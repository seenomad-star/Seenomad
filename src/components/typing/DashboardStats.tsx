import React from "react";
import { cn } from "@/utils/utils";

interface StatDisplayProps {
    value: string | number;
    label: string;
    color: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ value, label, color }) => (
    <div className="flex items-center gap-1.5" role="status" aria-label={`${label}: ${value}`}>
        <span className={cn("text-base font-bold tracking-tight", color)} aria-hidden="true">{value}</span>
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider" aria-hidden="true">{label}</span>
    </div>
);

interface DashboardStatsProps {
    wpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    className
}) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-4 sm:gap-8 py-3 bg-white dark:bg-transparent border-b border-black/[0.03] dark:border-white/5",
                className
            )}
            aria-live="polite"
        >
            <StatDisplay value={wpm} label="WPM" color="text-amber-500" />
            <StatDisplay value={`${accuracy}%`} label="Accuracy" color="text-emerald-500" />
            <StatDisplay value={correctChars} label="Correct" color="text-blue-500" />
            <StatDisplay value={incorrectChars} label="Errors" color="text-rose-500" />
        </div>
    );
};
