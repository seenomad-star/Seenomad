import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Target, 
  Clock, 
  Hash, 
  Star, 
  Lock, 
  CheckCircle2,
  Trophy,
  Flame,
  Shield,
  Sparkles,
  Crown,
  Medal,
  Award,
  Rocket,
  Brain,
  Eye,
  Keyboard,
  ChevronRight,
  Info
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirement: string;
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  progress: number;
  maxProgress: number;
  tier: number;
  prerequisiteId?: string;
}

interface SkillBranch {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  skills: Skill[];
}

interface MasteryBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: string;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  maxProgress: number;
}

const skillBranches: SkillBranch[] = [
  {
    id: "speed",
    name: "Speed Master",
    icon: <Zap className="h-6 w-6" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    description: "Increase your typing speed and unlock rapid-fire abilities",
    skills: [
      { id: "speed-1", name: "Quick Fingers", description: "Reach 30 WPM", icon: <Zap className="h-4 w-4" />, requirement: "30 WPM", xpReward: 50, unlocked: true, completed: true, progress: 30, maxProgress: 30, tier: 1 },
      { id: "speed-2", name: "Swift Typist", description: "Reach 50 WPM", icon: <Zap className="h-4 w-4" />, requirement: "50 WPM", xpReward: 100, unlocked: true, completed: true, progress: 50, maxProgress: 50, tier: 2, prerequisiteId: "speed-1" },
      { id: "speed-3", name: "Rapid Striker", description: "Reach 70 WPM", icon: <Zap className="h-4 w-4" />, requirement: "70 WPM", xpReward: 200, unlocked: true, completed: false, progress: 65, maxProgress: 70, tier: 3, prerequisiteId: "speed-2" },
      { id: "speed-4", name: "Lightning Speed", description: "Reach 100 WPM", icon: <Rocket className="h-4 w-4" />, requirement: "100 WPM", xpReward: 500, unlocked: false, completed: false, progress: 0, maxProgress: 100, tier: 4, prerequisiteId: "speed-3" },
      { id: "speed-5", name: "Sonic Typer", description: "Reach 120 WPM", icon: <Flame className="h-4 w-4" />, requirement: "120 WPM", xpReward: 1000, unlocked: false, completed: false, progress: 0, maxProgress: 120, tier: 5, prerequisiteId: "speed-4" },
      { id: "speed-6", name: "Speed Demon", description: "Reach 150 WPM", icon: <Crown className="h-4 w-4" />, requirement: "150 WPM", xpReward: 2000, unlocked: false, completed: false, progress: 0, maxProgress: 150, tier: 6, prerequisiteId: "speed-5" },
    ]
  },
  {
    id: "accuracy",
    name: "Precision Expert",
    icon: <Target className="h-6 w-6" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Perfect your accuracy and eliminate typing errors",
    skills: [
      { id: "acc-1", name: "Careful Typist", description: "Complete a test with 90% accuracy", icon: <Target className="h-4 w-4" />, requirement: "90% accuracy", xpReward: 50, unlocked: true, completed: true, progress: 100, maxProgress: 100, tier: 1 },
      { id: "acc-2", name: "Precise Striker", description: "Complete a test with 95% accuracy", icon: <Target className="h-4 w-4" />, requirement: "95% accuracy", xpReward: 100, unlocked: true, completed: true, progress: 100, maxProgress: 100, tier: 2, prerequisiteId: "acc-1" },
      { id: "acc-3", name: "Sharp Shooter", description: "Complete a test with 98% accuracy", icon: <Eye className="h-4 w-4" />, requirement: "98% accuracy", xpReward: 200, unlocked: true, completed: false, progress: 96, maxProgress: 98, tier: 3, prerequisiteId: "acc-2" },
      { id: "acc-4", name: "Perfect Aim", description: "Complete a test with 99% accuracy", icon: <Shield className="h-4 w-4" />, requirement: "99% accuracy", xpReward: 500, unlocked: false, completed: false, progress: 0, maxProgress: 99, tier: 4, prerequisiteId: "acc-3" },
      { id: "acc-5", name: "Flawless", description: "Complete 5 tests with 100% accuracy", icon: <Star className="h-4 w-4" />, requirement: "5 perfect tests", xpReward: 1000, unlocked: false, completed: false, progress: 0, maxProgress: 5, tier: 5, prerequisiteId: "acc-4" },
      { id: "acc-6", name: "Perfection Master", description: "Complete 25 tests with 100% accuracy", icon: <Crown className="h-4 w-4" />, requirement: "25 perfect tests", xpReward: 2000, unlocked: false, completed: false, progress: 0, maxProgress: 25, tier: 6, prerequisiteId: "acc-5" },
    ]
  },
  {
    id: "endurance",
    name: "Endurance Champion",
    icon: <Clock className="h-6 w-6" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Build stamina for long typing sessions",
    skills: [
      { id: "end-1", name: "Warm Up", description: "Complete a 1-minute test", icon: <Clock className="h-4 w-4" />, requirement: "1 min test", xpReward: 25, unlocked: true, completed: true, progress: 1, maxProgress: 1, tier: 1 },
      { id: "end-2", name: "Marathon Starter", description: "Complete a 5-minute test", icon: <Clock className="h-4 w-4" />, requirement: "5 min test", xpReward: 75, unlocked: true, completed: true, progress: 5, maxProgress: 5, tier: 2, prerequisiteId: "end-1" },
      { id: "end-3", name: "Endurance Runner", description: "Complete a 10-minute test", icon: <Clock className="h-4 w-4" />, requirement: "10 min test", xpReward: 150, unlocked: true, completed: false, progress: 7, maxProgress: 10, tier: 3, prerequisiteId: "end-2" },
      { id: "end-4", name: "Iron Fingers", description: "Type for 30 minutes in one session", icon: <Shield className="h-4 w-4" />, requirement: "30 min session", xpReward: 400, unlocked: false, completed: false, progress: 0, maxProgress: 30, tier: 4, prerequisiteId: "end-3" },
      { id: "end-5", name: "Ultra Marathon", description: "Type for 60 minutes in one day", icon: <Trophy className="h-4 w-4" />, requirement: "60 min daily", xpReward: 800, unlocked: false, completed: false, progress: 0, maxProgress: 60, tier: 5, prerequisiteId: "end-4" },
      { id: "end-6", name: "Typing Legend", description: "Type 100,000 characters total", icon: <Crown className="h-4 w-4" />, requirement: "100K chars", xpReward: 2000, unlocked: false, completed: false, progress: 45000, maxProgress: 100000, tier: 6, prerequisiteId: "end-5" },
    ]
  },
  {
    id: "special",
    name: "Special Keys",
    icon: <Hash className="h-6 w-6" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Master numbers, symbols, and special characters",
    skills: [
      { id: "spec-1", name: "Number Novice", description: "Complete number practice with 80% accuracy", icon: <Hash className="h-4 w-4" />, requirement: "80% on numbers", xpReward: 50, unlocked: true, completed: true, progress: 100, maxProgress: 100, tier: 1 },
      { id: "spec-2", name: "Symbol Starter", description: "Complete symbol practice with 80% accuracy", icon: <Keyboard className="h-4 w-4" />, requirement: "80% on symbols", xpReward: 75, unlocked: true, completed: false, progress: 65, maxProgress: 80, tier: 2, prerequisiteId: "spec-1" },
      { id: "spec-3", name: "Code Ready", description: "Complete programming practice", icon: <Brain className="h-4 w-4" />, requirement: "Code practice", xpReward: 150, unlocked: false, completed: false, progress: 0, maxProgress: 1, tier: 3, prerequisiteId: "spec-2" },
      { id: "spec-4", name: "Numpad Master", description: "Type 50 WPM on numpad", icon: <Hash className="h-4 w-4" />, requirement: "50 WPM numpad", xpReward: 300, unlocked: false, completed: false, progress: 0, maxProgress: 50, tier: 4, prerequisiteId: "spec-3" },
      { id: "spec-5", name: "Full Keyboard", description: "Master all keyboard zones", icon: <Keyboard className="h-4 w-4" />, requirement: "All zones 90%+", xpReward: 750, unlocked: false, completed: false, progress: 0, maxProgress: 6, tier: 5, prerequisiteId: "spec-4" },
      { id: "spec-6", name: "Keyboard Virtuoso", description: "95%+ accuracy on all special characters", icon: <Crown className="h-4 w-4" />, requirement: "95% specials", xpReward: 2000, unlocked: false, completed: false, progress: 0, maxProgress: 95, tier: 6, prerequisiteId: "spec-5" },
    ]
  },
];

const masteryBadges: MasteryBadge[] = [
  // Speed badges
  { id: "b1", name: "First Steps", description: "Complete your first typing test", icon: <Star />, category: "Getting Started", rarity: "common", requirement: "1 test completed", earned: true, earnedDate: "2024-01-15", progress: 1, maxProgress: 1 },
  { id: "b2", name: "Speed Seeker", description: "Reach 40 WPM for the first time", icon: <Zap />, category: "Speed", rarity: "common", requirement: "40 WPM", earned: true, earnedDate: "2024-01-16", progress: 40, maxProgress: 40 },
  { id: "b3", name: "Velocity Master", description: "Reach 80 WPM", icon: <Rocket />, category: "Speed", rarity: "rare", requirement: "80 WPM", earned: false, progress: 65, maxProgress: 80 },
  { id: "b4", name: "Supersonic", description: "Reach 100 WPM", icon: <Flame />, category: "Speed", rarity: "epic", requirement: "100 WPM", earned: false, progress: 65, maxProgress: 100 },
  { id: "b5", name: "Speed of Light", description: "Reach 150 WPM", icon: <Crown />, category: "Speed", rarity: "legendary", requirement: "150 WPM", earned: false, progress: 65, maxProgress: 150 },
  
  // Accuracy badges
  { id: "b6", name: "Sharp Eye", description: "Complete a test with 95% accuracy", icon: <Target />, category: "Accuracy", rarity: "uncommon", requirement: "95% accuracy", earned: true, earnedDate: "2024-01-17", progress: 100, maxProgress: 100 },
  { id: "b7", name: "Perfectionist", description: "Complete a test with 100% accuracy", icon: <CheckCircle2 />, category: "Accuracy", rarity: "rare", requirement: "100% accuracy", earned: false, progress: 98, maxProgress: 100 },
  { id: "b8", name: "Zero Errors", description: "Complete 10 tests with 100% accuracy", icon: <Shield />, category: "Accuracy", rarity: "epic", requirement: "10 perfect tests", earned: false, progress: 0, maxProgress: 10 },
  
  // Consistency badges
  { id: "b9", name: "Dedicated", description: "Practice for 7 consecutive days", icon: <Flame />, category: "Consistency", rarity: "uncommon", requirement: "7-day streak", earned: true, earnedDate: "2024-01-22", progress: 7, maxProgress: 7 },
  { id: "b10", name: "Unstoppable", description: "Practice for 30 consecutive days", icon: <Trophy />, category: "Consistency", rarity: "epic", requirement: "30-day streak", earned: false, progress: 12, maxProgress: 30 },
  { id: "b11", name: "Typing Legend", description: "Practice for 100 consecutive days", icon: <Crown />, category: "Consistency", rarity: "legendary", requirement: "100-day streak", earned: false, progress: 12, maxProgress: 100 },
  
  // Challenge badges
  { id: "b12", name: "Word Crusher", description: "Score 10,000 points in Word Crush", icon: <Zap />, category: "Games", rarity: "uncommon", requirement: "10K points", earned: false, progress: 5500, maxProgress: 10000 },
  { id: "b13", name: "Book Worm", description: "Complete 5 chapters in Book Library", icon: <Award />, category: "Learning", rarity: "uncommon", requirement: "5 chapters", earned: false, progress: 2, maxProgress: 5 },
  { id: "b14", name: "Exam Master", description: "Pass 10 certification exams", icon: <Medal />, category: "Certification", rarity: "rare", requirement: "10 exams passed", earned: false, progress: 3, maxProgress: 10 },
  { id: "b15", name: "Polyglot", description: "Practice in 5 different languages", icon: <Sparkles />, category: "Languages", rarity: "rare", requirement: "5 languages", earned: false, progress: 2, maxProgress: 5 },
];

const rarityColors = {
  common: "border-gray-400 bg-gray-400/10 text-gray-400",
  uncommon: "border-green-400 bg-green-400/10 text-green-400",
  rare: "border-blue-400 bg-blue-400/10 text-blue-400",
  epic: "border-purple-400 bg-purple-400/10 text-purple-400",
  legendary: "border-yellow-400 bg-yellow-400/10 text-yellow-400",
};

const rarityLabels = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function SkillProgression() {
  const [selectedBranch, setSelectedBranch] = useState<string>("speed");
  const { userStats } = useGamification();

  const currentBranch = skillBranches.find(b => b.id === selectedBranch)!;
  
  const totalSkillsCompleted = skillBranches.reduce((acc, branch) => 
    acc + branch.skills.filter(s => s.completed).length, 0
  );
  const totalSkills = skillBranches.reduce((acc, branch) => acc + branch.skills.length, 0);
  
  const totalBadgesEarned = masteryBadges.filter(b => b.earned).length;
  const totalBadges = masteryBadges.length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              Skill Progression
            </h1>
            <p className="text-muted-foreground">Master typing techniques and unlock achievements</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="px-4 py-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">{userStats.xp.toLocaleString()} XP</span>
            </Card>
            <Card className="px-4 py-2 flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold">Level {userStats.level}</span>
            </Card>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Skills Completed</h3>
                <p className="text-2xl font-bold">{totalSkillsCompleted}/{totalSkills}</p>
              </div>
            </div>
            <Progress value={(totalSkillsCompleted / totalSkills) * 100} className="h-2" />
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Medal className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold">Badges Earned</h3>
                <p className="text-2xl font-bold">{totalBadgesEarned}/{totalBadges}</p>
              </div>
            </div>
            <Progress value={(totalBadgesEarned / totalBadges) * 100} className="h-2" />
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Current Streak</h3>
                <p className="text-2xl font-bold">{userStats.streak} days</p>
              </div>
            </div>
            <Progress value={Math.min((userStats.streak / 30) * 100, 100)} className="h-2" />
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills" className="gap-2">
              <Zap className="h-4 w-4" />
              Skill Tree
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Medal className="h-4 w-4" />
              Mastery Badges
            </TabsTrigger>
          </TabsList>

          {/* Skill Tree Tab */}
          <TabsContent value="skills" className="space-y-6">
            {/* Branch Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skillBranches.map((branch) => {
                const completed = branch.skills.filter(s => s.completed).length;
                const total = branch.skills.length;
                return (
                  <Card
                    key={branch.id}
                    className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedBranch === branch.id 
                        ? `ring-2 ring-primary ${branch.bgColor}` 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedBranch(branch.id)}
                  >
                    <div className={`${branch.color} mb-2`}>{branch.icon}</div>
                    <h3 className="font-semibold text-sm">{branch.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{completed}/{total} skills</p>
                    <Progress value={(completed / total) * 100} className="h-1" />
                  </Card>
                );
              })}
            </div>

            {/* Skill Tree Visualization */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${currentBranch.bgColor} ${currentBranch.color}`}>
                  {currentBranch.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentBranch.name}</h2>
                  <p className="text-muted-foreground">{currentBranch.description}</p>
                </div>
              </div>

              {/* Skill Tree */}
              <div className="relative">
                {/* Connection Lines */}
                <div className="absolute left-[28px] top-12 bottom-12 w-0.5 bg-border" />
                
                <div className="space-y-4">
                  {currentBranch.skills.map((skill, index) => (
                    <div key={skill.id} className="relative flex items-start gap-4">
                      {/* Node */}
                      <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-2 shrink-0 ${
                        skill.completed 
                          ? `${currentBranch.bgColor} border-current ${currentBranch.color}` 
                          : skill.unlocked 
                            ? "bg-muted border-muted-foreground/30" 
                            : "bg-muted/50 border-muted-foreground/20"
                      }`}>
                        {skill.completed ? (
                          <CheckCircle2 className={`h-6 w-6 ${currentBranch.color}`} />
                        ) : skill.unlocked ? (
                          <span className={currentBranch.color}>{skill.icon}</span>
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Skill Card */}
                      <Card className={`flex-1 p-4 ${!skill.unlocked ? "opacity-50" : ""}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{skill.name}</h3>
                              <Badge variant="outline" className="text-xs">Tier {skill.tier}</Badge>
                              {skill.completed && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">Completed</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                            
                            {skill.unlocked && !skill.completed && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Progress</span>
                                  <span>{skill.progress}/{skill.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(skill.progress / skill.maxProgress) * 100} 
                                  className="h-1.5" 
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right shrink-0">
                            <div className={`text-sm font-medium ${currentBranch.color}`}>
                              +{skill.xpReward} XP
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {skill.requirement}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Mastery Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            {/* Badge Categories */}
            {["Getting Started", "Speed", "Accuracy", "Consistency", "Games", "Learning", "Certification", "Languages"].map(category => {
              const categoryBadges = masteryBadges.filter(b => b.category === category);
              if (categoryBadges.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {category}
                    <Badge variant="secondary">{categoryBadges.filter(b => b.earned).length}/{categoryBadges.length}</Badge>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryBadges.map((badge) => (
                      <Card 
                        key={badge.id}
                        className={`p-4 border-2 transition-all ${
                          badge.earned 
                            ? rarityColors[badge.rarity] 
                            : "border-muted opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-xl shrink-0 ${
                            badge.earned ? rarityColors[badge.rarity] : "bg-muted text-muted-foreground"
                          }`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold truncate">{badge.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs shrink-0 ${rarityColors[badge.rarity]}`}
                              >
                                {rarityLabels[badge.rarity]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                            
                            {badge.earned ? (
                              <p className="text-xs text-green-400">
                                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                                Earned on {badge.earnedDate}
                              </p>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{badge.requirement}</span>
                                  <span>{badge.progress}/{badge.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(badge.progress / badge.maxProgress) * 100} 
                                  className="h-1.5" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Badge Rarity Guide</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((rarity) => (
              <Badge key={rarity} className={rarityColors[rarity]}>
                {rarityLabels[rarity]}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
