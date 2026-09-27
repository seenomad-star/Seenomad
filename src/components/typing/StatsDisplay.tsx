import React from "react";
import { TypingStats } from "@/hooks/useTypingGame";
import { Gauge, Target, Clock } from "lucide-react";

interface StatsDisplayProps {
  stats: TypingStats;
  isStarted: boolean;
  targetWpm?: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, isStarted, targetWpm }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const wpmColor = targetWpm
    ? stats.wpm >= targetWpm
      ? "text-success"
      : stats.wpm >= targetWpm * 0.8
      ? "text-primary"
      : "text-foreground"
    : "text-foreground";

  return (
    <div className="flex items-center justify-center gap-8 md:gap-12">
      <div className="flex items-center gap-3 group">
        <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/20 transition-colors">
          <Gauge className="w-5 h-5 text-primary" />
        </div>
        <div className="text-center">
          <div className={`text-3xl md:text-4xl font-bold tabular-nums ${wpmColor}`}>
            {stats.wpm}
            {targetWpm && (
              <span className="text-lg text-muted-foreground">/{targetWpm}</span>
            )}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            WPM
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 group">
        <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-success/20 transition-colors">
          <Target className="w-5 h-5 text-success" />
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
            {stats.accuracy}%
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Accuracy
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 group">
        <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors">
          <Clock className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
            {formatTime(stats.timeElapsed)}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Time
          </div>
        </div>
      </div>
    </div>
  );
};
