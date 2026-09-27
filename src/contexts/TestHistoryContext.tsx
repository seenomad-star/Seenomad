import React, { createContext, useContext, ReactNode } from "react";
import { useTestHistory, TestResult } from "@/hooks/useTestHistory";

interface TestHistoryContextType {
  results: TestResult[];
  saveResult: (result: Omit<TestResult, "id" | "date" | "timestamp">) => TestResult;
  clearHistory: () => void;
  getRecentTests: (count?: number) => TestResult[];
  getAverageWpm: () => number;
  getBestWpm: () => number;
  getAverageAccuracy: () => number;
  getTotalPracticeTime: () => number;
  getWeeklyData: () => { day: string; wpm: number }[];
}

const TestHistoryContext = createContext<TestHistoryContextType | undefined>(undefined);

export const TestHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const history = useTestHistory();

  return (
    <TestHistoryContext.Provider value={history}>
      {children}
    </TestHistoryContext.Provider>
  );
};

export const useTestHistoryContext = () => {
  const context = useContext(TestHistoryContext);
  if (!context) {
    throw new Error("useTestHistoryContext must be used within a TestHistoryProvider");
  }
  return context;
};
