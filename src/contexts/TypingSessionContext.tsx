import React, { createContext, useContext, useState, useCallback } from "react";
import { KeystrokeData } from "@/hooks/useTypingGame";

interface TypingSessionContextType {
  isTyping: boolean;
  setIsTyping: (value: boolean) => void;
  currentWPM: number;
  setCurrentWPM: (value: number) => void;
  currentAccuracy: number;
  setCurrentAccuracy: (value: number) => void;
  focusLevel: number; // 0-100
  setFocusLevel: (value: number) => void;
  sessionXP: number;
  addSessionXP: (amount: number) => void;
  resetSession: () => void;
  timeElapsed: number;
  setTimeElapsed: (value: number) => void;
  timeRemaining: number | null;
  setTimeRemaining: (value: number | null) => void;
  correctChars: number;
  setCorrectChars: (value: number) => void;
  incorrectChars: number;
  setIncorrectChars: (value: number) => void;

  // Monkeytype Config
  contentMode: 'words' | 'sentences' | 'paragraphs' | 'numbers' | 'code' | 'quote' | 'zen' | 'custom' | 'characters';
  setContentMode: (mode: 'words' | 'sentences' | 'paragraphs' | 'numbers' | 'code' | 'quote' | 'zen' | 'custom' | 'characters') => void;
  limitMode: 'time' | 'count';
  setLimitMode: (mode: 'time' | 'count') => void;
  testDuration: number;
  setTestDuration: (duration: number) => void;
  wordCount: number;
  setWordCount: (count: number) => void;
  includePunctuation: boolean;
  setIncludePunctuation: (value: boolean) => void;
  includeNumbers: boolean;
  setIncludeNumbers: (value: boolean) => void;
  quoteLength: 'all' | 'short' | 'medium' | 'long' | 'thick';
  setQuoteLength: (length: 'all' | 'short' | 'medium' | 'long' | 'thick') => void;
  caretStyle: 'block' | 'line' | 'underline' | 'outline' | 'off';
  setCaretStyle: (style: 'block' | 'line' | 'underline' | 'outline' | 'off') => void;
  smoothCaret: boolean;
  setSmoothCaret: (value: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
  // Additional Config
  language: string;
  setLanguage: (lang: string) => void;
  soundType: 'mechanical' | 'typewriter' | 'soft' | 'none';
  setSoundType: (type: 'mechanical' | 'typewriter' | 'soft' | 'none') => void;
  showKeyboard: boolean;
  setShowKeyboard: (show: boolean) => void;
  // Rivalry / Ghost Data
  ghostData: KeystrokeData[] | null;
  setGhostData: (data: KeystrokeData[] | null) => void;
}

const TypingSessionContext = createContext<TypingSessionContextType | null>(null);

export const TypingSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [focusLevel, setFocusLevel] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  // Monkeytype Config State
  const [contentMode, setContentMode] = useState<'words' | 'sentences' | 'paragraphs' | 'numbers' | 'code' | 'quote' | 'zen' | 'custom' | 'characters'>('words');
  const [limitMode, setLimitMode] = useState<'time' | 'count'>('time');
  const [testDuration, setTestDuration] = useState(30);
  const [wordCount, setWordCount] = useState(50);
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [caretStyle, setCaretStyle] = useState<'block' | 'line' | 'underline' | 'outline' | 'off'>('line');
  const [smoothCaret, setSmoothCaret] = useState(true);
  const [quoteLength, setQuoteLength] = useState<'all' | 'short' | 'medium' | 'long' | 'thick'>('all');

  // Additional Config
  const [language, setLanguage] = useState("english");
  const [soundType, setSoundType] = useState<'mechanical' | 'typewriter' | 'soft' | 'none'>("mechanical");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [ghostData, setGhostData] = useState<KeystrokeData[] | null>(null);

  const addSessionXP = useCallback((amount: number) => {
    setSessionXP(prev => prev + amount);
  }, []);

  const resetSession = useCallback(() => {
    setCurrentWPM(0);
    setCurrentAccuracy(100);
    setSessionXP(0);
    setFocusLevel(0);
    setTimeElapsed(0);
    setTimeRemaining(null);
    setCorrectChars(0);
    setIncorrectChars(0);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev);
  }, []);

  return (
    <TypingSessionContext.Provider
      value={{
        isTyping,
        setIsTyping,
        currentWPM,
        setCurrentWPM,
        currentAccuracy,
        setCurrentAccuracy,
        focusLevel,
        setFocusLevel,
        sessionXP,
        addSessionXP,
        resetSession,
        isFocusMode,
        setIsFocusMode,
        toggleFocusMode,
        contentMode, setContentMode,
        limitMode, setLimitMode,
        testDuration, setTestDuration,
        wordCount, setWordCount,
        includePunctuation, setIncludePunctuation,
        includeNumbers, setIncludeNumbers,
        caretStyle, setCaretStyle,
        smoothCaret, setSmoothCaret,
        quoteLength, setQuoteLength,
        language, setLanguage,
        soundType, setSoundType,
        showKeyboard, setShowKeyboard,
        timeElapsed, setTimeElapsed,
        timeRemaining, setTimeRemaining,
        correctChars, setCorrectChars,
        incorrectChars, setIncorrectChars,
        ghostData, setGhostData
      }}
    >
      {children}
    </TypingSessionContext.Provider>
  );
};

export const useTypingSession = () => {
  const context = useContext(TypingSessionContext);
  if (!context) {
    throw new Error("useTypingSession must be used within TypingSessionProvider");
  }
  return context;
};
