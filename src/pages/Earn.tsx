import { useState } from "react";
import { Gift, Coins, Sparkles, Target, Clock, Trophy, Zap, CheckCircle2, Calendar, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGamification } from "@/contexts/GamificationContext";
import { AdToEarn } from "@/components/shared/AdToEarn";

export default function Earn() {
  const { userStats, earnTasks, completeTask } = useGamification();

  const handleClaim = (task: { id: string; coinsReward: number; xpReward: number; title: string; isCompleted: boolean }) => {
    if (task.isCompleted) return;
    completeTask(task.id);
  };

  const dailyTasks = earnTasks.filter(t => t.type === "daily");
  const weeklyTasks = earnTasks.filter(t => t.type === "weekly");
  const specialTasks = earnTasks.filter(t => t.type === "special");


  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Coins className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Earn & Rewards</h1>
              <p className="text-muted-foreground">Complete tasks to earn coins and XP</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Card className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-xl font-bold text-amber-500">{userStats.coins}</span>
                <span className="text-sm text-muted-foreground">coins</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card text-center">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-lg bg-green-500/20 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">3/5</div>
            <div className="text-xs text-muted-foreground">Daily Tasks</div>
          </div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-lg bg-blue-500/20 mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">2/4</div>
            <div className="text-xs text-muted-foreground">Weekly Tasks</div>
          </div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-lg bg-purple-500/20 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{userStats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-lg bg-amber-500/20 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{userStats.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
        </Card>
      </div>

      {/* AD TO EARN CYCLE */}
      <AdToEarn rewardAmount={50} />

      {/* Tasks Tabs */}
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="daily" className="gap-2">
            <Clock className="w-4 h-4" />
            Daily Earn
            <Badge variant="secondary" className="ml-1 bg-green-500/20 text-green-400">+100</Badge>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <Calendar className="w-4 h-4" />
            Weekly
            <Badge variant="secondary" className="ml-1 bg-blue-500/20 text-blue-400">+570</Badge>
          </TabsTrigger>
          <TabsTrigger value="special" className="gap-2">
            <Star className="w-4 h-4" />
            Special
            <Badge variant="secondary" className="ml-1 bg-purple-500/20 text-purple-400">+3000</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Daily Earn Tasks</h2>
            <Badge variant="outline" className="text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              Resets in 12:34:56
            </Badge>
          </div>
          <div className="grid gap-4">
            {dailyTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card hover:bg-secondary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${task.isCompleted ? 'bg-green-500/20' : 'bg-primary/10'}`}>
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Target className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.target && (
                      <div className="mt-2">
                        <Progress value={(task.progress / task.target) * 100} className="h-2" />
                        <span className="text-xs text-muted-foreground">{task.progress}/{task.target}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-medium mb-1">
                      <Coins className="w-4 h-4" />
                      +{task.coinsReward}
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm">
                      <Zap className="w-3 h-3" />
                      +{task.xpReward} XP
                    </div>
                  </div>
                  <Button
                    variant={task.isCompleted ? "outline" : "default"}
                    disabled={task.isCompleted}
                    onClick={() => handleClaim(task)}
                  >
                    {task.isCompleted ? "Claimed" : "Claim"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Weekly Challenges</h2>
            <Badge variant="outline" className="text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Resets in 5 days
            </Badge>
          </div>
          <div className="grid gap-4">
            {weeklyTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-card hover:bg-secondary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${task.isCompleted ? 'bg-green-500/20' : 'bg-blue-500/10'}`}>
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Calendar className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.target && (
                      <div className="mt-2">
                        <Progress value={(task.progress / task.target) * 100} className="h-2" />
                        <span className="text-xs text-muted-foreground">{task.progress}/{task.target}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-medium mb-1">
                      <Coins className="w-4 h-4" />
                      +{task.coinsReward}
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm">
                      <Zap className="w-3 h-3" />
                      +{task.xpReward} XP
                    </div>
                  </div>
                  <Button
                    variant={task.isCompleted ? "outline" : "default"}
                    disabled={task.isCompleted}
                    onClick={() => handleClaim(task)}
                  >
                    {task.isCompleted ? "Claimed" : "Claim"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="special" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Special Milestones</h2>
            <Badge variant="outline" className="text-purple-400 border-purple-400/50">
              <Star className="w-3 h-3 mr-1" />
              One-time rewards
            </Badge>
          </div>
          <div className="grid gap-4">
            {specialTasks.length > 0 ? (
              specialTasks.map((reward) => (
                <Card key={reward.id} className="p-4 bg-card hover:bg-secondary/30 transition-all border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${reward.isCompleted ? 'bg-green-500/20' : 'bg-purple-500/10'}`}>
                      {reward.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Trophy className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">{reward.requirement}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 font-medium mb-1">
                        <Coins className="w-4 h-4" />
                        +{reward.coinsReward}
                      </div>
                      <div className="flex items-center gap-1 text-primary text-sm">
                        <Zap className="w-3 h-3" />
                        +{reward.xpReward} XP
                      </div>
                    </div>
                    <Button
                      variant={reward.isCompleted ? "outline" : "secondary"}
                      disabled={reward.isCompleted}
                      onClick={() => handleClaim(reward)}
                    >
                      {reward.isCompleted ? "Claimed" : "Claim"}
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No special tasks available yet. Complete tests to unlock special milestones!</p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Referral Section */}
      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Gift className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Invite Friends & Earn</h3>
              <p className="text-muted-foreground">Get 100 coins for each friend who joins!</p>
            </div>
          </div>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20">
            <Gift className="w-4 h-4 mr-2" />
            Share Invite Link
          </Button>
        </div>
      </Card>
    </div>
  );
}
