export interface EarnReward {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special" | "referral";
  coinsReward: number;
  xpReward: number;
  requirement: string;
  progress?: number;
  target?: number;
  isCompleted: boolean;
  expiresAt?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: "live" | "scheduled" | "completed";
  startTime: number;
  endTime: number;
  participants: number;
  maxParticipants: number;
  prize: number;
  entryFee: number;
  minWpm: number;
  category: "beginner" | "intermediate" | "advanced" | "pro";
  isJoined: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorLevel: number;
  authorCountry: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: number;
  type: "achievement" | "tip" | "question" | "discussion";
  authorAvatar?: string;
}

export interface AIAcademyCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  isPro: boolean;
  category: "fundamentals" | "speed" | "accuracy" | "professional" | "specialized";
  thumbnail?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward?: string;
  isPro?: boolean;
  route: string;
}

export const dailyEarnTasks: EarnReward[] = [
  { id: "daily-login", title: "Daily Login", description: "Log in to earn your daily bonus", type: "daily", coinsReward: 10, xpReward: 5, requirement: "Log in today", isCompleted: false },
  { id: "complete-test", title: "Complete a Test", description: "Finish any typing test", type: "daily", coinsReward: 15, xpReward: 10, requirement: "Complete 1 test", progress: 0, target: 1, isCompleted: false },
  { id: "achieve-wpm", title: "Speed Goal", description: "Achieve 40+ WPM in a test", type: "daily", coinsReward: 25, xpReward: 20, requirement: "Get 40+ WPM", isCompleted: false },
  { id: "accuracy-90", title: "Accuracy Star", description: "Get 90%+ accuracy", type: "daily", coinsReward: 20, xpReward: 15, requirement: "90%+ accuracy", isCompleted: false },
  { id: "practice-10min", title: "Practice Session", description: "Practice for 10 minutes", type: "daily", coinsReward: 30, xpReward: 25, requirement: "10 min practice", progress: 0, target: 10, isCompleted: false },
];

export const weeklyEarnTasks: EarnReward[] = [
  { id: "weekly-streak", title: "Weekly Streak", description: "Maintain a 7-day streak", type: "weekly", coinsReward: 100, xpReward: 75, requirement: "7-day streak", progress: 0, target: 7, isCompleted: false },
  { id: "complete-20-tests", title: "Test Marathon", description: "Complete 20 tests this week", type: "weekly", coinsReward: 150, xpReward: 100, requirement: "20 tests", progress: 0, target: 20, isCompleted: false },
  { id: "improve-wpm", title: "Improvement Goal", description: "Improve your average WPM by 5", type: "weekly", coinsReward: 200, xpReward: 150, requirement: "+5 WPM", isCompleted: false },
  { id: "complete-lesson", title: "Course Progress", description: "Complete 3 lessons", type: "weekly", coinsReward: 120, xpReward: 80, requirement: "3 lessons", progress: 0, target: 3, isCompleted: false },
];

export const specialRewards: EarnReward[] = [
  { id: "first-50wpm", title: "Speed Milestone", description: "Reach 50 WPM for the first time", type: "special", coinsReward: 500, xpReward: 250, requirement: "50 WPM", isCompleted: false },
  { id: "first-100wpm", title: "Speed Master", description: "Reach 100 WPM", type: "special", coinsReward: 1000, xpReward: 500, requirement: "100 WPM", isCompleted: false },
  { id: "perfect-accuracy", title: "Perfect Score", description: "Get 100% accuracy in a test", type: "special", coinsReward: 300, xpReward: 150, requirement: "100% accuracy", isCompleted: false },
  { id: "level-10", title: "Rising Star", description: "Reach level 10", type: "special", coinsReward: 400, xpReward: 200, requirement: "Level 10", isCompleted: false },
  { id: "level-25", title: "Expert Typist", description: "Reach level 25", type: "special", coinsReward: 800, xpReward: 400, requirement: "Level 25", isCompleted: false },
];

export const tournaments: Tournament[] = [
  { id: "daily-sprint", name: "Daily Sprint", description: "Quick 1-minute speed race", type: "live", startTime: Date.now() - 3600000, endTime: Date.now() + 3600000, participants: 234, maxParticipants: 500, prize: 500, entryFee: 0, minWpm: 0, category: "beginner", isJoined: false },
  { id: "speed-masters", name: "Speed Masters", description: "For typists 60+ WPM", type: "live", startTime: Date.now() - 1800000, endTime: Date.now() + 5400000, participants: 89, maxParticipants: 100, prize: 2000, entryFee: 50, minWpm: 60, category: "advanced", isJoined: false },
  { id: "global-championship", name: "Global Championship", description: "Weekly world championship", type: "scheduled", startTime: Date.now() + 86400000, endTime: Date.now() + 172800000, participants: 1250, maxParticipants: 5000, prize: 5000, entryFee: 100, minWpm: 40, category: "intermediate", isJoined: false },
  { id: "pro-league", name: "Pro League", description: "Elite competition for pros", type: "scheduled", startTime: Date.now() + 172800000, endTime: Date.now() + 259200000, participants: 45, maxParticipants: 50, prize: 15000, entryFee: 500, minWpm: 100, category: "pro", isJoined: false },
  { id: "accuracy-challenge", name: "Accuracy Challenge", description: "Who can type most accurately?", type: "live", startTime: Date.now() - 7200000, endTime: Date.now() + 7200000, participants: 156, maxParticipants: 300, prize: 1500, entryFee: 25, minWpm: 30, category: "intermediate", isJoined: false },
];

export const communityPosts: CommunityPost[] = [
  { id: "1", author: "SpeedTyper", authorLevel: 42, authorCountry: "US", content: "Just hit 150 WPM! Months of practice finally paying off 🎉", likes: 234, comments: 45, timestamp: Date.now() - 3600000, type: "achievement", authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  { id: "2", author: "KeyboardNinja", authorLevel: 38, authorCountry: "UK", content: "Pro tip: Keep your wrists slightly elevated for better speed and comfort", likes: 189, comments: 28, timestamp: Date.now() - 7200000, type: "tip", authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "3", author: "NewTypist", authorLevel: 5, authorCountry: "IN", content: "How do I improve from 30 to 50 WPM? Been stuck for weeks", likes: 56, comments: 67, timestamp: Date.now() - 10800000, type: "question", authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { id: "4", author: "TypeMaster", authorLevel: 55, authorCountry: "JP", content: "Mechanical keyboards vs membrane - which do you prefer for typing practice?", likes: 312, comments: 156, timestamp: Date.now() - 14400000, type: "discussion", authorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" },
  { id: "5", author: "AccuracyQueen", authorLevel: 31, authorCountry: "CA", content: "Finally completed all advanced lessons with 98% accuracy! 💪", likes: 145, comments: 23, timestamp: Date.now() - 18000000, type: "achievement", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
];

export const aiAcademyCourses: AIAcademyCourse[] = [
  { id: "ai-fundamentals", title: "AI-Powered Typing Fundamentals", description: "Let AI analyze your typing patterns and create a personalized learning path", instructor: "AI Coach", duration: "4 weeks", lessons: 20, rating: 4.9, students: 15420, isPro: false, category: "fundamentals" },
  { id: "ai-speed-boost", title: "Speed Boost Accelerator", description: "Advanced AI algorithms to rapidly increase your typing speed", instructor: "AI Coach", duration: "6 weeks", lessons: 30, rating: 4.8, students: 8930, isPro: true, category: "speed" },
  { id: "ai-accuracy", title: "Precision Typing Mastery", description: "AI-guided exercises to eliminate errors and build muscle memory", instructor: "AI Coach", duration: "3 weeks", lessons: 15, rating: 4.9, students: 12340, isPro: false, category: "accuracy" },
  { id: "ai-professional", title: "Professional Document Typing", description: "Master business documents, emails, and professional content", instructor: "AI Coach", duration: "8 weeks", lessons: 40, rating: 4.7, students: 5670, isPro: true, category: "professional" },
  { id: "ai-coding", title: "Developer Typing Mastery", description: "Specialized course for programmers with code-focused exercises", instructor: "AI Coach", duration: "5 weeks", lessons: 25, rating: 4.8, students: 7890, isPro: true, category: "specialized" },
  { id: "ai-multilingual", title: "Multilingual Typing Course", description: "Learn to type in multiple languages with AI-powered lessons", instructor: "AI Coach", duration: "10 weeks", lessons: 50, rating: 4.6, students: 3450, isPro: true, category: "specialized" },
];

export const quickActions: QuickAction[] = [
  { id: "quick-test", title: "Quick Typing Test", description: "Start a 1-minute test", icon: "⌨️", reward: "+5 XP", route: "/" },
  { id: "join-tournament", title: "Join Tournament", description: "Compete for prizes", icon: "🏆", reward: "Win 5000 Coins", route: "/tournaments" },
  { id: "find-job", title: "Find Job", description: "Browse typing jobs", icon: "💼", reward: "500 Coins/hr", isPro: true, route: "/jobs" },
  { id: "claim-reward", title: "Claim Reward", description: "Daily bonus available", icon: "🎁", reward: "+50 Coins", route: "/earn" },
  { id: "premium-upgrade", title: "Premium Upgrade", description: "Unlock all features", icon: "💎", reward: "2x Earnings", isPro: true, route: "/premium" },
];
