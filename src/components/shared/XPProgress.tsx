import { Star, Sparkles, TrendingUp, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { Badge } from "@/components/ui/badge";

export function XPProgress({ compact = false }: { compact?: boolean }) {
  const { userStats, getXPForNextLevel } = useGamification();
  
  const xpForNext = getXPForNextLevel();
  const currentLevelXP = Math.pow(userStats.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(userStats.level, 2) * 100;
  const progressInLevel = userStats.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercent = (progressInLevel / xpNeededForLevel) * 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-primary" />
          <span className="text-xs font-bold text-primary">Lv.{userStats.level}</span>
        </div>
        <Progress value={progressPercent} className="w-16 h-1.5" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">Level {userStats.level}</p>
            <p className="text-xs text-muted-foreground">{xpForNext} XP to next level</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {userStats.streak > 0 && (
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 gap-1">
              <Flame className="w-3 h-3" />
              {userStats.streak} day streak
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-500">{userStats.coins}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={progressPercent} className="flex-1 h-2" />
        <span className="text-xs text-muted-foreground font-medium">
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <span>{userStats.xp} XP total</span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {userStats.totalTests} tests completed
        </span>
      </div>
    </div>
  );
}
