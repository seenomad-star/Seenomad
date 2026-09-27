import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, AtSign, DollarSign, Percent, Star, Lock, CheckCircle, Play, RotateCcw } from "lucide-react";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { TypingDisplay } from "@/components/typing/TypingDisplay";

interface Lesson {
  id: string;
  title: string;
  description: string;
  keys: string[];
  practiceText: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  unlocked: boolean;
  completed: boolean;
  icon: React.ReactNode;
}

const numberLessons: Lesson[] = [
  {
    id: "num-1",
    title: "Number Row Basics",
    description: "Learn to type numbers 1-5 with proper finger placement",
    keys: ["1", "2", "3", "4", "5"],
    practiceText: "12 34 55 21 43 15 32 54 11 22 33 44 55 12 23 34 45 51 42 35 24 13",
    difficulty: "beginner",
    unlocked: true,
    completed: false,
    icon: <Hash className="w-5 h-5" />,
  },
  {
    id: "num-2",
    title: "Complete Number Row",
    description: "Master numbers 6-0 and full number row",
    keys: ["6", "7", "8", "9", "0"],
    practiceText: "67 89 90 78 60 97 86 70 98 67 80 96 77 88 99 00 69 87 76 90 68 79",
    difficulty: "beginner",
    unlocked: true,
    completed: false,
    icon: <Hash className="w-5 h-5" />,
  },
  {
    id: "num-3",
    title: "Mixed Numbers",
    description: "Practice all numbers in random sequences",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    practiceText: "1234567890 0987654321 1357924680 2468013579 9876543210 1029384756",
    difficulty: "intermediate",
    unlocked: true,
    completed: false,
    icon: <Hash className="w-5 h-5" />,
  },
  {
    id: "num-4",
    title: "Phone Numbers",
    description: "Type realistic phone number patterns",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
    practiceText: "555-1234 800-555-0199 212-555-3847 310-555-9876 415-555-2468 617-555-1357",
    difficulty: "intermediate",
    unlocked: true,
    completed: false,
    icon: <Hash className="w-5 h-5" />,
  },
  {
    id: "num-5",
    title: "Dates & Times",
    description: "Practice typing dates and times quickly",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/", ":"],
    practiceText: "01/15/2025 12:30:45 03/22/1995 09:15:00 11/30/2000 23:59:59 06/01/2024 14:45:30",
    difficulty: "advanced",
    unlocked: true,
    completed: false,
    icon: <Hash className="w-5 h-5" />,
  },
];

const symbolLessons: Lesson[] = [
  {
    id: "sym-1",
    title: "Basic Punctuation",
    description: "Master period, comma, and common punctuation",
    keys: [".", ",", "!", "?"],
    practiceText: "Hello, world! How are you? I am fine. Great, thanks! Really? Yes, indeed.",
    difficulty: "beginner",
    unlocked: true,
    completed: false,
    icon: <AtSign className="w-5 h-5" />,
  },
  {
    id: "sym-2",
    title: "Brackets & Parentheses",
    description: "Learn to type various brackets quickly",
    keys: ["(", ")", "[", "]", "{", "}"],
    practiceText: "(hello) [world] {test} (a + b) [x, y, z] {name: value} (1) [2] {3} ((nested))",
    difficulty: "beginner",
    unlocked: true,
    completed: false,
    icon: <AtSign className="w-5 h-5" />,
  },
  {
    id: "sym-3",
    title: "Math Symbols",
    description: "Practice mathematical operators and symbols",
    keys: ["+", "-", "*", "/", "=", "%"],
    practiceText: "5 + 3 = 8 10 - 4 = 6 3 * 7 = 21 20 / 5 = 4 50% off 100 + 200 = 300 a * b = c",
    difficulty: "intermediate",
    unlocked: true,
    completed: false,
    icon: <Percent className="w-5 h-5" />,
  },
  {
    id: "sym-4",
    title: "Currency & Special",
    description: "Master currency symbols and special characters",
    keys: ["$", "@", "#", "&", "^"],
    practiceText: "$100 $25.99 user@email.com #hashtag R&D x^2 $1,000 @mention #trending price & tax",
    difficulty: "intermediate",
    unlocked: true,
    completed: false,
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: "sym-5",
    title: "Programming Symbols",
    description: "Essential symbols for coding",
    keys: ["<", ">", "|", "\\", "`", "~"],
    practiceText: "<div> </tag> a > b x < y a || b path\\to\\file `code` ~home a | b <html></html>",
    difficulty: "advanced",
    unlocked: true,
    completed: false,
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: "sym-6",
    title: "Quotes & Apostrophes",
    description: "Master single and double quotes",
    keys: ["'", "\"", ";", ":"],
    practiceText: "\"Hello\" 'world' it's can't don't she's \"quoted text\" key: value; name: 'John';",
    difficulty: "advanced",
    unlocked: true,
    completed: false,
    icon: <AtSign className="w-5 h-5" />,
  },
];

export const NumberSymbolPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState("numbers");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | undefined>();
  const [isCorrect, setIsCorrect] = useState(true);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, wpm: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);

  const lessons = activeTab === "numbers" ? numberLessons : symbolLessons;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || !selectedLesson) return;

    const key = e.key;
    setPressedKey(key);

    if (key === "Backspace") {
      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
      return;
    }

    if (key.length === 1) {
      const expectedChar = selectedLesson.practiceText[currentIndex];
      const correct = key === expectedChar;

      if (!startTime) {
        setStartTime(Date.now());
      }

      setIsCorrect(correct);
      setUserInput(prev => prev + key);
      setCurrentIndex(prev => prev + 1);

      if (correct) {
        setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }

      // Calculate WPM
      if (startTime) {
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        const wordsTyped = (userInput.length + 1) / 5;
        setStats(prev => ({ ...prev, wpm: Math.round(wordsTyped / elapsedMinutes) || 0 }));
      }

      // Check completion
      if (currentIndex + 1 >= selectedLesson.practiceText.length) {
        setIsPlaying(false);
      }
    }
  }, [isPlaying, selectedLesson, currentIndex, userInput, startTime]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsPlaying(true);
    setUserInput("");
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0, wpm: 0 });
    setStartTime(null);
    setIsCorrect(true);
  };

  const resetLesson = () => {
    if (selectedLesson) {
      startLesson(selectedLesson);
    }
  };

  const exitLesson = () => {
    setSelectedLesson(null);
    setIsPlaying(false);
  };

  const accuracy = stats.correct + stats.incorrect > 0 
    ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
    : 100;

  const progress = selectedLesson 
    ? (currentIndex / selectedLesson.practiceText.length) * 100 
    : 0;

  const isComplete = selectedLesson && currentIndex >= selectedLesson.practiceText.length;

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedLesson.title}</h1>
              <p className="text-muted-foreground">{selectedLesson.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetLesson}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              <Button variant="ghost" onClick={exitLesson}>
                Exit
              </Button>
            </div>
          </div>

          {/* Keys to practice */}
          <div className="flex flex-wrap gap-2">
            {selectedLesson.keys.map(key => (
              <Badge key={key} variant="secondary" className="text-lg px-3 py-1 font-mono">
                {key}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stats.wpm}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{stats.incorrect}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2" />

          {/* Typing Area */}
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              {isComplete ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">Lesson Complete!</h2>
                  <div className="flex justify-center gap-8 text-lg">
                    <div>
                      <span className="text-primary font-bold">{stats.wpm}</span> WPM
                    </div>
                    <div>
                      <span className="text-green-500 font-bold">{accuracy}%</span> Accuracy
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <Button onClick={resetLesson}>Try Again</Button>
                    <Button variant="outline" onClick={exitLesson}>Back to Lessons</Button>
                  </div>
                </div>
              ) : (
                <TypingDisplay
                  text={selectedLesson.practiceText}
                  userInput={userInput}
                  currentIndex={currentIndex}
                />
              )}
            </CardContent>
          </Card>

          {/* Virtual Keyboard */}
          {!isComplete && (
            <VirtualKeyboard
              currentChar={selectedLesson.practiceText[currentIndex]}
              pressedKey={pressedKey}
              isCorrect={isCorrect}
              showFingerGuide={true}
              showHandGestures={true}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Hash className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Number & Symbol Practice</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Master the number row and special characters with dedicated lessons for faster, more accurate typing.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="numbers" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Numbers
            </TabsTrigger>
            <TabsTrigger value="symbols" className="flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Symbols
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className={`relative overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    !lesson.unlocked ? "opacity-50" : ""
                  }`}
                  onClick={() => lesson.unlocked && startLesson(lesson)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {lesson.icon}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          lesson.difficulty === "beginner" ? "bg-green-500/20 text-green-500" :
                          lesson.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-500" :
                          "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {lesson.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {lesson.keys.slice(0, 6).map(key => (
                        <Badge key={key} variant="outline" className="font-mono text-xs">
                          {key}
                        </Badge>
                      ))}
                      {lesson.keys.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{lesson.keys.length - 6}
                        </Badge>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={lesson.unlocked ? "default" : "secondary"}
                      disabled={!lesson.unlocked}
                    >
                      {lesson.unlocked ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Lesson
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </CardContent>
                  {lesson.completed && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NumberSymbolPractice;
