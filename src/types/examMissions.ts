export type ExamCategory = "ssc" | "railway" | "banking" | "judiciary" | "global";

export interface AIRules {
    title: string;
    items: string[];
}

export interface AIPredictor {
    historicalCutoff: number;
    trend: "rising" | "stable" | "falling";
    difficultyFactor: number;
}

export interface MissionCategory {
    title: string;
    desc: string;
    icon: string;
    color: string;
}

export interface MissionMonetization {
    offer: string;
    price: string;
    benefits: string[];
}

export interface MissionData {
    id: string;
    type: "category" | "specific";
    title: string;
    subtitle: string;
    targetWpm: number;
    qualifyingMetric: string;
    aspirantSeed: number;
    rules: AIRules[];
    categories?: MissionCategory[]; // For category hubs like SSC
    monetization: MissionMonetization;
    aiPredictor: AIPredictor;
    hints: string[];
    countryCode?: string; // Optional for global exams
}
