import { TestResult } from "@/hooks/useTestHistory";

/**
 * Calculate recommended difficulty level based on user's typing performance
 * @param avgWpm - Average words per minute from user's test history
 * @param avgAccuracy - Average accuracy percentage from user's test history
 * @param examId - Optional exam ID to get exam-specific recommendations
 * @returns Recommended difficulty level: "easy" | "medium" | "hard"
 */
export const getRecommendedDifficulty = (
    avgWpm: number,
    avgAccuracy: number,
    examId?: string
): "easy" | "medium" | "hard" => {
    // If no data, recommend easy
    if (avgWpm === 0 && avgAccuracy === 0) {
        return "easy";
    }

    // Calculate a performance score (weighted combination of WPM and accuracy)
    // WPM weight: 60%, Accuracy weight: 40%
    const wpmScore = Math.min(avgWpm / 60, 1); // Normalize to 0-1 (60 WPM = 1.0)
    const accuracyScore = avgAccuracy / 100; // Already 0-1
    const performanceScore = (wpmScore * 0.6) + (accuracyScore * 0.4);

    // Determine difficulty based on performance score
    if (performanceScore >= 0.75) {
        return "hard"; // High performers get hard difficulty
    } else if (performanceScore >= 0.45) {
        return "medium"; // Average performers get medium
    } else {
        return "easy"; // Beginners get easy
    }
};

/**
 * Check if user has mastered a specific difficulty level
 * @param results - User's test history
 * @param difficulty - Difficulty level to check
 * @param examId - Optional exam ID to check exam-specific mastery
 * @returns true if user has mastered the difficulty level
 */
export const hasMasteredDifficulty = (
    results: TestResult[],
    difficulty: "easy" | "medium" | "hard",
    examId?: string
): boolean => {
    // Filter results for the specific exam if provided
    const relevantResults = examId
        ? results.filter(r => r.examName?.includes(examId))
        : results;

    if (relevantResults.length < 3) {
        return false; // Need at least 3 tests to determine mastery
    }

    // Get recent results (last 10 for this difficulty)
    const recentResults = relevantResults.slice(0, 10);

    // Define mastery thresholds based on difficulty
    const thresholds = {
        easy: { wpm: 30, accuracy: 90 },
        medium: { wpm: 40, accuracy: 92 },
        hard: { wpm: 50, accuracy: 94 }
    };

    const threshold = thresholds[difficulty];

    // Count how many recent tests meet the threshold
    const passedTests = recentResults.filter(
        r => r.wpm >= threshold.wpm && r.accuracy >= threshold.accuracy
    );

    // Mastered if at least 70% of recent tests passed
    return passedTests.length / recentResults.length >= 0.7;
};

/**
 * Get mastery status for all difficulty levels
 * @param results - User's test history
 * @param examId - Optional exam ID
 * @returns Object with mastery status for each difficulty
 */
export const getDifficultyMastery = (
    results: TestResult[],
    examId?: string
) => {
    return {
        easy: hasMasteredDifficulty(results, "easy", examId),
        medium: hasMasteredDifficulty(results, "medium", examId),
        hard: hasMasteredDifficulty(results, "hard", examId)
    };
};
