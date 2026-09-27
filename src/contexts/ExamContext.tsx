import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "@/data/wordLists";

export interface ExamConfig {
  id: string;
  name: string;
  fullName: string;
  targetWpm: number;
  duration: number; // in minutes
  language: Language;
  isMockTest: boolean;
  selectedSetId?: string;
  selectedSetText?: string;
}

interface ExamContextType {
  examConfig: ExamConfig | null;
  setExamConfig: (config: ExamConfig | null) => void;
  clearExam: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

  const clearExam = () => setExamConfig(null);

  return (
    <ExamContext.Provider value={{ examConfig, setExamConfig, clearExam }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
