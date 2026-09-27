import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification, SeasonReward } from '@/contexts/GamificationContext';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Lock, CheckCircle2, Gift, Sparkles,
    Crown, Zap, Coins, Trophy, Star,
    ArrowRight, Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import Confetti from 'react-confetti';

const SEASON_REWARDS: SeasonReward[] = [
    { level: 1, title: "Starter Coins", type: 'coins', value: 100, isPremium: false },
    { level: 2, title: "XP Boost (1hr)", type: 'xp', value: 1.5, isPremium: true },
    { level: 3, title: "Basic Keycap", type: 'item', value: 'keycap_plastic', isPremium: false },
    { level: 4, title: "Bonus Coins", type: 'coins', value: 200, isPremium: false },
    { level: 5, title: "Season Badge", type: 'badge', value: 'S20_ROOKIE', isPremium: true },
    { level: 10, title: "Mega Coins", type: 'coins', value: 1000, isPremium: false },
    { level: 25, title: "Elite Theme", type: 'item', value: 'theme_nebula', isPremium: true },
    { level: 50, title: "Apex Legend Badge", type: 'badge', value: 'S20_APEX', isPremium: true },
];

export default function SeasonPass() {
    const { userStats, addCoins, buyPremiumPass, claimSeasonReward } = useGamification();
    const [showConfetti, setShowConfetti] = useState(false);

    const currentXPProgess = userStats.seasonXP % 1000;
    const progressPercent = (currentXPProgess / 1000) * 100;

    const handleClaim = (reward: SeasonReward) => {
        if (reward.level > userStats.seasonLevel) {
            toast.error("Level too low", { description: `Reach level ${reward.level} to unlock.` });
            return;
        }
        if (reward.isPremium && !userStats.isPremiumPass) {
            toast.error("Premium Reward", { description: "Upgrade to the Premium Pass to claim this." });
            return;
        }
        if (userStats.unlockedSeasonRewards.includes(reward.level)) {
            toast.info("Already claimed");
            return;
        }

        claimSeasonReward(reward.level);
        if (reward.type === 'coins') addCoins(reward.value);

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success(`Claimed: ${reward.title}!`);
    };

    return (
        <div className="min-h-screen bg-background p-8 pt-20">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} gravity={0.3} />}

            <div className="max-w-6xl mx-auto space-y-12">
                {/* HERO HEADER */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-12 border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Crown size={240} className="text-white" />
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 uppercase font-black tracking-widest text-xs">
                                Season 20: Global Conquest
                            </Badge>
                            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                                Neon <span className="text-primary italic">Pass</span>
                            </h1>
                            <p className="text-purple-200/70 text-lg max-w-md">
                                Climb the ranks, dominate the sector, and unlock legendary cosmetics. Your conquest starts now.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                {!userStats.isPremiumPass ? (
                                    <Button
                                        onClick={buyPremiumPass}
                                        className="h-16 px-8 bg-primary hover:bg-primary/90 text-background font-black rounded-2xl text-lg uppercase tracking-wider shadow-lg shadow-primary/20"
                                    >
                                        Upgrade to Premium <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                ) : (
                                    <Badge className="h-16 px-8 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black rounded-2xl text-lg uppercase tracking-wider flex items-center gap-2 border-0 shadow-xl">
                                        <Crown className="w-6 h-6" /> Premium Active
                                    </Badge>
                                )}
                                <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/10 bg-white/5 text-white font-black uppercase text-sm hover:bg-white/10">
                                    <Info className="mr-2 w-5 h-5" /> Season Rules
                                </Button>
                            </div>
                        </div>

                        {/* PROGRESS CARD */}
                        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase text-purple-300/50 tracking-widest">Global Rank</div>
                                        <div className="text-4xl font-black text-white">Level {userStats.seasonLevel}</div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[10px] font-black uppercase text-purple-300/50 tracking-widest">Season XP</div>
                                        <div className="text-xl font-bold text-primary">{userStats.seasonXP.toLocaleString()} XP</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                                        <span>Current Tier</span>
                                        <span>{1000 - currentXPProgess} XP to Level {userStats.seasonLevel + 1}</span>
                                    </div>
                                    <Progress value={progressPercent} className="h-4 bg-white/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-primary/20 text-primary">
                                            <Trophy size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-white">#1,240</div>
                                            <div className="text-[9px] font-bold text-white/40 uppercase">Global Ranking</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-green-500/20 text-green-500">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-white">+15% Boost</div>
                                            <div className="text-[9px] font-bold text-white/40 uppercase">Active Buffs</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* REWARD TRACK */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary text-background">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Reward Track</h2>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-white/20" />
                                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Free</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Premium</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const lv = i + 1;
                            const reward = SEASON_REWARDS.find(r => r.level === lv);
                            const isUnlocked = lv <= userStats.seasonLevel;
                            const isClaimed = userStats.unlockedSeasonRewards.includes(lv);
                            const isLockedPremium = reward?.isPremium && !userStats.isPremiumPass;

                            return (
                                <motion.div
                                    key={lv}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                        "group relative flex flex-col items-center gap-4 p-6 rounded-[2rem] border transition-all cursor-pointer",
                                        isUnlocked ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-50 grayscale",
                                        reward?.isPremium && "border-primary/30 ring-1 ring-primary/10"
                                    )}
                                    onClick={() => reward && handleClaim(reward)}
                                >
                                    {/* Level Badge */}
                                    <div className={cn(
                                        "absolute -top-3 left-1/2 -translate-x-1/2 h-8 w-12 rounded-lg flex items-center justify-center font-black text-xs border border-white/10 shadow-lg",
                                        isUnlocked ? "bg-primary text-background" : "bg-muted text-muted-foreground"
                                    )}>
                                        LV {lv}
                                    </div>

                                    {/* Reward Content */}
                                    <div className="mt-4 flex flex-col items-center text-center gap-4">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center relative",
                                            reward?.isPremium ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                                        )}>
                                            {reward ? (
                                                <>
                                                    {reward.type === 'coins' && <Coins size={32} />}
                                                    {reward.type === 'xp' && <Zap size={32} />}
                                                    {reward.type === 'item' && <Gift size={32} />}
                                                    {reward.type === 'badge' && <Trophy size={32} />}
                                                </>
                                            ) : (
                                                <Lock size={24} className="opacity-20" />
                                            )}

                                            {isClaimed && (
                                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-4 border-background shadow-xl">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black uppercase tracking-tight text-white leading-tight">
                                                {reward?.title || "Classified"}
                                            </div>
                                            <div className="flex items-center justify-center gap-1">
                                                {reward?.isPremium && <Crown size={10} className="text-primary" />}
                                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                                                    {reward?.isPremium ? "Premium" : "Free"}
                                                </span>
                                            </div>
                                        </div>

                                        {!isClaimed && isUnlocked && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest",
                                                    reward?.isPremium ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-white/10 text-white hover:bg-white/20"
                                                )}
                                                disabled={isLockedPremium}
                                            >
                                                {isLockedPremium ? "Locked" : "Claim"}
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
