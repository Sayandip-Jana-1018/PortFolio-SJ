import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollFrames — a pre-rendered film scrubbed by page scroll.
 *
 * The whole design problem here is that a frame sequence is fast to DRAW and
 * slow to DECODE. drawImage on an image the browser has not decoded yet blocks
 * the main thread for as long as the decode takes, so a naive implementation
 * runs at 60fps until you scroll somewhere new and then drops a 40ms frame.
 *
 * So decoding is treated as the real work:
 *
 *  - Frames are decoded ahead of time via img.decode(), never implicitly by
 *    drawImage, with bounded concurrency so the decoder queue cannot monopolise
 *    the thread the site's own animations run on.
 *
 *  - They arrive in STRIDED order — every 16th frame, then every 8th, and so on.
 *    A coarse scrub is available almost immediately and refines in place, rather
 *    than the first quarter of the page working and the rest being blank.
 *
 *  - Any frame that is not ready yet falls back to the nearest one that is, so
 *    the backdrop is never empty and never stalls waiting for an exact index.
 *
 * The scroll loop itself does no allocation and no layout reads beyond a single
 * cached scrollY, and it skips the draw entirely when the resolved frame has not
 * changed — which, at 200 frames over a page this tall, is most frames.
 */

type Tier = { count: number; width: number; height: number };
type Manifest = { aspect: number; tiers: Record<string, Tier> };

export interface ScrollFramesProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  /** 0..1, how strongly the accent washes the footage */
  tint?: number;
  className?: string;
  onProgress?: (loaded01: number) => void;
  /**
   * Element the film hands over to the still plate at. The sequence is mapped
   * to end exactly here rather than at the bottom of the document, so the last
   * frame lands on the cut instead of being scrolled past mid-move.
   */
  handoffRef?: React.RefObject<HTMLElement | null>;
  /** Still plate that carries the page from the handoff to the end. */
  tailSrc?: string;
}

/** Fraction of total page scroll the dissolve occupies. */
const HANDOFF_BAND = 0.11;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const MANIFEST_URL = '/bg-frames/manifest.json';
const frameUrl = (tier: string, i: number) =>
  `/bg-frames/${tier}/${String(i + 1).padStart(4, '0')}.webp`;

/** Decodes running at once. Enough to fill fast, few enough to stay polite. */
const DECODE_CONCURRENCY = 5;

const ScrollFrames: React.FC<ScrollFramesProps> = ({
  theme = 'dark',
  accentColor = '#00D4FF',
  tint = 1,
  className = '',
  onProgress,
  handoffRef,
  tailSrc,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  const handoffElRef = useRef(handoffRef);
  handoffElRef.current = handoffRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let disposed = false;
    let frames: (HTMLImageElement | null)[] = [];
    let decoded: boolean[] = [];
    let tierName = 'desktop';
    let count = 0;
    let raf = 0;
    let running = true;

    // Last frame actually painted. Guards the redundant-draw check.
    let painted = -1;
    // Tail opacity at the last paint. The dissolve changes continuously even
    // while the frame index holds, so the redundant-draw guard has to watch
    // this too or the cross-fade freezes in steps.
    let paintedTail = -1;
    let smooth = 0;
    let targetIdx = 0;

    let tailImg: HTMLImageElement | null = null;
    let tailReady = false;
    // Scroll fraction where the film has fully given way to the still.
    let handoff = 1;

    /* ── sizing ───────────────────────────────────────────────────────── */
    // Capped at 2: beyond that the backdrop is spending fill rate on detail
    // that sits behind glass panels and body text anyway.
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
    let cw = 1, chh = 1;

    /**
     * Where the film ends, as a fraction of total page scroll. Measured from
     * the handoff element's own position so it tracks the real layout — section
     * heights change with viewport width and with content, and a hardcoded
     * fraction would drift away from the section it is supposed to land on.
     */
    const measureHandoff = () => {
      const el = handoffElRef.current?.current;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (!el || total <= 0) { handoff = 1; return; }
      const top = el.getBoundingClientRect().top + window.scrollY;
      // Complete the dissolve as the section's top reaches mid-viewport, so the
      // still is already in place by the time anyone reads over it.
      handoff = Math.min(1, Math.max(0.2, (top - window.innerHeight * 0.5) / total));
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const d = dpr();
      cw = Math.max(1, Math.round(r.width * d));
      chh = Math.max(1, Math.round(r.height * d));
      if (canvas.width !== cw || canvas.height !== chh) {
        canvas.width = cw;
        canvas.height = chh;
      }
      measureHandoff();
      painted = -1; // force a repaint at the new size
      paintedTail = -1;
    };

    /** Cover-fit: fill the viewport, crop the overflow, never letterbox. */
    const draw = (img: HTMLImageElement, zoom = 1) => {
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / chh;
      let w, h, x, y;
      if (cr > ir) { w = cw; h = cw / ir; x = 0; y = (chh - h) / 2; }
      else { h = chh; w = chh * ir; y = 0; x = (cw - w) / 2; }
      if (zoom !== 1) {
        const dw = w * (zoom - 1), dh = h * (zoom - 1);
        x -= dw / 2; y -= dh / 2; w += dw; h += dh;
      }
      ctx.drawImage(img, x, y, w, h);
    };

    /** Nearest decoded frame to `i`, searching outward. Never returns a stall. */
    const nearestReady = (i: number): number => {
      if (decoded[i]) return i;
      for (let r = 1; r < count; r++) {
        if (i - r >= 0 && decoded[i - r]) return i - r;
        if (i + r < count && decoded[i + r]) return i + r;
      }
      return -1;
    };

    /* ── scroll ───────────────────────────────────────────────────────── */
    const readScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / total));
    };

    const tick = () => {
      if (!running) return;
      const p = readScroll();
      // Light inertia. The backdrop trails the reader very slightly, which is
      // what stops a frame sequence feeling like a flipbook.
      smooth += (p - smooth) * (reduce ? 1 : 0.16);
      if (Math.abs(p - smooth) < 0.0004) smooth = p;

      // The film is mapped to END at the handoff rather than at the bottom of
      // the document, so the whole move plays out over the sections it belongs
      // to instead of being cut off partway.
      const filmT = handoff > 0 ? Math.min(1, smooth / handoff) : 1;
      targetIdx = Math.min(count - 1, Math.max(0, Math.round(filmT * (count - 1))));

      const tail = tailReady
        ? smoothstep(handoff - HANDOFF_BAND, handoff, smooth)
        : 0;

      const use = nearestReady(targetIdx);
      const frameChanged = use >= 0 && use !== painted;
      const tailChanged = Math.abs(tail - paintedTail) > 0.003;

      if (frameChanged || tailChanged) {
        // The film keeps playing underneath the dissolve rather than freezing
        // on its last frame — a static plate fading into another static plate
        // is exactly what makes a cut visible.
        if (use >= 0 && frames[use]) draw(frames[use]!);
        if (tail > 0.001 && tailImg) {
          // Drifts from a slight push-in to rest, so the still arrives already
          // in motion and inherits the film's momentum instead of snapping to a
          // dead frame.
          ctx.globalAlpha = tail;
          draw(tailImg, 1.06 - 0.06 * tail);
          ctx.globalAlpha = 1;
        }
        painted = use;
        paintedTail = tail;
        // Published to CSS so the overlay stack can step back over the still.
        // The veils exist to keep body copy legible on moving footage; the tail
        // plate is a finished composition and only needs a fraction of that.
        host.style.setProperty('--tail', tail.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };

    /* ── decode queue ─────────────────────────────────────────────────── */
    let loadedCount = 0;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        if (disposed || frames[i]) return resolve();
        const img = new Image();
        img.decoding = 'async';
        img.src = frameUrl(tierName, i);
        frames[i] = img;
        img
          .decode()
          .then(() => {
            if (disposed) return;
            decoded[i] = true;
            loadedCount++;
            progressRef.current?.(loadedCount / count);
            // First frame on screen ends the fade-in — do not wait for the set.
            if (!ready && loadedCount === 1) setReady(true);
            // A newly arrived frame may be a better match than what is painted.
            if (Math.abs(i - targetIdx) <= Math.abs(painted - targetIdx)) painted = -1;
          })
          .catch(() => { frames[i] = null; })
          .finally(resolve);
      });

    /**
     * Strided fill. Pass 1 takes every 16th frame so the entire page length is
     * scrubbable within a second or so; each later pass halves the gap. Loading
     * 0,1,2,3… instead would leave the bottom of the page blank until the very
     * end of the download.
     */
    const buildOrder = (n: number) => {
      const order: number[] = [];
      const seen = new Set<number>();
      for (let stride = 16; stride >= 1; stride = Math.floor(stride / 2)) {
        for (let i = 0; i < n; i += stride) {
          if (!seen.has(i)) { seen.add(i); order.push(i); }
        }
        if (stride === 1) break;
      }
      for (let i = 0; i < n; i++) if (!seen.has(i)) { seen.add(i); order.push(i); }
      return order;
    };

    const pump = async (order: number[]) => {
      let cursor = 0;
      const worker = async () => {
        while (!disposed && cursor < order.length) {
          const i = order[cursor++];
          await loadOne(i);
        }
      };
      await Promise.all(
        Array.from({ length: DECODE_CONCURRENCY }, worker)
      );
    };

    /* ── boot ─────────────────────────────────────────────────────────── */
    (async () => {
      let manifest: Manifest;
      try {
        const res = await fetch(MANIFEST_URL);
        manifest = await res.json();
      } catch {
        return; // no frames built yet — host stays transparent, site still works
      }
      if (disposed) return;

      // A phone is portrait, so the 16:9 plate is cropped to its middle band
      // and the extra width would be thrown away before it was ever seen.
      tierName = window.innerWidth < 820 ? 'mobile' : 'desktop';
      const tier = manifest.tiers[tierName] ?? manifest.tiers.desktop;
      count = tier.count;
      frames = new Array(count).fill(null);
      decoded = new Array(count).fill(false);

      // The still is one image and it is what the page ends on, so it is worth
      // starting immediately rather than queueing behind 200 frames.
      if (tailSrc) {
        const t = new Image();
        t.decoding = 'async';
        t.src = tailSrc;
        tailImg = t;
        t.decode().then(() => { if (!disposed) { tailReady = true; paintedTail = -1; } })
          .catch(() => { tailImg = null; });
      }

      resize();
      // The frame under the reader right now matters more than frame 0.
      const first = Math.round(readScroll() * (count - 1));
      await loadOne(first);
      if (disposed) return;

      raf = requestAnimationFrame(tick);
      pump(buildOrder(count));
    })();

    /* ── lifecycle ────────────────────────────────────────────────────── */
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    // Sections grow and shrink as their own content animates in, which moves
    // the handoff element. Watching the body keeps the cut pinned to it.
    ro.observe(document.body);

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      // Drop the decoded bitmaps rather than waiting for GC — this component
      // unmounts when the reader flips back to the shader backdrop.
      for (const img of frames) if (img) img.src = '';
      frames = [];
      if (tailImg) { tailImg.src = ''; tailImg = null; }
    };
    // Intentionally mount-once: theme and accent drive the CSS overlays below,
    // which must never tear down and rebuild the decode cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = theme === 'dark';

  return (
    <div ref={hostRef} className={`absolute inset-0 overflow-hidden ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        className="h-full w-full block"
        style={{
          opacity: ready ? 1 : 0,
          // No filter in either mode. Blurring the plate in light mode to turn
          // it into an abstract light field was tried and looked worse than the
          // plain plate under a white gloss — the figure stayed legible enough
          // to be recognisable and just read as out of focus.
          transition: 'opacity 1.1s cubic-bezier(.22,1,.36,1)',
        }}
      />

      {/* ── liquid glass stack ──────────────────────────────────────────
          Composited layers rather than one flat scrim, each fading back over
          the tail plate via --tail. None of them repaint on scroll.

          Light mode is a GLOSS, not a wash. Flooding flat white over the whole
          frame is what killed it before: it greys the footage and everything
          reads pink once the accent tint lands on top. Instead the plate is
          lifted by a pearl gradient with a real specular sweep across the top
          left, so the white has a direction and a highlight — which is the
          difference between "washed out" and "glossy". */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `linear-gradient(160deg, ${accentColor}${Math.round(tint * 26).toString(16).padStart(2, '0')} 0%, transparent 45%, ${accentColor}14 100%)`
            : `linear-gradient(160deg, ${accentColor}12 0%, transparent 46%, ${accentColor}0a 100%)`,
          mixBlendMode: isDark ? 'screen' : 'multiply',
          opacity: 'calc(1 - var(--tail, 0) * 0.55)',
          transition: 'background .6s ease',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 120% 80% at 50% 38%, ${accentColor}0f, rgba(3,3,6,.62) 68%, rgba(2,2,5,.86) 100%)`
            : `radial-gradient(ellipse 130% 90% at 50% 34%, rgba(255,255,255,.50), rgba(247,248,251,.72) 58%, rgba(236,239,244,.84) 100%)`,
          opacity: 'calc(1 - var(--tail, 0) * 0.5)',
          transition: 'background .6s ease',
        }}
      />
      {/* Specular sweep — light mode only. A single soft highlight raking across
          the top left is what makes a white surface read as glossy rather than
          as blank paper. */}
      {!isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(118deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.34) 22%, rgba(255,255,255,0) 46%),' +
              'radial-gradient(ellipse 60% 40% at 18% 8%, rgba(255,255,255,.75), rgba(255,255,255,0) 70%)',
            opacity: 'calc(1 - var(--tail, 0) * 0.62)',
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'saturate(118%)',
          WebkitBackdropFilter: 'saturate(118%)',
          opacity: 'calc(1 - var(--tail, 0) * 0.6)',
          boxShadow: isDark
            ? 'inset 0 0 220px 60px rgba(0,0,0,.55)'
            : 'inset 0 0 180px 70px rgba(255,255,255,.5)',
        }}
      />
    </div>
  );
};

export default ScrollFrames;
