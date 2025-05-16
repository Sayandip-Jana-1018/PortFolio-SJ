import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useHorizontalScroll = (containerSelector: string, sectionSelector: string) => {
  const scrollTween = useRef<gsap.core.Tween | null>(null);
  
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    const sections = gsap.utils.toArray(sectionSelector);
    
    if (!container || sections.length === 0) return;
    
    // Calculate the total width of all sections
    const totalWidth = (sections as HTMLElement[]).reduce(
      (width, section) => width + section.offsetWidth,
      0
    );
    
    // Set the container width to accommodate all sections
    gsap.set(container, { width: totalWidth });
    
    // Create the horizontal scroll animation
    scrollTween.current = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${totalWidth}`,
      },
    });
    
    return () => {
      // Clean up ScrollTrigger when component unmounts
      if (scrollTween.current) {
        scrollTween.current.scrollTrigger?.kill();
      }
    };
  }, [containerSelector, sectionSelector]);
  
  return scrollTween;
};

// Function to create transition animations between sections
export const createSectionTransitions = (
  triggerSelector: string,
  fromSelector: string,
  toSelector: string,
  direction: 'next' | 'prev' = 'next'
) => {
  useEffect(() => {
    const trigger = document.querySelector(triggerSelector);
    const fromElement = document.querySelector(fromSelector);
    const toElement = document.querySelector(toSelector);
    
    if (!trigger || !fromElement || !toElement) return;
    
    // Create animation for transitioning between sections
    ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      onEnter: () => {
        if (direction === 'next') {
          gsap.to(fromElement, { opacity: 0, scale: 0.8, duration: 0.5 });
          gsap.fromTo(
            toElement, 
            { opacity: 0, scale: 1.2 }, 
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }
          );
        } else {
          gsap.to(fromElement, { opacity: 0, scale: 1.2, duration: 0.5 });
          gsap.fromTo(
            toElement, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }
          );
        }
      },
      onLeaveBack: () => {
        if (direction === 'next') {
          gsap.to(toElement, { opacity: 0, scale: 1.2, duration: 0.5 });
          gsap.fromTo(
            fromElement, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }
          );
        } else {
          gsap.to(toElement, { opacity: 0, scale: 0.8, duration: 0.5 });
          gsap.fromTo(
            fromElement, 
            { opacity: 0, scale: 1.2 }, 
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }
          );
        }
      },
    });
    
    return () => {
      // Clean up ScrollTrigger when component unmounts
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [triggerSelector, fromSelector, toSelector, direction]);
};

export default useHorizontalScroll;
