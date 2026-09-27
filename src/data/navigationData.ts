
import {
    Keyboard,
    Library,
    Globe,
    GraduationCap,
    Gamepad2,
    Bot,
    Car,
    Trophy,
    Users,
    Coins,
    BarChart3,
    Search,
    Settings,
    Sparkles,
    Settings2,
    Home,
    BookOpen,
    Hash,
    Zap,
    Gift,
    ShoppingCart,
    Medal,
    Building2,
    Crown,
    Activity,
    History,
    Share2,
    Share,
    Star,
    Play,
    Rocket,
    Swords,
    FileText,
    Quote,
    MapPin,
    Monitor,
    Type,
    Briefcase,
    Heart,
    Hammer,
    Shield,
    Cpu
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationOption {
    title: string;
    url: string;
    icon: LucideIcon;
    desc?: string;
}

export interface NavigationCategory {
    id: string;
    label: string;
    icon: LucideIcon;
    subOptions: NavigationOption[];
}

export const navigationCategories: NavigationCategory[] = [
    {
        id: "practice",
        label: "Practice Base",
        icon: Keyboard,
        subOptions: [
            { title: "Standard Test", url: "/", icon: Play, desc: "Quick WPM & accuracy check" },
            { title: "Skill Academy", url: "/courses", icon: GraduationCap, desc: "Structured mastery paths" },
            { title: "Book Library", url: "/book-library", icon: BookOpen, desc: "Type through classic literature" },
            { title: "Custom Text", url: "/custom-practice", icon: FileText, desc: "Paste and practice your own content" },
            { title: "Zen Flow", url: "/zen", icon: Globe, desc: "Distraction-free endless typing" },
        ]
    },
    {
        id: "exams",
        label: "Indian Exams",
        icon: GraduationCap,
        subOptions: [
            { title: "SSC / CGL", url: "/exams/mission/ssc", icon: Building2, desc: "🇮🇳 Government exam layouts" },
            { title: "Railway RRB", url: "/exams/mission/railway", icon: Rocket, desc: "🇮🇳 Specific RRB NTPC speed tests" },
            { title: "Banking / SBI", icon: Building2, desc: "🇮🇳 Data entry & speed drills", url: "/exams/mission/banking" },
            { title: "Judiciary Typing", icon: BookOpen, desc: "🇮🇳 Legal terminology practice", url: "/exams/mission/judiciary" },
            { title: "Speed Drills", icon: Zap, desc: "🇮🇳 Burst typing for tough keys", url: "/exams" },
        ]
    },
    {
        id: "global-exams",
        label: "Global Exams",
        icon: Globe,
        subOptions: [
            { title: "World Dashboard", url: "/global-exams", icon: Globe, desc: "Access all international tests" },
            { title: "Regional Hub", url: "/global-exams", icon: MapPin, desc: "Filter by continent & country" },
            { title: "Certifications", url: "/global-exams", icon: Medal, desc: "Standardized typing certificates" },
            { title: "Practice Drills", url: "/global-exams", icon: Keyboard, desc: "Free-style global practice" },
        ]
    },
    {
        id: "economy",
        label: "Economy Hub",
        icon: Coins,
        subOptions: [
            { title: "Daily Earn", url: "/earn", icon: Gift, desc: "XP & Coin reward tasks" },
            { title: "Cosmetics Shop", url: "/cosmetics", icon: ShoppingCart, desc: "Spend coins on skins & themes" },
            { title: "Missions Forge", url: "/forge", icon: Hammer, desc: "Mint missions & earn royalties" },
            { title: "Developer Portal", url: "/developer", icon: Cpu, desc: "Connect to the Forge API" },
            { title: "Tournaments", url: "/tournaments", icon: Trophy, desc: "Join paid & free events" },
            { title: "Pro Membership", url: "/pricing", icon: Crown, desc: "Upgrade for premium features" },
            { title: "Spin & Win", url: "/earn", icon: Star, desc: "Daily luck-based rewards" },
        ]
    },
    {
        id: "nexus",
        label: "Nexus Social",
        icon: Users,
        subOptions: [
            { title: "Season Pass", url: "/season-pass", icon: Zap, desc: "Level up & claim rewards" },
            { title: "Global Conquest", url: "/leaderboards", icon: Globe, desc: "See world rankings" },
            { title: "Clan Citadel", url: "/clans", icon: Shield, desc: "Team up & dominate sectors" },
            { title: "Clan War Zone", url: "/war-zone", icon: Swords, desc: "High-stakes tug-of-war" },
            { title: "Community Hub", url: "/community", icon: Users, desc: "Connect with typists" },
            { title: "Leaderboards", url: "/leaderboards", icon: Medal, desc: "Global rankings" },
            { title: "Referral System", url: "/referral-system", icon: Share2, desc: "Invite & earn rewards" },
        ]
    },
    {
        id: "blog",
        label: "Blog Central",
        icon: BookOpen,
        subOptions: [
            { title: "Latest Insights", url: "/blog", icon: Zap, desc: "Trending typing stories" },
            { title: "OS Changelog", url: "/whats-new", icon: History, desc: "Version 2.0 updates" },
            { title: "Typing Blog", url: "/blog", icon: Library, desc: "Deep dive articles" },
            { title: "Writer Labs", url: "/blog-comments", icon: Users, desc: "Community discussions" },
        ]
    },
    {
        id: "games",
        label: "Gaming Zone",
        icon: Gamepad2,
        subOptions: [
            { title: "Word Crush", url: "/word-crush", icon: Star, desc: "Arcade puzzle typing" },
            { title: "Speed Typing", url: "/speed-typing", icon: Zap, desc: "Pure WPM challenge" },
            { title: "Space Race", url: "/multiplayer-race", icon: Rocket, desc: "Competitive global racing" },
            { title: "Type Duel", url: "/multiplayer-race", icon: Swords, desc: "1v1 arena battles" },
            { title: "Type Dungeon", url: "/dungeon", icon: Swords, desc: "Level-up through typing combat" },
            { title: "Typing Invaders", url: "/games", icon: Gamepad2, desc: "Retro arcade arcade" },
        ]
    },
    {
        id: "ai",
        label: "AI Academy",
        icon: Bot,
        subOptions: [
            { title: "Neural Lab", url: "/ai-academy", icon: Activity, desc: "Gesture & neural training" },
            { title: "AI Coach", url: "/ai-coach", icon: Bot, desc: "Smart training analysis" },
            { title: "Skill Flow", url: "/skill-progression", icon: Activity, desc: "Visual growth mapping" },
            { title: "Performance AI", url: "/statistics", icon: BarChart3, desc: "Deep neural insights" },
        ]
    },
    {
        id: "downloads",
        label: "Download",
        icon: Rocket,
        subOptions: [
            { title: "Download App", url: "/download", icon: Monitor, desc: "Desktop & Mobile Installers" },
            { title: "Font Resources", url: "/download", icon: Type, desc: "Hindi & Regional Fonts" },
        ]
    },
    {
        id: "careers",
        label: "Careers",
        icon: Briefcase,
        subOptions: [
            { title: "Explore Roles", url: "/jobs", icon: Search, desc: "Find your next mission" },
            { title: "Life at TypingOS", url: "/jobs", icon: Heart, desc: "Culture & Perks" },
        ]
    },
    {
        id: "system",
        label: "System Terminal",
        icon: Settings,
        subOptions: [
            { title: "Analytics", url: "/statistics", icon: BarChart3, desc: "Deep performance insights" },
            { title: "Achievements", url: "/achievements", icon: Trophy, desc: "Your milestone history" },
            { title: "OS Settings", url: "/settings", icon: Settings, desc: "Core configuration" },
            { title: "AI Model Config", url: "#ai-settings", icon: Settings2, desc: "Configure API Keys" },
            { title: "Diagnostics", url: "/statistics", icon: Activity, desc: "System health check" },
        ]
    },
    {
        id: "creative",
        label: "Creative Suite",
        icon: Sparkles,
        subOptions: [
            { title: "Type Writer", icon: FileText, desc: "Minimalist distraction-free writer", url: "/zen" },
            { title: "Quote Forge", icon: Quote, desc: "Generate AI typing quotes", url: "/ai-coach" },
            { title: "Code Lab", icon: Hash, desc: "Developer-focused typing drills", url: "/number-symbol-practice" },
            { title: "Story Mode", icon: BookOpen, desc: "Type interactive narratives", url: "/book-library" },
        ]
    },
    {
        id: "workspaces",
        label: "OS Workspaces",
        icon: Building2,
        subOptions: [
            { title: "Switch Identity", url: "/mode-selection", icon: Sparkles, desc: "Theme & Layout switch" },
            { title: "School Center", url: "/school-dashboard", icon: GraduationCap, desc: "Educational admin tools" },
            { title: "Business Hub", url: "/business-dashboard", icon: Building2, desc: "Collaborative performance" },
            { title: "Family Mode", url: "/home-dashboard", icon: Home, desc: "Safety & progress tracking" },
        ]
    }
];

export const themeOptions = [
    { name: "Default", value: "dark", color: "#EAB308", premium: false },
    { name: "Midnight", value: "midnight", color: "#A855F7", premium: true },
    { name: "Cyberpunk", value: "cyberpunk", color: "#FF00FF", premium: true },
    { name: "Rose Gold", value: "rose", color: "#FDA4AF", premium: true },
    { name: "Forest", value: "forest", color: "#22C55E", premium: false },
    { name: "Ocean", value: "ocean", color: "#0EA5E9", premium: false },
    { name: "Nova", value: "nova", color: "#F97316", premium: true },
    { name: "Earth", value: "earth", color: "#C2410C", premium: false },
];
