import {
  Keyboard,
  Zap,
  BookOpen,
  Code,
  Terminal,
  Briefcase,
  GraduationCap,
  Globe,
  Coffee,
  Cpu
} from "lucide-react";

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
  xpReward: number;
  coinReward: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite" | "beginner" | "intermediate" | "advanced" | "pro";
  level?: "beginner" | "intermediate" | "advanced" | "pro";
  lessons?: number;
  targetWpm?: number;
  isPro?: boolean;
  estimatedTime: string;
  stats: {
    students: string;
    rating: number;
  };
  image: string;
  rewards: {
    badge: string;
    totalXp: number;
    totalCoins: number;
  };
  isPremium: boolean;
  modules: CourseModule[];
}

export const courseCategories = [
  { id: "personal", title: "For Individuals", icon: "user", description: "Personalized typing tracks for all skill levels.", cta: "Start Learning" },
  { id: "school", title: "For Schools", icon: "school", description: "Classroom management and student tracking.", cta: "Learn More" },
  { id: "business", title: "For Business", icon: "building", description: "Improve team productivity and speed.", cta: "Get Started" },
  { id: "gift", title: "Gift Pro", icon: "gift", description: "Give the gift of mastery to someone else.", cta: "View Plans" },
];

export const careerTracks = [
  { id: "programmer", title: "The Coding Track", description: "Master symbols, brackets, and high-speed syntax.", isPro: true },
  { id: "assistant", title: "Executive Assistant", description: "Focus on accuracy and professional document flow.", isPro: false },
  { id: "data-entry", title: "Data Entry Pro", description: "Number row mastery and high-precision input.", isPro: true },
];

export const touchTypingCourses = [
  { id: "basics-1", title: "The Home Row", description: "Level 1-10: Foundation building." },
  { id: "basics-2", title: "Top and Bottom", description: "Level 11-20: Expanding your reach." },
];

export const achievementBadges = [
  { id: "b1", name: "Fast Starter", unlocked: true },
  { id: "b2", name: "Daily Streak (7 days)", unlocked: false },
  { id: "b3", name: "Accuracy King", unlocked: true },
];

export const courses: Course[] = [
  {
    id: "touch-typing-mastery",
    title: "Full Touch Typing Mastery",
    subtitle: "From 10 to 100 WPM with scientific accuracy",
    description: "The complete journey from hunt-and-peck to professional level proficiency. Optimized for neuro-pathway building.",
    icon: Keyboard,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83aca2?auto=format&fit=crop&w=800&q=80",
    category: "Foundation",
    difficulty: "Beginner",
    level: "beginner",
    lessons: 45,
    targetWpm: 40,
    isPro: false,
    estimatedTime: "12 Hours",
    stats: { students: "125k+", rating: 4.9 },
    rewards: { badge: "Scientific Master", totalXp: 5000, totalCoins: 2500 },
    isPremium: false,
    modules: [
      {
        id: "m1-home-row",
        title: "Base Camp: Home Row",
        description: "Installing the muscle memory for the foundation of typing.",
        lessonIds: ["home-row-1", "home-row-2"],
        xpReward: 500,
        coinReward: 200
      },
      {
        id: "m2-top-row",
        title: "The Ascent: Top Row",
        description: "Expanding vertical reach without looking down.",
        lessonIds: ["top-row-1", "top-row-2"],
        xpReward: 600,
        coinReward: 300
      }
    ]
  },
  {
    id: "exam-crusher-pro",
    title: "Government Exam Masterclass",
    subtitle: "Crush SSC, CGL, and RRB Typing Tests",
    description: "Specialized training focused on specific exam layouts, backspace restrictions, and high-pressure scenarios.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    category: "Exam Prep",
    difficulty: "Intermediate",
    level: "intermediate",
    lessons: 60,
    targetWpm: 35,
    isPro: true,
    estimatedTime: "8 Hours",
    stats: { students: "45k+", rating: 4.8 },
    rewards: { badge: "Certified Official", totalXp: 8000, totalCoins: 4000 },
    isPremium: true,
    modules: [
      {
        id: "m1-pressure",
        title: "Exam Simulation: Stage 1",
        description: "Typing under simulated timer pressure with high accuracy requirements.",
        lessonIds: ["speed-1", "accuracy-1"],
        xpReward: 1000,
        coinReward: 500
      }
    ]
  },
  {
    id: "ai-coding-speedrun",
    title: "Developer: AI & Code Speed",
    subtitle: "Boost your dev performance by 2x",
    description: "Master the brackets, semicolons, and curly braces that slow down developers. Built for Modern Code Flow.",
    icon: Code,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Developer",
    difficulty: "Advanced",
    level: "advanced",
    lessons: 30,
    targetWpm: 80,
    isPro: true,
    estimatedTime: "5 Hours",
    stats: { students: "8k+", rating: 5.0 },
    rewards: { badge: "Syntax Ninja", totalXp: 12000, totalCoins: 6000 },
    isPremium: true,
    modules: [
      {
        id: "m1-syntax",
        title: "Bracket Blast",
        description: "Rapid-fire practicing of complex coding characters.",
        lessonIds: ["symbols-1", "advanced-1"],
        xpReward: 1500,
        coinReward: 750
      }
    ]
  }
];
