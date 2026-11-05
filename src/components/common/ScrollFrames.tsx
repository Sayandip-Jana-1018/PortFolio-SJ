import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollFrames — a pre-rendered film scrubbed by page scroll.
 *
 * The whole design problem here is that a frame sequence is fast to DRAW and
 * expensive to keep DECODED. Every frame costs width * height * 4 bytes once
 * decoded, which is over 1GB for the desktop set. Left to the browser's image
 * cache, frames get evicted and then re-decoded on the main thread by drawImage,
 * which is what drops a frame right when you scroll somewhere new.
 *
 * So decoding is managed here instead:
 *
 *  - Frames are decoded with createImageBitmap, which works off the main thread
 *    and hands back a bitmap that stays decoded until it is closed. Drawing one
 *    can never stall.
 *
 *  - Only some frames stay decoded: an evenly spaced set of anchors across the
 *    whole film, plus a window around the reader that leans the way they are
 *    moving. That caps memory at about 250MB on desktop.
 *
 *  - Any frame that is not ready yet falls back to the nearest one that is, so
 *    the backdrop is never empty and a fast scroll always has an anchor close by.
 *
 * The loop does no layout reads and no allocation. It stops completely once the
 * film has caught up with the scroll position, and it skips the draw when the
 * resolved frame has not changed — which, at 200 frames over a page this tall,
 * is most frames.
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

/** Decodes running at once. They are off-thread, but still use CPU. */
const DECODE_CONCURRENCY = 3;
const FETCH_CONCURRENCY = 5;
/** Every 8th frame stays decoded, so a fast scroll is never far from a real frame. */
const ANCHOR_STRIDE = 8;
/** Extra frames kept decoded around the reader, in the direction of travel and behind. */
const WINDOW_AHEAD = 12;
const WINDOW_BEHIND = 6;

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
    const abort = new AbortController();

    let disposed = false;
    let tierName = 'desktop';
    let tierWidth = 1;
    let tierHeight = 1;
    let count = 0;

    // Compressed frames stay in memory, so any frame can be decoded on demand
    // without another network request. Decoded bitmaps are the expensive part
    // and only the ones near the reader are kept.
    let blobs: (Blob | null)[] = [];
    let bitmaps: (ImageBitmap | null)[] = [];
    const fetching = new Set<number>();
    const decoding = new Set<number>();
    const failed = new Set<number>();
    // Bumped whenever decoded frames are thrown away, so a decode that was already
    // running at the old size does not get stored.
    let decodeGeneration = 0;
    // Share of the frame's natural size to decode at. Below 1 when the canvas is
    // smaller than the frame, since those extra pixels would never be seen.
    let decodeScale = 1;

    let raf = 0;
    let firstFrameShown = false;
    let loadedCount = 0;

    // Last frame actually painted. Guards the redundant-draw check.
    let painted = -1;
    // Tail opacity at the last paint. The dissolve changes continuously even
    // while the frame index holds, so the redundant-draw guard has to watch
    // this too or the cross-fade freezes in steps.
    let paintedTail = -1;
    let smooth = 0;
    let targetIdx = 0;
    // Which way the reader is moving: 1 down the page, -1 back up.
    let direction = 1;

    let tailImg: ImageBitmap | null = null;
    // Scroll fraction where the film has fully given way to the still.
    let handoff = 1;

    // Layout values, read when layout changes and not on every frame.
    let scrollTop = window.scrollY;
    let scrollTotal = 0;

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
    const measureLayout = () => {
      const el = handoffElRef.current?.current;
      const doc = document.documentElement;
      scrollTotal = doc.scrollHeight - window.innerHeight;
      scrollTop = window.scrollY;
      if (!el || scrollTotal <= 0) { handoff = 1; return; }
      const top = el.getBoundingClientRect().top + scrollTop;
      // Complete the dissolve as the section's top reaches mid-viewport, so the
      // still is already in place by the time anyone reads over it.
      handoff = Math.min(1, Math.max(0.2, (top - window.innerHeight * 0.5) / scrollTotal));
    };

    const scrollFraction = () =>
      scrollTotal > 0 ? Math.min(1, Math.max(0, scrollTop / scrollTotal)) : 0;

    /** The film is mapped to END at the handoff rather than at the bottom of the document. */
    const frameAt = (fraction: number) => {
      const filmT = handoff > 0 ? Math.min(1, fraction / handoff) : 1;
      return Math.min(count - 1, Math.max(0, Math.round(filmT * (count - 1))));
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
      measureLayout();
      painted = -1; // force a repaint at the new size
      paintedTail = -1;

      if (count > 0) {
        // Decoded frames that are now too small have to be redone at the new size.
        const needed = Math.min(1, Math.max(cw / tierWidth, chh / tierHeight));
        if (needed > decodeScale * 1.05) {
          decodeScale = needed;
          decodeGeneration++;
          bitmaps.forEach((bitmap, i) => {
            if (bitmap) {
              bitmap.close();
              bitmaps[i] = null;
            }
          });
          decoding.clear();
          pumpDecode();
        }
      }
      wake();
    };

    /** Cover-fit: fill the viewport, crop the overflow, never letterbox. */
    const draw = (img: ImageBitmap, zoom = 1) => {
      const ir = img.width / img.height;
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
      if (bitmaps[i]) return i;
      for (let r = 1; r < count; r++) {
        if (i - r >= 0 && bitmaps[i - r]) return i - r;
        if (i + r < count && bitmaps[i + r]) return i + r;
      }
      return -1;
    };

    /* ── scroll ───────────────────────────────────────────────────────── */
    const tick = () => {
      raf = 0;
      const p = scrollFraction();
      // Light inertia. The backdrop trails the reader very slightly, which is
      // what stops a frame sequence feeling like a flipbook.
      smooth += (p - smooth) * (reduce ? 1 : 0.16);
      if (Math.abs(p - smooth) < 0.0004) smooth = p;

      if (count > 0) {
        const nextTarget = frameAt(smooth);
        if (nextTarget !== targetIdx) {
          direction = nextTarget > targetIdx ? 1 : -1;
          targetIdx = nextTarget;
          evictFarFrames();
          pumpDecode();
          pumpFetch();
        }
      }

      const tail = tailImg
        ? smoothstep(handoff - HANDOFF_BAND, handoff, smooth)
        : 0;

      const use = nearestReady(targetIdx);
      const frameChanged = use >= 0 && use !== painted;
      const tailChanged = Math.abs(tail - paintedTail) > 0.003;

      if (frameChanged || tailChanged) {
        // The film keeps playing underneath the dissolve rather than freezing
        // on its last frame — a static plate fading into another static plate
        // is exactly what makes a cut visible.
        const frame = use >= 0 ? bitmaps[use] : null;
        if (frame) draw(frame);
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

      // Nothing to do until the reader scrolls or a better frame arrives.
      if (smooth !== p) raf = requestAnimationFrame(tick);
    };

    function wake() {
      if (!raf && !disposed) raf = requestAnimationFrame(tick);
    }

    const onScroll = () => {
      scrollTop = window.scrollY;
      wake();
    };

    /* ── which frames stay decoded ────────────────────────────────────── */
    const isAnchor = (i: number) => i % ANCHOR_STRIDE === 0;

    /** Frames worth decoding now: the anchors, and a window biased the way the reader is moving. */
    const isWanted = (i: number) => {
      if (isAnchor(i)) return true;
      const offset = (i - targetIdx) * direction;
      return offset >= -WINDOW_BEHIND && offset <= WINDOW_AHEAD;
    };

    /** Wider than the wanted window, so reversing direction does not throw away work. */
    const isWorthKeeping = (i: number) => isAnchor(i) || Math.abs(i - targetIdx) <= WINDOW_AHEAD;

    const evictFarFrames = () => {
      for (let i = 0; i < count; i++) {
        const bitmap = bitmaps[i];
        if (bitmap && !isWorthKeeping(i)) {
          bitmap.close();
          bitmaps[i] = null;
        }
      }
    };

    /* ── decode queue ─────────────────────────────────────────────────── */
    const decodeOne = (i: number, blob: Blob) => {
      const generation = decodeGeneration;
      decoding.add(i);
      // createImageBitmap decodes off the main thread, and the bitmap it returns
      // stays decoded until it is closed. drawImage can never stall on it.
      const decoded = decodeScale < 1
        ? createImageBitmap(blob, {
            resizeWidth: Math.max(1, Math.round(tierWidth * decodeScale)),
            resizeHeight: Math.max(1, Math.round(tierHeight * decodeScale)),
            resizeQuality: 'high',
          })
        : createImageBitmap(blob);

      decoded
        .then((bitmap) => {
          if (disposed || generation !== decodeGeneration || !isWorthKeeping(i)) {
            bitmap.close();
            return;
          }
          bitmaps[i]?.close();
          bitmaps[i] = bitmap;
          // First frame on screen ends the fade-in — do not wait for the set.
          if (!firstFrameShown) {
            firstFrameShown = true;
            setReady(true);
          }
          // A newly arrived frame may be a better match than what is painted.
          if (Math.abs(i - targetIdx) < Math.abs(painted - targetIdx)) {
            painted = -1;
            wake();
          }
        })
        .catch(() => { failed.add(i); })
        .finally(() => {
          if (generation === decodeGeneration) decoding.delete(i);
          if (!disposed) pumpDecode();
        });
    };

    function pumpDecode() {
      while (decoding.size < DECODE_CONCURRENCY) {
        // Closest wanted frame first, with frames ahead of the reader winning ties.
        let best = -1;
        let bestCost = Infinity;
        for (let i = 0; i < count; i++) {
          if (bitmaps[i] || !blobs[i] || decoding.has(i) || failed.has(i) || !isWanted(i)) continue;
          const offset = (i - targetIdx) * direction;
          const cost = Math.abs(offset) * 2 + (offset < 0 ? 1 : 0);
          if (cost < bestCost) { bestCost = cost; best = i; }
        }
        if (best < 0) return;
        decodeOne(best, blobs[best]!);
      }
    }

    /* ── download queue ───────────────────────────────────────────────── */
    /**
     * The frame under the reader first, so something is on screen right away.
     * Then the anchors, so the entire page length is scrubbable within a second
     * or so. Then the rest, nearest first, so the area being read fills in before
     * the far end of the page does.
     */
    const nextToFetch = () => {
      let best = -1;
      let bestCost = Infinity;
      for (let i = 0; i < count; i++) {
        if (blobs[i] || fetching.has(i) || failed.has(i)) continue;
        const distance = Math.abs(i - targetIdx);
        const cost = i === targetIdx ? -1 : isAnchor(i) ? distance : count + distance;
        if (cost < bestCost) { bestCost = cost; best = i; }
      }
      return best;
    };

    const fetchOne = (i: number) => {
      fetching.add(i);
      fetch(frameUrl(tierName, i), { signal: abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`frame ${i}: ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          if (disposed) return;
          blobs[i] = blob;
          loadedCount++;
          progressRef.current?.(loadedCount / count);
          pumpDecode();
        })
        .catch(() => { failed.add(i); })
        .finally(() => {
          fetching.delete(i);
          if (!disposed) pumpFetch();
        });
    };

    function pumpFetch() {
      while (fetching.size < FETCH_CONCURRENCY) {
        const next = nextToFetch();
        if (next < 0) return;
        fetchOne(next);
      }
    }

    /* ── boot ─────────────────────────────────────────────────────────── */
    (async () => {
      let manifest: Manifest;
      try {
        const res = await fetch(MANIFEST_URL, { signal: abort.signal });
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
      tierWidth = tier.width;
      tierHeight = tier.height;
      blobs = new Array(count).fill(null);
      bitmaps = new Array(count).fill(null);

      resize();
      decodeScale = Math.min(1, Math.max(cw / tierWidth, chh / tierHeight));
      smooth = scrollFraction();
      // The frame under the reader right now matters more than frame 0.
      targetIdx = frameAt(smooth);
      pumpFetch();

      // The still is one image and it is what the page ends on, so it is worth
      // starting immediately rather than queueing behind 200 frames.
      if (tailSrc) {
        fetch(tailSrc, { signal: abort.signal })
          .then((res) => res.blob())
          .then((blob) => createImageBitmap(blob))
          .then((bitmap) => {
            if (disposed) { bitmap.close(); return; }
            tailImg = bitmap;
            paintedTail = -1;
            wake();
          })
          .catch(() => { });
      }
    })();

    /* ── lifecycle ────────────────────────────────────────────────────── */
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    // Sections grow and shrink as their own content animates in, which moves
    // the handoff element. Watching the body keeps the cut pinned to it.
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      // Free the decoded frames right away rather than waiting for GC — this
      // component unmounts when the reader flips back to the shader backdrop.
      bitmaps.forEach((bitmap) => bitmap?.close());
      bitmaps = [];
      blobs = [];
      tailImg?.close();
      tailImg = null;
    };
    // Intentionally mount-once: theme and accent drive the CSS overlays below,
    // which must never tear down and rebuild the decode cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = theme === 'dark';

  return (
    <div ref={hostRef} className={`absolute inset-0 overflow-hidden ${className}`.trim()}>
      {/* The saturation boost is a filter on this wrapper rather than a full
          screen backdrop filter. It produces the same pixels without reading the
          page back, and 1.18 fades toward 1 by the same amount as the old layer's
          opacity did over the tail plate. */}
      <div
        className="absolute inset-0"
        style={{ filter: 'saturate(calc(1 + 0.18 * (1 - var(--tail, 0) * 0.6)))' }}
      >
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
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
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
