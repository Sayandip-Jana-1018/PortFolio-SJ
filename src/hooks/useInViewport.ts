import { useEffect, useState, type RefObject } from 'react';

/**
 * One IntersectionObserver per margin, shared by every effect on the page, so
 * offscreen work can stop without each component running its own observer.
 */
type Listener = (inView: boolean) => void;

/** Effects restart slightly before they scroll into view. */
export const VIEW_MARGIN = '200px 0px';
/** Media starts loading a full viewport ahead, so it is ready on arrival. */
export const NEAR_MARGIN = '100% 0px';

type Shared = { io: IntersectionObserver; listeners: Map<Element, Set<Listener>> };
const shared = new Map<string, Shared>();

const getShared = (rootMargin: string): Shared => {
  let entry = shared.get(rootMargin);
  if (!entry) {
    const listeners = new Map<Element, Set<Listener>>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) listeners.get(e.target)?.forEach((fn) => fn(e.isIntersecting));
      },
      { rootMargin }
    );
    entry = { io, listeners };
    shared.set(rootMargin, entry);
  }
  return entry;
};

/** Calls `listener` whenever `el` enters or leaves the margin. Returns a cleanup. */
export function observeViewport(el: Element, listener: Listener, rootMargin: string = VIEW_MARGIN): () => void {
  const { io, listeners } = getShared(rootMargin);
  let set = listeners.get(el);
  if (!set) {
    set = new Set();
    listeners.set(el, set);
    io.observe(el);
  }
  set.add(listener);
  return () => {
    const current = listeners.get(el);
    if (!current) return;
    current.delete(listener);
    if (current.size === 0) {
      listeners.delete(el);
      io.unobserve(el);
    }
  };
}

interface UseInViewportOptions {
  rootMargin?: string;
  /** Set false until the ref is attached, for components that render it late. */
  enabled?: boolean;
  /** Stay true after the first time the element comes near. */
  once?: boolean;
}

/** React state version of observeViewport. False on the server and first render. */
export function useInViewport(
  ref: RefObject<Element | null>,
  { rootMargin = VIEW_MARGIN, enabled = true, once = false }: UseInViewportOptions = {}
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const stop = observeViewport(el, (visible) => {
      if (once && !visible) return;
      setInView(visible);
      if (once && visible) stop();
    }, rootMargin);
    return stop;
  }, [ref, rootMargin, enabled, once]);

  return inView;
}
