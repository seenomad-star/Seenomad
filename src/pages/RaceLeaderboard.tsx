import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Zap, Clock, Target, Crown, Medal, Trash2, TrendingUp } from "lucide-react";
import { useRaceHistory, RaceResult } from "@/hooks/useRaceHistory";
import { toast } from "sonner";

const difficultyColors = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  expert: "bg-red-500/20 text-red-400 border-red-500/30",
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-4 w-4 text-yellow-400" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-300" />;
    case 3:
      return <Medal className="h-4 w-4 text-amber-600" />;
    default:
      return <span className="text-xs text-muted-foreground">#{rank}</span>;
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
};

export const RaceLeaderboard: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const {
    results,
    clearHistory,
    getLeaderboardByDifficulty,
    getBestTimeByDifficulty,
    getHighestWpmByDifficulty,
    getAllTimeStats,
  } = useRaceHistory();

  const leaderboard = getLeaderboardByDifficulty(selectedDifficulty);
  const bestTime = getBestTimeByDifficulty(selectedDifficulty);
  const highestWpm = getHighestWpmByDifficulty(selectedDifficulty);
  const allTimeStats = getAllTimeStats();

  const handleClearHistory = () => {
    clearHistory();
    toast.success("Race history cleared!");
  };

  return (
    <div className="space-y-6">
      {/* All-Time Stats */}
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            All-Time Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">{allTimeStats.totalRaces}</div>
              <div className="text-xs text-muted-foreground">Total Races</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-400">{allTimeStats.avgWpm}</div>
              <div className="text-xs text-muted-foreground">Avg WPM</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <div className="text-2xl font-bold text-green-400">{allTimeStats.avgAccuracy}%</div>
              <div className="text-xs text-muted-foreground">Avg Accuracy</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10">
              <div className="text-2xl font-bold text-yellow-400">{allTimeStats.wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-500/10">
              <div className="text-2xl font-bold text-purple-400">{allTimeStats.winRate}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Tabs */}
      <Tabs value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as typeof selectedDifficulty)}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="easy" className="text-green-400">Easy</TabsTrigger>
          <TabsTrigger value="medium" className="text-yellow-400">Medium</TabsTrigger>
          <TabsTrigger value="hard" className="text-orange-400">Hard</TabsTrigger>
          <TabsTrigger value="expert" className="text-red-400">Expert</TabsTrigger>
        </TabsList>

        {['easy', 'medium', 'hard', 'expert'].map((diff) => (
          <TabsContent key={diff} value={diff} className="space-y-4">
            {/* Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Highest WPM</span>
                  </div>
                  {highestWpm ? (
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-yellow-400">{highestWpm.wpm} WPM</div>
                      <div className="text-sm text-muted-foreground">
                        by {highestWpm.playerName} • {highestWpm.accuracy}% accuracy
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No records yet</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold">Best Winning Time</span>
                  </div>
                  {bestTime ? (
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-blue-400">{formatTime(bestTime.finishTime)}</div>
                      <div className="text-sm text-muted-foreground">
                        by {bestTime.playerName} • {bestTime.wpm} WPM
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No wins yet</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard Table */}
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Top 10 - {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </div>
                  <Badge className={difficultyColors[diff as keyof typeof difficultyColors]}>
                    {diff.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.map((result, index) => (
                      <div
                        key={result.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border border-gray-400/30"
                            : index === 2
                            ? "bg-gradient-to-r from-amber-600/20 to-orange-600/10 border border-amber-600/30"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 flex justify-center">
                            {getRankIcon(index + 1)}
                          </div>
                          <div>
                            <div className="font-medium">{result.playerName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <span className="font-bold">{result.wpm}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-400" />
                            <span>{result.accuracy}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>{formatTime(result.finishTime)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No races completed at this difficulty yet.</p>
                    <p className="text-sm">Complete a race to appear on the leaderboard!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Clear History Button */}
      {results.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Race History
          </Button>
        </div>
      )}
    </div>
  );
};
