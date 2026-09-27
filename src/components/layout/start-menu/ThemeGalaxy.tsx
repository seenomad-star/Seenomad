
import { cn } from "@/utils/utils";
import React, { useRef, useEffect } from "react";
import { Palette, Crown } from "lucide-react";
import { useTheme } from "next-themes";
import { useGamification } from "@/contexts/GamificationContext";
import { themeOptions } from "@/data/navigationData";

/** Applies --theme-color imperatively to avoid JSX style= prop */
const ThemeColorDot: React.FC<{ color: string }> = ({ color }) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (outerRef.current) outerRef.current.style.border = `2.5px solid ${color}`;
        if (innerRef.current) innerRef.current.style.backgroundColor = color;
    }, [color]);
    return (
        <div ref={outerRef} className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center bg-background">
            <div ref={innerRef} className="w-4 h-4 rounded-full" />
        </div>
    );
};


interface ThemeGalaxyProps {
    setSubModalOpen: (open: boolean) => void;
}

export function ThemeGalaxy({ setSubModalOpen }: ThemeGalaxyProps) {
    const { setTheme, theme } = useTheme();
    const { userStats } = useGamification();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Theme Galaxy
                </h4>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {themeOptions.map((opt) => (
                    <button
                        key={opt.name}
                        onClick={() => !opt.premium || userStats.isPremium ? setTheme(opt.value) : setSubModalOpen(true)}
                        className={cn(
                            "flex-shrink-0 w-24 h-24 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-2 group relative overflow-hidden",
                            theme === opt.value ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border/50 hover:border-primary/30"
                        )}
                    >
                        <ThemeColorDot color={opt.color} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{opt.name}</span>
                        {opt.premium && !userStats.isPremium && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                                <Crown className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
