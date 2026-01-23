"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Rocket } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
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

    // Get native scroll progress (0 to 1)
    const { scrollYProgress } = useScroll();

    // Use raw scroll progress directly - relying on Lenis for the smoothing
    // This removes the "double smoothing" lag/stuck feeling
    const heightPercent = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const topPercent = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Calculate rotation based on velocity to avoid state re-renders
    // 0 = static/up, 1 = down
    const [isScrollingDown, setIsScrollingDown] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const previous = scrollYProgress.getPrevious() ?? 0;
        if (latest > previous) {
            setIsScrollingDown(true);
        } else if (latest < previous) {
            setIsScrollingDown(false);
        }
    });

    const trackBg = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
    const dotBg = theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
    const dotBorder = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';
    const labelBg = theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';
    const labelText = theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col justify-center py-4 pointer-events-none h-[50vh] hidden lg:flex">
            {/* Main container */}
            <div className="relative h-full w-[2px] rounded-full overflow-visible">

                {/* Visual Track Layer */}
                <div
                    className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
                    style={{
                        background: trackBg,
                        boxShadow: `0 0 15px rgba(0,0,0,0.3)`
                    }}
                >
                    {/* Animated shimmer */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${accentColor}40 50%, transparent 100%)`,
                        }}
                        animate={{
                            y: ["-100%", "100%", "-100%"]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Progress bar with glow */}
                    <motion.div
                        className="w-full rounded-full absolute top-0 left-0"
                        style={{
                            height: heightPercent,
                            background: accentColor,
                            boxShadow: `0 0 20px ${accentColor}, 0 0 10px ${accentColor}`,
                        }}
                    />
                </div>

                {/* Terminator Dot at the bottom */}
                <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{
                        background: accentColor,
                        boxShadow: `0 0 10px ${accentColor}`
                    }}
                />

                {/* Animated Rocket at progress tip */}
                <motion.div
                    className="absolute left-1/2 z-[50]"
                    style={{
                        top: topPercent,
                        x: "-50%",
                        y: "-50%",
                    }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Glow behind rocket */}
                        <div
                            className="absolute w-12 h-12 rounded-full blur-xl transition-colors duration-500"
                            style={{ background: accentColor, opacity: 0.5 }}
                        />
                        {/* Rocket container */}
                        <motion.div
                            className="relative w-8 h-8 rounded-full flex items-center justify-center group shadow-2xl border border-white/20"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                                boxShadow: `0 4px 15px ${accentColor}60, inset 0 2px 0 rgba(255,255,255,0.3)`,
                            }}
                            animate={{
                                rotate: isScrollingDown ? 135 : -45,
                                y: [0, -3, 0]
                            }}
                            transition={{
                                rotate: { duration: 0.3, ease: "circOut" }, // Snappy rotation
                                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <Rocket className="w-4 h-4 text-white drop-shadow-md" />

                            {/* Tooltip on hover */}
                            <div
                                className="absolute left-auto right-full mr-4 top-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 rounded text-[10px] border backdrop-blur-md pointer-events-none"
                                style={{
                                    transform: `translateY(-50%) rotate(${isScrollingDown ? -135 : 45}deg)`,
                                    background: labelBg,
                                    borderColor: `${accentColor}30`,
                                    color: labelText
                                }}
                            >
                                <PercentageLabel progress={scrollYProgress} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Section marker dots */}
                {SECTIONS.map((section) => (
                    <SectionDot
                        key={section.name}
                        section={section}
                        accentColor={accentColor}
                        dotBg={dotBg}
                        dotBorder={dotBorder}
                        labelBg={labelBg}
                        labelText={labelText}
                    />
                ))}
            </div>
        </div>
    );
}

function PercentageLabel({ progress }: { progress: any }) {
    const [value, setValue] = useState(0);
    useMotionValueEvent(progress, "change", (latest: number) => {
        setValue(Math.round(latest * 100));
    });
    return <>{value}%</>;
}

interface SectionDotProps {
    section: { name: string; position: number; link: string };
    accentColor: string;
    dotBg: string;
    dotBorder: string;
    labelBg: string;
    labelText: string;
}

function SectionDot({ section, accentColor, dotBg, dotBorder, labelBg, labelText }: SectionDotProps) {
    return (
        <Link
            href={section.link}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto cursor-pointer"
            style={{ top: `${section.position}%` }}
        >
            <motion.div
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: dotBorder,
                    backgroundColor: dotBg,
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                }}
                whileHover={{
                    scale: 1.8,
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    boxShadow: `0 0 15px ${accentColor}`
                }}
            />
            <div
                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
            >
                <span
                    className="text-[11px] font-medium px-3 py-1.5 rounded-md backdrop-blur-xl border"
                    style={{
                        background: labelBg,
                        color: labelText,
                        borderColor: `${accentColor}30`,
                        boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
                    }}
                >
                    {section.name}
                </span>
            </div>
        </Link>
    );
}

export default ScrollProgress;
