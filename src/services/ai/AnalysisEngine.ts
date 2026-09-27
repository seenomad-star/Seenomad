
import { aiService } from './AIService';

export type CoachPersona = 'sensei' | 'drill_sergeant' | 'hype_beast' | 'analytical_bot';

interface CoachProfile {
    id: CoachPersona;
    name: string;
    avatar: string;
    greeting: string;
    style: string;
}

export const COACH_PROFILES: Record<CoachPersona, CoachProfile> = {
    sensei: {
        id: 'sensei',
        name: 'Master Kenji',
        avatar: '🧘‍♂️',
        greeting: "Breathe in. Focus. Let us find flow in your keystrokes.",
        style: "Calm, philosophical, focuses on rhythm and accuracy."
    },
    drill_sergeant: {
        id: 'drill_sergeant',
        name: 'Sgt. Stryker',
        avatar: '🪖',
        greeting: "DROP AND GIVE ME 50 WORDS PER MINUTE! MOVE IT!",
        style: "Aggressive, high-energy, demands speed and discipline."
    },
    hype_beast: {
        id: 'hype_beast',
        name: 'Neon',
        avatar: '⚡',
        greeting: "Yo! Let's crush those high scores! You got this fam!",
        style: "Enthusiastic, uses slang, focuses on gamification and streaks."
    },
    analytical_bot: {
        id: 'analytical_bot',
        name: 'Unit 734',
        avatar: '🤖',
        greeting: "Initializing analysis protocols. Efficiency is paramount.",
        style: "Precise, data-driven, focuses on metrics and error patterns."
    }
};

export interface TypingAnalysis {
    weakKeys: string[];
    speedTrend: 'increasing' | 'decreasing' | 'stable';
    accuracyTrend: 'improving' | 'declining' | 'stable';
    recommendation: string;
    suggestedLesson: string;
}

export class AnalysisEngine {
    static async generateAIAnalysis(history: any[], persona: CoachPersona): Promise<TypingAnalysis> {
        if (history.length === 0) {
            return this.analyzePerformance([], persona);
        }

        const statsSummary = history.slice(-10).map(h => ({
            wpm: h.wpm,
            accuracy: h.accuracy,
            date: new Date(h.timestamp).toLocaleDateString()
        }));

        const coach = COACH_PROFILES[persona];
        const systemPrompt = `You are ${coach.name}, a typing coach with a ${coach.style} personality. 
        Analyze the user's recent performance and provide a brief recommendation.
        Format your response as a JSON object with these keys: 
        "recommendation" (string), "weakKeys" (array of characters), "speedTrend" ("increasing"|"decreasing"|"stable"), 
        "accuracyTrend" ("improving"|"declining"|"stable"), "suggestedLesson" (string).`;

        const userPrompt = `Analyze my last 10 sessions: ${JSON.stringify(statsSummary)}`;

        try {
            const response = await aiService.generateText({
                modelId: '', // Use active provider
                prompt: userPrompt,
                systemPrompt: systemPrompt,
                temperature: 0.5
            });

            // Attempt to parse JSON from AI response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                return {
                    weakKeys: data.weakKeys || [],
                    speedTrend: data.speedTrend || 'stable',
                    accuracyTrend: data.accuracyTrend || 'stable',
                    recommendation: data.recommendation || "Keep practicing!",
                    suggestedLesson: data.suggestedLesson || "General Practice"
                };
            }
            throw new Error("Could not parse AI response");
        } catch (error) {
            console.warn("AI Analysis failed, falling back to mock:", error);
            return this.analyzePerformance(history, persona);
        }
    }

    static analyzePerformance(history: any[], persona: CoachPersona): TypingAnalysis {
        // Fallback mock analysis logic
        const weakKeys = ['q', 'z', 'p', '-'];
        const speedTrend = 'increasing';
        const accuracyTrend = 'stable';

        let recommendation = "";

        switch (persona) {
            case 'sensei':
                recommendation = "Your pinky finger hesitates on 'P'. Practice is the path to perfection.";
                break;
            case 'drill_sergeant':
                recommendation = "YOU'RE SLOWING DOWN ON THE PUNCTUATION! TIGHTEN IT UP!";
                break;
            case 'hype_beast':
                recommendation = "You're crushing it, but that 'Z' key is looking sus. Let's fix it for the win!";
                break;
            case 'analytical_bot':
                recommendation = "Detected 15% latency on right-hand periphery keys. Optimization required.";
                break;
        }

        return {
            weakKeys,
            speedTrend,
            accuracyTrend,
            recommendation,
            suggestedLesson: "Right Pinky Precision Drill"
        };
    }

    static async generateGroupAIAnalysis(users: any[], persona: CoachPersona): Promise<TypingAnalysis> {
        if (users.length === 0) {
            return this.analyzeGroupPerformance([], persona);
        }

        const coach = COACH_PROFILES[persona];
        const systemPrompt = `You are ${coach.name}, an organization-level typing performance auditor. 
        Your style is ${coach.style}.
        Analyze the aggregated performance data of a group of typists and provide strategic recommendations.
        Format your response as a JSON object with these keys: 
        "recommendation" (string), "weakKeys" (array of characters), "speedTrend" ("increasing"|"decreasing"|"stable"), 
        "accuracyTrend" ("improving"|"declining"|"stable"), "suggestedLesson" (string).`;

        const userPrompt = `Analyze this group performance data: ${JSON.stringify(users.slice(0, 50))}`;

        try {
            const response = await aiService.generateText({
                modelId: '', // active
                prompt: userPrompt,
                systemPrompt: systemPrompt,
                temperature: 0.4
            });

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                return {
                    weakKeys: data.weakKeys || [],
                    speedTrend: data.speedTrend || 'stable',
                    accuracyTrend: data.accuracyTrend || 'stable',
                    recommendation: data.recommendation || "Maintain current training intensity.",
                    suggestedLesson: data.suggestedLesson || "Team Speed Drill"
                };
            }
            throw new Error("Could not parse AI response");
        } catch (error) {
            console.warn("Group AI Analysis failed, falling back to mock:", error);
            return this.analyzeGroupPerformance(users, persona);
        }
    }

    static analyzeGroupPerformance(users: any[], persona: CoachPersona): TypingAnalysis {
        // Mock group analysis logic
        const weakKeys = ['x', 'q', 'num-row'];
        const speedTrend = 'increasing';
        const accuracyTrend = 'stable';

        let recommendation = "";

        switch (persona) {
            case 'sensei':
                recommendation = "The class harmony is improving, but attention wavers on complex symbols.";
                break;
            case 'drill_sergeant':
                recommendation = "20% OF THE PLATOON IS LAGGING! WE NEED MORE DRILLS ON NUMBER ROWS!";
                break;
            case 'hype_beast':
                recommendation = "Squad is vibes, but we gotta boost that accuracy on different rows fam.";
                break;
            case 'analytical_bot':
                recommendation = "Aggregate efficiency up 12%. Detected collective deficit in numeric entry.";
                break;
        }

        return {
            weakKeys,
            speedTrend,
            accuracyTrend,
            recommendation,
            suggestedLesson: "Team Sync: Number Row Challenge"
        };
    }

    static generateLesson(weakKeys: string[]): string {
        return `Practice these words: ${weakKeys.map(k => `${k}zz ${k}pp ${k}--`).join(' ')}`;
    }
}
