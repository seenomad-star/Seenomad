import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomy } from '@/contexts/EconomyContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trophy, Medal, Users, Shield,
    TrendingUp, Globe, Crown,
    ArrowUpRight, ArrowDownRight, Minus,
    Star, Target, Zap
} from "lucide-react";
import { cn } from "@/utils/utils";

const CLAN_RANKINGS = [
    { id: 'c1', name: 'Neon Strikers', tag: 'NEON', level: 42, xp: 250000, trend: 'up', members: 48, logo: '⚡', color: 'text-primary' },
    { id: 'c3', name: 'Ether Kings', tag: 'ETH', level: 38, xp: 210000, trend: 'stable', members: 50, logo: '💎', color: 'text-blue-400' },
    { id: 'c2', name: 'Void Walkers', tag: 'VOID', level: 32, xp: 180000, trend: 'up', members: 42, logo: '🌀', color: 'text-purple-400' },
    { id: 'c4', name: 'Keyboard Warriors', tag: 'KBW', level: 25, xp: 120000, trend: 'down', members: 32, logo: '⚔️', color: 'text-rose-400' },
    { id: 'c5', name: 'Data Drifters', tag: 'DATA', level: 18, xp: 72000, trend: 'up', members: 25, logo: '🌊', color: 'text-emerald-400' },
];

const PLAYER_RANKINGS = [
    { id: 'p1', username: 'SpeedDemon', level: 45, wpm: 142, accuracy: 99.8, trend: 'up', country: 'US' },
    { id: 'p2', username: 'GhostWriter', level: 42, wpm: 138, accuracy: 99.5, trend: 'stable', country: 'UK' },
    { id: 'p3', username: 'NeonKnight', level: 38, wpm: 135, accuracy: 98.2, trend: 'up', country: 'JP' },
    { id: 'p4', username: 'BinaryBard', level: 35, wpm: 128, accuracy: 97.4, trend: 'down', country: 'CA' },
    { id: 'p5', username: 'Matrix_Fan', level: 31, wpm: 125, accuracy: 98.1, trend: 'up', country: 'DE' },
];

export default function GlobalLeaderboards() {
    const { stats } = useEconomy();
    const [activeTab, setActiveTab] = useState("clans");

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-12">
            {/* Massive Header Section */}
            <div className="relative">
                <div className="absolute -top-24 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col md:flex-row items-end justify-between gap-8 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <div className="h-px w-12 bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Global Ranking Authority</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
                            World <span className="text-primary">Conquest</span>
                        </h1>

                        <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed">
                            Behold the most elite typists and clans. Every keystroke is tracked. Every mistake is remembered. Only the fastest survive the climb.
                        </p>
                    </div>

                    <div className="flex gap-4 p-4 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl">
                        <div className="px-8 py-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center">
                            <span className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Season 20 Progress</span>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-black italic">68%</span>
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[68%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="clans" onValueChange={setActiveTab} className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-2">
                    <TabsList className="bg-transparent h-auto p-0 gap-10">
                        {[
                            { id: "clans", label: "Top Citadels", icon: Shield },
                            { id: "players", label: "Global MVPs", icon: Users },
                            { id: "hall", label: "Pantheon", icon: Crown },
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={cn(
                                    "relative bg-transparent border-0 p-0 text-xs font-black uppercase tracking-[0.2em] transition-all h-14",
                                    "data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none",
                                    "after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-primary after:transition-all hover:text-white/80",
                                    "data-[state=active]:after:w-full"
                                )}
                            >
                                <tab.icon className="w-4 h-4 mr-3" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global WPM: <span className="text-white">74.2</span></span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updated: <span className="text-white">Just Now</span></div>
                    </div>
                </div>

                <TabsContent value="clans" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {CLAN_RANKINGS.map((clan, i) => (
                            <motion.div
                                key={clan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "group relative grid grid-cols-12 items-center p-8 rounded-[2rem] border transition-all hover:scale-[1.02] cursor-pointer",
                                    i === 0 ? "bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-primary/40 shadow-2xl shadow-primary/10" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="col-span-1">
                                    <div className={cn(
                                        "text-4xl font-black italic",
                                        i === 0 ? "text-primary" : "text-white/10 group-hover:text-white/20"
                                    )}>
                                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                    </div>
                                </div>

                                <div className="col-span-5 flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {clan.logo}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{clan.name}</h3>
                                            <Badge variant="outline" className="font-mono text-[10px] border-white/20 text-muted-foreground">[{clan.tag}]</Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Users className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase">{clan.members} Members</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <Zap className="w-3 h-3" />
                                                <span className="text-[10px] font-black uppercase">Battle Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 text-center">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Citadel Level</div>
                                    <div className="text-2xl font-black">LV {clan.level}</div>
                                </div>

                                <div className="col-span-2 text-center">
                                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Global Trend</div>
                                    <div className="flex items-center justify-center gap-2">
                                        {clan.trend === 'up' ? <ArrowUpRight className="text-emerald-500 w-5 h-5" /> : clan.trend === 'down' ? <ArrowDownRight className="text-rose-500 w-5 h-5" /> : <Minus className="text-blue-500 w-5 h-5" />}
                                        <span className={cn(
                                            "text-xs font-black uppercase",
                                            clan.trend === 'up' ? "text-emerald-500" : clan.trend === 'down' ? "text-rose-500" : "text-blue-500"
                                        )}>
                                            {clan.trend}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-2 text-right">
                                    <div className="text-4xl font-black tracking-tighter text-primary">{(clan.xp / 1000).toFixed(1)}K</div>
                                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total XP</div>
                                </div>

                                {i === 0 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 bg-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-background">
                                        Current Hegemon
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="players" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PLAYER_RANKINGS.map((player, i) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="relative p-8 bg-white/[0.02] border-white/5 hover:border-primary/30 transition-all rounded-[2.5rem] overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Trophy className="w-32 h-32" />
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-500">
                                                <div className="w-full h-full rounded-full bg-muted border-4 border-background overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`} alt="avatar" />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary flex items-center justify-center font-black text-background border-4 border-background italic">
                                                #{i + 1}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">{player.username}</h3>
                                            <div className="flex items-center justify-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[9px] uppercase font-black tracking-widest">{player.country}</Badge>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Level {player.level}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 w-full gap-4 pt-4 border-t border-white/5">
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Avg WPM</div>
                                                <div className="text-2xl font-black text-primary italic">{player.wpm}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Accuracy</div>
                                                <div className="text-2xl font-black text-blue-400 italic">{player.accuracy}%</div>
                                            </div>
                                        </div>

                                        <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20">
                                            View Performance
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="hall" className="mt-0">
                    <Card className="p-16 text-center bg-gradient-to-b from-white/[0.05] to-transparent border-dashed border-white/10 rounded-[3rem] space-y-6">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 mx-auto flex items-center justify-center mb-4">
                            <Crown className="w-12 h-12 text-primary opacity-20" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Pantheon</h2>
                        <p className="max-w-md mx-auto text-muted-foreground text-lg leading-relaxed font-medium">
                            Only the victors of the Grand Finals are archived here. Reach the top of the Season MVP list to be immortalized.
                        </p>
                        <div className="pt-8">
                            <Button variant="outline" className="h-12 px-10 rounded-2xl border-primary/20 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/10">
                                View Season 19 Archive
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
