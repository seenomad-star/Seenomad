import { useState, useEffect, useCallback } from "react";
import { generateText, Language } from "@/data/wordLists";

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
  timeRemaining: number | null;
  frustrationLevel: number; // 0-100
  fatigueIndex: number; // 0-100
  burstConsistency: number; // 0-100
  flowState: number; // 0-100
}

export interface KeystrokeData {
  char: string;
  timestamp: number;
  wpmAtPoint: number;
  isCorrect: boolean;
  index: number;
}

export interface TypingGameState {
  text: string;
  userInput: string;
  currentIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  startTime: number | null;
  stats: TypingStats;
  keystrokes: KeystrokeData[];
  wordCompletedTrigger: number;
}

export interface TypingGameConfig {
  wordCount?: number;
  timeLimit?: number; // in seconds
  targetWpm?: number;
  language?: Language;
  customText?: string;
  mode?: string;
  includePunctuation?: boolean;
  includeNumbers?: boolean;
}

export const useTypingGame = (config: TypingGameConfig = {}) => {
  const {
    wordCount = 30,
    timeLimit,
    targetWpm,
    language = "english",
    customText,
    mode = "words",
    includePunctuation = false,
    includeNumbers = false
  } = config;

  // Generate more words for timed tests
  const actualWordCount = timeLimit ? Math.max(wordCount, Math.ceil((timeLimit / 60) * 50)) : wordCount;

  const getInitialText = () => {
    if (customText && customText.trim()) {
      return customText.trim();
    }
    return generateText(actualWordCount, language, mode, includePunctuation, includeNumbers);
  };

  const [state, setState] = useState<TypingGameState>(() => ({
    text: getInitialText(),
    userInput: "",
    currentIndex: 0,
    isStarted: false,
    isFinished: false,
    startTime: null,
    stats: {
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      timeElapsed: 0,
      timeRemaining: timeLimit || null,
      frustrationLevel: 0,
      fatigueIndex: 0,
      burstConsistency: 100,
      flowState: 0
    },
    keystrokes: [],
    wordCompletedTrigger: 0,
  }));

  const calculateStats = useCallback((
    correctChars: number,
    incorrectChars: number,
    startTime: number | null
  ): TypingStats => {
    const totalChars = correctChars + incorrectChars;
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const minutes = Math.max(0.1 / 60, timeElapsed / 60); // Use a 100ms floor for WPM calculation to prevent spikes
    const words = correctChars / 5;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const timeRemaining = timeLimit ? Math.max(0, timeLimit - timeElapsed) : null;

    return {
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
      timeRemaining,
      frustrationLevel: 0,
      fatigueIndex: 0,
      burstConsistency: 0,
      flowState: 0
    };
  }, [timeLimit]);

  const handleKeyPress = useCallback((key: string) => {
    setState((prev) => {
      if (prev.isFinished) return prev;

      const newState = { ...prev };

      // Start timer on first keypress
      if (!newState.isStarted) {
        newState.isStarted = true;
        newState.startTime = Date.now();
      }

      if (key === "Backspace") {
        if (newState.currentIndex > 0) {
          newState.currentIndex--;
          newState.userInput = newState.userInput.slice(0, -1);
        }
      } else if (key.length === 1) {
        newState.userInput += key;
        newState.currentIndex++;

        // Check if finished (completed all text)
        if (newState.currentIndex >= newState.text.length) {
          newState.isFinished = true;
        }

        // TRIGGER PARTICLES ON WORD COMPLETION (Space or End)
        if (key === " " || newState.currentIndex === newState.text.length) {
          const lastWord = newState.text.slice(0, newState.currentIndex).trim().split(" ").pop();
          const lastInputWord = newState.userInput.trim().split(" ").pop();
          if (lastWord === lastInputWord) {
            newState.wordCompletedTrigger += 1;
          }
        }
      }

      // Recalculate stats
      let correctChars = 0;
      let incorrectChars = 0;
      for (let i = 0; i < newState.userInput.length; i++) {
        if (newState.userInput[i] === newState.text[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      }

      newState.stats = calculateStats(correctChars, incorrectChars, newState.startTime);

      // NEURAL EMPATHY ENGINE
      const recentKeystrokes = newState.keystrokes.slice(-20);
      const isFrustrated = key === "Backspace" && recentKeystrokes.filter(k => k.char === "Backspace").length > 5;
      const avgWpm = newState.stats.wpm;
      const isFatigued = newState.stats.timeElapsed > 60 && avgWpm < (targetWpm || 60) * 0.7;

      newState.stats.frustrationLevel = isFrustrated ? 80 : Math.max(0, newState.stats.frustrationLevel - 10);
      newState.stats.fatigueIndex = isFatigued ? 70 : Math.max(0, newState.stats.fatigueIndex - 5);
      newState.stats.burstConsistency = Math.max(0, 100 - (newState.stats.incorrectChars * 2));

      // FLOW STATE ADAPTATION
      const isFlowing = newState.stats.accuracy > 98 && newState.stats.wpm > (targetWpm || 40);
      newState.stats.flowState = isFlowing
        ? Math.min(100, newState.stats.flowState + 5)
        : Math.max(0, newState.stats.flowState - 15);

      // ADAPTIVE DIFFICULTY: If Flowing, add more text silently if near end
      if (isFlowing && newState.stats.flowState > 50 && newState.text.length - newState.currentIndex < 30) {
        const extraText = " " + generateText(10, language, mode, includePunctuation, includeNumbers);
        newState.text += extraText;
      }

      // Record detailed keystroke for heatmap/replay
      if (key !== "Backspace" && key.length === 1) {
        const isCorrect = key === newState.text[newState.currentIndex - 1];
        newState.keystrokes.push({
          char: key,
          timestamp: Date.now(),
          wpmAtPoint: newState.stats.wpm,
          isCorrect,
          index: newState.currentIndex - 1
        });
      }

      return newState;
    });
  }, [calculateStats]);

  const restart = useCallback(() => {
    const newText = customText && customText.trim()
      ? customText.trim()
      : generateText(actualWordCount, language, mode, includePunctuation, includeNumbers);

    setState({
      text: newText,
      userInput: "",
      currentIndex: 0,
      isStarted: false,
      isFinished: false,
      startTime: null,
      stats: {
        wpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        timeElapsed: 0,
        timeRemaining: timeLimit || null,
        frustrationLevel: 0,
        fatigueIndex: 0,
        burstConsistency: 100,
        flowState: 0
      },
      keystrokes: [],
      wordCompletedTrigger: 0,
    });
  }, [actualWordCount, timeLimit, language, customText, mode]);

  // Update timer and check time limit
  useEffect(() => {
    if (!state.isStarted || state.isFinished) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const newStats = calculateStats(
          prev.stats.correctChars,
          prev.stats.incorrectChars,
          prev.startTime
        );

        // Check if time is up
        if (timeLimit && newStats.timeRemaining !== null && newStats.timeRemaining <= 0) {
          return {
            ...prev,
            isFinished: true,
            stats: { ...newStats, timeRemaining: 0 },
          };
        }

        return {
          ...prev,
          stats: {
            ...newStats,
            frustrationLevel: prev.stats.frustrationLevel,
            fatigueIndex: prev.stats.fatigueIndex,
            burstConsistency: prev.stats.burstConsistency,
            flowState: prev.stats.flowState
          },
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [state.isStarted, state.isFinished, calculateStats, timeLimit]);

  return {
    ...state,
    handleKeyPress,
    restart,
    timeLimit,
    targetWpm,
    language,
  };
};
