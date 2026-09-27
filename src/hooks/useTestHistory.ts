import { useState, useEffect, useCallback } from "react";
import { Language } from "@/data/wordLists";

export interface TestResult {
  id: string;
  date: string;
  timestamp: number;
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  totalChars: number;
  language: Language;
  examName?: string;
  passed?: boolean;
}

const STORAGE_KEY = "typing-test-history";
const MAX_RESULTS = 100;

export const useTestHistory = () => {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      // Local-only history fetch for loginless architecture
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setResults(JSON.parse(stored));
        } catch {
          setResults([]);
        }
      }
    };

    fetchHistory();
  }, []);

  const saveResult = useCallback(async (result: Omit<TestResult, "id" | "date" | "timestamp">) => {
    const newResult: TestResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Cloud cloud save removed - local persistence only

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

  const getRecentTests = useCallback((count: number = 10) => {
    return results.slice(0, count);
  }, [results]);

  const getAverageWpm = useCallback(() => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length);
  }, [results]);

  const getBestWpm = useCallback(() => {
    if (results.length === 0) return 0;
    return Math.max(...results.map((r) => r.wpm));
  }, [results]);

  const getAverageAccuracy = useCallback(() => {
    if (results.length === 0) return 0;
    return Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / results.length) * 10) / 10;
  }, [results]);

  const getTotalPracticeTime = useCallback(() => {
    return results.reduce((acc, r) => acc + r.duration, 0);
  }, [results]);

  const getWeeklyData = useCallback(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const weekResults = results.filter((r) => r.timestamp >= weekAgo);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData: { day: string; wpm: number; count: number }[] = days.map((day) => ({
      day,
      wpm: 0,
      count: 0,
    }));

    weekResults.forEach((r) => {
      const dayIndex = new Date(r.timestamp).getDay();
      dailyData[dayIndex].wpm += r.wpm;
      dailyData[dayIndex].count += 1;
    });

    // Reorder to start from today and go back 7 days
    const today = new Date().getDay();
    const reordered = [];
    for (let i = 6; i >= 0; i--) {
      const index = (today - i + 7) % 7;
      const data = dailyData[index];
      reordered.push({
        day: data.day,
        wpm: data.count > 0 ? Math.round(data.wpm / data.count) : 0,
      });
    }

    return reordered;
  }, [results]);

  return {
    results,
    saveResult,
    clearHistory,
    getRecentTests,
    getAverageWpm,
    getBestWpm,
    getAverageAccuracy,
    getTotalPracticeTime,
    getWeeklyData,
  };
};
