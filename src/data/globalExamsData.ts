import { AIRules, AIPredictor, MissionMonetization } from "@/types/examMissions";

export interface GlobalExam {
  id: string;
  name: string;
  fullName: string;
  authority: string;
  country: string;
  countryCode: string;
  region: "asia" | "europe" | "americas" | "africa" | "oceania";
  typingSpeed: {
    english?: number;
    native?: number;
  };
  nativeLanguage?: string;
  duration: number;
  accuracy?: number;
  category: string;
  description: string;
  posts: string[];
  // Mission Control 2.0 Fields
  rules: AIRules[];
  aiPredictor: AIPredictor;
  hints: string[];
  monetization: MissionMonetization;
}

export interface ProgressiveLesson {
  id: string;
  title: string;
  description: string;
  level: number;
  requiredLevel: number;
  targetWpm: number;
  targetAccuracy: number;
  xpReward: number;
  coinReward: number;
  category: "home-row" | "top-row" | "bottom-row" | "numbers" | "symbols" | "speed" | "accuracy" | "advanced";
  keys: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  bestWpm?: number;
  bestAccuracy?: number;
  practiceText: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  layout: string;
  direction: "ltr" | "rtl";
}

export const supportedLanguages: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", layout: "QWERTY", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", layout: "QWERTY", direction: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", layout: "AZERTY", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", layout: "QWERTZ", direction: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", layout: "QWERTY", direction: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", layout: "QWERTY", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", layout: "ЙЦУКЕН", direction: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", layout: "Romaji", direction: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", layout: "두벌식", direction: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", layout: "Pinyin", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", layout: "Arabic", direction: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", layout: "Inscript", direction: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", layout: "Turkish-Q", direction: "ltr" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", layout: "QWERTY", direction: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", layout: "QWERTY", direction: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", layout: "QWERTY", direction: "ltr" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", layout: "ЙЦУКЕН", direction: "ltr" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", layout: "Kedmanee", direction: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", layout: "QWERTY", direction: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", layout: "QWERTY", direction: "ltr" },
];

const generateDefaultMissionData = (exam: Partial<GlobalExam>) => ({
  rules: [
    {
      title: "Standard Proficiency",
      items: [
        `Target Speed: ${exam.typingSpeed?.english || exam.typingSpeed?.native || 30} WPM.`,
        "Minimum Accuracy: 95% required.",
        "Duration: 10 minutes session."
      ]
    },
    {
      title: "Navigation Rules",
      items: [
        "Backspace is enabled for correction.",
        "Auto-scroll enabled.",
        "Time starts on first keystroke."
      ]
    }
  ],
  aiPredictor: {
    historicalCutoff: (exam.typingSpeed?.english || exam.typingSpeed?.native || 30) - 1,
    trend: "stable" as const,
    difficultyFactor: 1.0
  },
  hints: [
    "Keep a steady rhythm to maintain flow.",
    "Accuracy is prioritized over raw speed in this certification.",
    "Take deep breaths and focus on the screen, not your hands."
  ],
  monetization: {
    offer: `${exam.name} Success Pack`,
    price: "₹999",
    benefits: ["Full Mock Series", "Detailed AI Breakdown", "Speed Booster Drills"]
  }
});

export const globalExams: GlobalExam[] = ([
  // India
  { id: "ssc-chsl", name: "SSC CHSL", fullName: "Combined Higher Secondary Level", authority: "Staff Selection Commission", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 35, native: 30 }, nativeLanguage: "Hindi", duration: 15, category: "Government", description: "Typing test for LDC/JSA, PA/SA, and DEO posts", posts: ["LDC", "JSA", "PA/SA", "DEO"] },
  { id: "ssc-cgl", name: "SSC CGL", fullName: "Combined Graduate Level", authority: "Staff Selection Commission", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 35, native: 30 }, nativeLanguage: "Hindi", duration: 15, category: "Government", description: "Required for Tax Assistant and other clerical posts", posts: ["Tax Assistant", "Sub-Inspector", "Assistant"] },
  { id: "rrb-ntpc", name: "Railway RRB NTPC", fullName: "Non-Technical Popular Categories", authority: "Railway Recruitment Board", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 30, native: 25 }, nativeLanguage: "Hindi", duration: 10, category: "Government", description: "Typing skill test for Station Master & Clerk posts", posts: ["Station Master", "Junior Accounts Assistant"] },
  { id: "sbi-po", name: "SBI PO / Clerk", fullName: "State Bank of India Recruitment", authority: "SBI", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 30 }, duration: 10, category: "Banking", description: "Data entry and speed drills for banking", posts: ["Probationary Officer", "Junior Associate"] },
  { id: "ibps-clerk", name: "IBPS Clerk", fullName: "Institute of Banking Personnel Selection", authority: "IBPS", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 30, native: 25 }, nativeLanguage: "Hindi", duration: 15, category: "Banking", description: "Typing test for bank clerical cadre", posts: ["Bank Clerk", "Office Assistant"] },
  { id: "judiciary-india", name: "Judiciary Typing", fullName: "District & High Court Exams", authority: "High Courts", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 40 }, duration: 10, category: "Legal", description: "Legal terminology and judgment typing", posts: ["Stenographer", "Court Clerk"] },
  { id: "cpct", name: "CPCT", fullName: "Computer Proficiency Certification Test", authority: "MP Online", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 30, native: 25 }, nativeLanguage: "Hindi", duration: 15, accuracy: 90, category: "State", description: "Mandatory for MP government jobs", posts: ["Various State Posts"] },
  { id: "speed-drills-india", name: "India Speed Drills", fullName: "Burst Typing For Tough Keys", authority: "TypingOS", country: "India", countryCode: "IN", region: "asia", typingSpeed: { english: 50 }, duration: 5, category: "Practice", description: "High-intensity burst typing for mastery", posts: ["Speed Typist"] },

  // USA
  { id: "civil-service-usa", name: "Civil Service Exam", fullName: "Federal Civil Service Typing Test", authority: "OPM", country: "United States", countryCode: "US", region: "americas", typingSpeed: { english: 40 }, duration: 5, category: "Federal", description: "Typing proficiency for federal positions", posts: ["Administrative Assistant", "Secretary", "Clerk Typist"] },
  { id: "court-reporter-usa", name: "Court Reporter", fullName: "Court Reporting Certification", authority: "NCRA", country: "United States", countryCode: "US", region: "americas", typingSpeed: { english: 225 }, duration: 5, category: "Legal", description: "Stenography certification for court reporting", posts: ["Court Reporter", "Legal Transcriptionist"] },

  // UK
  { id: "civil-service-uk", name: "Civil Service UK", fullName: "UK Civil Service Fast Stream", authority: "Civil Service Commission", country: "United Kingdom", countryCode: "GB", region: "europe", typingSpeed: { english: 45 }, duration: 10, category: "Government", description: "Administrative officer typing assessment", posts: ["Administrative Officer", "Executive Officer"] },
  { id: "nhs-admin", name: "NHS Admin", fullName: "NHS Administrative Typing Test", authority: "NHS", country: "United Kingdom", countryCode: "GB", region: "europe", typingSpeed: { english: 35 }, duration: 10, category: "Healthcare", description: "Medical secretary and admin typing", posts: ["Medical Secretary", "Ward Clerk", "Receptionist"] },

  // Germany
  { id: "verwaltung-de", name: "Verwaltungsfachangestellte", fullName: "German Administrative Assistant Exam", authority: "Bundesverwaltungsamt", country: "Germany", countryCode: "DE", region: "europe", typingSpeed: { english: 40, native: 200 }, nativeLanguage: "German", duration: 10, category: "Government", description: "Public administration typing test", posts: ["Verwaltungsfachangestellte", "Bürokaufmann"] },

  // France
  { id: "concours-fr", name: "Concours Administratif", fullName: "French Civil Service Exam", authority: "Ministère de la Fonction publique", country: "France", countryCode: "FR", region: "europe", typingSpeed: { english: 35, native: 40 }, nativeLanguage: "French", duration: 15, category: "Government", description: "Administrative typing certification", posts: ["Adjoint Administratif", "Secrétaire Administratif"] },

  // Japan
  { id: "japanese-civil", name: "\u56FD\u5BB6\u516C\u52D9\u54E1\u8A66\u9A13", fullName: "National Public Service Exam", authority: "\u4EBA\u4E8B\u9662", country: "Japan", countryCode: "JP", region: "asia", typingSpeed: { native: 80 }, nativeLanguage: "Japanese", duration: 10, category: "Government", description: "Japanese typing proficiency for civil service", posts: ["\u884C\u653F\u8077", "\u4E8B\u52D9\u8077"] },

  // South Korea
  { id: "korean-geps", name: "GEPS Typing", fullName: "Government Employee Typing Test", authority: "MPM", country: "South Korea", countryCode: "KR", region: "asia", typingSpeed: { native: 300 }, nativeLanguage: "Korean", duration: 10, category: "Government", description: "Korean typing for government positions", posts: ["\uD589\uC815\uC9C1", "\uC0AC\uBB34\uC9C1"] },

  // China
  { id: "china-civil", name: "\u516C\u52A1\u54E1\u8003\u8BD5", fullName: "Chinese Civil Service Exam", authority: "\u4EBA\u529B\u8D44\u6E90\u793E\u4F1A\u4FDD\u969C\u90E8", country: "China", countryCode: "CN", region: "asia", typingSpeed: { native: 50 }, nativeLanguage: "Chinese", duration: 10, category: "Government", description: "Pinyin typing for civil service", posts: ["\u516C\u52A1\u54E1", "\u4E8B\u4E1A\u5355\u4F4D"] },

  // Australia
  { id: "aps-typing", name: "APS Typing Test", fullName: "Australian Public Service Typing", authority: "APSC", country: "Australia", countryCode: "AU", region: "oceania", typingSpeed: { english: 40 }, duration: 5, category: "Government", description: "Federal government typing assessment", posts: ["APS Officer", "Administrative Clerk"] },

  // Canada
  { id: "psac-typing", name: "PSAC Typing", fullName: "Public Service Alliance Typing Test", authority: "PSC", country: "Canada", countryCode: "CA", region: "americas", typingSpeed: { english: 40 }, duration: 5, category: "Federal", description: "Federal public service typing", posts: ["Administrative Assistant", "Clerk", "Secretary"] },

  // Brazil
  { id: "concurso-br", name: "Concurso P\u00FAblico", fullName: "Brazilian Civil Service Exam", authority: "CESPE", country: "Brazil", countryCode: "BR", region: "americas", typingSpeed: { native: 150 }, nativeLanguage: "Portuguese", duration: 10, category: "Government", description: "Typing test for public positions", posts: ["T\u00E9cnico Administrativo", "Agente Administrativo"] },

  // Russia
  { id: "russia-civil", name: "\u0413\u043E\u0441\u0441\u043B\u0443\u0436\u0431\u0430", fullName: "Russian Civil Service Typing", authority: "\u041C\u0438\u043D\u0442\u0440\u0443\u0434", country: "Russia", countryCode: "RU", region: "europe", typingSpeed: { native: 120 }, nativeLanguage: "Russian", duration: 10, category: "Government", description: "Typing certification for state positions", posts: ["\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0441\u043B\u0443\u0436\u0430\u0449\u0438\u0439", "\u0421\u0435\u043A\u0440\u0435\u0442\u0430\u0440\u044C"] },

  // UAE
  { id: "uae-federal", name: "UAE Federal", fullName: "Federal Authority Typing Test", authority: "FAHR", country: "United Arab Emirates", countryCode: "AE", region: "asia", typingSpeed: { english: 40, native: 35 }, nativeLanguage: "Arabic", duration: 10, category: "Government", description: "Federal government typing assessment", posts: ["Administrative Officer", "Clerk"] },

  // Singapore
  { id: "psc-sg", name: "PSC Singapore", fullName: "Public Service Commission Typing", authority: "PSC", country: "Singapore", countryCode: "SG", region: "asia", typingSpeed: { english: 45 }, duration: 5, category: "Government", description: "Civil service typing proficiency", posts: ["Management Executive", "\u0041dministrative Officer"] },

  // South Africa
  { id: "dpsa-typing", name: "DPSA Typing", fullName: "Department of Public Service", authority: "DPSA", country: "South Africa", countryCode: "ZA", region: "africa", typingSpeed: { english: 35 }, duration: 10, category: "Government", description: "Public service typing certification", posts: ["Administrative Clerk", "Secretary"] },

  // Nigeria
  { id: "nigeria-civil", name: "Nigeria Civil Service", fullName: "Federal Civil Service Exam", authority: "FCSC", country: "Nigeria", countryCode: "NG", region: "africa", typingSpeed: { english: 30 }, duration: 10, category: "Government", description: "Civil service typing assessment", posts: ["Administrative Officer", "Clerk"] },

  // Mexico
  { id: "spc-mexico", name: "SPC Mexico", fullName: "Servicio Profesional de Carrera", authority: "SFP", country: "Mexico", countryCode: "MX", region: "americas", typingSpeed: { native: 40 }, nativeLanguage: "Spanish", duration: 10, category: "Government", description: "Federal typing certification", posts: ["Analista Administrativo", "Secretario"] },

  // Philippines
  { id: "csc-ph", name: "CSC Typing", fullName: "Civil Service Commission Typing", authority: "CSC", country: "Philippines", countryCode: "PH", region: "asia", typingSpeed: { english: 30 }, duration: 10, category: "Government", description: "Civil service typing requirement", posts: ["Administrative Aide", "Clerk"] },

  // Indonesia
  { id: "cpns-typing", name: "CPNS Typing", fullName: "Civil Servant Candidate Typing", authority: "BKN", country: "Indonesia", countryCode: "ID", region: "asia", typingSpeed: { native: 30 }, nativeLanguage: "Indonesian", duration: 10, category: "Government", description: "Civil servant typing test", posts: ["PNS", "Administrasi"] },

  // Turkey
  { id: "kpss-typing", name: "KPSS Typing", fullName: "Public Personnel Selection Exam", authority: "\u00D6SYM", country: "Turkey", countryCode: "TR", region: "europe", typingSpeed: { native: 30 }, nativeLanguage: "Turkish", duration: 10, category: "Government", description: "Typing test for public positions", posts: ["Memur", "Sekreter"] },

  // Poland
  { id: "poland-civil", name: "S\u0142u\u017Cba Cywilna", fullName: "Polish Civil Service Typing", authority: "KPRM", country: "Poland", countryCode: "PL", region: "europe", typingSpeed: { native: 180 }, nativeLanguage: "Polish", duration: 10, category: "Government", description: "Civil service typing certification", posts: ["Urz\u0119dnik", "Sekretarz"] },

  // Egypt
  { id: "egypt-civil", name: "Egypt Civil Service", fullName: "Central Agency for Organization", authority: "CAOA", country: "Egypt", countryCode: "EG", region: "africa", typingSpeed: { english: 25, native: 30 }, nativeLanguage: "Arabic", duration: 10, category: "Government", description: "Government typing assessment", posts: ["\u0645\u0648\u0638\u0641 \u0625\u062F\u0627\u0631\u064A", "\u0643\u0627\u062A\u0628"] },
]).map((exam: any) => ({
  ...exam,
  region: exam.region as "asia" | "europe" | "americas" | "africa" | "oceania",
  ...generateDefaultMissionData(exam)
})) as GlobalExam[];


export const progressiveLessons: ProgressiveLesson[] = [
  // Level 1 - Home Row Basics
  { id: "home-row-1", title: "Home Row Introduction", description: "Learn the home row keys: A S D F and J K L ;", level: 1, requiredLevel: 1, targetWpm: 15, targetAccuracy: 85, xpReward: 50, coinReward: 10, category: "home-row", keys: ["a", "s", "d", "f", "j", "k", "l", ";"], isUnlocked: true, isCompleted: false, practiceText: "asdf jkl; asdf jkl; fad sad lad ask dad all fall flask" },
  { id: "home-row-2", title: "Home Row Mastery", description: "Master the home row with word combinations", level: 2, requiredLevel: 1, targetWpm: 20, targetAccuracy: 88, xpReward: 60, coinReward: 12, category: "home-row", keys: ["a", "s", "d", "f", "j", "k", "l", ";"], isUnlocked: false, isCompleted: false, practiceText: "all fall flask ask dad sad lad add salad flask salads" },

  // Level 2 - Adding G and H
  { id: "home-row-3", title: "Adding G and H", description: "Expand your reach with G and H keys", level: 3, requiredLevel: 2, targetWpm: 22, targetAccuracy: 85, xpReward: 70, coinReward: 15, category: "home-row", keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"], isUnlocked: false, isCompleted: false, practiceText: "hash gash dash flash glad had half hang high ghast" },

  // Level 3 - Top Row Introduction
  { id: "top-row-1", title: "Top Row Introduction", description: "Learn Q W E R T and Y U I O P", level: 4, requiredLevel: 3, targetWpm: 20, targetAccuracy: 82, xpReward: 80, coinReward: 18, category: "top-row", keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], isUnlocked: false, isCompleted: false, practiceText: "quiet write quite tower power outer equip proper property" },
  { id: "top-row-2", title: "Top Row Mastery", description: "Master the top row keys", level: 5, requiredLevel: 4, targetWpm: 25, targetAccuracy: 85, xpReward: 90, coinReward: 20, category: "top-row", keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], isUnlocked: false, isCompleted: false, practiceText: "typewriter reporter territory property opportunity poetry" },

  // Level 4 - Bottom Row
  { id: "bottom-row-1", title: "Bottom Row Introduction", description: "Learn Z X C V B and N M , . /", level: 6, requiredLevel: 5, targetWpm: 20, targetAccuracy: 80, xpReward: 100, coinReward: 22, category: "bottom-row", keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"], isUnlocked: false, isCompleted: false, practiceText: "zero exact voice became number machine, next. zoom" },
  { id: "bottom-row-2", title: "Bottom Row Mastery", description: "Master the bottom row keys", level: 7, requiredLevel: 6, targetWpm: 25, targetAccuracy: 82, xpReward: 110, coinReward: 25, category: "bottom-row", keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"], isUnlocked: false, isCompleted: false, practiceText: "maximum, examination. civilization, combination. mix" },

  // Level 5 - Full Keyboard
  { id: "full-keyboard-1", title: "Full Keyboard Practice", description: "Practice all letter keys together", level: 8, requiredLevel: 7, targetWpm: 28, targetAccuracy: 85, xpReward: 120, coinReward: 28, category: "speed", keys: [], isUnlocked: false, isCompleted: false, practiceText: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs." },

  // Level 6 - Numbers
  { id: "numbers-1", title: "Number Row Introduction", description: "Learn the number row 1 2 3 4 5 6 7 8 9 0", level: 9, requiredLevel: 8, targetWpm: 20, targetAccuracy: 80, xpReward: 130, coinReward: 30, category: "numbers", keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], isUnlocked: false, isCompleted: false, practiceText: "12345 67890 24680 13579 2024 1999 2000 2050 100 250" },
  { id: "numbers-2", title: "Numbers in Context", description: "Practice numbers with words", level: 10, requiredLevel: 9, targetWpm: 25, targetAccuracy: 82, xpReward: 140, coinReward: 32, category: "numbers", keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], isUnlocked: false, isCompleted: false, practiceText: "I have 25 apples and 30 oranges. Room 101 is on floor 5. Call 555-1234." },

  // Level 7 - Symbols
  { id: "symbols-1", title: "Common Symbols", description: "Learn ! @ # $ % ^ & * ( )", level: 11, requiredLevel: 10, targetWpm: 18, targetAccuracy: 78, xpReward: 150, coinReward: 35, category: "symbols", keys: ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"], isUnlocked: false, isCompleted: false, practiceText: "Hello! How are you? Email: test@example.com. Price: $50 (50% off!)" },
  { id: "symbols-2", title: "Programming Symbols", description: "Learn [ ] { } | \\ : ; ' \"", level: 12, requiredLevel: 11, targetWpm: 18, targetAccuracy: 78, xpReward: 160, coinReward: 38, category: "symbols", keys: ["[", "]", "{", "}", "|", "\\", ":", ";", "'", "\""], isUnlocked: false, isCompleted: false, practiceText: "function() { return [1, 2, 3]; } const name = 'test'; \"hello\"" },

  // Level 8 - Speed Building
  { id: "speed-1", title: "Speed Building I", description: "Build your typing speed to 35 WPM", level: 13, requiredLevel: 12, targetWpm: 35, targetAccuracy: 90, xpReward: 180, coinReward: 40, category: "speed", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Practice makes perfect. The more you type, the faster you become. Keep your fingers on the home row and type without looking at the keyboard." },
  { id: "speed-2", title: "Speed Building II", description: "Push to 45 WPM", level: 14, requiredLevel: 13, targetWpm: 45, targetAccuracy: 90, xpReward: 200, coinReward: 45, category: "speed", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Speed and accuracy go hand in hand. Focus on hitting each key correctly while maintaining a steady rhythm. Your muscle memory will develop over time." },
  { id: "speed-3", title: "Speed Building III", description: "Achieve 55 WPM", level: 15, requiredLevel: 14, targetWpm: 55, targetAccuracy: 92, xpReward: 220, coinReward: 50, category: "speed", keys: [], isUnlocked: false, isCompleted: false, practiceText: "You are becoming a proficient typist. At this level, you can handle most office tasks efficiently. Keep challenging yourself to improve even further." },

  // Level 9 - Accuracy Focus
  { id: "accuracy-1", title: "Accuracy Challenge I", description: "Achieve 95% accuracy", level: 16, requiredLevel: 15, targetWpm: 40, targetAccuracy: 95, xpReward: 250, coinReward: 55, category: "accuracy", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Precision is paramount. Each keystroke matters. Take your time to ensure every letter is correct before moving on to the next word." },
  { id: "accuracy-2", title: "Accuracy Challenge II", description: "Achieve 98% accuracy", level: 17, requiredLevel: 16, targetWpm: 45, targetAccuracy: 98, xpReward: 280, coinReward: 60, category: "accuracy", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Near-perfect accuracy requires focus and patience. Read each word carefully and type deliberately. Quality over quantity leads to mastery." },

  // Level 10 - Advanced
  { id: "advanced-1", title: "Advanced Typing I", description: "Complex sentences at 60 WPM", level: 18, requiredLevel: 17, targetWpm: 60, targetAccuracy: 93, xpReward: 300, coinReward: 70, category: "advanced", keys: [], isUnlocked: false, isCompleted: false, practiceText: "The comprehensive examination of contemporary methodologies demonstrates the significance of maintaining consistent practice schedules for optimal skill development." },
  { id: "advanced-2", title: "Advanced Typing II", description: "Technical content at 65 WPM", level: 19, requiredLevel: 18, targetWpm: 65, targetAccuracy: 93, xpReward: 350, coinReward: 80, category: "advanced", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Implementation of sophisticated algorithms requires understanding of data structures, complexity analysis, and optimization techniques for efficient software development." },
  { id: "advanced-3", title: "Master Typist", description: "Achieve 75+ WPM with 95% accuracy", level: 20, requiredLevel: 19, targetWpm: 75, targetAccuracy: 95, xpReward: 500, coinReward: 100, category: "advanced", keys: [], isUnlocked: false, isCompleted: false, practiceText: "Congratulations on reaching the pinnacle of typing proficiency. Your dedication has transformed you into an expert typist capable of handling any document with speed and precision." },
];

export const regionColors: Record<string, string> = {
  asia: "bg-rose-500/20 text-rose-400",
  europe: "bg-blue-500/20 text-blue-400",
  americas: "bg-emerald-500/20 text-emerald-400",
  africa: "bg-amber-500/20 text-amber-400",
  oceania: "bg-purple-500/20 text-purple-400",
};

export const categoryIcons: Record<string, string> = {
  Government: "🏛️",
  Banking: "🏦",
  Legal: "⚖️",
  Healthcare: "🏥",
  Federal: "🇺🇸",
  State: "📍",
};
