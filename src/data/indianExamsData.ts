import { MissionData, ExamCategory } from "@/types/examMissions";

export type { ExamCategory };

export const indianExamsData: Record<string, MissionData> = {
    ssc: {
        id: "ssc",
        type: "category",
        title: "SSC MISSION CONTROL",
        subtitle: "Staff Selection Commission Examination Hub. Practice official layouts with live qualifying analytics.",
        targetWpm: 35,
        qualifyingMetric: "2000 key depressions / 15 mins",
        aspirantSeed: 12432,
        rules: [
            {
                title: "Error Margin Policies",
                items: [
                    "UNRESERVED (UR): Max 5% error allowed.",
                    "OBC / EWS: Max 7% error allowed.",
                    "SC / ST / PwD: Max 10% error allowed."
                ]
            },
            {
                title: "Calculation Rules",
                items: [
                    "WPM is (Total Characters / 5) / Time.",
                    "Half mistakes vs Full mistakes calculation applies.",
                    "Backspace is allowed but accuracy is prioritized."
                ]
            }
        ],
        categories: [
            { title: "SSC CGL (Tier-II)", desc: "Tax Assistant / Auditor Posts", icon: "Shield", color: "text-emerald-500" },
            { title: "CHSL (10+2)", desc: "LDC/JSA/PA/SA Positions", icon: "Trophy", color: "text-blue-500" },
            { title: "MTS / Havaldar", desc: "Non-Technical Posts", icon: "Target", color: "text-purple-500" },
            { title: "Steno Grade C&D", desc: "Shorthand & Typing Skills", icon: "FileText", color: "text-orange-500" },
            { title: "Selection Posts", desc: "Various Specialized Roles", icon: "Star", color: "text-yellow-500" },
        ],
        monetization: {
            offer: "Unlock SSC Elite Sets",
            price: "₹499",
            benefits: ["100+ PYP Passages", "AI Rank Prediction", "Customized Error Analysis"]
        },
        aiPredictor: {
            historicalCutoff: 34.5,
            trend: "rising",
            difficultyFactor: 1.2
        },
        hints: [
            "Focus on Special Characters (%, &, @) as they often appear in CGL Tier-II.",
            "The 'Enter' key behavior in SSC is strictly 'Line-by-Line'. Don't double tap.",
            "Accuracy under 95% is a high-risk failure in UR category."
        ]
    },
    railway: {
        id: "railway",
        type: "category",
        title: "RRB JUNCTION",
        subtitle: "RRB NTPC & Group D Typing Mastery. Track your progress for the biggest railway recruitment drives.",
        targetWpm: 30,
        qualifyingMetric: "30 WPM (English) / 25 WPM (Hindi)",
        aspirantSeed: 45210,
        rules: [
            {
                title: "RRB Standard Rules",
                items: [
                    "English: 30 WPM (300 words in 10 mins).",
                    "Hindi: 25 WPM (250 words in 10 mins).",
                    "Minimum 95% Accuracy required."
                ]
            },
            {
                title: "Testing Environment",
                items: [
                    "Editing and Backspace are strictly disabled.",
                    "Highlighting of text is NOT allowed.",
                    "Evaluation based on net typing speed."
                ]
            }
        ],
        categories: [
            { title: "RRB NTPC", desc: "Graduate & Under-Graduate Level", icon: "Rocket", color: "text-red-500" },
            { title: "RRB Group D", desc: "Technical & Non-Technical Skills", icon: "Zap", color: "text-orange-500" },
            { title: "ALP / Tech", desc: "Assistant Loco Pilot Skill Test", icon: "Activity", color: "text-green-500" },
            { title: "GDCE Exams", desc: "Internal Departmental Exams", icon: "Shield", color: "text-blue-500" },
        ],
        monetization: {
            offer: "Railway Master Pass",
            price: "₹299",
            benefits: ["Restricted Backspace Drills", "Live Mock Leaderboards", "Regional Lang Support"]
        },
        aiPredictor: {
            historicalCutoff: 29.8,
            trend: "stable",
            difficultyFactor: 1.0
        },
        hints: [
            "Backspace is disabled in real RRB tests. Practice without it!",
            "The 'Tab' key is used for paragraph indentations in NTPC sets.",
            "Long words are weighted higher. Take extra care with 10+ char words."
        ]
    },
    banking: {
        id: "banking",
        type: "category",
        title: "FINTELLIGENCE HUB",
        subtitle: "Banking & Financial Sector Data Entry. High speed, perfect accuracy for SBI, IBPS & RBI.",
        targetWpm: 40,
        qualifyingMetric: "10,500 KDPH (Key Depressions Per Hour)",
        aspirantSeed: 8743,
        rules: [
            {
                title: "Data Entry Standards",
                items: [
                    "Numeric & Alpha-Numeric precision focus.",
                    "Avg speed requirement: 35-40 WPM.",
                    "Error margin: Less than 3% for elite roles."
                ]
            },
            {
                title: "RBI/SBI Specifics",
                items: [
                    "Special focus on special characters (%) and numbers.",
                    "Tab-based navigation drills.",
                    "Case-sensitive word matching."
                ]
            }
        ],
        categories: [
            { title: "SBI Clerk", desc: "Junior Associate Skill Prep", icon: "Building2", color: "text-blue-600" },
            { title: "IBPS PO/Clerk", desc: "Mains Exam Descriptive & Skill", icon: "GraduationCap", color: "text-emerald-500" },
            { title: "RBI Assistant", desc: "LPT & Numerical Typing", icon: "Crown", color: "text-yellow-600" },
            { title: "NABARD / SEBI", desc: "Regulatory Body Typing Drill", icon: "Zap", color: "text-indigo-500" },
        ],
        monetization: {
            offer: "Banking Analytics Pro",
            price: "₹599",
            benefits: ["Numeric Pad Mastery", "Spreadsheet Layout Drills", "Real-time KDPH Tracker"]
        },
        aiPredictor: {
            historicalCutoff: 38.5,
            trend: "rising",
            difficultyFactor: 1.4
        },
        hints: [
            "Banking exams have heavy numeric input. Use the Numpad if available.",
            "SBI Clerk often includes complex multi-tier data tables to type.",
            "Precision > Speed. A 98% accuracy is the minimum threshold."
        ]
    },
    judiciary: {
        id: "judiciary",
        type: "category",
        title: "LEGAL SCRIBE PORTAL",
        subtitle: "Judiciary & High Court Typing. Precision for the halls of justice. Specialized legal terminology.",
        targetWpm: 40,
        qualifyingMetric: "40-50 WPM with Legal Dictation",
        aspirantSeed: 3210,
        rules: [
            {
                title: "Legal Formatting",
                items: [
                    "Double space requirement drills.",
                    "Legal abbreviations & Latin terms included.",
                    "Specialized punctuation focus."
                ]
            },
            {
                title: "Court Mastery",
                items: [
                    "High Court Clerical standard rules.",
                    "Continuous typing without visual feedback option.",
                    "Strict judgment-style paragraph tests."
                ]
            }
        ],
        categories: [
            { title: "High Court Exam", desc: "State-wise Judicial Clerkship", icon: "Gavel", color: "text-amber-700" },
            { title: "Supreme Court JCA", desc: "Junior Court Assistant Prep", icon: "Building", color: "text-slate-800" },
            { title: "Civil Court", desc: "District Level Stenography", icon: "Scale", color: "text-rose-500" },
            { title: "Legal Dictation", desc: "Type-as-you-hear training", icon: "Mic", color: "text-violet-500" },
        ],
        monetization: {
            offer: "Justice League Edition",
            price: "₹799",
            benefits: ["Legal Terminology Dictionary", "Unlimited Court Mocks", "Certificate of Proficiency"]
        },
        aiPredictor: {
            historicalCutoff: 42.0,
            trend: "rising",
            difficultyFactor: 1.5
        },
        hints: [
            "Latin terms like 'Habeas Corpus' are common. Slow down for spelling accuracy.",
            "Many High Courts require 'Right-Aligned' number typing for case years.",
            "Practice typing without word-highlighting to simulate the court terminal."
        ]
    }
};
