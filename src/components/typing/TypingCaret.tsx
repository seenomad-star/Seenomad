
import { motion, MotionConfig } from "framer-motion";
import { memo } from "react";
import { cn } from "@/utils/utils";

interface TypingCaretProps {
    top: number;
    left: number;
    style: 'block' | 'line' | 'underline' | 'outline' | 'off';
    smooth: boolean;
    isTyping: boolean;
}

export const TypingCaret = memo(({ top, left, style, smooth, isTyping }: TypingCaretProps) => {
    if (style === 'off') return null;

    // Spring physics for "natural" feel
    const springTransition = {
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5
    } as const;

    const hardTransition = {
        duration: 0
    };

    return (
        <motion.div
            initial={false}
            animate={{ top, left }}
            transition={smooth ? springTransition : hardTransition}
            className={cn(
                "absolute pointer-events-none z-10 transition-colors duration-200",
                style === 'block' && "bg-primary/50 w-[1ch] h-[1.5em] rounded-sm",
                style === 'line' && "bg-primary w-[2px] h-[1.5em] rounded-full",
                style === 'underline' && "bg-primary w-[1ch] h-[3px] mt-[1.2em] rounded-full",
                style === 'outline' && "border-2 border-primary bg-transparent w-[1ch] h-[1.5em] rounded-sm",
                !isTyping && "animate-pulse"
            )}
        />
    );
});
