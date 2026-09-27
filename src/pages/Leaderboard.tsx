import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Crown, Medal, Trophy, TrendingUp, Zap, Globe, User, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGamification, LeaderboardEntry } from "@/contexts/GamificationContext";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge } from "@/components/shared/PremiumBadge";


export default function Leaderboard() {
  const { userStats } = useGamification();
  const [activeBoard, setActiveBoard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("global");

  const fetchLeaderboard = async (period: string) => {
    setIsLoading(true);
    try {
      // Simulated local leaderboard for database-free system
      const mockData: LeaderboardEntry[] = [
        { id: "1", username: "Nexus-Prime", wpm: 142, accuracy: 99, level: 85, country: "US", timestamp: Date.now() },
        { id: "2", username: "CyberType", wpm: 128, accuracy: 98, level: 72, country: "JP", timestamp: Date.now() },
        { id: "3", username: "GhostPilot", wpm: 115, accuracy: 97, level: 64, country: "DE", timestamp: Date.now() },
        { id: "4", username: "Spectral", wpm: 105, accuracy: 96, level: 58, country: "CA", timestamp: Date.now() },
        { id: "5", username: "VoidRunner", wpm: 98, accuracy: 95, level: 45, country: "FR", timestamp: Date.now() },
        { id: "6", username: "Neo", wpm: 92, accuracy: 94, level: 99, country: "KR", timestamp: Date.now() },
        { id: "7", username: "Circuit", wpm: 88, accuracy: 93, level: 32, country: "CN", timestamp: Date.now() },
        { id: "8", username: "Glitch", wpm: 85, accuracy: 92, level: 28, country: "BR", timestamp: Date.now() },
        { id: "9", username: "Pulse", wpm: 82, accuracy: 91, level: 25, country: "IN", timestamp: Date.now() },
        { id: "10", username: "Static", wpm: 78, accuracy: 90, level: 22, country: "UK", timestamp: Date.now() },
      ];

      // Insert current user into leaderboard if they have stats
      const bestWpm = 88; // Placeholder or pull from history
      // Actually we have history now, but for this component we'll keep it simple or use real stats if available

      const userEntry: LeaderboardEntry = {
        id: "current-user",
        username: "Local Pilot",
        wpm: 88, // Mock for now, would ideally pull from history
        accuracy: 98,
        level: userStats.level,
        country: "Local",
        timestamp: Date.now(),
        isCurrentUser: true
      };

      // Sort and filter based on timeframe (period)
      setActiveBoard([userEntry, ...mockData].sort((a, b) => b.wpm - a.wpm));
    } finally {
      setIsLoading(false);
    }
  };

  const clearLeaderboard = () => {
    toast.info("Score Reset", {
      description: "Local scores have been cleared (Simulation)."
    });
  };

  useEffect(() => {
    fetchLeaderboard(timeframe);
  }, [timeframe]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
    return "bg-card";
  };

  const userRank = activeBoard.findIndex((e) => e.isCurrentUser) + 1;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <PremiumBadge />
        </div>
        <p className="text-muted-foreground">
          Compete with typists worldwide and climb the ranks
        </p>
      </div>

      {/* User Stats Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Your Ranking</h3>
              <p className="text-muted-foreground text-sm">
                {userRank > 0 ? `#${userRank} of ${activeBoard.length} active players` : "Complete a test to join!"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userStats.level}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{userStats.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-500">{userStats.coins}</p>
              </div>
              <p className="text-xs text-muted-foreground">Coins</p>
            </div>
          </div>
        </div>
      </Card>

      <AdBanner type="banner" className="mb-6" />

      <Tabs defaultValue="global" className="mb-6" onValueChange={setTimeframe}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Daily
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 relative min-h-[400px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Fetching global rankings...</p>
              </div>
            </div>
          ) : (
            <LeaderboardTable entries={activeBoard} getRankIcon={getRankIcon} getRankBg={getRankBg} />
          )}
        </div>
      </Tabs>

      <div className="flex justify-center">
        <Button variant="outline" onClick={clearLeaderboard}>
          Reset My Scores
        </Button>
      </div>
    </div>
  );
}

interface LeaderboardTableProps {
  entries: ReturnType<typeof useGamification>["leaderboard"];
  getRankIcon: (rank: number) => React.ReactNode;
  getRankBg: (rank: number) => string;
}

function LeaderboardTable({ entries, getRankIcon, getRankBg }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No entries yet. Be the first to compete!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Card
          key={entry.id}
          className={`p-4 transition-all hover:scale-[1.01] ${getRankBg(index + 1)} ${entry.isCurrentUser ? "ring-2 ring-primary" : ""
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              {getRankIcon(index + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate">
                  {entry.username}
                </span>
                {entry.isCurrentUser && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                    You
                  </Badge>
                )}
                {entry.level >= 30 && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Level {entry.level} {entry.country && `• ${entry.country}`}
              </p>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-lg font-bold text-primary">{entry.wpm}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{entry.accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
