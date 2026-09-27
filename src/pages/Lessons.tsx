import { useState } from "react";
import {
  GraduationCap, Lock, Crown, Search, BookOpen, Target, Zap,
  Users, Building, Gift, School, Filter, Award, ChevronRight,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AICoach } from "@/pages/AICoach";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge, PremiumUpsell } from "@/components/shared/PremiumBadge";
import { TypingBlog } from "@/pages/TypingBlog";
import { useGamification } from "@/contexts/GamificationContext";
import { useTestHistory } from "@/hooks/useTestHistory";
import {
  courses,
  courseCategories,
  careerTracks,
  touchTypingCourses,
  achievementBadges,
  type Course,
} from "@/data/coursesData";

const categoryIcons: Record<string, React.ElementType> = {
  user: Users,
  school: School,
  building: Building,
  gift: Gift,
};

const categoryFilters = ["All", "Speed", "Accuracy", "Numbers", "Career"];

export default function Lessons() {
  const { userStats } = useGamification();
  const { getBestWpm, getAverageAccuracy, results } = useTestHistory();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilters, setLevelFilters] = useState({
    beginner: true,
    intermediate: false,
    advanced: false,
    pro: false,
  });
  const [careerFilters, setCareerFilters] = useState({
    programmers: false,
    dataEntry: false,
    speedTraining: false,
  });

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" ||
      course.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      (levelFilters.beginner && course.level === "beginner") ||
      (levelFilters.intermediate && course.level === "intermediate") ||
      (levelFilters.advanced && course.level === "advanced") ||
      (levelFilters.pro && course.level === "pro") ||
      (!levelFilters.beginner && !levelFilters.intermediate && !levelFilters.advanced && !levelFilters.pro);
    return matchesCategory && matchesSearch && matchesLevel;
  });

  const toggleLevelFilter = (level: keyof typeof levelFilters) => {
    setLevelFilters((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Course Categories Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20 rounded-2xl p-6 md:p-10 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Find the Typing Course That's Right for You
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the path that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courseCategories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || Users;
            return (
              <Card
                key={cat.id}
                className="p-5 bg-card/80 backdrop-blur hover:shadow-lg transition-all cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground mb-3">{cat.title}</h3>
                <div className="h-24 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 mb-3 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-primary/50 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-medium text-foreground mb-1">{cat.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                <Button size="sm" className="w-full">
                  {cat.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Courses Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Typing Courses</h2>
            <p className="text-muted-foreground">
              Learn to type faster and improve your accuracy with fun and interactive courses!
            </p>
          </div>
          <PremiumBadge />
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Lessons : Completed {results.length}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Highest WPM : {getBestWpm()}
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Target className="w-4 h-4 mr-2" />
            Overall Accuracy : {getAverageAccuracy()}%
          </Badge>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {categoryFilters.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
          <div className="ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Filter</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Level</h4>
                  <div className="space-y-2">
                    {Object.entries(levelFilters).map(([level, checked]) => (
                      <div key={level} className="flex items-center gap-2">
                        <Checkbox
                          id={level}
                          checked={checked}
                          onCheckedChange={() => toggleLevelFilter(level as keyof typeof levelFilters)}
                        />
                        <label
                          htmlFor={level}
                          className="text-sm text-foreground capitalize cursor-pointer"
                        >
                          {level === "pro" ? "Pro Exclusive" : level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3">Career</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="programmers"
                        checked={careerFilters.programmers}
                        onCheckedChange={() =>
                          setCareerFilters((prev) => ({ ...prev, programmers: !prev.programmers }))
                        }
                      />
                      <label htmlFor="programmers" className="text-sm text-foreground cursor-pointer">
                        Typing for Programmers
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="dataEntry"
                        checked={careerFilters.dataEntry}
                        onCheckedChange={() =>
                          setCareerFilters((prev) => ({ ...prev, dataEntry: !prev.dataEntry }))
                        }
                      />
                      <label htmlFor="dataEntry" className="text-sm text-foreground cursor-pointer">
                        Data Entry
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="speedTraining"
                        checked={careerFilters.speedTraining}
                        onCheckedChange={() =>
                          setCareerFilters((prev) => ({ ...prev, speedTraining: !prev.speedTraining }))
                        }
                      />
                      <label htmlFor="speedTraining" className="text-sm text-foreground cursor-pointer">
                        Speed Training
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Career Tracks Card */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Career Tracks</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pick a track and start learning.
              </p>
              <Button size="sm" className="w-full">
                Browse Tracks
              </Button>
            </Card>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} isPremiumUser={userStats.isPremium} />
            ))}

            {filteredCourses.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No courses found matching your filters.</p>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Achievement Badges */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Achievement Badges</h3>
              <div className="flex flex-wrap gap-2">
                {achievementBadges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={badge.unlocked ? "default" : "secondary"}
                    className={badge.unlocked ? "" : "opacity-50"}
                  >
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Limited Offer */}
            <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <h3 className="font-semibold text-foreground mb-2">Limited Time Offer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get 20% off Pro for a limited time.
              </p>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                Get Offer
              </Button>
            </Card>

            {/* Random Challenge */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Random Typing Challenge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Quick daily challenge to boost your skills.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Start Challenge
              </Button>
            </Card>

            {/* AI Coach */}
            <AICoach context="lessons" />
          </div>
        </div>
      </div>

      {/* Pro Upsell Banner */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Go Pro — Unlock All Typing Courses!
              </h3>
              <p className="text-muted-foreground">
                Unlimited courses, 200+ lessons, and advanced career tracks.
              </p>
            </div>
          </div>
          <Button size="lg" className="shrink-0">
            Upgrade to Pro
          </Button>
        </div>
      </Card>

      {/* Career Typing Tracks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Career Typing Tracks</h2>
        <p className="text-muted-foreground mb-6">Specialized training for jobs and exams.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {careerTracks.map((track) => (
            <Card key={track.id} className="p-5 relative">
              {track.isPro && (
                <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">PRO</Badge>
              )}
              <div className="h-24 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">{track.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
              <Button size="sm" variant={track.isPro ? "secondary" : "default"}>
                {track.isPro ? "Unlock Pro" : "Start Course"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Touch Typing Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Touch typing courses</h2>
        <p className="text-muted-foreground mb-6">Choose a course and start practicing right away.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {touchTypingCourses.map((course) => (
            <Card key={course.id} className="p-5">
              <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
              <Button size="sm" variant="outline">
                Start course
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Typing Blog Section */}
      <TypingBlog />

      {/* Ad Banner */}
      <AdBanner type="banner" />
    </div>
  );
}

function CourseCard({ course, isPremiumUser }: { course: Course; isPremiumUser: boolean }) {
  const isLocked = course.isPro && !isPremiumUser;

  return (
    <Card
      className={`p-5 transition-all ${isLocked ? "opacity-80" : "hover:shadow-md cursor-pointer"
        }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{course.title}</h3>
            {course.isPro && (
              <Badge className="bg-yellow-500 text-black text-xs">PRO</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{course.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {course.lessons} lessons
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Target {course.targetWpm} WPM
            </Badge>
            <Badge variant="outline" className="text-xs">
              Earn XP
            </Badge>
          </div>
        </div>
        <Button
          size="sm"
          variant={isLocked ? "secondary" : "default"}
          className={isLocked ? "" : ""}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4 mr-1" />
              Unlock
            </>
          ) : (
            "Start Course"
          )}
        </Button>
      </div>
    </Card>
  );
}
