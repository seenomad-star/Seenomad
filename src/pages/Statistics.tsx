import { BarChart3, TrendingUp, Clock, Target, Flame, Calendar, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { languageNames } from "@/data/wordLists";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AICoach } from "@/pages/AICoach";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge, PremiumUpsell } from "@/components/shared/PremiumBadge";

export default function Statistics() {
  const {
    getRecentTests,
    getAverageWpm,
    getBestWpm,
    getAverageAccuracy,
    getTotalPracticeTime,
    getWeeklyData,
    clearHistory,
    results,
  } = useTestHistoryContext();

  const recentTests = getRecentTests(10);
  const averageWpm = getAverageWpm();
  const bestWpm = getBestWpm();
  const averageAccuracy = getAverageAccuracy();
  const totalPracticeTime = getTotalPracticeTime();
  const weeklyData = getWeeklyData();

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const stats = [
    {
      title: "Average WPM",
      value: averageWpm.toString(),
      change: results.length > 0 ? `${results.length} tests` : "No tests yet",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Best WPM",
      value: bestWpm.toString(),
      change: bestWpm > 0 ? "Personal best!" : "Take a test",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Accuracy",
      value: `${averageAccuracy}%`,
      change: results.length > 0 ? "Average" : "No data",
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Practice Time",
      value: formatTotalTime(totalPracticeTime),
      change: "Total",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  const hasWeeklyData = weeklyData.some(d => d.wpm > 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
          </div>
          <p className="text-muted-foreground">Track your typing progress over time</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumBadge />
          {results.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {results.length} test results. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* AI Coach */}
      <div className="mb-6">
        <AICoach context="statistics" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-5 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
            <div className="text-xs text-success mt-1">{stat.change}</div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6 bg-card mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Weekly Progress</h2>
        </div>
        <div className="h-64">
          {hasWeeklyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Complete some typing tests to see your weekly progress</p>
            </div>
          )}
        </div>
      </Card>

      {/* Premium Upsell */}
      <div className="mb-6">
        <PremiumUpsell feature="Unlock detailed analytics & AI predictions" />
      </div>

      {/* Ad Banner */}
      <div className="mb-6">
        <AdBanner type="banner" />
      </div>

      {/* Recent Tests */}
      <Card className="p-6 bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Tests</h2>
        {recentTests.length > 0 ? (
          <div className="space-y-3">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-muted-foreground">{formatDate(test.date)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {languageNames[test.language]}
                    </span>
                    {test.examName && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {test.examName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{test.wpm} WPM</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-success">{test.accuracy}%</div>
                  </div>
                  <div className="text-right w-16">
                    <div className="text-sm text-muted-foreground">{formatTime(test.duration)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tests yet. Start typing to see your results here!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
