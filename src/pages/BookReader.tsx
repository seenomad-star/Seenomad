import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Book,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  Zap,
} from "lucide-react";
import { getBookById, getChapterById, Book as BookType, Chapter } from "@/data/booksData";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { useGamification } from "@/contexts/GamificationContext";
import { useKeyboardSounds, SoundType } from "@/hooks/useKeyboardSounds";

const BookReader: React.FC = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { addXP, addCoins } = useGamification();
  const { playSound, playErrorSound } = useKeyboardSounds();

  const [book, setBook] = useState<BookType | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [lastKeyCorrect, setLastKeyCorrect] = useState(true);
  const [soundType] = useState<SoundType>("mechanical");

  useEffect(() => {
    if (bookId) {
      const foundBook = getBookById(bookId);
      setBook(foundBook || null);
      if (foundBook && chapterId) {
        const foundChapter = getChapterById(bookId, chapterId);
        setChapter(foundChapter || null);
      }
    }
  }, [bookId, chapterId]);

  useEffect(() => {
    containerRef.current?.focus();
  }, [chapter]);

  // Timer
  useEffect(() => {
    if (!isStarted || isFinished) return;
    const interval = setInterval(() => {
      if (startTime) {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isStarted, isFinished, startTime]);

  const calculateStats = useCallback(() => {
    if (!chapter) return { wpm: 0, accuracy: 100 };
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === chapter.content[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    const total = correct + incorrect;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
    const minutes = timeElapsed / 60;
    const words = correct / 5;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
    return { wpm, accuracy, correct, incorrect };
  }, [userInput, chapter, timeElapsed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!chapter || isFinished) return;
      
      e.preventDefault();
      const key = e.key;

      if (key === "Tab") {
        // Restart
        setUserInput("");
        setCurrentIndex(0);
        setIsStarted(false);
        setIsFinished(false);
        setStartTime(null);
        setTimeElapsed(0);
        return;
      }

      if (!isStarted && key.length === 1) {
        setIsStarted(true);
        setStartTime(Date.now());
      }

      setLastPressedKey(key);

      if (key === "Backspace") {
        if (currentIndex > 0) {
          setUserInput((prev) => prev.slice(0, -1));
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (key.length === 1) {
        const isCorrect = key === chapter.content[currentIndex];
        setLastKeyCorrect(isCorrect);
        
        if (isCorrect) {
          playSound(soundType, true);
        } else {
          playErrorSound(soundType);
        }

        setUserInput((prev) => prev + key);
        setCurrentIndex((prev) => prev + 1);

        if (currentIndex + 1 >= chapter.content.length) {
          setIsFinished(true);
          // Save progress
          const progress = JSON.parse(
            localStorage.getItem(`book-progress-${bookId}`) || '{"completedChapters":[]}'
          );
          if (!progress.completedChapters.includes(chapterId)) {
            progress.completedChapters.push(chapterId);
          }
          progress.lastChapter = chapterId;
          localStorage.setItem(`book-progress-${bookId}`, JSON.stringify(progress));
          
          // Award XP and coins
          const stats = calculateStats();
          const xpReward = Math.round(20 + (stats.wpm / 10) + (stats.accuracy / 5));
          const coinReward = Math.round(5 + (stats.wpm / 20));
          addXP(xpReward);
          addCoins(coinReward);
        }
      }

      setTimeout(() => setLastPressedKey(null), 100);
    },
    [chapter, currentIndex, isStarted, isFinished, bookId, chapterId, playSound, playErrorSound, addXP, addCoins, calculateStats]
  );

  const getNextChapter = () => {
    if (!book || !chapter) return null;
    const currentIdx = book.chapters.findIndex((c) => c.id === chapter.id);
    return currentIdx < book.chapters.length - 1 ? book.chapters[currentIdx + 1] : null;
  };

  const getPrevChapter = () => {
    if (!book || !chapter) return null;
    const currentIdx = book.chapters.findIndex((c) => c.id === chapter.id);
    return currentIdx > 0 ? book.chapters[currentIdx - 1] : null;
  };

  if (!book || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Book className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Book or chapter not found</p>
        <Button onClick={() => navigate("/book-library")}>Back to Library</Button>
      </div>
    );
  }

  const stats = calculateStats();
  const nextChapter = getNextChapter();
  const prevChapter = getPrevChapter();
  const progressPercent = (currentIndex / chapter.content.length) * 100;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/book-library")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
        <div className="flex items-center gap-2">
          {prevChapter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/book-reader/${book.id}/${prevChapter.id}`)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          {nextChapter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/book-reader/${book.id}/${nextChapter.id}`)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Book Info */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{book.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
            <Badge variant="outline">{chapter.title}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xl font-bold">{stats.wpm}</p>
              <p className="text-xs text-muted-foreground">WPM</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xl font-bold">{stats.accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xl font-bold">{timeElapsed}s</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-violet-500" />
            <div>
              <p className="text-xl font-bold">{Math.round(progressPercent)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-2" />

      {/* Typing Area */}
      <Card
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="p-6 bg-card/80 backdrop-blur border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-text min-h-[200px]"
      >
        {isFinished ? (
          <div className="text-center py-8 space-y-4">
            <Trophy className="h-16 w-16 mx-auto text-amber-500" />
            <h3 className="text-2xl font-bold">Chapter Complete!</h3>
            <div className="flex justify-center gap-6 text-lg">
              <span>
                <strong>{stats.wpm}</strong> WPM
              </span>
              <span>
                <strong>{stats.accuracy}%</strong> Accuracy
              </span>
              <span>
                <strong>{timeElapsed}s</strong> Time
              </span>
            </div>
            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUserInput("");
                  setCurrentIndex(0);
                  setIsStarted(false);
                  setIsFinished(false);
                  setStartTime(null);
                  setTimeElapsed(0);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              {nextChapter && (
                <Button
                  onClick={() => navigate(`/book-reader/${book.id}/${nextChapter.id}`)}
                >
                  Next Chapter
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Click here and start typing • Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to restart
            </p>
            <TypingDisplay
              text={chapter.content}
              userInput={userInput}
              currentIndex={currentIndex}
            />
          </div>
        )}
      </Card>

      {/* Virtual Keyboard */}
      {showKeyboard && !isFinished && (
        <VirtualKeyboard
          currentChar={chapter.content[currentIndex] || ""}
          pressedKey={lastPressedKey}
          isCorrect={lastKeyCorrect}
          showFingerGuide={true}
        />
      )}

      {/* Keyboard Toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowKeyboard(!showKeyboard)}
        >
          {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
        </Button>
      </div>
    </div>
  );
};

export default BookReader;
