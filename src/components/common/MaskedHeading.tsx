import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import type { CSSProperties, ElementType } from 'react';
import { gsap } from 'gsap';
import { observeViewport, NEAR_MARGIN } from '../../hooks/useInViewport';

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

type Reveal = 'rise' | 'wipe' | 'fade' | 'none';
type Trigger = 'view' | 'mount' | 'hover';

export interface MaskedHeadingProps {
    text?: string;
    tag?: ElementType;
    mediaType?: 'image' | 'video';
    src?: string;
    poster?: string;
    fillScale?: number;
    parallax?: number;
    drift?: number;
    brightness?: number;
    saturation?: number;
    grayscale?: boolean;
    reveal?: Reveal;
    duration?: number;
    stagger?: number;
    trigger?: Trigger;
    align?: 'left' | 'center' | 'right';
    weight?: number;
    tracking?: number;
    lineHeight?: number;
    textScale?: number;
    fontSize?: string;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

const MaskedHeading: React.FC<MaskedHeadingProps> = ({
    text = 'Designed in the details',
    tag = 'h2',
    mediaType = 'image',
    src = '',
    poster = '',
    fillScale = 1.25,
    parallax = 26,
    drift = 18,
    brightness = 1,
    saturation = 1,
    grayscale = false,
    reveal = 'rise',
    duration = 1.1,
    stagger = 0.09,
    trigger = 'view',
    align = 'center',
    weight = 700,
    tracking = -0.03,
    lineHeight = 1.06,
    textScale = 0.115,
    fontSize,
    className = '',
    style,
    ...rest
}: MaskedHeadingProps) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const measureRef = useRef<HTMLSpanElement | null>(null);
    const revealRef = useRef<HTMLSpanElement | null>(null);
    const mediaRef = useRef<HTMLSpanElement | null>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const baseRefs = useRef<(HTMLElement | null)[]>([]);
    const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const offsetRef = useRef<{ x: number; y: number; tx: number; ty: number }>({ x: 0, y: 0, tx: 0, ty: 0 });
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const srcRef = useRef(src);
    srcRef.current = src;
    // Measured by sync() on resize, so the per-frame loop never forces layout.
    const sizeRef = useRef({ w: 0, h: 0 });
    const placedRef = useRef({ x: NaN, y: NaN, scale: NaN, filter: '' });

    const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);

    const settingsRef = useRef<{
        fillScale: number;
        parallax: number;
        drift: number;
        brightness: number;
        saturation: number;
        grayscale: boolean;
        textScale: number;
        fontSize?: string;
    }>({ fillScale: 1, parallax: 0, drift: 0, brightness: 1, saturation: 1, grayscale: false, textScale: 0.115 });
    settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale, fontSize };

    const place = useCallback(() => {
        const media = mediaRef.current;
        if (!media) return;
        const s = settingsRef.current;
        const { w: W, h: H } = sizeRef.current;
        const off = offsetRef.current;
        const placed = placedRef.current;

        const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);
        const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);
        const x = clamp(off.x, -maxX, maxX);
        const y = clamp(off.y, -maxY, maxY);

        // Style writes only happen when the result would actually differ.
        if (!(Math.abs(x - placed.x) < 0.05) || !(Math.abs(y - placed.y) < 0.05) || s.fillScale !== placed.scale) {
            media.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.fillScale})`;
            placed.x = x;
            placed.y = y;
            placed.scale = s.fillScale;
        }

        const isIdentity = s.brightness === 1 && s.saturation === 1 && !s.grayscale;
        const filter = isIdentity ? '' : `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;
        if (filter !== placed.filter) {
            media.style.filter = filter;
            placed.filter = filter;
        }
    }, []);

    const sync = useCallback(() => {
        const root = rootRef.current;
        const measure = measureRef.current;
        if (!root || !measure) return;
        const s = settingsRef.current;
        if (s.fontSize) {
            root.style.fontSize = s.fontSize;
        } else {
            root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 16, 220).toFixed(1)}px`;
        }

        const cs = window.getComputedStyle(measure);
        for (let i = 0; i < wordRefs.current.length; i += 1) {
            const box = wordRefs.current[i];
            const base = baseRefs.current[i];
            const glyph = glyphRefs.current[i];
            if (!box || !base || !glyph) continue;
            glyph.setAttribute('x', `${box.offsetLeft}`);
            glyph.setAttribute('y', `${base.offsetTop}`);
            glyph.style.fontFamily = cs.fontFamily;
            glyph.style.fontSize = cs.fontSize;
            glyph.style.fontWeight = cs.fontWeight;
            glyph.style.fontStyle = cs.fontStyle;
            glyph.style.letterSpacing = cs.letterSpacing;
        }
        sizeRef.current = { w: root.clientWidth, h: root.clientHeight };
        place();
    }, [place]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        sync();
        const ro = new ResizeObserver(sync);
        ro.observe(root);
        if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => { });

        let raf = 0;
        let last = performance.now();
        let clock = 0;

        const frame = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            clock += dt;
            const s = settingsRef.current;
            const off = offsetRef.current;

            const dx = Math.sin(clock * 0.21) * s.drift;
            const dy = Math.cos(clock * 0.17) * s.drift * 0.6;

            const ease = 1 - Math.exp(-dt / 0.18);
            off.x += (off.tx + dx - off.x) * ease;
            off.y += (off.ty + dy - off.y) * ease;

            place();
            raf = requestAnimationFrame(frame);
        };

        const onMove = (e: PointerEvent) => {
            const s = settingsRef.current;
            if (s.parallax <= 0) return;
            const r = root.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
            const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
            offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
            offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
        };

        const onLeave = () => {
            offsetRef.current.tx = 0;
            offsetRef.current.ty = 0;
        };

        root.addEventListener('pointermove', onMove);
        root.addEventListener('pointerleave', onLeave);

        // The video and the drift loop only run while this heading can be seen.
        // A paused video keeps showing its current frame, so nothing goes blank.
        let inView = false;
        const loadVideo = () => {
            const video = videoRef.current;
            if (video && !video.getAttribute('src') && srcRef.current) {
                video.preload = 'auto';
                video.src = srcRef.current;
            }
        };
        const applyActivity = () => {
            const active = inView && !document.hidden;
            if (active && !raf) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            } else if (!active && raf) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
            const video = videoRef.current;
            if (!video) return;
            if (active) {
                loadVideo();
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        };
        const stopView = observeViewport(root, (visible) => {
            inView = visible;
            applyActivity();
        });
        const stopNear = observeViewport(root, (near) => {
            if (near) loadVideo();
        }, NEAR_MARGIN);
        document.addEventListener('visibilitychange', applyActivity);

        return () => {
            cancelAnimationFrame(raf);
            raf = 0;
            stopView();
            stopNear();
            document.removeEventListener('visibilitychange', applyActivity);
            videoRef.current?.pause();
            ro.disconnect();
            root.removeEventListener('pointermove', onMove);
            root.removeEventListener('pointerleave', onLeave);
        };
    }, [place, sync]);

    useEffect(() => {
        sync();
    }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);

    useEffect(() => {
        const root = rootRef.current;
        const layer = revealRef.current;
        if (!root || !layer) return;
        const glyphs = glyphRefs.current.filter(Boolean);
        if (!glyphs.length) return;

        const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

        const settle = () => {
            gsap.set(glyphs, { y: 0 });
            gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        };

        const rest = () => {
            if (reveal === 'rise') {
                gsap.set(glyphs, { y: riseDistance() });
            } else if (reveal === 'wipe') {
                gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' });
            } else if (reveal === 'fade') {
                gsap.set(layer, { opacity: 0, scale: 1.08 });
            }
        };

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reveal === 'none' || reduce) {
            settle();
            return;
        }

        const play = () => {
            tweenRef.current?.kill();
            if (reveal === 'rise') {
                gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
                tweenRef.current = gsap.fromTo(
                    glyphs,
                    { y: riseDistance() },
                    { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }
                );
            } else if (reveal === 'wipe') {
                gsap.set(glyphs, { y: 0 });
                const state = { p: 100 };
                tweenRef.current = gsap.to(state, {
                    p: 0,
                    duration,
                    ease: 'power3.inOut',
                    overwrite: 'auto',
                    onUpdate: () => {
                        layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
                    }
                });
            } else {
                gsap.set(glyphs, { y: 0 });
                tweenRef.current = gsap.fromTo(
                    layer,
                    { opacity: 0, scale: 1.08 },
                    { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
                );
            }
        };

        if (trigger === 'hover') {
            settle();
            root.addEventListener('pointerenter', play);
            return () => {
                root.removeEventListener('pointerenter', play);
                tweenRef.current?.kill();
            };
        }

        if (trigger === 'view') {
            settle();
            rest();
            const io = new IntersectionObserver(
                entries => {
                    if (entries.some(e => e.isIntersecting)) {
                        play();
                        io.disconnect();
                    }
                },
                { threshold: 0.25 }
            );
            io.observe(root);
            return () => {
                io.disconnect();
                tweenRef.current?.kill();
            };
        }

        play();
        return () => tweenRef.current?.kill();
    }, [reveal, trigger, duration, stagger, words]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TagAny = tag as any;

    return (
        <TagAny
            ref={rootRef}
            className={`relative w-full m-0 p-0 antialiased [text-wrap:balance] ${className}`.trim()}
            style={{
                textAlign: align,
                fontWeight: weight,
                letterSpacing: `${tracking}em`,
                lineHeight,
                ...style
            }}
            {...rest}
        >
            <span ref={measureRef} className="text-transparent">
                {words.map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        ref={(el: HTMLSpanElement | null) => {
                            wordRefs.current[i] = el;
                        }}
                        className="inline-block whitespace-pre"
                    >
                        {word}{i !== words.length - 1 && '\u00A0'}
                        <i
                            ref={(el: HTMLElement | null) => {
                                baseRefs.current[i] = el;
                            }}
                            className="inline-block w-0 h-0"
                        />
                    </span>
                ))}
            </span>

            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
                <defs>
                    <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                        {words.map((word, i) => (
                            <text
                                key={`${word}-${i}`}
                                ref={(el: SVGTextElement | null) => {
                                    glyphRefs.current[i] = el;
                                }}
                            >
                                {word}
                            </text>
                        ))}
                    </clipPath>
                </defs>
            </svg>

            <span ref={revealRef} className="absolute inset-0 block pointer-events-none">
                <span className="absolute inset-0 block" style={{ clipPath: `url(#${clipId})` }}>
                    <span ref={mediaRef} className="absolute inset-0 block [will-change:transform]">
                        {mediaType === 'video' ? (
                            <video
                                ref={videoRef}
                                className="block w-full h-full object-cover select-none"
                                poster={poster || undefined}
                                preload="none"
                                muted
                                loop
                                playsInline
                            />
                        ) : (
                            <img className="block w-full h-full object-cover select-none" src={src} alt="" draggable={false} />
                        )}
                    </span>
                </span>
            </span>
        </TagAny>
    );
};

export default MaskedHeading;
