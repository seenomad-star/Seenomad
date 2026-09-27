import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTypingGame, TypingGameConfig } from "@/hooks/useTypingGame";
import { useExam } from "@/contexts/ExamContext";
import { useCustomText } from "@/contexts/CustomTextContext";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import { StatsDisplay } from "@/components/typing/StatsDisplay";
import { ResultsModal } from "@/components/typing/ResultsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Keyboard, ArrowLeft, Target, Clock, Languages, FileText, X } from "lucide-react";
import { Language, languageNames } from "@/data/wordLists";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allLanguages: Language[] = [
  "english", "hindi", "tamil", "telugu", "marathi", 
  "bengali", "gujarati", "punjabi", "kannada", "malayalam", "odia"
];

export const TypingGame: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { examConfig, clearExam } = useExam();
  const { customText, clearCustomText } = useCustomText();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    examConfig?.language || "english"
  );

  // Update language when exam config changes
  useEffect(() => {
    if (examConfig?.language) {
      setSelectedLanguage(examConfig.language);
    }
  }, [examConfig?.language]);

  const isCustomTextMode = customText.isActive && customText.text.trim().length > 0;

  const config: TypingGameConfig = examConfig
    ? {
        timeLimit: examConfig.duration * 60,
        targetWpm: examConfig.targetWpm,
        wordCount: 50,
        language: selectedLanguage,
      }
    : isCustomTextMode
    ? { customText: customText.text, language: "english" }
    : { wordCount: 30, language: selectedLanguage };

  const {
    text,
    userInput,
    currentIndex,
    isStarted,
    isFinished,
    stats,
    handleKeyPress,
    restart,
    timeLimit,
    targetWpm,
    language,
  } = useTypingGame(config);

  // Restart when language changes (only for non-custom text mode)
  useEffect(() => {
    if (!isCustomTextMode) {
      restart();
    }
  }, [selectedLanguage, isCustomTextMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" && e.key !== "F5" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
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
  }, [handleKeyPress, restart]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleBackToExams = () => {
    clearExam();
    navigate("/exams");
  };

  const handleLanguageChange = (lang: Language) => {
    if (!isStarted) {
      setSelectedLanguage(lang);
    }
  };

  const progress = (currentIndex / text.length) * 100;
  const passed = targetWpm ? stats.wpm >= targetWpm && stats.accuracy >= 85 : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isIndic = selectedLanguage !== "english";

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center px-4 py-8 md:py-12 min-h-[calc(100vh-6rem)] outline-none"
      tabIndex={0}
    >
      {/* Exam Header */}
      {examConfig && (
        <div className="w-full max-w-4xl mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToExams}
            className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exams
          </Button>
          <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-foreground">{examConfig.name}</h2>
                <Badge variant={examConfig.isMockTest ? "default" : "secondary"}>
                  {examConfig.isMockTest ? "Mock Test" : "Practice"}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Languages className="w-3 h-3" />
                  {languageNames[selectedLanguage]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{examConfig.fullName}</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{examConfig.targetWpm} WPM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{examConfig.duration} min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Text Mode Banner */}
      {isCustomTextMode && !examConfig && (
        <div className="w-full max-w-4xl mb-6">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium text-foreground">Custom Text Practice</h3>
                <p className="text-sm text-muted-foreground">
                  {customText.text.split(/\s+/).length} words · {customText.text.length} characters
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearCustomText();
                restart();
              }}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
              Exit Custom Mode
            </Button>
          </div>
        </div>
      )}

      {/* Language selector - only show when not in exam mode and not custom text mode */}
      {!examConfig && !isCustomTextMode && (
        <div className="w-full max-w-4xl mb-6">
          <div className="flex items-center justify-center gap-3">
            <Languages className="w-5 h-5 text-muted-foreground" />
            <Select
              value={selectedLanguage}
              onValueChange={(value) => handleLanguageChange(value as Language)}
              disabled={isStarted}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {allLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {languageNames[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <Keyboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {examConfig ? "Typing Test" : isCustomTextMode ? "Custom Practice" : "Speed Typing"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isStarted ? "Keep going..." : "Start typing to begin the test"}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <StatsDisplay stats={stats} isStarted={isStarted} targetWpm={targetWpm} />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-4xl mb-6">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Time remaining for exam mode */}
      {examConfig && stats.timeRemaining !== null && (
        <div className={`mb-4 text-2xl font-mono font-bold ${
          stats.timeRemaining < 60 ? "text-destructive animate-pulse" : "text-foreground"
        }`}>
          {formatTime(stats.timeRemaining)}
        </div>
      )}

      {/* Typing display */}
      <TypingDisplay
        text={text}
        userInput={userInput}
        currentIndex={currentIndex}
        isHindi={isIndic}
      />

      <div className="flex items-center gap-4 mt-8">
        <Button
          onClick={restart}
          variant="secondary"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Restart
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Press <kbd className="px-2 py-1 rounded bg-secondary text-foreground">Tab</kbd> to restart
      </p>

      {/* Results Modal */}
      {isFinished && (
        <ResultsModal
          stats={stats}
          onRestart={restart}
          examConfig={examConfig}
          passed={passed}
          language={selectedLanguage}
        />
      )}
    </div>
  );
};
