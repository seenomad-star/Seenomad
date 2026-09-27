import React from 'react';
import { KeystrokeData } from '@/hooks/useTypingGame';
import { cn } from '@/utils/utils';

interface KeystrokeHeatmapProps {
    keystrokes: KeystrokeData[];
    text: string;
    className?: string;
}

export const KeystrokeHeatmap: React.FC<KeystrokeHeatmapProps> = ({ keystrokes, text, className }) => {
    // Create a map of index -> wpmAtPoint
    const statsMap = new Map<number, number>();
    keystrokes.forEach(ks => {
        statsMap.set(ks.index, ks.wpmAtPoint);
    });

    // Calculate min/max WPM for color scaling
    const wpms = keystrokes.map(ks => ks.wpmAtPoint);
    const minWpm = Math.min(...wpms, 20);
    const maxWpm = Math.max(...wpms, 80);

    const getColor = (wpm: number | undefined) => {
        if (wpm === undefined) return 'text-muted-foreground/30';

        // Normalize WPM between 0 and 1
        const normalized = (wpm - minWpm) / (maxWpm - minWpm || 1);

        // Blue (Slow) -> Green (Average) -> Red (Fast)
        if (normalized < 0.3) return 'text-blue-400';
        if (normalized < 0.7) return 'text-emerald-400';
        return 'text-rose-500';
    };

    return (
        <div className={cn("p-6 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md", className)}>
            <div className="flex flex-wrap gap-x-[1px] gap-y-1 justify-center">
                {text.split('').map((char, i) => {
                    const wpm = statsMap.get(i);
                    return (
                        <span
                            key={i}
                            className={cn("text-xs font-black transition-colors duration-500", getColor(wpm))}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    );
                })}
            </div>
            <div className="mt-4 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Slow</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Flow</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Peak</span>
            </div>
        </div>
    );
};
