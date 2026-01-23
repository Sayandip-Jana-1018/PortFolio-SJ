import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register standard ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SectionTransition: React.FC = () => {
    useEffect(() => {
        // Select all sections that should be animated
        // Targeted by their IDs which are already standard in the app (e.g. #about, #skills)
        // Also including elements with the class 'gsap-section' for manual targeting
        const sections = document.querySelectorAll('section, .gsap-section');

        // Clear any existing ScrollTriggers to prevent duplicates on potential re-runs
        ScrollTrigger.getAll().forEach(t => t.kill());

        sections.forEach((section) => {
            // Basic initial state set by CSS or immediately by GSAP to avoid FOUC
            gsap.set(section, {
                autoAlpha: 0,
                y: 50
            });

            // Create the animation
            gsap.to(section, {
                duration: 1,
                autoAlpha: 1,
                y: 0,
                ease: "power3.out", // Smooth easing
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%", // Only start when top of section is 80% down viewport
                    toggleActions: "play none none reverse", // Play on entry, reverse on leave up
                    // markers: true, // Uncomment for debugging
                }
            });
        });

        return () => {
            // Clean up triggers when component unmounts
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null; // This component handles side effects only
};

export default SectionTransition;
