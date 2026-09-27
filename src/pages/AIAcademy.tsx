import { useState } from "react";
import { Bot, Crown, Star, Users, Clock, BookOpen, Sparkles, GraduationCap, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { aiAcademyCourses } from "@/data/enterpriseFeaturesData";
import { PremiumBadge } from "@/components/shared/PremiumBadge";
import { useGamification } from "@/contexts/GamificationContext";

const categoryColors: Record<string, string> = {
  fundamentals: "bg-blue-500/20 text-blue-400",
  speed: "bg-green-500/20 text-green-400",
  accuracy: "bg-purple-500/20 text-purple-400",
  professional: "bg-amber-500/20 text-amber-400",
  specialized: "bg-rose-500/20 text-rose-400",
};

export default function AIAcademy() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { userStats } = useGamification();

  const filteredCourses = activeCategory === "all" 
    ? aiAcademyCourses 
    : aiAcademyCourses.filter(c => c.category === activeCategory);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Academy</h1>
                <p className="text-muted-foreground">Personalized AI-powered typing education</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
              <PremiumBadge />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{aiAcademyCourses.length}</div>
                  <div className="text-xs text-muted-foreground">AI Courses</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">53K+</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">4.8</div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">AI</div>
                  <div className="text-xs text-muted-foreground">Powered</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Personal Tutor Section */}
      <Card className="mb-8 p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h2 className="text-2xl font-bold text-foreground">AI Personal Tutor</h2>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">PRO</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Get personalized 1-on-1 AI coaching that adapts to your typing patterns, identifies weaknesses, and creates custom exercises just for you.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline">Real-time feedback</Badge>
              <Badge variant="outline">Custom exercises</Badge>
              <Badge variant="outline">Progress tracking</Badge>
              <Badge variant="outline">Weakness analysis</Badge>
            </div>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
            <Crown className="w-4 h-4 mr-2" />
            Start Personal Training
          </Button>
        </div>
      </Card>

      {/* Course Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="speed">Speed</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden bg-card hover:border-primary/50 transition-all group">
            <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <GraduationCap className="w-16 h-16 text-primary/50 group-hover:text-primary transition-colors" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={categoryColors[course.category]}>
                  {course.category}
                </Badge>
                {course.isPro && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons} lessons
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-foreground">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {course.students.toLocaleString()}
                </div>
              </div>

              <Button className="w-full" variant={course.isPro && !userStats.isPremium ? "outline" : "default"}>
                {course.isPro && !userStats.isPremium ? (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Unlock with PRO
                  </>
                ) : (
                  "Start Learning"
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Learn Multilingual Banner */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌍</div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Learn Multilingual - $45/hr</h3>
              <p className="text-muted-foreground">Master typing in 20+ languages with native instructor support</p>
            </div>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
            Start Learning Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
