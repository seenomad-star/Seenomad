import { useState, useEffect, useCallback } from "react";

export interface RaceResult {
  id: string;
  playerName: string;
  wpm: number;
  accuracy: number;
  position: number;
  finishTime: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timestamp: number;
  botCount: number;
}

const STORAGE_KEY = "race-history";
const MAX_RESULTS = 100;

export const useRaceHistory = () => {
  const [results, setResults] = useState<RaceResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch {
        setResults([]);
      }
    }
  }, []);

  const saveResult = useCallback((result: Omit<RaceResult, "id" | "timestamp">) => {
    const newResult: RaceResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setResults((prev) => {
      const updated = [newResult, ...prev].slice(0, MAX_RESULTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return newResult;
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResults([]);
  }, []);

  const getLeaderboardByDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    return results
      .filter((r) => r.difficulty === difficulty)
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, 10);
  }, [results]);

  const getBestTimeByDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const filtered = results.filter((r) => r.difficulty === difficulty && r.position === 1);
    if (filtered.length === 0) return null;
    return filtered.reduce((best, r) => r.finishTime < best.finishTime ? r : best);
  }, [results]);

  const getHighestWpmByDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const filtered = results.filter((r) => r.difficulty === difficulty);
    if (filtered.length === 0) return null;
    return filtered.reduce((best, r) => r.wpm > best.wpm ? r : best);
  }, [results]);

  const getAllTimeStats = useCallback(() => {
    if (results.length === 0) {
      return {
        totalRaces: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        wins: 0,
        winRate: 0,
      };
    }

    const wins = results.filter((r) => r.position === 1).length;
    return {
      totalRaces: results.length,
      avgWpm: Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length),
      avgAccuracy: Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / results.length) * 10) / 10,
      wins,
      winRate: Math.round((wins / results.length) * 100),
    };
  }, [results]);

  return {
    results,
    saveResult,
    clearHistory,
    getLeaderboardByDifficulty,
    getBestTimeByDifficulty,
    getHighestWpmByDifficulty,
    getAllTimeStats,
  };
};
