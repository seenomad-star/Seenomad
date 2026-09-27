import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGamification } from "@/contexts/GamificationContext";
import { useTestHistory } from "@/hooks/useTestHistory";
import { Zap, Target, TrendingUp, Award } from "lucide-react";

import { cn } from "@/utils/utils";

export const QuickStats: React.FC = () => {
  const { userStats } = useGamification();
  const { getBestWpm, getAverageAccuracy } = useTestHistory();
  const bestWpm = getBestWpm();
  const avgAccuracy = getAverageAccuracy();

  const quickStats = [
    {
      icon: Zap,
      label: "Best WPM",
      value: bestWpm || 0,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Target,
      label: "Avg Accuracy",
      value: `${avgAccuracy?.toFixed(0) || 0}%`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: TrendingUp,
      label: "Tests Today",
      value: userStats.totalTests,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Award,
      label: "Level",
      value: userStats.level,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {quickStats.map((stat) => (
        <Card key={stat.label} className={cn(
          "bg-[#1A1C1E]/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group",
          stat.borderColor
        )}>
          <CardContent className="p-2.5 flex items-center gap-2.5">
            <div className={cn(
              "p-1.5 rounded-xl transition-transform group-hover:scale-110 duration-500",
              stat.bg,
              stat.color
            )}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <p className="text-lg font-black text-foreground tracking-tighter leading-none">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 m-0 leading-none">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div >
  );
};

// Mini version for embedding
export const MiniStats: React.FC = () => {
  const { userStats } = useGamification();
  const { getBestWpm, getAverageAccuracy } = useTestHistory();
  const bestWpm = getBestWpm();
  const avgAccuracy = getAverageAccuracy();

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">{bestWpm || 0}</span>
        <span className="text-muted-foreground text-xs">WPM</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Target className="w-4 h-4 text-green-500" />
        <span className="font-medium">{avgAccuracy?.toFixed(0) || 0}%</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 text-purple-500" />
        <span className="font-medium">Lv.{userStats.level}</span>
      </div>
    </div>
  );
};
