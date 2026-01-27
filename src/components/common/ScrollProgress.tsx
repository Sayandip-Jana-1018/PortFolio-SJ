"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

// Section markers for the portfolio
const SECTIONS = [
    { name: "Home", position: 0, link: "/#" },
    { name: "Explore", position: 12, link: "/#explore" },
    { name: "About", position: 24, link: "/#about" },
    { name: "Projects", position: 38, link: "/#projects" },
    { name: "Skills", position: 52, link: "/#skills" },
    { name: "Education", position: 62, link: "/#education" },
    { name: "Hackathons", position: 74, link: "/#hackathons" },
    { name: "Certificates", position: 86, link: "/#certificates" },
    { name: "Contact", position: 98, link: "/#contact" },
];

export function ScrollProgress() {
    const { accentColor, theme } = useTheme();
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to percentage for line height  
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Track current scroll percentage for display
    const [scrollPercent, setScrollPercent] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setScrollPercent(Math.round(latest * 100));
    });

    // High contrast colors for both themes
    const trackBg = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    const dotInactive = theme === 'dark' ? 'rgba(60,60,60,1)' : 'rgba(100,100,100,1)';
    const dotBorder = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

    return (
        <div
            className="fixed right-6 top-1/2 -translate-y-1/2 z-[10000] flex flex-col items-center pointer-events-none"
            style={{ height: '60vh' }}
        >
            {/* Track Background - High Visibility */}
            <div
                className="absolute w-[4px] h-full rounded-full overflow-hidden"
                style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: theme === 'dark' ? '0 0 10px rgba(0,0,0,0.5)' : '0 0 10px rgba(255,255,255,0.5)'
                }}
            >
                {/* Inner distinct track line */}
                <div
                    className="w-full h-full opacity-30"
                    style={{ backgroundColor: theme === 'dark' ? '#fff' : '#000' }}
                />
            </div>

            {/* Progress Line - Fills from top as you scroll down */}
            <motion.div
                className="absolute top-0 w-[4px] rounded-full"
                style={{
                    height: lineHeight,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 15px ${accentColor}, 0 0 5px ${accentColor}`
                }}
            />

            {/* Section Dots */}
            {SECTIONS.map((section) => (
                <Link
                    key={section.name}
                    href={section.link}
                    className="absolute pointer-events-auto cursor-pointer group"
                    style={{
                        top: `${section.position}%`,
                        transform: 'translateX(-50%) translateY(-50%)',
                        left: '50%'
                    }}
                >
                    {/* Dot - Larger and more visible */}
                    <div
                        className="w-3 h-3 rounded-full transition-all duration-200 hover:scale-150"
                        style={{
                            backgroundColor: scrollPercent >= section.position ? accentColor : dotInactive,
                            border: `2px solid ${scrollPercent >= section.position ? accentColor : dotBorder}`,
                            boxShadow: scrollPercent >= section.position
                                ? `0 0 8px ${accentColor}, 0 0 16px ${accentColor}50`
                                : `0 0 4px rgba(0,0,0,0.3)`
                        }}
                    />

                    {/* Label on hover */}
                    <div
                        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                    >
                        <span
                            className="text-xs font-medium px-3 py-1.5 rounded-md border shadow-lg"
                            style={{
                                background: theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
                                color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                                borderColor: `${accentColor}50`,
                            }}
                        >
                            {section.name}
                        </span>
                    </div>
                </Link>
            ))}

            {/* Percentage indicator at bottom */}
            <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold"
                style={{ color: accentColor }}
            >
                {scrollPercent}%
            </div>
        </div>
    );
}

export default ScrollProgress;
