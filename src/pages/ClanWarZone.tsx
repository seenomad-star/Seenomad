import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Swords, Shield, Zap, Target, Flame,
    ArrowLeft, AlertTriangle, Coins, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Confetti from 'react-confetti';

export default function ClanWarZone() {
    const navigate = useNavigate();
    const { userStats, userClan, addCoins, addXP } = useGamification();

    const [dominance, setDominance] = useState(50); // 50% = equal
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [warTimeLeft, setWarTimeLeft] = useState(3600); // 1 hour in seconds
    const [isFighting, setIsFighting] = useState(false);
    const [showVictory, setShowVictory] = useState(false);

    // Simulated enemy pressure
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isFighting && dominance > 10) {
                setDominance(prev => prev - 0.1);
            }
            setWarTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [isFighting, dominance]);

    const handleAttack = () => {
        setIsFighting(true);
        // Simulate a typing battle
        toast.info("ENGAGING ENEMY...", { description: "Preparing battle sequence." });

        setTimeout(() => {
            setIsFighting(false);
            const luck = Math.random() * 15;
            setDominance(prev => Math.min(100, prev + luck));
            addXP(50);
            toast.success("STRIKE SUCCESSFUL!", { description: `Dominance increased by ${Math.round(luck)}%` });

            if (dominance + luck >= 100) {
                setShowVictory(true);
                addCoins(1000);
                toast.success("WAR WON!", { description: "Your clan has dominated the sector!" });
            }
        }, 3000);
    };

    const buyWarBond = () => {
        const BOND_COST = 200;
        if (userStats.coins < BOND_COST) {
            toast.error("Insufficient Funds");
            return;
        }

        addCoins(-BOND_COST);
        setDominance(prev => Math.min(100, prev + 5));
        toast.success("War Bond Redeemed", { description: "Reinforcements arrived! +5% Dominance." });
    };

    if (!userClan) {
        return (
            <div className="h-screen flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto" />
                    <h2 className="text-2xl font-black uppercase">Unauthorized Access</h2>
                    <p className="text-muted-foreground">You must be in a Clan to enter the War Zone.</p>
                    <Button onClick={() => navigate("/clans")}>Go to Clans</Button>
                </div>
            </div>
        );
    }

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 selection:bg-red-500/30 overflow-hidden relative">
            {showVictory && <Confetti recycle={false} numberOfPieces={1000} colors={['#ef4444', '#ffffff', '#000000']} />}

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent)] pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => navigate("/clans")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Citadel
                    </Button>
                    <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1">Time Remaining</div>
                        <div className="text-3xl font-mono font-black">{formatTime(warTimeLeft)}</div>
                    </div>
                </div>

                {/* THE TUG OF WAR */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="text-left">
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">{userClan.name}</h2>
                            <p className="text-xs font-bold text-red-500 uppercase">Defending Sector 7</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white/40">Dark Matter</h2>
                            <p className="text-xs font-bold text-white/20 uppercase">Aggressor</p>
                        </div>
                    </div>

                    <div className="relative h-24 bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center px-4">
                        {/* THE BAR */}
                        <motion.div
                            className="absolute h-full left-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 shadow-[0_0_50px_rgba(220,38,38,0.5)] z-0"
                            animate={{ width: `${dominance}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />

                        {/* MARKERS */}
                        <div className="absolute inset-0 flex items-center justify-between px-12 z-10 pointer-events-none">
                            <div className="bg-black/80 px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-2xl font-black">{Math.round(dominance)}%</span>
                            </div>
                            <SeparatorLine />
                            <div className="bg-black/80 px-4 py-2 rounded-xl border border-white/10 opacity-40">
                                <span className="text-2xl font-black">{Math.round(100 - dominance)}%</span>
                            </div>
                        </div>

                        {/* FLAME EFFECT AT THE CENTER POINT */}
                        <motion.div
                            className="absolute z-20"
                            animate={{ left: `${dominance}%` }}
                            style={{ transform: 'translateX(-50%)' }}
                        >
                            <Flame className="w-12 h-12 text-orange-500 animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
                        </motion.div>
                    </div>

                    {dominance < 30 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4 animate-bounce"
                        >
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <div>
                                <h4 className="font-black uppercase text-sm">CRITICAL MOMENT</h4>
                                <p className="text-[11px] text-red-400 font-bold">Dominance low. The Clan needs you! Attack now for 2x XP.</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* THE WAR ROOM DASHBOARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ACTION CENTER */}
                    <Card className="md:col-span-2 bg-white/[0.02] border-white/10 p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase italic tracking-tight">Strike Operations</h3>
                            <Badge className="bg-red-600 text-white border-none py-1 px-3">BATTLE ACTIVE</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                                <div className="p-3 bg-red-500/10 rounded-2xl w-fit">
                                    <Target className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2">Precision Strike</h4>
                                    <p className="text-[10px] text-muted-foreground">High accuracy boosts dominance.</p>
                                </div>
                                <Button
                                    onClick={handleAttack}
                                    disabled={isFighting}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest h-14 rounded-2xl shadow-xl shadow-red-600/20"
                                >
                                    {isFighting ? <Zap className="w-5 h-5 animate-spin" /> : "EXECUTE ATTACK"}
                                </Button>
                            </div>

                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                                    <TrendingUp className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2">Market Sabotage</h4>
                                    <p className="text-[10px] text-muted-foreground">Invest to weaken enemy lines.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={buyWarBond}
                                    className="w-full border-white/10 hover:bg-white/5 font-black uppercase tracking-widest h-14 rounded-2xl flex flex-col gap-0"
                                >
                                    <span>PURCHASE WAR BOND</span>
                                    <span className="text-[9px] text-amber-500">200 COINS</span>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* LATEST CASUALTIES / ACTIVITY */}
                    <Card className="bg-white/[0.02] border-white/10 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Intelligence Feed</h3>
                        </div>
                        <div className="flex-1 p-6 space-y-6">
                            {[
                                { user: "You", action: "executed Strike", val: "+8%" },
                                { user: "VaporType", action: "lost ground", val: "-3%", negative: true },
                                { user: "NeonBoi", action: "bought Bond", val: "+5%" },
                                { user: "Dark_Bot_4", action: "counter-attacked", val: "-12%", negative: true }
                            ].map((log, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{log.user}</span>
                                        <span className="text-[10px] text-muted-foreground lowercase">{log.action}</span>
                                    </div>
                                    <span className={cn("font-black italic", log.negative ? "text-red-500" : "text-emerald-500")}>
                                        {log.val}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-white/5">
                            <div className="text-[9px] font-black uppercase text-white/20 tracking-widest">
                                Status: Encryption Active
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const SeparatorLine = () => (
    <div className="h-full w-px bg-white/10 flex flex-col justify-between py-2">
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="w-1 h-1 bg-white/20 rounded-full" />
    </div>
);
