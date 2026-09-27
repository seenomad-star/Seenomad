import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Storage } from "@/services/Persistence";
import { NeuralSync } from "@/services/NeuralSync";

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  streakFrozen: boolean; // New field for Streak Freeze
  lastPracticeDate: string | null;
  totalTests: number;
  totalTimeSeconds: number;
  coins: number;
  isPremium: boolean;
  subscriptionTier: 'free' | 'pro_plus';
  ownedItems: string[]; // IDs of items purchased/unlocked
  cratesAvailable: number;
  equippedCosmetics: {
    keycap?: string;
    sound?: string;
    particle?: string;
  };
  isLoggedIn: boolean;
  // Season Pass Fields
  seasonXP: number;
  seasonLevel: number;
  isPremiumPass: boolean;
  unlockedSeasonRewards: number[]; // Array of claimed level rewards
}

export interface SeasonReward {
  level: number;
  title: string;
  type: 'coins' | 'xp' | 'item' | 'badge';
  value: any;
  isPremium: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  level: number;
  country?: string;
  timestamp: number;
  isCurrentUser?: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  type: "wpm" | "tests" | "accuracy" | "time";
  completed: boolean;
  expiresAt: number;
}

export interface EarnTask {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special";
  coinsReward: number;
  xpReward: number;
  requirement: string;
  progress: number;
  target: number;
  isCompleted: boolean;
}

export interface CustomMission {
  id: string;
  title: string;
  description: string;
  content: string;
  creator: string;
  creatorId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  category: string;
  plays: number;
  rating: number;
  royaltyEarned: number; // Coins earned by creator
  isVerified: boolean; // System verified
  isPublished: boolean;
  createdAt: number;
  coverEmoji?: string;
}

export type ClanRole = 'Leader' | 'Elder' | 'Member';
export type ClanTier = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface ClanMember {
  userId: string;
  username: string;
  role: ClanRole;
  contribution: number; // Coins donated
  lastActive: number;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string;
  logo: string; // Emoji or Icon ID
  tier: ClanTier;
  xp: number;
  level: number;
  treasury: number; // Pooled coins
  members: ClanMember[];
  maxMembers: number;
  isOpen: boolean;
  minLevelToJoin: number;
  warsWon: number;
  warsLost: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem: boolean;
}

interface GamificationContextType {
  userStats: UserStats;
  leaderboard: LeaderboardEntry[];
  dailyChallenges: DailyChallenge[];
  earnTasks: EarnTask[];
  joinedTournaments: string[];
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  updateStreak: () => void;
  submitToLeaderboard: (wpm: number, accuracy: number) => void;
  updateChallengeProgress: (type: DailyChallenge["type"], value: number) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  joinTournament: (tournamentId: string) => void;
  leaveTournament: (tournamentId: string) => void;
  getXPForNextLevel: () => number;
  clearLeaderboard: () => void;
  setPremium: (value: boolean) => void;
  buyItem: (itemId: string, price: number) => boolean;
  isItemOwned: (itemId: string) => boolean;
  login: () => void;
  logout: () => void;

  subscribe: () => void;
  unlockCosmetic: (itemId: string) => void;
  consumeCrate: () => boolean;
  equipCosmetic: (type: 'keycap' | 'sound' | 'particle', itemId: string) => void;

  // Creator Economy
  customMissions: CustomMission[];
  publishMission: (mission: Omit<CustomMission, "id" | "plays" | "rating" | "royaltyEarned" | "isVerified" | "createdAt" | "creator" | "creatorId">) => void;
  playMission: (missionId: string) => void;

  // Clan System
  clans: Clan[];
  userClan: Clan | null;
  clanChat: ChatMessage[];
  createClan: (name: string, tag: string, logo: string, desc: string) => boolean;
  joinClan: (clanId: string) => boolean;
  leaveClan: () => void;
  donateToClan: (amount: number) => boolean;
  sendClanMessage: (text: string) => void;
  updateClan: (clanId: string, updates: Partial<Clan>) => void;

  // Season Pass
  addSeasonXP: (amount: number) => void;
  buyPremiumPass: () => boolean;
  claimSeasonReward: (level: number) => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

const STORAGE_KEY_STATS = "typing-user-stats";
const STORAGE_KEY_LEADERBOARD = "typing-leaderboard";
const STORAGE_KEY_CHALLENGES = "typing-daily-challenges";
const STORAGE_KEY_EARN_TASKS = "typing-earn-tasks";
const STORAGE_KEY_TOURNAMENTS = "typing-joined-tournaments";
const STORAGE_KEY_MISSIONS = "typing-custom-missions";
const STORAGE_KEY_CLANS = "typing-clans";
const STORAGE_KEY_USER_CLAN_ID = "typing-user-clan-id";
const STORAGE_KEY_SEASON_DATA = "typing-season-data";

export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const getXPForLevel = (level: number): number => {
  return Math.pow(level - 1, 2) * 100;
};

const generateEarnTasks = (): EarnTask[] => {
  return [
    { id: "complete-test", title: "Complete a Test", description: "Finish any typing test", type: "daily", coinsReward: 15, xpReward: 10, requirement: "Complete 1 test", progress: 0, target: 1, isCompleted: false },
    { id: "achieve-wpm-40", title: "Speed Goal", description: "Achieve 40+ WPM in a test", type: "daily", coinsReward: 25, xpReward: 20, requirement: "Get 40+ WPM", progress: 0, target: 40, isCompleted: false },
    { id: "accuracy-90", title: "Accuracy Star", description: "Get 90%+ accuracy", type: "daily", coinsReward: 20, xpReward: 15, requirement: "90%+ accuracy", progress: 0, target: 90, isCompleted: false },
    { id: "weekly-streak", title: "Weekly Streak", description: "Maintain a 7-day streak", type: "weekly", coinsReward: 100, xpReward: 75, requirement: "7-day streak", progress: 0, target: 7, isCompleted: false },
    { id: "complete-20-tests", title: "Test Marathon", description: "Complete 20 tests this week", type: "weekly", coinsReward: 150, xpReward: 100, requirement: "20 tests", progress: 0, target: 20, isCompleted: false },
    { id: "early-adopter", title: "Early Adopter", description: "Be part of the TypingOS alpha phase", type: "special", coinsReward: 1000, xpReward: 500, requirement: "Join before v1.0", progress: 1, target: 1, isCompleted: false },
    { id: "bug-hunter", title: "Bug Hunter", description: "Report your first system anomaly", type: "special", coinsReward: 500, xpReward: 250, requirement: "Valid bug report", progress: 0, target: 1, isCompleted: false },
    { id: "top-contributor", title: "Top Contributor", description: "Contribute to TypingOS open source", type: "special", coinsReward: 2500, xpReward: 1000, requirement: "Merged PR", progress: 0, target: 1, isCompleted: false },
  ];
};

const generateDailyChallenges = (): DailyChallenge[] => {
  const now = Date.now();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return [
    {
      id: "daily-1",
      title: "Speed Demon",
      description: "Achieve 50 WPM or higher",
      target: 50,
      current: 0,
      reward: 50,
      type: "wpm",
      completed: false,
      expiresAt: endOfDay.getTime(),
    },
    {
      id: "daily-2",
      title: "Practice Makes Perfect",
      description: "Complete 5 typing tests",
      target: 5,
      current: 0,
      reward: 30,
      type: "tests",
      completed: false,
      expiresAt: endOfDay.getTime(),
    },
    {
      id: "daily-3",
      title: "Accuracy Master",
      description: "Get 95% accuracy or higher",
      target: 95,
      current: 0,
      reward: 40,
      type: "accuracy",
      completed: false,
      expiresAt: endOfDay.getTime(),
    },
  ];
};

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  streakFrozen: false,
  lastPracticeDate: null,
  totalTests: 0,
  totalTimeSeconds: 0,
  coins: 100,
  isPremium: false,
  subscriptionTier: 'free',
  ownedItems: [],
  cratesAvailable: 3, // Default starting crates
  equippedCosmetics: {
    keycap: 'keycap_neon', // Default
  },
  isLoggedIn: false,
  seasonXP: 0,
  seasonLevel: 1,
  isPremiumPass: false,
  unlockedSeasonRewards: [],
};

const sampleLeaderboard: LeaderboardEntry[] = [
  { id: "1", username: "SpeedTyper", wpm: 145, accuracy: 98.5, level: 42, country: "US", timestamp: Date.now() - 3600000 },
  { id: "2", username: "KeyboardNinja", wpm: 138, accuracy: 99.1, level: 38, country: "UK", timestamp: Date.now() - 7200000 },
  { id: "3", username: "TypeMaster", wpm: 132, accuracy: 97.8, level: 35, country: "CA", timestamp: Date.now() - 10800000 },
  { id: "4", username: "SwiftFingers", wpm: 128, accuracy: 96.5, level: 31, country: "AU", timestamp: Date.now() - 14400000 },
  { id: "5", username: "WordRacer", wpm: 125, accuracy: 98.2, level: 29, country: "DE", timestamp: Date.now() - 18000000 },
  { id: "6", username: "TypePro", wpm: 120, accuracy: 97.0, level: 27, country: "IN", timestamp: Date.now() - 21600000 },
  { id: "7", username: "FastKeys", wpm: 118, accuracy: 96.8, level: 25, country: "JP", timestamp: Date.now() - 25200000 },
  { id: "8", username: "TypingWizard", wpm: 115, accuracy: 98.9, level: 24, country: "FR", timestamp: Date.now() - 28800000 },
  { id: "9", username: "KeyStroke", wpm: 112, accuracy: 95.5, level: 22, country: "BR", timestamp: Date.now() - 32400000 },
  { id: "10", username: "QuickType", wpm: 108, accuracy: 97.3, level: 20, country: "MX", timestamp: Date.now() - 36000000 },
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(sampleLeaderboard);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [earnTasks, setEarnTasks] = useState<EarnTask[]>([]);
  const [joinedTournaments, setJoinedTournaments] = useState<string[]>([]);
  const [customMissions, setCustomMissions] = useState<CustomMission[]>([]);

  // Clan State
  const [clans, setClans] = useState<Clan[]>([]);
  const [userClanId, setUserClanId] = useState<string | null>(null);
  const [clanChat, setClanChat] = useState<ChatMessage[]>([]);

  // Derived
  const userClan = clans.find(c => c.id === userClanId) || null;

  // Load from Persistence Layer
  useEffect(() => {
    const loadAllData = async () => {
      // Load Stats with Integrity Check
      const storedStats = await Storage.load<UserStats | null>(STORAGE_KEY_STATS, null);
      const storedIntegrity = await Storage.load<string | null>(STORAGE_KEY_STATS + "-integrity", null);

      if (storedStats && storedIntegrity) {
        const calculatedIntegrity = btoa(JSON.stringify(storedStats) + "typing-security-v1");
        if (calculatedIntegrity === storedIntegrity) {
          // Ensure isLoggedIn is true even for old stored data
          setUserStats({ ...storedStats, isLoggedIn: true });
        } else {
          console.error("Security: Data integrity violation detected.");
          toast.error("Profile data was reset due to integrity failure.");
          setUserStats(defaultStats);
        }
      } else {
        setUserStats(defaultStats);
      }

      // Load Leaderboard
      const storedLeaderboard = await Storage.load<LeaderboardEntry[]>(STORAGE_KEY_LEADERBOARD, []);
      setLeaderboard([...sampleLeaderboard, ...storedLeaderboard].sort((a, b) => b.wpm - a.wpm).slice(0, 100));

      // Load Challenges
      const storedChallenges = await Storage.load<DailyChallenge[]>(STORAGE_KEY_CHALLENGES, []);
      const now = Date.now();
      if (storedChallenges.length > 0 && storedChallenges[0].expiresAt > now) {
        setDailyChallenges(storedChallenges);
      } else {
        const newChallenges = generateDailyChallenges();
        setDailyChallenges(newChallenges);
        Storage.save(STORAGE_KEY_CHALLENGES, newChallenges);
      }

      // Load Tasks, Tournaments, Missions, Clans, etc.
      setEarnTasks(await Storage.load<EarnTask[]>(STORAGE_KEY_EARN_TASKS, generateEarnTasks()));
      setJoinedTournaments(await Storage.load<string[]>(STORAGE_KEY_TOURNAMENTS, []));
      setCustomMissions(await Storage.load<CustomMission[]>(STORAGE_KEY_MISSIONS, []));

      const storedClans = await Storage.load<Clan[]>(STORAGE_KEY_CLANS, []);
      setClans(storedClans.length > 0 ? storedClans : [
        {
          id: "c1", name: "Neon Strikers", tag: "NEON", description: "Elite cyberpunk typists.", logo: "⚡",
          tier: 'Rare', xp: 52000, level: 12, treasury: 15400,
          members: [
            { userId: "u2", username: "Glitch00", role: 'Leader', contribution: 5000, lastActive: Date.now() },
            { userId: "u3", username: "VaporWave", role: 'Member', contribution: 1200, lastActive: Date.now() }
          ],
          maxMembers: 50, isOpen: true, minLevelToJoin: 10, warsWon: 15, warsLost: 3, createdAt: Date.now()
        },
        {
          id: "c2", name: "Keyboard Warriors", tag: "KBW", description: "We type to survive.", logo: "⚔️",
          tier: 'Common', xp: 12000, level: 4, treasury: 2400,
          members: [],
          maxMembers: 30, isOpen: true, minLevelToJoin: 5, warsWon: 2, warsLost: 8, createdAt: Date.now()
        }
      ]);

      setUserClanId(await Storage.load<string | null>(STORAGE_KEY_USER_CLAN_ID, null));
    };

    loadAllData();
  }, []);

  // Removed Sync with Cloud Auth & Profile (Loginless transition)

  // Save updates to Persistence Layer (Cloud sync removed)
  useEffect(() => {
    const statsString = JSON.stringify(userStats);
    const integrityHash = btoa(statsString + "typing-security-v1");
    Storage.save(STORAGE_KEY_STATS, userStats);
    Storage.save(STORAGE_KEY_STATS + "-integrity", integrityHash);
  }, [userStats.xp, userStats.coins, userStats.level, userStats.streak, userStats.lastPracticeDate]);

  useEffect(() => {
    if (dailyChallenges.length > 0) Storage.save(STORAGE_KEY_CHALLENGES, dailyChallenges);
  }, [dailyChallenges]);

  useEffect(() => {
    Storage.save(STORAGE_KEY_EARN_TASKS, earnTasks);
  }, [earnTasks]);

  useEffect(() => {
    Storage.save(STORAGE_KEY_CLANS, clans);
  }, [clans]);

  useEffect(() => {
    Storage.save(STORAGE_KEY_USER_CLAN_ID, userClanId);
  }, [userClanId]);

  const addXP = useCallback((amount: number) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);

      if (newLevel > prev.level && prev.level > 0) {
        toast.success(`LEVEL UP!`, {
          description: `You are now Level ${newLevel}!`,
          icon: "🎉"
        });

        // Broadcast global event
        NeuralSync.broadcast({
          type: 'GLOBAL_ACHIEVEMENT',
          payload: {
            username: "You",
            achievement: `Reached Level ${newLevel}!`,
            timestamp: Date.now()
          }
        });
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setUserStats((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    setUserStats((prev) => {
      if (prev.lastPracticeDate === today) {
        return prev;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = prev.lastPracticeDate === yesterday.toDateString();

      return {
        ...prev,
        streak: wasYesterday || !prev.lastPracticeDate ? prev.streak + 1 : 1,
        lastPracticeDate: today,
        totalTests: prev.totalTests + 1,
      };
    });
  }, []);

  const submitToLeaderboard = useCallback((wpm: number, accuracy: number) => {
    const newEntry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      username: `Player_${userStats.level}`,
      wpm,
      accuracy,
      level: userStats.level,
      timestamp: Date.now(),
      isCurrentUser: true,
    };

    setLeaderboard((prev) => {
      const updated = [...prev.map(e => ({ ...e, isCurrentUser: false })), newEntry]
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 100);

      const userEntries = updated.filter(e => e.isCurrentUser);
      localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(userEntries));

      return updated;
    });
  }, [userStats.level]);

  const updateChallengeProgress = useCallback((type: DailyChallenge["type"], value: number) => {
    setDailyChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.type !== type || challenge.completed) return challenge;

        let newCurrent = challenge.current;
        if (type === "tests") {
          newCurrent = challenge.current + 1;
        } else if (type === "wpm" || type === "accuracy") {
          newCurrent = Math.max(challenge.current, value);
        } else if (type === "time") {
          newCurrent = challenge.current + value;
        }

        const completed = newCurrent >= challenge.target;
        if (completed && !challenge.completed) {
          addCoins(challenge.reward);
          addXP(challenge.reward);
        }

        return { ...challenge, current: newCurrent, completed };
      })
    );
  }, [addCoins, addXP]);

  const getXPForNextLevel = useCallback(() => {
    return getXPForLevel(userStats.level + 1) - userStats.xp;
  }, [userStats]);

  const clearLeaderboard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_LEADERBOARD);
    setLeaderboard(sampleLeaderboard);
  }, []);

  const setPremium = useCallback((value: boolean) => {
    setUserStats((prev) => ({ ...prev, isPremium: value }));
  }, []);

  const isItemOwned = useCallback((itemId: string) => {
    return userStats.ownedItems.includes(itemId);
  }, [userStats.ownedItems]);

  const buyItem = useCallback((itemId: string, price: number) => {
    if (userStats.coins < price) return false;
    if (isItemOwned(itemId)) return true;

    setUserStats((prev) => ({
      ...prev,
      coins: prev.coins - price,
      ownedItems: [...prev.ownedItems, itemId],
    }));
    return true;
  }, [userStats.coins, isItemOwned]);

  const updateTaskProgress = useCallback((taskId: string, progress: number) => {
    setEarnTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const newProgress = Math.min(progress, task.target);
        const isCompleted = newProgress >= task.target;
        return { ...task, progress: newProgress, isCompleted };
      })
    );
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setEarnTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || task.isCompleted) return task;
        addCoins(task.coinsReward);
        addXP(task.xpReward);
        toast.success(`Task completed!`, {
          description: `Earned ${task.coinsReward} coins and ${task.xpReward} XP!`,
        });
        return { ...task, isCompleted: true };
      })
    );
  }, [addCoins, addXP]);

  const joinTournament = useCallback((tournamentId: string) => {
    setJoinedTournaments((prev) => {
      if (prev.includes(tournamentId)) return prev;
      const updated = [...prev, tournamentId];
      localStorage.setItem(STORAGE_KEY_TOURNAMENTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const leaveTournament = useCallback((tournamentId: string) => {
    setJoinedTournaments((prev) => {
      const updated = prev.filter((id) => id !== tournamentId);
      localStorage.setItem(STORAGE_KEY_TOURNAMENTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    // Local-only logout just toggles state for UI consistency if needed
    // In current implementation, we might not even need a logout button
    setUserStats((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    toast.info("Interface locked", {
      description: "Neural link severed.",
    });
  }, []);

  const login = useCallback(() => {
    setUserStats((prev) => ({
      ...prev,
      isLoggedIn: true,
    }));
    toast.success("Interface initialized", {
      description: "Neural link established.",
    });
  }, []);

  const subscribe = useCallback(() => {
    setUserStats((prev) => ({
      ...prev,
      isPremium: true,
      subscriptionTier: 'pro_plus',
    }));
    toast.success("Welcome to Pro Plus!", {
      description: "You've unlocked all premium features!",
      icon: "👑"
    });
  }, []);

  const unlockCosmetic = useCallback((itemId: string) => {
    setUserStats((prev) => {
      if (prev.ownedItems.includes(itemId)) return prev;
      return {
        ...prev,
        ownedItems: [...prev.ownedItems, itemId]
      };
    });
  }, []);

  const consumeCrate = useCallback(() => {
    const success = false;
    // We can't return value easily from setState updater, so we check state first
    // Note: This isn't perfectly atomic but sufficient for this app
    if (userStats.cratesAvailable > 0) {
      setUserStats((prev) => ({
        ...prev,
        cratesAvailable: prev.cratesAvailable - 1
      }));
      return true;
    }
    return false;
  }, [userStats.cratesAvailable]);

  const equipCosmetic = useCallback((type: 'keycap' | 'sound' | 'particle', itemId: string) => {
    setUserStats((prev) => ({
      ...prev,
      equippedCosmetics: {
        ...prev.equippedCosmetics,
        [type]: itemId
      }
    }));
    toast.success("Cosmetic equipped!");
  }, []);

  // Save earn tasks to localStorage
  useEffect(() => {
    if (earnTasks.length > 0) {
      localStorage.setItem(STORAGE_KEY_EARN_TASKS, JSON.stringify(earnTasks));
    }
  }, [earnTasks]);

  // Save missions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(customMissions));
  }, [customMissions]);

  const publishMission = useCallback((missionData: Omit<CustomMission, "id" | "plays" | "rating" | "royaltyEarned" | "isVerified" | "createdAt" | "creator" | "creatorId">) => {
    const newMission: CustomMission = {
      ...missionData,
      id: crypto.randomUUID(),
      creator: userStats.isLoggedIn ? "You" : "Anonymous Architect",
      creatorId: "user-current", // In real app, actual user ID
      plays: 0,
      rating: 0,
      royaltyEarned: 0,
      isVerified: false,
      createdAt: Date.now()
    };

    setCustomMissions(prev => [newMission, ...prev]);
    toast.success("Mission Minted!", {
      description: "Your mission is now live in The Forge.",
      icon: "⚒️"
    });
  }, [userStats.isLoggedIn]);

  const playMission = useCallback((missionId: string) => {
    setCustomMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        const royalty = 5; // 5 coins per play

        // If current user is the creator, they get the royalty
        if (m.creatorId === "user-current") {
          addCoins(royalty);
          toast.success("Royalty Payment!", {
            description: `Someone played your mission! +${royalty} coins.`,
            icon: "💰"
          });
        }

        return {
          ...m,
          plays: m.plays + 1,
          royaltyEarned: m.royaltyEarned + royalty
        };
      }
      return m;
    }));
  }, [addCoins]);

  // Save Clans
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLANS, JSON.stringify(clans));
  }, [clans]);

  useEffect(() => {
    if (userClanId) localStorage.setItem(STORAGE_KEY_USER_CLAN_ID, userClanId);
    else localStorage.removeItem(STORAGE_KEY_USER_CLAN_ID);
  }, [userClanId]);

  // Clan Methods
  const createClan = useCallback((name: string, tag: string, logo: string, desc: string) => {
    const COST = 500;
    if (userStats.coins < COST) {
      toast.error("Insufficient Funds", { description: `Creating a clan costs ${COST} coins.` });
      return false;
    }
    if (userClanId) {
      toast.error("Already in a Clan", { description: "You must leave your current clan first." });
      return false;
    }

    const newClan: Clan = {
      id: crypto.randomUUID(),
      name, tag, logo, description: desc,
      tier: 'Common', xp: 0, level: 1, treasury: 0,
      members: [{
        userId: 'user-current',
        username: 'You',
        role: 'Leader',
        contribution: COST,
        lastActive: Date.now()
      }],
      maxMembers: 20, isOpen: true, minLevelToJoin: 0, warsWon: 0, warsLost: 0, createdAt: Date.now()
    };

    addCoins(-COST);
    setClans(prev => [...prev, newClan]);
    setUserClanId(newClan.id);
    toast.success("Clan Established!", { description: `Welcome to the ${name} citadel.` });
    return true;
  }, [userStats.coins, userClanId, addCoins]);

  const joinClan = useCallback((clanId: string) => {
    if (userClanId) return false;

    setClans(prev => prev.map(c => {
      if (c.id === clanId) {
        return {
          ...c,
          members: [...c.members, { userId: 'user-current', username: 'You', role: 'Member', contribution: 0, lastActive: Date.now() }]
        };
      }
      return c;
    }));
    setUserClanId(clanId);
    toast.success("Joined Clan!");
    return true;
  }, [userClanId]);

  const leaveClan = useCallback(() => {
    if (!userClanId) return;
    setClans(prev => prev.map(c => {
      if (c.id === userClanId) {
        return {
          ...c,
          members: c.members.filter(m => m.userId !== 'user-current')
        };
      }
      return c;
    }));
    setUserClanId(null);
    setClanChat([]);
    toast.info("Left Clan");
  }, [userClanId]);

  const donateToClan = useCallback((amount: number) => {
    if (!userClanId || userStats.coins < amount) return false;

    addCoins(-amount);
    setClans(prev => prev.map(c => {
      if (c.id === userClanId) {
        // Update clan treasury and user contribution
        const updatedMembers = c.members.map(m =>
          m.userId === 'user-current' ? { ...m, contribution: m.contribution + amount } : m
        );
        return { ...c, treasury: c.treasury + amount, members: updatedMembers, xp: c.xp + (amount / 10) };
      }
      return c;
    }));
    toast.success("Donation Successful", { description: `Contributed ${amount} coins to the treasury.` });
    return true;
  }, [userClanId, userStats.coins, addCoins]);

  const sendClanMessage = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "You",
      text,
      timestamp: Date.now(),
      isSystem: false
    };
    setClanChat(prev => [...prev, msg]);

    // Simulate reply
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const replies = ["Let's go!", "Need more XP!", "Anyone for a race?", "GG", "Nice donation!"];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        setClanChat(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: "ClanMember_Bot",
          text: randomReply,
          timestamp: Date.now(),
          isSystem: false
        }]);
      }
    }, 2000);
  }, []);

  const addSeasonXP = useCallback((amount: number) => {
    setUserStats(prev => {
      const newXP = prev.seasonXP + amount;
      const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level

      if (newLevel > prev.seasonLevel) {
        toast.success(`SEASON LEVEL UP!`, {
          description: `You've reached Season Level ${newLevel}!`,
          icon: "🌟"
        });
      }

      return {
        ...prev,
        seasonXP: newXP,
        seasonLevel: newLevel
      };
    });
  }, []);

  const buyPremiumPass = useCallback(() => {
    const COST = 1000;
    if (userStats.coins < COST) {
      toast.error("Insufficient Coins", { description: "The Premium Pass costs 1000 coins." });
      return false;
    }

    addCoins(-COST);
    setUserStats(prev => ({ ...prev, isPremiumPass: true }));
    toast.success("Premium Pass Activated!", {
      description: "You've unlocked the elite reward track.",
      icon: "💎"
    });
    return true;
  }, [userStats.coins, addCoins]);

  const claimSeasonReward = useCallback((level: number) => {
    setUserStats(prev => {
      if (prev.unlockedSeasonRewards.includes(level)) return prev;
      return {
        ...prev,
        unlockedSeasonRewards: [...prev.unlockedSeasonRewards, level]
      };
    });
  }, []);

  const updateClan = useCallback((clanId: string, updates: Partial<Clan>) => {
    setClans(prev => prev.map(c => c.id === clanId ? { ...c, ...updates } : c));
    toast.success("Clan Updated");
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        userStats,
        leaderboard,
        dailyChallenges,
        earnTasks,
        joinedTournaments,
        addXP,
        addCoins,
        updateStreak,
        submitToLeaderboard,
        updateChallengeProgress,
        updateTaskProgress,
        completeTask,
        joinTournament,
        leaveTournament,
        getXPForNextLevel,
        clearLeaderboard,
        setPremium,
        buyItem,
        isItemOwned,
        login,
        logout,

        subscribe,
        unlockCosmetic,
        consumeCrate,
        equipCosmetic,

        customMissions,
        publishMission,
        playMission,

        clans,
        userClan,
        clanChat,
        createClan,
        joinClan,
        leaveClan,
        donateToClan,
        sendClanMessage,
        updateClan,

        addSeasonXP,
        buyPremiumPass,
        claimSeasonReward
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
};
