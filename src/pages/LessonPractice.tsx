import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import {
  X, RotateCcw, Trophy, Target, Zap, Coins,
  CheckCircle2, XCircle, Keyboard, Timer
} from "lucide-react";
import { ProgressiveLesson } from "@/data/globalExamsData";
import { useGamification } from "@/contexts/GamificationContext";
import { toast } from "sonner";
import { useKeyboardSounds } from "@/hooks/useKeyboardSounds";

interface LessonPracticeProps {
  lesson: ProgressiveLesson;
  onComplete: (lessonId: string, wpm: number, accuracy: number) => void;
  onClose: () => void;
}

export const LessonPractice: React.FC<LessonPracticeProps> = ({
  lesson,
  onComplete,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addXP, addCoins } = useGamification();

  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [lastPressedKey, setLastPressedKey] = useState<string>("");
  const [lastKeyCorrect, setLastKeyCorrect] = useState(true);
  const [wordCompletedTrigger, setWordCompletedTrigger] = useState(0);

  const { playSound, playErrorSound } = useKeyboardSounds();

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const text = lesson.practiceText;

  // Calculate WPM and accuracy in real-time
  useEffect(() => {
    if (isStarted && startTime && !isFinished) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeElapsed(elapsed);

        // WPM = (characters / 5) / (time in minutes)
        const minutes = elapsed / 60;
        if (minutes > 0) {
          const currentWpm = Math.round((correctChars / 5) / minutes);
          setWpm(currentWpm);
        }

        // Accuracy
        const total = correctChars + incorrectChars;
        if (total > 0) {
          setAccuracy(Math.round((correctChars / total) * 100));
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStarted, startTime, isFinished, correctChars, incorrectChars]);

  const handleKeyPress = useCallback((key: string) => {
    if (isFinished) return;

    // Start timer on first keypress
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setLastPressedKey(key);

    if (key === "Backspace") {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setUserInput(prev => prev.slice(0, -1));
      }
      setLastKeyCorrect(true);
      return;
    }

    if (key.length !== 1) return;

    const expectedChar = text[currentIndex];
    const isCorrect = key === expectedChar;

    setLastKeyCorrect(isCorrect);

    if (isCorrect) {
      setCorrectChars(prev => prev + 1);
      playSound(undefined, true);
      if (key === ' ') setWordCompletedTrigger(prev => prev + 1);
    } else {
      setIncorrectChars(prev => prev + 1);
      playErrorSound(undefined);
    }

    setUserInput(prev => prev + key);
    setCurrentIndex(prev => prev + 1);

    // Check if finished
    if (currentIndex + 1 >= text.length) {
      finishLesson();
    }
  }, [currentIndex, text, isStarted, isFinished]);

  const finishLesson = () => {
    setIsFinished(true);
    const finalTime = (Date.now() - (startTime || Date.now())) / 1000;
    const finalMinutes = finalTime / 60;
    const finalWpm = Math.round((correctChars / 5) / Math.max(finalMinutes, 0.01));
    const total = correctChars + incorrectChars;
    const finalAccuracy = total > 0 ? Math.round((correctChars / total) * 100) : 100;

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);

    // Check if passed
    const passed = finalWpm >= lesson.targetWpm && finalAccuracy >= lesson.targetAccuracy;

    if (passed) {
      addXP(lesson.xpReward);
      addCoins(lesson.coinReward);
      onComplete(lesson.id, finalWpm, finalAccuracy);
      toast.success(`🎉 Lesson completed! +${lesson.xpReward} XP, +${lesson.coinReward} coins`);
    } else {
      toast.error(`Keep practicing! You need ${lesson.targetWpm} WPM and ${lesson.targetAccuracy}% accuracy.`);
    }
  };

  const restart = () => {
    setUserInput("");
    setCurrentIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setTimeElapsed(0);
    setLastPressedKey("");
    containerRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" && e.key !== "F5" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        restart();
        return;
      }

      handleKeyPress(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, onClose]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentIndex / text.length) * 100;
  const passed = wpm >= lesson.targetWpm && accuracy >= lesson.targetAccuracy;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      tabIndex={0}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-2 border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{lesson.title}</h2>
              <p className="text-sm text-muted-foreground">Level {lesson.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={showKeyboard ? "text-primary" : ""}
            >
              <Keyboard className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Target Requirements */}
        <div className="flex items-center justify-center gap-6 p-3 bg-secondary/20 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">Target: <strong>{lesson.targetWpm} WPM</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm">Accuracy: <strong>{lesson.targetAccuracy}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm">+{lesson.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-sm">+{lesson.coinReward}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Live Stats */}
        <div className="flex items-center justify-center gap-8 p-4 bg-secondary/10 border-b border-border">
          <div className="text-center">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold font-mono text-foreground">
                {formatTime(timeElapsed)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Time</span>
          </div>
          <div className="text-center">
            <span className={`text-2xl font-bold ${wpm >= lesson.targetWpm ? 'text-green-500' : 'text-primary'}`}>
              {wpm}
            </span>
            <span className="text-xs text-muted-foreground block">WPM</span>
          </div>
          <div className="text-center">
            <span className={`text-2xl font-bold ${accuracy >= lesson.targetAccuracy ? 'text-green-500' : accuracy < 80 ? 'text-red-500' : 'text-amber-500'}`}>
              {accuracy}%
            </span>
            <span className="text-xs text-muted-foreground block">Accuracy</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-green-500">{correctChars}</span>
            <span className="text-xs text-muted-foreground block">Correct</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-red-500">{incorrectChars}</span>
            <span className="text-xs text-muted-foreground block">Errors</span>
          </div>
        </div>

        {/* Keys to Practice */}
        {lesson.keys.length > 0 && (
          <div className="p-3 border-b border-border bg-secondary/5">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">Focus keys:</span>
              {lesson.keys.map(key => (
                <kbd
                  key={key}
                  className="px-3 py-1.5 text-sm bg-primary/20 text-primary rounded-lg border border-primary/30 font-mono"
                >
                  {key.toUpperCase()}
                </kbd>
              ))}
            </div>
          </div>
        )}

        {/* Typing Area */}
        <div className="p-6">
          <TypingDisplay
            text={text}
            userInput={userInput}
            currentIndex={currentIndex}
            isHindi={false}
            particleTrigger={wordCompletedTrigger}
          />

          {!isStarted && !isFinished && (
            <p className="text-center text-muted-foreground mt-6 animate-pulse">
              Start typing to begin the lesson...
            </p>
          )}
        </div>

        {/* Virtual Keyboard */}
        {showKeyboard && !isFinished && (
          <div className="p-4 border-t border-border">
            <VirtualKeyboard
              currentChar={text[currentIndex]}
              pressedKey={lastPressedKey}
              isCorrect={lastKeyCorrect}
              showFingerGuide={true}
            />
          </div>
        )}

        {/* Results Panel */}
        {isFinished && (
          <div className="p-6 border-t border-border bg-gradient-to-b from-secondary/20 to-background">
            <div className="text-center mb-6">
              {passed ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                    <Trophy className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-500 mb-2">Lesson Completed!</h3>
                  <p className="text-muted-foreground">You've earned your rewards!</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-500 mb-2">Keep Practicing!</h3>
                  <p className="text-muted-foreground">
                    You need {lesson.targetWpm} WPM and {lesson.targetAccuracy}% accuracy
                  </p>
                </>
              )}
            </div>

            {/* Final Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center bg-card">
                <div className="text-2xl font-bold text-primary">{wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
                {wpm >= lesson.targetWpm && (
                  <Badge className="mt-1 bg-green-500/20 text-green-500">✓ Passed</Badge>
                )}
              </Card>
              <Card className="p-4 text-center bg-card">
                <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
                {accuracy >= lesson.targetAccuracy && (
                  <Badge className="mt-1 bg-green-500/20 text-green-500">✓ Passed</Badge>
                )}
              </Card>
              <Card className="p-4 text-center bg-card">
                <div className="text-2xl font-bold text-foreground">{formatTime(timeElapsed)}</div>
                <div className="text-xs text-muted-foreground">Time</div>
              </Card>
              <Card className="p-4 text-center bg-card">
                <div className="text-2xl font-bold text-foreground">{correctChars}</div>
                <div className="text-xs text-muted-foreground">Characters</div>
              </Card>
            </div>

            {/* Rewards Earned */}
            {passed && (
              <div className="flex items-center justify-center gap-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-semibold">+{lesson.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold">+{lesson.coinReward} coins</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 p-4 border-t border-border bg-secondary/30">
          <Button onClick={restart} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {isFinished ? "Try Again" : "Restart"}
          </Button>
          <Button onClick={onClose} variant={isFinished && passed ? "default" : "secondary"}>
            {isFinished && passed ? "Continue" : "Close"}
          </Button>
        </div>

        {/* Keyboard Hint */}
        <div className="text-center text-xs text-muted-foreground py-2 bg-background/50 border-t border-border">
          Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground">Tab</kbd> to restart •
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-foreground ml-1">Esc</kbd> to close
        </div>
      </Card>
    </div>
  );
};
