import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Hammer,
    Search,
    Sparkles,
    TrendingUp,
    Users,
    Play,
    Plus,
    ShieldCheck,
    Clock,
    Trophy,
    Gamepad2,
    Coins,
    BarChart3,
    ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

interface CustomMission {
    id: string;
    title: string;
    description: string;
    creator: string;
    creatorAvatar: string;
    plays: number;
    rating: number;
    wpmAvg: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    category: string;
    royaltyEarned: number;
    isVerified: boolean;
    tag: string;
}

const MOCK_MISSIONS: CustomMission[] = [
    {
        id: "m1",
        title: "Cyberpunk Terminal Hacks",
        description: "High-speed ASCII and hex-code based typing mission. Feel like a netrunner.",
        creator: "Neo_T",
        creatorAvatar: "NT",
        plays: 12405,
        rating: 4.9,
        wpmAvg: 92,
        difficulty: 'Hard',
        category: 'Code',
        royaltyEarned: 2500,
        isVerified: true,
        tag: 'Trending'
    },
    {
        id: "m2",
        title: "Shakespearean Flow",
        description: "Classic literature meets modern speed. Master the art of iambic pentameter.",
        creator: "Bard_00",
        creatorAvatar: "BO",
        plays: 8500,
        rating: 4.7,
        wpmAvg: 65,
        difficulty: 'Medium',
        category: 'Literature',
        royaltyEarned: 1200,
        isVerified: false,
        tag: 'Popular'
    },
    {
        id: "m3",
        title: "Legal Stenograph Test",
        description: "Simulated courtroom environment. High stakes, zero error tolerance.",
        creator: "The_Judge",
        creatorAvatar: "TJ",
        plays: 4200,
        rating: 4.8,
        wpmAvg: 110,
        difficulty: 'Extreme',
        category: 'Professional',
        royaltyEarned: 3100,
        isVerified: true,
        tag: 'Pro Tier'
    }
];

export default function MissionMarketplace() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userStats, customMissions } = useGamification();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Merge Mock & Custom Missions
    const allMissions = [
        ...MOCK_MISSIONS,
        ...customMissions.filter(m => m.isPublished).map(m => ({
            ...m,
            creatorAvatar: m.creator.substring(0, 2).toUpperCase(),
            tag: "Community",
            wpmAvg: 0, // Default for new
            royaltyEarned: m.royaltyEarned || 0,
            plays: m.plays || 0,
            rating: m.rating || 0
        }))
    ];

    const filteredMissions = allMissions.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.creator.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" ||
            (activeTab === "verified" && m.isVerified) ||
            (activeTab === "trending" && (m.plays > 1000 || m.tag === "Trending")) ||
            (activeTab === "mine" && m.creator === "You"); // Simplified check
        return matchesSearch && matchesTab;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 selection:bg-primary/20">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-12"
            >
                {/* HERO SECTION - "THE FORGE" */}
                <div className="relative rounded-[3rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-white/5 p-12 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                        <Hammer className="w-64 h-64 text-primary" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/20 text-primary border-primary/20 px-3 py-1 font-black uppercase tracking-widest text-[10px]">Ecosystem Hub</Badge>
                            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Version 1.1 Live</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                                The <span className="text-primary underline decoration-wavy decoration-primary/30 underline-offset-8">Forge</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                                Create your own typing missions, share them with the world, and earn real royalty coins from every fellow typist's play.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button onClick={() => navigate("/forge/create")} size="lg" className="rounded-2xl px-8 h-14 bg-primary text-background font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 gap-3">
                                <Plus className="w-5 h-5" /> Start Minting
                            </Button>
                            <div className="flex items-center gap-6 px-8 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="text-center">
                                    <span className="block text-2xl font-black">{allMissions.reduce((acc, m) => acc + m.plays, 0).toLocaleString()}</span>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Plays</span>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <span className="block text-2xl font-black">{allMissions.length}</span>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Missions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTERS */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="SEARCH MISSIONS, CREATORS, OR TAGS..."
                            className="h-16 pl-14 pr-6 rounded-2xl bg-white/[0.03] border-white/5 text-lg font-medium focus:ring-primary/20 transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white/5 p-1 rounded-2xl border border-white/5 h-16 flex items-center">
                        <TabsList className="bg-transparent h-full">
                            <TabsTrigger value="all" className="rounded-xl px-6 h-full font-black uppercase tracking-widest text-[10px]">All Forge</TabsTrigger>
                            <TabsTrigger value="trending" className="rounded-xl px-6 h-full font-black uppercase tracking-widest text-[10px]">Trending</TabsTrigger>
                            <TabsTrigger value="verified" className="rounded-xl px-6 h-full font-black uppercase tracking-widest text-[10px]">Verified</TabsTrigger>
                            <TabsTrigger value="mine" className="rounded-xl px-6 h-full font-black uppercase tracking-widest text-[10px]">My Analytics</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* MISSION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
                    <AnimatePresence>
                        {filteredMissions.map((mission) => (
                            <motion.div key={mission.id} variants={item} layout>
                                <Card className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 cursor-pointer">
                                    {/* Badge Overlay */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                                        <Badge className={cn(
                                            "font-black uppercase tracking-widest text-[8px] px-2 py-1 border-none",
                                            mission.difficulty === 'Extreme' ? 'bg-rose-500 text-white' :
                                                mission.difficulty === 'Hard' ? 'bg-amber-500 text-black' : 'bg-primary text-background'
                                        )}>
                                            {mission.difficulty}
                                        </Badge>
                                        {mission.tag && (
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-black/60 border-white/10">{mission.tag}</Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                                                    {mission.creatorAvatar}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{mission.creator}</span>
                                                {mission.isVerified && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                                            </div>
                                            <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{mission.title}</h3>
                                            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2">{mission.description}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                                            <div className="text-center">
                                                <span className="block text-lg font-black">{mission.plays >= 1000 ? `${(mission.plays / 1000).toFixed(1)}k` : mission.plays}</span>
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Plays</span>
                                            </div>
                                            <div className="text-center border-x border-white/5">
                                                <span className="block text-lg font-black text-primary">{mission.wpmAvg || "-"}</span>
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Avg WPM</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-lg font-black text-amber-500">★ {mission.rating || "-"}</span>
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Rating</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Royalty Pool</span>
                                                <div className="flex items-center gap-1">
                                                    <Coins className="w-4 h-4 text-amber-500" />
                                                    <span className="text-sm font-black text-amber-500">{mission.royaltyEarned?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => navigate(`/forge/play/${mission.id}`)}
                                                className="rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-background transition-all"
                                            >
                                                Launch Mission <Play className="w-3 h-3 ml-2 fill-current" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* BOTTOM CTA - BECOME A CREATOR */}
                <div className="text-center py-24 relative">
                    <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full overflow-hidden" />
                    <motion.div variants={item} className="relative space-y-8 max-w-2xl mx-auto">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-purple-600 mx-auto flex items-center justify-center shadow-2xl shadow-primary/40">
                            <Trophy className="w-10 h-10 text-background" />
                        </div>
                        <h3 className="text-4xl font-black tracking-tight uppercase italic leading-none">Become a <span className="text-primary">Master Architect</span></h3>
                        <p className="text-muted-foreground font-medium text-lg italic">
                            Top creators in The Forge earn over **50,000 Coins** monthly. Influence the flow of TypingOS.
                        </p>
                        <Button onClick={() => navigate("/forge/create")} size="lg" variant="outline" className="rounded-2xl border-white/10 hover:border-primary/50 px-12 h-16 font-black uppercase tracking-widest text-xs gap-3">
                            <ArrowUpRight className="w-5 h-5" /> Open Creator Dashboard
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
