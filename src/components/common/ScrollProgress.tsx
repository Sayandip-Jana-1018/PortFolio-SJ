"use client";

import { useRef } from "react";
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

    // The line slides into its clipped track, so scrolling never causes layout.
    const lineY = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);

    const percentRef = useRef<HTMLDivElement>(null);
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
    const lastPercent = useRef(0);

    // Written straight to the DOM: scrolling must not re-render this component.
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const percent = Math.round(latest * 100);
        if (percent === lastPercent.current) return;
        lastPercent.current = percent;
        if (percentRef.current) percentRef.current.textContent = `${percent}%`;
        SECTIONS.forEach((section, i) => {
            dotRefs.current[i]?.toggleAttribute("data-passed", percent >= section.position);
        });
    });

    return (
        <div
            className="fixed right-6 top-1/2 -translate-y-1/2 z-[10000] flex flex-col items-center pointer-events-none"
            style={{
                height: '60vh',
                '--progress-accent': accentColor,
                '--progress-glow': `${accentColor}50`,
                '--progress-dot': theme === 'dark' ? 'rgba(60,60,60,1)' : 'rgba(100,100,100,1)',
                '--progress-dot-border': theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            } as React.CSSProperties}
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
            <div className="absolute top-0 w-[4px] h-full" style={{ clipPath: 'inset(0 -30px -30px -30px)' }}>
                <motion.div
                    className="w-full h-full rounded-full"
                    style={{
                        y: lineY,
                        backgroundColor: accentColor,
                        boxShadow: `0 0 15px ${accentColor}, 0 0 5px ${accentColor}`
                    }}
                />
            </div>

            {/* Section Dots */}
            {SECTIONS.map((section, i) => (
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
                        ref={(el) => { dotRefs.current[i] = el; }}
                        className="scroll-progress-dot w-3 h-3 rounded-full transition-all duration-200 hover:scale-150"
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
                ref={percentRef}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold"
                style={{ color: accentColor }}
            >
                0%
            </div>
        </div>
    );
}

export default ScrollProgress;
