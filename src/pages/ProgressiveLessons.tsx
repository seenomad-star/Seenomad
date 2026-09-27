import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Lock, Unlock, Target, Zap, Coins, Trophy, ChevronRight, CheckCircle2, Star, Keyboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { progressiveLessons, ProgressiveLesson } from "@/data/globalExamsData";
import { useGamification } from "@/contexts/GamificationContext";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { LessonPractice } from "@/pages/LessonPractice";
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  "home-row": "bg-green-500/20 text-green-400",
  "top-row": "bg-blue-500/20 text-blue-400",
  "bottom-row": "bg-purple-500/20 text-purple-400",
  "numbers": "bg-amber-500/20 text-amber-400",
  "symbols": "bg-rose-500/20 text-rose-400",
  "speed": "bg-cyan-500/20 text-cyan-400",
  "accuracy": "bg-emerald-500/20 text-emerald-400",
  "advanced": "bg-indigo-500/20 text-indigo-400",
};

const categoryIcons: Record<string, string> = {
  "home-row": "🏠",
  "top-row": "⬆️",
  "bottom-row": "⬇️",
  "numbers": "🔢",
  "symbols": "⌨️",
  "speed": "⚡",
  "accuracy": "🎯",
  "advanced": "🚀",
};

interface LessonWithStatus extends ProgressiveLesson {
  isUnlocked: boolean;
  isCompleted: boolean;
}

export default function ProgressiveLessons() {
  const navigate = useNavigate();
  const { userStats, addXP, addCoins } = useGamification();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [completedLessons, setCompletedLessons] = useState<Map<string, { wpm: number; accuracy: number }>>(new Map());
  const [selectedLesson, setSelectedLesson] = useState<LessonWithStatus | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [practiceLesson, setPracticeLesson] = useState<LessonWithStatus | null>(null);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("completed-lessons-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompletedLessons(new Map(Object.entries(parsed)));
    }
  }, []);

  // Calculate unlocked lessons based on user level
  const getUnlockedLessons = (): LessonWithStatus[] => {
    return progressiveLessons.map(lesson => ({
      ...lesson,
      isUnlocked: lesson.requiredLevel <= userStats.level || lesson.id === "home-row-1",
      isCompleted: completedLessons.has(lesson.id),
      bestWpm: completedLessons.get(lesson.id)?.wpm,
      bestAccuracy: completedLessons.get(lesson.id)?.accuracy,
    }));
  };

  const lessons = getUnlockedLessons();

  const filteredLessons = activeCategory === "all"
    ? lessons
    : lessons.filter(l => l.category === activeCategory);

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const unlockedCount = lessons.filter(l => l.isUnlocked).length;
  const progressPercent = (completedCount / lessons.length) * 100;

  const startLesson = (lesson: LessonWithStatus) => {
    if (!lesson.isUnlocked) {
      toast.error(`Reach level ${lesson.requiredLevel} to unlock this lesson!`);
      return;
    }
    setPracticeLesson(lesson);
  };

  const handleLessonComplete = (lessonId: string, wpm: number, accuracy: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      const existingData = completedLessons.get(lessonId);
      const newData = {
        wpm: Math.max(wpm, existingData?.wpm || 0),
        accuracy: Math.max(accuracy, existingData?.accuracy || 0),
      };

      const newCompleted = new Map(completedLessons);
      newCompleted.set(lessonId, newData);
      setCompletedLessons(newCompleted);

      // Save to localStorage
      const saveData: Record<string, { wpm: number; accuracy: number }> = {};
      newCompleted.forEach((value, key) => {
        saveData[key] = value;
      });
      localStorage.setItem("completed-lessons-data", JSON.stringify(saveData));
    }
  };

  const categories = ["all", "home-row", "top-row", "bottom-row", "numbers", "symbols", "speed", "accuracy", "advanced"];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <GraduationCap className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Progressive Lessons</h1>
              <p className="text-muted-foreground">Master typing step by step with progressive difficulty</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="gap-2"
          >
            <Keyboard className="w-4 h-4" />
            {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Your Progress</h3>
              <span className="text-sm text-muted-foreground">{completedCount}/{lessons.length} lessons</span>
            </div>
            <Progress value={progressPercent} className="h-3 mb-2" />
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedCount} completed</span>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                <Unlock className="w-4 h-4" />
                <span>{unlockedCount} unlocked</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>{lessons.length - unlockedCount} locked</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Card className="p-4 bg-card text-center">
              <div className="text-2xl font-bold text-primary">{userStats.level}</div>
              <div className="text-xs text-muted-foreground">Your Level</div>
            </Card>
            <Card className="p-4 bg-card text-center">
              <div className="text-2xl font-bold text-amber-500">{userStats.coins}</div>
              <div className="text-xs text-muted-foreground">Coins Earned</div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <div className="mb-8">
          <VirtualKeyboard
            currentChar={selectedLesson?.keys[0] || "f"}
            pressedKey=""
            isCorrect={true}
            showFingerGuide={true}
          />
        </div>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="bg-secondary/50 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.slice(1).map(cat => (
            <TabsTrigger key={cat} value={cat} className="gap-1">
              <span>{categoryIcons[cat]}</span>
              <span className="hidden md:inline capitalize">{cat.replace("-", " ")}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Lessons Grid */}
      <div className="grid gap-4">
        {filteredLessons.map((lesson, index) => (
          <Card
            key={lesson.id}
            className={`p-5 transition-all ${lesson.isUnlocked
                ? 'bg-card hover:border-primary/50 cursor-pointer'
                : 'bg-card/50 opacity-60'
              } ${lesson.isCompleted ? 'border-green-500/30' : ''}`}
            onClick={() => lesson.isUnlocked && startLesson(lesson)}
          >
            <div className="flex items-center gap-4">
              {/* Lesson Number/Status */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${lesson.isCompleted
                  ? 'bg-green-500/20'
                  : lesson.isUnlocked
                    ? 'bg-primary/20'
                    : 'bg-secondary'
                }`}>
                {lesson.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : lesson.isUnlocked ? (
                  <span className="text-xl font-bold text-primary">{lesson.level}</span>
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                  <Badge className={categoryColors[lesson.category]}>
                    {categoryIcons[lesson.category]} {lesson.category.replace("-", " ")}
                  </Badge>
                  {!lesson.isUnlocked && (
                    <Badge variant="outline" className="text-muted-foreground">
                      <Lock className="w-3 h-3 mr-1" />
                      Level {lesson.requiredLevel}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>

                {/* Keys to practice */}
                {lesson.keys.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {lesson.keys.map(key => (
                      <kbd key={key} className="px-2 py-1 text-xs bg-secondary rounded border border-border">
                        {key.toUpperCase()}
                      </kbd>
                    ))}
                  </div>
                )}

                {/* Requirements */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-primary" />
                    <span>{lesson.targetWpm} WPM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>{lesson.targetAccuracy}% accuracy</span>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-primary mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">+{lesson.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Coins className="w-4 h-4" />
                  <span className="font-medium">+{lesson.coinReward}</span>
                </div>
                {lesson.isCompleted && lesson.bestWpm && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Best: {lesson.bestWpm} WPM
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                {lesson.isUnlocked ? (
                  <Button
                    variant={lesson.isCompleted ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      startLesson(lesson);
                    }}
                  >
                    {lesson.isCompleted ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Retry
                      </>
                    ) : (
                      <>
                        Start
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="ghost" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Milestone Banner */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Complete All Lessons</h3>
              <p className="text-muted-foreground">Earn the Master Typist badge and 1000 bonus coins!</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">{Math.round(progressPercent)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
          </div>
        </div>
      </Card>

      {/* Lesson Practice Modal */}
      {practiceLesson && (
        <LessonPractice
          lesson={practiceLesson}
          onComplete={handleLessonComplete}
          onClose={() => setPracticeLesson(null)}
        />
      )}
    </div>
  );
}
