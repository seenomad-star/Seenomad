import { Zap, Target, Clock, CheckCircle2, Sparkles, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamification, DailyChallenge } from "@/contexts/GamificationContext";
import { Badge } from "@/components/ui/badge";

const challengeIcons: Record<DailyChallenge["type"], React.ElementType> = {
  wpm: Zap,
  tests: Target,
  accuracy: CheckCircle2,
  time: Clock,
};

export function DailyChallenges() {
  const { dailyChallenges } = useGamification();

  const completedCount = dailyChallenges.filter((c) => c.completed).length;

  return (
    <Card className="p-5 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Daily Challenges</h3>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {completedCount}/{dailyChallenges.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {dailyChallenges.map((challenge) => {
          const Icon = challengeIcons[challenge.type];
          const progress = Math.min((challenge.current / challenge.target) * 100, 100);

          return (
            <div
              key={challenge.id}
              className={`p-3 rounded-lg border transition-all ${
                challenge.completed
                  ? "bg-success/10 border-success/30"
                  : "bg-secondary/30 border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    challenge.completed ? "bg-success/20" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      challenge.completed ? "text-success" : "text-primary"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {challenge.title}
                    </span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium text-yellow-600">
                        +{challenge.reward}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {challenge.description}
                  </p>
                  {!challenge.completed && (
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {challenge.type === "tests"
                          ? `${challenge.current}/${challenge.target}`
                          : `${Math.round(challenge.current)}${challenge.type === "accuracy" || challenge.type === "wpm" ? "" : "s"}/${challenge.target}${challenge.type === "accuracy" ? "%" : ""}`}
                      </span>
                    </div>
                  )}
                  {challenge.completed && (
                    <span className="text-xs text-success font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed!
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
