import { Trophy, Star, Zap, Target, Flame, Clock, Award, Medal, Bot, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge } from "@/components/shared/PremiumBadge";
import { Badge } from "@/components/ui/badge";

export default function Achievements() {
  const { userStats } = useGamification();
  const { results, getBestWpm, getAverageAccuracy, getTotalPracticeTime } = useTestHistoryContext();

  const bestWpm = getBestWpm();
  const avgAccuracy = getAverageAccuracy();
  const totalTime = getTotalPracticeTime();
  const totalTests = results.length;

  const achievements = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Reach 100 WPM in a typing test",
      icon: Zap,
      progress: Math.min((bestWpm / 100) * 100, 100),
      unlocked: bestWpm >= 100,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      xpReward: 100,
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Complete a test with 100% accuracy",
      icon: Target,
      progress: Math.min(avgAccuracy, 100),
      unlocked: results.some((r) => r.accuracy === 100),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      xpReward: 75,
    },
    {
      id: 3,
      title: "Week Warrior",
      description: "Practice for 7 consecutive days",
      icon: Flame,
      progress: Math.min((userStats.streak / 7) * 100, 100),
      unlocked: userStats.streak >= 7,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      xpReward: 150,
    },
    {
      id: 4,
      title: "Marathon Typer",
      description: "Complete 100 typing tests",
      icon: Medal,
      progress: Math.min((totalTests / 100) * 100, 100),
      unlocked: totalTests >= 100,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      xpReward: 200,
    },
    {
      id: 5,
      title: "Rising Star",
      description: "Reach Level 10",
      icon: Star,
      progress: Math.min((userStats.level / 10) * 100, 100),
      unlocked: userStats.level >= 10,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      xpReward: 100,
    },
    {
      id: 6,
      title: "Dedication",
      description: "Accumulate 1 hour of practice",
      icon: Clock,
      progress: Math.min((totalTime / 3600) * 100, 100),
      unlocked: totalTime >= 3600,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      xpReward: 125,
    },
    {
      id: 7,
      title: "Champion",
      description: "Reach the top 10 on the leaderboard",
      icon: Trophy,
      progress: 30,
      unlocked: false,
      color: "text-primary",
      bgColor: "bg-primary/10",
      xpReward: 250,
    },
    {
      id: 8,
      title: "Elite Typist",
      description: "Unlock all other achievements",
      icon: Award,
      progress: 0,
      unlocked: false,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      xpReward: 500,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          </div>
          <PremiumBadge />
        </div>
        <p className="text-muted-foreground">
          {unlockedCount} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* XP & Level Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Level {userStats.level}</h3>
              <p className="text-muted-foreground">{userStats.xp} XP earned</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{userStats.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{userStats.coins}</p>
              <p className="text-xs text-muted-foreground">Coins</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Overall Progress */}
      <Card className="p-6 bg-card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Overall Progress</h2>
          <span className="text-2xl font-bold text-primary">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <Progress value={(unlockedCount / achievements.length) * 100} className="h-3" />
      </Card>

      {/* Ad Banner */}
      <AdBanner type="banner" className="mb-6" />

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-5 transition-all ${
              achievement.unlocked
                ? "bg-card border-primary/30"
                : "bg-card opacity-70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl ${achievement.bgColor} ${
                  achievement.unlocked ? "ring-2 ring-primary/30" : ""
                }`}
              >
                <achievement.icon
                  className={`w-6 h-6 ${
                    achievement.unlocked ? achievement.color : "text-muted-foreground"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                      Unlocked!
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between">
                  {!achievement.unlocked && (
                    <div className="flex items-center gap-3 flex-1">
                      <Progress value={achievement.progress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(achievement.progress)}%
                      </span>
                    </div>
                  )}
                  <Badge variant="outline" className="text-xs ml-2">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
