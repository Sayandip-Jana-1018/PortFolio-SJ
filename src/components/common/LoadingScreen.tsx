"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface LoadingScreenProps {
    onLoadingComplete?: () => void;
    minDisplayTime?: number;
}

export function LoadingScreen({
    onLoadingComplete,
    minDisplayTime = 1500
}: LoadingScreenProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { accentColor, theme } = useTheme();

    useEffect(() => {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                // Fast at first, slow down near the end
                const increment = prev < 80 ? Math.random() * 15 + 5 : Math.random() * 3 + 1;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        // Minimum display time before hiding
        const timer = setTimeout(() => {
            setIsLoading(false);
            onLoadingComplete?.();
        }, minDisplayTime);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, [minDisplayTime, onLoadingComplete]);

    const bgColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    const textColor = theme === 'dark' ? '#ffffff' : '#0a0a0a';

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    style={{ background: bgColor }}
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.5, ease: "easeInOut" }
                    }}
                >
                    {/* Animated background gradient */}
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${accentColor}30, transparent 70%)`
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Logo/Name */}
                    <motion.div
                        className="relative z-10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Animated initials */}
                        <motion.div
                            className="text-6xl md:text-7xl font-bold mb-4"
                            style={{ color: accentColor }}
                            animate={{
                                textShadow: [
                                    `0 0 20px ${accentColor}40`,
                                    `0 0 40px ${accentColor}60`,
                                    `0 0 20px ${accentColor}40`
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            SJ
                        </motion.div>

                        {/* Name */}
                        <motion.p
                            className="text-lg md:text-xl font-medium opacity-70"
                            style={{ color: textColor }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.3 }}
                        >
                            Sayandip Jana
                        </motion.p>
                    </motion.div>

                    {/* Loading bar */}
                    <motion.div
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {/* Track */}
                        <div
                            className="h-1 rounded-full overflow-hidden"
                            style={{
                                background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Progress */}
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: accentColor,
                                    boxShadow: `0 0 20px ${accentColor}`
                                }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Percentage */}
                        <motion.p
                            className="text-center text-sm mt-3 font-medium"
                            style={{ color: accentColor }}
                        >
                            {Math.round(progress)}%
                        </motion.p>
                    </motion.div>

                    {/* Decorative dots */}
                    <div className="absolute bottom-10 flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ background: accentColor }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoadingScreen;
