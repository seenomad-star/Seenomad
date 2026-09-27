import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { useTypingGame, TypingGameConfig } from "@/hooks/useTypingGame";
import { useExam } from "@/contexts/ExamContext";
import { useCustomText } from "@/contexts/CustomTextContext";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { useGamification } from "@/contexts/GamificationContext";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import { ResultsModal } from "@/components/typing/ResultsModal";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { ExamSelectionDialog } from "./ExamSelectionDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SponsoredSponsorBadge } from '@/components/shared/SponsoredSponsorBadge';
import {
  RotateCcw, ArrowLeft, Target, Clock, Languages, FileText, X,
  Volume2, VolumeX, Moon, Sun, RefreshCw, Keyboard, Music, Focus,
  Trophy, Zap, Activity, Info, Settings, Maximize2, Palette,
  CheckCircle2, Circle, BookOpen, Coins, TrendingUp, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, languageNames } from "@/data/wordLists";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useKeyboardSounds, SoundType } from "@/hooks/useKeyboardSounds";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardStats } from "@/components/typing/DashboardStats";
import { useTranslation } from "react-i18next";

const allLanguages: Language[] = [
  "english", "hindi", "tamil", "telugu", "marathi",
  "bengali", "gujarati", "punjabi", "kannada", "malayalam", "odia"
];

const timeOptions = [
  { label: "15 Seconds", value: 15 },
  { label: "30 Seconds", value: 30 },
  { label: "1 Minute", value: 60 },
  { label: "2 Minutes", value: 120 },
  { label: "5 Minutes", value: 300 },
  { label: "10 Minutes", value: 600 },
  { label: "15 Minutes", value: 900 },
  { label: "20 Minutes", value: 1200 },
  { label: "30 Minutes", value: 1800 },
];

const textModeOptions = [
  { label: "Words", value: "words" },
  { label: "Sentences", value: "sentences" },
  { label: "Paragraphs", value: "paragraphs" },
  { label: "Numbers", value: "numbers" },
  { label: "Punctuation", value: "punctuation" },
  { label: "Code Snippets", value: "code" },
];

interface TypingTestBoxProps {
  compact?: boolean;
}

export const TypingTestBox: React.FC<TypingTestBoxProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { examConfig, setExamConfig, clearExam } = useExam();
  const { customText, clearCustomText } = useCustomText();
  const { theme, setTheme } = useTheme();
  const {
    isTyping,
    setIsTyping,
    setCurrentWPM,
    setCurrentAccuracy,
    setFocusLevel,
    addSessionXP,
    resetSession,
    isFocusMode,
    toggleFocusMode,
    contentMode,
    limitMode,
    testDuration,
    setTestDuration,
    wordCount,
    setWordCount,
    includePunctuation,
    includeNumbers,
    language,
    soundType,
    showKeyboard,
    setTimeElapsed,
    setTimeRemaining,
    setCorrectChars,
    setIncorrectChars
  } = useTypingSession();

  // Use context values instead of local state
  const selectedLanguage = language as Language;

  const { playSound, playErrorSound } = useKeyboardSounds();
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [lastKeyCorrect, setLastKeyCorrect] = useState(true);
  const lastXPCheckRef = useRef(0);
  const history = useTestHistoryContext();
  const topWpm = history.getBestWpm();

  const isCustomTextMode = customText.isActive && customText.text.trim().length > 0;
  const { ghostData, setGhostData } = useTypingSession();

  // CHALLENGE DETECTION: Decode ghost data from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get('challenge');
    if (challenge) {
      try {
        const decoded = JSON.parse(atob(challenge));
        if (decoded.g) {
          // Map back to KeystrokeData structure
          const mappedGhost = decoded.g.map((ks: any) => ({
            index: ks.i,
            timestamp: ks.t, // relative time
            isCorrect: ks.c === 1,
            wpmAtPoint: decoded.w
          }));
          setGhostData(mappedGhost);
          toast.success(`${t('Challenge Accepted! Compete against')} 124 WPM ${t('Ghost')}.`);
        }
      } catch (err) {
        console.error("Failed to decode challenge:", err);
      }
    }
  }, [setGhostData]);

  const config: TypingGameConfig = examConfig
    ? {
      timeLimit: examConfig.duration * 60,
      targetWpm: examConfig.targetWpm,
      wordCount: 50,
      language: selectedLanguage,
      customText: examConfig.selectedSetText,
    }
    : isCustomTextMode
      ? { customText: customText.text, language: "english" }
      : {
        wordCount: limitMode === 'time' || contentMode === 'zen' ? (contentMode === 'zen' ? 1000 : Math.max(50, testDuration * 2)) : wordCount,
        language: selectedLanguage,
        timeLimit: limitMode === 'time' ? testDuration : 0,
        mode: contentMode,
        includePunctuation,
        includeNumbers,
      };

  const {
    text,
    userInput,
    currentIndex,
    isStarted,
    isFinished,
    stats,
    handleKeyPress,
    restart,
    targetWpm,
    keystrokes,
    wordCompletedTrigger,
  } = useTypingGame(config);

  const currentSelectionProbability = useMemo(() => {
    if (!isStarted || isFinished) return 0;
    const currentWpm = stats.wpm;
    const target = targetWpm || 35;
    if (currentWpm === 0) return 0;

    // Growth Formula: Logistic curve for selection probability
    const diff = currentWpm - target;
    const probability = 1 / (1 + Math.exp(-0.2 * diff));
    return Math.round(probability * 100);
  }, [stats.wpm, targetWpm, isStarted, isFinished]);

  const ghostProgress = useMemo(() => {
    if (!isStarted || !stats.timeElapsed) return 0;

    if (ghostData && ghostData.length > 0) {
      // Find the furthest index the ghost reached at this elapsed time
      const timeMs = stats.timeElapsed * 1000;
      const ghostKsAtTime = ghostData.filter(ks => ks.timestamp <= timeMs);
      const furthestIndex = ghostKsAtTime.length > 0 ? ghostKsAtTime[ghostKsAtTime.length - 1].index : 0;
      return Math.min(100, (furthestIndex / text.length) * 100);
    }

    if (!topWpm) return 0;
    // Fallback to constant speed if no detailed ghost data
    const expectedCharsAtThisTime = (topWpm / 60) * 5 * stats.timeElapsed;
    return Math.min(100, (expectedCharsAtThisTime / text.length) * 100);
  }, [isStarted, topWpm, stats.timeElapsed, text.length, ghostData]);

  const playerProgress = (currentIndex / text.length) * 100;

  useEffect(() => {
    if (!isCustomTextMode) {
      restart();
    }
  }, [selectedLanguage, isCustomTextMode, contentMode, limitMode, testDuration, wordCount, includePunctuation, includeNumbers, examConfig]);

  useEffect(() => {
    setIsTyping(isStarted && !isFinished);
    if (!isStarted && !isFinished) {
      resetSession();
      lastXPCheckRef.current = 0;
    }
  }, [isStarted, isFinished, setIsTyping, resetSession]);

  useEffect(() => {
    if (isStarted && !isFinished) {
      setCurrentWPM(stats.wpm);
      setCurrentAccuracy(stats.accuracy);
      setCorrectChars(stats.correctChars);
      setIncorrectChars(stats.incorrectChars);

      const focusBonus = Math.min(stats.timeElapsed * 2, 50);
      const accuracyBonus = Math.max(0, stats.accuracy - 50);
      setFocusLevel(Math.min(100, focusBonus + accuracyBonus));

      setTimeElapsed(stats.timeElapsed);
      setTimeRemaining(stats.timeRemaining);

      const correctCount = stats.correctChars;
      if (correctCount > 0 && correctCount % 10 === 0 && correctCount > lastXPCheckRef.current) {
        lastXPCheckRef.current = correctCount;
        addSessionXP(1);
      }
    }
  }, [stats.wpm, stats.accuracy, stats.timeElapsed, stats.correctChars, stats.incorrectChars, isStarted, isFinished, setCurrentWPM, setCurrentAccuracy, setCorrectChars, setIncorrectChars, setFocusLevel, addSessionXP, setTimeElapsed, setTimeRemaining]);

  const [showSparks, setShowSparks] = useState(false);
  const [accuracyLevel, setAccuracyLevel] = useState(0);
  const [isBotDetected, setIsBotDetected] = useState(false);
  const [liveShadows, setLiveShadows] = useState<{ id: string, index: number, color: string, name: string }[]>([]);
  const [overtakeQueue, setOvertakeQueue] = useState<string[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [rewards, setRewards] = useState<{ id: string; amount: string; type: 'xp' | 'coin'; x: number; y: number }[]>([]);

  const keyIntervalsRef = useRef<number[]>([]);
  const lastKeyTimeRef = useRef<number>(0);

  const handleRestart = useCallback(() => {
    setIsBotDetected(false);
    keyIntervalsRef.current = [];
    lastKeyTimeRef.current = 0;
    restart();
  }, [restart]);

  useEffect(() => {
    if (isStarted && !isFinished) {
      const threshold = targetWpm ? targetWpm * 1.1 : 60;
      if (stats.wpm > threshold && stats.accuracy > 95) {
        setShowSparks(true);
        const timer = setTimeout(() => setShowSparks(false), 2000);
        return () => clearTimeout(timer);
      }
      setAccuracyLevel(stats.accuracy > 90 ? (stats.accuracy - 90) * 10 : 0);
    } else {
      setShowSparks(false);
      setAccuracyLevel(0);
      setLiveShadows([]);
    }
  }, [stats.wpm, stats.accuracy, isStarted, isFinished, targetWpm]);

  // LIVE SHADOWS SIMULATION (Aura Velocity)
  useEffect(() => {
    if (isStarted && !isFinished) {
      // Initialize shadows
      if (liveShadows.length === 0) {
        setLiveShadows([
          { id: 'ghost-1', index: 0, color: 'text-indigo-400', name: 'Speedster_X' },
          { id: 'ghost-2', index: 0, color: 'text-purple-400', name: 'Z_Typist' }
        ]);
      }

      const timer = setInterval(() => {
        setLiveShadows(prev => prev.map(shadow => {
          const speedFactor = shadow.id === 'ghost-1' ? 70 : 85;
          const randomBurst = Math.random() > 0.8 ? 2 : 0.5;
          const progressInc = (speedFactor / 60 / 5) * randomBurst;
          const newIndex = Math.min(text.length - 1, shadow.index + progressInc);

          // Overtake Logic
          if (currentIndex > shadow.index && currentIndex <= newIndex + 1) {
            setOvertakeQueue(q => [...q, shadow.name]);
            setTimeout(() => setOvertakeQueue(q => q.slice(1)), 2000);
          }

          return { ...shadow, index: newIndex };
        }));
      }, 500);

      return () => clearInterval(timer);
    }
  }, [isStarted, isFinished, currentIndex, text.length]);

  // Render Smart Caret - Move up to fix lint and use in callbacks
  const charElements = typeof document !== 'undefined' ? document.querySelectorAll('.char-pending, .char-correct, .char-incorrect, .char-current') : [];
  const currentCharElement = (charElements[currentIndex] as HTMLElement) || null;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isBotDetected) return; // Stop if bot detected

    if (e.key === "Escape" && isFocusMode) {
      toggleFocusMode();
      return;
    }
    if (e.key !== "Tab" && e.key !== "F5" && !e.ctrlKey && !e.metaKey && e.key !== "Escape") {
      e.preventDefault();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      handleRestart();
      return;
    }

    // INTEGRITY CHECK: Detect robotic typing (extremely consistent intervals)
    const now = performance.now();
    if (lastKeyTimeRef.current > 0) {
      const interval = now - lastKeyTimeRef.current;
      keyIntervalsRef.current.push(interval);
      if (keyIntervalsRef.current.length > 30) {
        keyIntervalsRef.current.shift();
        // Calculate standard deviation of intervals
        const avg = keyIntervalsRef.current.reduce((a, b) => a + b) / 30;
        const variance = keyIntervalsRef.current.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 30;
        const stdDev = Math.sqrt(variance);

        // Human typing varies; if stdDev is extremely low (< 5ms), it's likely a script
        if (stdDev < 5 && stats.wpm > 100) {
          console.warn("Robotic typing detected!");
          setIsBotDetected(true);
          toast.error(t("Security Alert: Robotic activity detected. Test invalidated."));
          handleRestart();
        }
      }
    }
    lastKeyTimeRef.current = now;

    // SPEED LIMIT CHECK
    // Higher threshold to prevent false positives for elite typists
    if (stats.wpm > 450) {
      setIsBotDetected(true);
      toast.error(t("Security Alert: Impossible speed detected. Test invalidated."));
      handleRestart();
      return;
    }

    if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
      setLastPressedKey(e.key);
      const expectedChar = text[currentIndex];
      const isCorrect = e.key === expectedChar;
      setLastKeyCorrect(e.key === "Backspace" ? true : isCorrect);

      // DOPAMINE ENGINE: Combo & Reward Logic
      if (e.key !== "Backspace") {
        if (isCorrect) {
          const newCombo = combo + 1;
          setCombo(newCombo);
          if (newCombo > maxCombo) setMaxCombo(newCombo);

          // Reward 'Pops' every 10 combo or on perfect word completion (space)
          if (newCombo % 20 === 0 || (e.key === " " && combo > 5)) {
            const rect = containerRef.current?.getBoundingClientRect();
            const charRect = currentCharElement?.getBoundingClientRect();

            const newReward = {
              id: Math.random().toString(36),
              amount: newCombo % 50 === 0 ? "+5" : "+1",
              type: 'xp' as const,
              x: (charRect?.left || 0) - (rect?.left || 0),
              y: (charRect?.top || 0) - (rect?.top || 0) - 20
            };
            setRewards(prev => [...prev, newReward]);
            addSessionXP(newCombo % 50 === 0 ? 5 : 1);
            setTimeout(() => setRewards(prev => prev.filter(r => r.id !== newReward.id)), 1000);
          }
        } else {
          setCombo(0);
        }
      }
    }
    if (soundType !== "none" && (e.key.length === 1 || e.key === " ")) {
      const expectedChar = text[currentIndex];
      const isCorrect = e.key === expectedChar;
      if (isCorrect) {
        playSound(soundType, true);
      } else {
        playErrorSound(soundType);
      }
    }
    handleKeyPress(e.key);
  }, [isBotDetected, isFocusMode, toggleFocusMode, handleRestart, stats.wpm, stats.accuracy, t, text, currentIndex, combo, maxCombo, currentIndex, addSessionXP, soundType, playSound, playErrorSound, handleKeyPress]);

  useEffect(() => {
    const blockEvent = (e: Event) => {
      e.preventDefault();
      toast.warning(t("Security: Interaction blocked to maintain test integrity."));
    };

    window.addEventListener("keydown", handleKeyDown);
    containerRef.current?.addEventListener("paste", blockEvent);
    containerRef.current?.addEventListener("contextmenu", blockEvent);
    containerRef.current?.addEventListener("drop", blockEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      containerRef.current?.removeEventListener("paste", blockEvent);
      containerRef.current?.removeEventListener("contextmenu", blockEvent);
      containerRef.current?.removeEventListener("drop", blockEvent);
    };
  }, [handleKeyDown, t]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isIndic = selectedLanguage !== "english";
  const passed = targetWpm ? stats.wpm >= targetWpm && stats.accuracy >= 85 : null;

  // Render Smart Caret - Already declared above

  // Calculate relative position for the caret
  const containerRect = containerRef.current?.getBoundingClientRect();
  const charRect = currentCharElement?.getBoundingClientRect();

  // Default values if not started or element not found
  const caretTop = charRect && containerRect ? charRect.top - containerRect.top + containerRef.current!.scrollTop : 20;
  const caretLeft = charRect && containerRect ? charRect.left - containerRect.left : 20;

  return (
    <div
      ref={containerRef}
      className="outline-none space-y-4 relative overflow-clip"
      tabIndex={0}
      role="main"
      aria-label="Typing Test Area"
    >
      <div className={cn(
        "bg-white dark:bg-[#1A1C1E]/80 backdrop-blur-3xl border border-black/[0.03] dark:border-white/5 rounded-[2rem] shadow-xl overflow-hidden transition-all duration-700 relative",
        isFocusMode && "border-primary/20 shadow-primary/10"
      )}>
        {/* ACCURACY EMBERS GLOW */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 accuracy-embers-glow"
          initial={{ opacity: 0 }}
          animate={{
            opacity: accuracyLevel > 0 ? 1 : 0,
            transition: { duration: 1 }
          }}
          style={{
            '--accuracy-level': `${accuracyLevel}px`
          } as React.CSSProperties}
        />

        {/* SPEED SPARKS OVERLAY */}
        {showSparks && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                initial={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* DOPAMINE REWARDS POPUP */}
        <div className="absolute inset-0 pointer-events-none z-[100]">
          {rewards.map(reward => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: reward.y, x: reward.x, scale: 0.5 }}
              animate={{ opacity: 1, y: reward.y - 40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "absolute font-black text-sm drop-shadow-lg flex items-center gap-1",
                reward.type === 'xp' ? "text-primary" : "text-yellow-500"
              )}
            >
              {reward.amount} {reward.type.toUpperCase()}
              {reward.type === 'xp' ? <Zap className="w-3 h-3" /> : <Coins className="w-3 h-3" />}
            </motion.div>
          ))}
        </div>

        {/* COMBO METER */}
        {combo > 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-8 right-8 z-50 flex flex-col items-end"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Combo</div>
            <div className={cn(
              "text-4xl font-black italic tracking-tighter transition-all duration-300",
              combo > 50 ? "text-primary scale-110 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "text-muted-foreground/60"
            )}>
              {combo}x
            </div>
            {combo > 20 && (
              <div className="h-1 w-32 bg-muted/20 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (combo / 100) * 100)}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* TOP TOOLBAR - REMOVED (Moved to ConfigBar) */}

        {/* HIGH-STAKES PERFORMANCE HUD (Real-time AI) */}
        {isStarted && !isFinished && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/20 to-transparent"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-white/50 tracking-widest">{t('AI Status')}</span>
              <Badge className={cn(
                "font-black uppercase text-[10px] py-0",
                currentSelectionProbability > 80 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-yellow-500"
              )}>
                {currentSelectionProbability > 80 ? t('Safe Zone') : t('Risky Sector')}
              </Badge>
            </div>

            <div className="flex-1 max-w-xs mx-8 space-y-1">
              <div className="flex justify-between text-[8px] font-black uppercase text-white/50">
                <span>{t('Player Position')}</span>
                <span>{t('Selection Prob.')}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${currentSelectionProbability}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
              <div className="text-right text-[12px] font-black text-white italic">{currentSelectionProbability}%</div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[8px] font-black uppercase text-white/50 tracking-widest">{t('Mission WPM')}</span>
              <div className="text-xl font-black italic tabular-nums">{stats.wpm}</div>
            </div>
          </motion.div>
        )}

        {/* SPONSORED BADGE (Native Monetization) */}
        {examConfig && (
          <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-40 no-export">
            <SponsoredSponsorBadge brandName="Google Cloud Mastery" />
          </div>
        )}

        {/* GHOST RACER HUD */}
        {isStarted && !isFinished && topWpm > 0 && (
          <div className="absolute top-[70px] left-0 right-0 px-4 z-40">
            <div className="relative h-6 flex items-center">
              <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden border border-white/5">
                {/* GHOST BAR */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-500/20 border-r border-blue-400/50"
                  animate={{ width: `${ghostProgress}%` }}
                >
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                    <span className="text-[8px] font-black text-blue-400">{t('PHANTOM')} ({topWpm})</span>
                    <Moon className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                </motion.div>
                {/* PLAYER BAR */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/20 border-r border-primary"
                  animate={{ width: `${playerProgress}%` }}
                />
              </div>

              {/* GHOST ICON */}
              <motion.div
                className="absolute z-50 pointer-events-none"
                animate={{ left: `${ghostProgress}%` }}
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 flex items-center justify-center shadow-lg border border-white/20">
                  <Moon className="w-2.5 h-2.5 text-white" />
                </div>
              </motion.div>

              {/* PLAYER ICON */}
              <motion.div
                className="absolute z-50 pointer-events-none"
                animate={{ left: `${playerProgress}%` }}
              >
                <div className="w-6 h-6 bg-primary rounded-full -translate-x-1/2 flex items-center justify-center shadow-xl border-2 border-white/40">
                  <Zap className="w-3.5 h-3.5 text-white fill-current" />
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* OVERTAKE NOTIFICATIONS */}
        <div className="absolute top-[200px] right-2 sm:right-8 flex flex-col gap-2 z-50 pointer-events-none">
          <AnimatePresence>
            {overtakeQueue.map((name, i) => (
              <motion.div
                key={`${name}-${i}`}
                initial={{ x: 100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.5 }}
                className="bg-primary/90 text-background px-4 py-2 rounded-xl font-black italic uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-2"
              >
                <TrendingUp className="w-3 h-3" /> {t('Overtook')} {name}!
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* MAIN TYPING LAYOUT */}
      <div className={cn(
        "relative min-h-[300px] lg:min-h-[350px] w-full flex flex-col items-center justify-center p-4 lg:p-8 transition-all duration-700",
        isStarted && !isFinished && stats.wpm > (topWpm || 40) ? "bg-primary/5" : ""
      )}>
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full relative group/engine">
            {/* PERFORMANCE SPEED LINES (Dopamine Visuals) */}
            {isStarted && !isFinished && stats.wpm > 60 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full performance-line"
                    animate={{ x: [-1000, 1000] }}
                    transition={{ duration: 1 / (stats.wpm / 100), repeat: Infinity, delay: i * 0.2 }}
                    style={{ '--line-top': `${20 * i + 10}%` } as React.CSSProperties}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 transition-all duration-500">

              <div className="max-h-[320px] overflow-y-auto custom-scrollbar pr-6 scroll-smooth text-center">
                <TypingDisplay
                  text={text}
                  userInput={userInput}
                  currentIndex={currentIndex}
                  isHindi={isIndic}
                  shadows={liveShadows}
                  particleTrigger={wordCompletedTrigger}
                />
              </div>

              {!isStarted && (
                <div className="mt-4 text-center text-muted-foreground/40 font-medium tracking-tight text-xl animate-pulse">
                  {t('Start typing to begin')}
                </div>
              )}
            </div>
          </div>

          {showKeyboard && (
            <div className="hidden md:block w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
              <VirtualKeyboard
                currentChar={text[currentIndex]}
                pressedKey={lastPressedKey || undefined}
                isCorrect={lastKeyCorrect}
                showFingerGuide={true}
                showHandGestures={true}
              />
            </div>
          )}
        </div>
      </div >

      {/* FINAL ACTIONS */}
      < div className="flex items-center justify-center gap-4 py-4 bg-secondary/20 border-t border-black/[0.03] dark:border-white/5" >
        <Button onClick={handleRestart} className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl font-bold gap-2 shadow-lg transition-all active:scale-95" aria-label="Start new test">
          <RefreshCw className="w-4 h-4" aria-hidden="true" /> {t('New Test')}
        </Button>
        <Button onClick={handleRestart} variant="outline" className="h-12 px-8 bg-white dark:bg-[#25282C] border-black/10 dark:border-white/10 text-foreground rounded-xl font-bold gap-2 shadow-sm hover:bg-secondary transition-all active:scale-95" aria-label="Restart current test">
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> {t('Restart Test')}
        </Button>
      </div >

      <div className="pb-8 text-center">
        <p className="text-xs text-muted-foreground font-medium">{t('Press')} <Badge variant="secondary" className="mx-1 h-5 px-1.5 rounded uppercase font-bold text-[10px]">Tab</Badge> {t('to restart')}</p>
      </div>

      {
        isFinished && (
          <ResultsModal
            stats={stats}
            onRestart={handleRestart}
            examConfig={examConfig}
            passed={passed}
            language={selectedLanguage}
            keystrokes={keystrokes}
            text={text}
          />
        )
      }
    </div >
  );
};
