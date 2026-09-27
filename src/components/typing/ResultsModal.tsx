import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TypingStats, KeystrokeData } from "@/hooks/useTypingGame";
import { ExamConfig, useExam } from "@/contexts/ExamContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Zap, Target, Clock, CheckCircle2, XCircle, ArrowLeft, Star, TrendingUp, Sparkles, Share2 } from "lucide-react";
import { Language, languageNames } from "@/data/wordLists";
import { AIInsightCard } from "@/pages/AICoach";
import { AdPlacement } from "@/components/shared/AdPlacement";
import { SocialShare } from "@/components/shared/SocialShare";
import { CertificateGenerator } from "@/components/shared/CertificateGenerator";
import { MomentOfGlory } from "@/components/shared/MomentOfGlory";
import { ChallengeLinkOverlay } from "@/components/shared/ChallengeLinkOverlay";
import { ReplayShareCard } from "@/components/shared/ReplayShareCard";
import { useTranslation } from "react-i18next";

interface ResultsModalProps {
  stats: TypingStats;
  onRestart: () => void;
  examConfig?: ExamConfig | null;
  passed?: boolean | null;
  language: Language;
  keystrokes?: KeystrokeData[];
  text?: string;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ stats, onRestart, examConfig, passed, language, keystrokes = [], text = "" }) => {
  const navigate = useNavigate();
  const { clearExam } = useExam();
  const { saveResult } = useTestHistoryContext();
  const { addXP, addCoins, updateStreak, submitToLeaderboard, updateChallengeProgress, updateTaskProgress, userStats } = useGamification();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showReplayCard, setShowReplayCard] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedUP, setEarnedUP] = useState(0);

  // Save result and update gamification on mount
  useEffect(() => {
    saveResult({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      duration: stats.timeElapsed,
      correctChars: stats.correctChars,
      totalChars: stats.totalChars,
      language,
      examName: examConfig?.name,
      passed: passed ?? undefined,
    });

    // Calculate XP earned
    let xp = Math.round(stats.wpm * (stats.accuracy / 100));
    if (stats.accuracy >= 95) xp += 20;
    if (stats.wpm >= 80) xp += 30;
    if (passed) xp += 50;
    if (userStats.isPremium) xp *= 2;

    // Calculate OS Points earned (TypingOS Points)
    let up = Math.round(stats.wpm / 2);
    if (stats.accuracy >= 98) up += 10;
    if (userStats.isPremium) up *= 2;

    setEarnedXP(xp);
    setEarnedUP(up);

    const prevLevel = userStats.level;
    addXP(xp);
    addCoins(up);
    updateStreak();
    submitToLeaderboard(stats.wpm, stats.accuracy);

    // Update challenges
    updateChallengeProgress("tests", 1);
    updateChallengeProgress("wpm", stats.wpm);
    updateChallengeProgress("accuracy", stats.accuracy);

    // Update earn tasks progress
    updateTaskProgress("complete-test", 1);
    if (stats.wpm >= 40) {
      updateTaskProgress("achieve-wpm-40", stats.wpm);
    }
    if (stats.accuracy >= 90) {
      updateTaskProgress("accuracy-90", stats.accuracy);
    }

    // Check for level up (with slight delay for animation)
    setTimeout(() => {
      const currentLevelXP = Math.pow(prevLevel, 2) * 100;
      if (userStats.xp + xp >= currentLevelXP) {
        setShowLevelUp(true);
      }
    }, 500);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getWpmMessage = (wpm: number) => {
    if (examConfig && passed !== null) {
      return passed
        ? "Congratulations! You passed the exam requirements!"
        : `You need ${examConfig.targetWpm} WPM with 85%+ accuracy to pass.`;
    }
    if (wpm >= 80) return "Incredible! You're a speed demon! 🔥";
    if (wpm >= 60) return "Great job! Above average typing speed!";
    if (wpm >= 40) return "Good work! Keep practicing!";
    return "Nice effort! Practice makes perfect!";
  };

  const handleBackToExams = () => {
    clearExam();
    navigate("/exams");
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-title"
    >
      <div className="bg-card border border-border rounded-2xl p-8 md:p-10 max-w-md w-full mx-4 shadow-card animate-scale-in">
        {/* Level Up Animation */}
        {showLevelUp && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-2xl z-10 animate-fade-in"
            role="alert"
          >
            <div className="text-center">
              <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Level Up!</h2>
              <p className="text-primary text-xl font-bold">Level {userStats.level + 1}</p>
              <Button onClick={() => setShowLevelUp(false)} className="mt-4" aria-label="Close level up announcement">
                Continue
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <div className={`inline-flex p-4 rounded-full mb-4 ${examConfig
            ? passed
              ? "bg-success/10"
              : "bg-destructive/10"
            : "bg-primary/10"
            }`} role="img" aria-label={examConfig ? (passed ? "Pass Icon" : "Fail Icon") : "Trophy Icon"}>
            {examConfig ? (
              passed ? (
                <CheckCircle2 className="w-10 h-10 text-success" aria-hidden="true" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" aria-hidden="true" />
              )
            ) : (
              <Trophy className="w-10 h-10 text-primary" aria-hidden="true" />
            )}
          </div>
          <h2 id="results-title" className="text-2xl font-bold text-foreground mb-2">
            {examConfig
              ? passed
                ? "Exam Passed!"
                : "Keep Practicing!"
              : "Test Complete!"}
          </h2>
          <p className="text-muted-foreground" aria-live="assertive">{getWpmMessage(stats.wpm)}</p>
          {examConfig && (
            <p className="text-sm text-muted-foreground mt-2">
              {examConfig.name} - {examConfig.isMockTest ? "Mock Test" : "Practice"} ({languageNames[language]})
            </p>
          )}
        </div>

        {/* XP Earned Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 mb-6 flex items-center justify-around gap-4" role="status">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
            <span className="font-bold text-primary">+{earnedXP} XP</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/5 pl-4">
            <Sparkles className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            <span className="font-bold text-yellow-500">+{earnedUP} UP</span>
          </div>
          {userStats.isPremium && (
            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              2x PRO
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-xl p-4 text-center ${examConfig && passed !== null
            ? stats.wpm >= examConfig.targetWpm
              ? "bg-success/10"
              : "bg-destructive/10"
            : "bg-secondary/50"
            }`}>
            <Zap className={`w-6 h-6 mx-auto mb-2 ${examConfig && stats.wpm >= examConfig.targetWpm ? "text-success" : "text-primary"
              }`} />
            <div className="text-3xl font-bold text-foreground">
              {stats.wpm}
              {examConfig && (
                <span className="text-lg text-muted-foreground">/{examConfig.targetWpm}</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </div>

          <div className={`rounded-xl p-4 text-center ${examConfig && passed !== null
            ? stats.accuracy >= 85
              ? "bg-success/10"
              : "bg-destructive/10"
            : "bg-secondary/50"
            }`}>
            <Target className={`w-6 h-6 mx-auto mb-2 ${!examConfig || stats.accuracy >= 85 ? "text-success" : "text-destructive"
              }`} />
            <div className="text-3xl font-bold text-foreground">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-secondary-foreground mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">{formatTime(stats.timeElapsed)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.correctChars}/{stats.totalChars}
            </div>
            <div className="text-sm text-muted-foreground">Characters</div>
          </div>
        </div>

        {/* AI Insight */}
        <AIInsightCard wpm={stats.wpm} accuracy={stats.accuracy} mistakes={[]} />

        {/* AI Adaptive Scaling Suggestions */}
        {!examConfig && (
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 animate-in fade-in zoom-in duration-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Scaling Recommendation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {stats.accuracy >= 98 && stats.wpm >= 60 ? (
                "You're crushing this level! To keep growing, we recommend enabling **Punctuation** or **Numbers** to challenge your precision."
              ) : stats.accuracy < 90 ? (
                "Your speed is impressive, but accuracy is vital for exams. We suggest switching to **Easy Mode** (lowercase only) to master your finger positioning."
              ) : (
                "You're in the sweet spot! Keep practicing at this level to build rock-solid muscle memory before pushing for more complexity."
              )}
            </p>
          </div>
        )}

        {/* MOMENT OF GLORY (Viral Achievement) */}
        {(stats.wpm > 60 || examConfig) && (
          <div className="mb-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Viral Achievement Card</h3>
            <MomentOfGlory
              stats={{
                wpm: stats.wpm,
                accuracy: stats.accuracy,
                rank: "1,204", // Mocked for now
                examName: examConfig?.name || "Global Typing Challenge",
                percentile: 98 // Mocked for now
              }}
              keystrokes={keystrokes}
              text={text}
              onShare={() => setShowReplayCard(true)}
            />
            <Button
              variant="outline"
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => setShowReplayCard(true)}
            >
              <Share2 className="w-4 h-4" />
              Share Replay
            </Button>
            <ChallengeLinkOverlay
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              keystrokes={keystrokes}
              text={text}
            />
          </div>
        )}

        {/* Main Achievement Actions */}
        <div className="space-y-4 mb-6">
          <CertificateGenerator
            wpm={stats.wpm}
            accuracy={stats.accuracy}
            examName={examConfig?.name}
            language={languageNames[language]}
            passed={passed ?? (stats.wpm >= 30 && stats.accuracy >= 85)}
            timeElapsed={stats.timeElapsed}
          />

          <div className="flex justify-center">
            <SocialShare
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              timeElapsed={stats.timeElapsed}
              correctChars={stats.correctChars}
              totalChars={stats.totalChars}
              passed={passed ?? undefined}
              examName={examConfig?.name}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onRestart}
            className="w-full gap-2"
            size="lg"
            aria-label="Try test again"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Try Again
          </Button>

          {examConfig && (
            <Button
              onClick={handleBackToExams}
              variant="outline"
              className="w-full gap-2"
              size="lg"
              aria-label="Back to exam selection"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Back to Exams
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Tab</kbd> to restart
        </p>

        {/* Ad Placement */}
        {!userStats.isPremium && (
          <div className="mt-6">
            <AdPlacement type="horizontal" />
          </div>
        )}
      </div>

      {/* Replay Share Card Modal */}
      {showReplayCard && (
        <ReplayShareCard
          stats={{
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            timeElapsed: stats.timeElapsed,
            correctChars: stats.correctChars,
            totalChars: stats.totalChars
          }}
          keystrokes={keystrokes}
          text={text}
          examName={examConfig?.name}
          onClose={() => setShowReplayCard(false)}
        />
      )}
    </div>
  );
};
