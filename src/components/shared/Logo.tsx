import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

interface LogoProps {
    className?: string;
    size?: number;
    animated?: boolean;
}

export function Logo({ className, size = 32, animated = true }: LogoProps) {
    return (
        <motion.div
            className={cn("relative flex items-center justify-center", className)}
            initial={animated ? { scale: 0.8, opacity: 0 } : {}}
            animate={animated ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                    <filter id="glow-strong">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Hexagon Container - Represents 'System/OS' */}
                <motion.path
                    d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z"
                    stroke="url(#logo-gradient)"
                    strokeWidth="3"
                    fill="hsl(var(--primary) / 0.1)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                    animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Inner 'T' / Cursor Shape - Represents 'Typing' */}
                <motion.path
                    d="M35 35 H65 M50 35 V70"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                    filter="url(#glow-strong)"
                    initial={animated ? { pathLength: 0 } : {}}
                    animate={animated ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />

                {/* Speed Data Dots */}
                <motion.circle
                    cx="50" cy="20" r="3"
                    fill="hsl(var(--primary))"
                    animate={animated ? { opacity: [0.2, 1, 0.2] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="50" cy="80" r="3"
                    fill="hsl(var(--primary))"
                    animate={animated ? { opacity: [0.2, 1, 0.2] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* Orbiting Bit */}
                <motion.circle
                    cx="50" cy="50" r="42"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeDasharray="5 10"
                    className="opacity-30"
                    animate={animated ? { rotate: 360 } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </motion.div>
    );
}
