import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Sparkles, Coins, Zap, CheckCircle2, Lock } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

const REWARDS = [
    { day: 1, type: "coins", amount: 10, bonus: "Basic" },
    { day: 2, type: "coins", amount: 25, bonus: "Daily" },
    { day: 3, type: "coins", amount: 50, bonus: "Spark" },
    { day: 4, type: "xp", amount: 100, bonus: "Experience" },
    { day: 5, type: "coins", amount: 100, bonus: "Mega" },
    { day: 6, type: "coins", amount: 250, bonus: "Ultra" },
    { day: 7, type: "premium", amount: 1, bonus: "Legendary" },
];

export const DailyRewardModal: React.FC = () => {
    const { userStats, addCoins, addXP, updateStreak } = useGamification();
    const [isOpen, setIsOpen] = useState(false);
    const [claimedToday, setClaimedToday] = useState(false);

    useEffect(() => {
        const lastClaimDate = localStorage.getItem("last-daily-claim-date");
        const today = new Date().toDateString();

        if (lastClaimDate !== today) {
            setIsOpen(true);
            setClaimedToday(false);
        } else {
            setClaimedToday(true);
        }
    }, []);

    const handleClaim = () => {
        const today = new Date().toDateString();
        const currentDay = (userStats.streak % 7) || 7;
        const reward = REWARDS.find(r => r.day === currentDay);

        if (reward) {
            if (reward.type === "coins") {
                addCoins(reward.amount);
            } else if (reward.type === "xp") {
                addXP(reward.amount);
            }

            localStorage.setItem("last-daily-claim-date", today);
            setClaimedToday(true);
            toast.success(`Claimed Day ${currentDay} Reward!`, {
                description: `You received ${reward.amount} ${reward.type === 'coins' ? 'coins' : 'XP'}.`,
            });

            // Close after a short delay to allow the user to see the "Claimed" state
            setTimeout(() => setIsOpen(false), 1500);
        }
    };

    if (!isOpen) return null;

    const currentDay = ((userStats.streak) % 7) + 1;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
            <Card className="w-full max-w-2xl bg-[#1A1C1E]/95 border-white/10 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.8)] rounded-[2.5rem] overflow-hidden">
                <div className="relative p-8 md:p-12">
                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative text-center mb-10">
                        <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-6 animate-bounce">
                            <Gift className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Daily Login Bonus</h2>
                        <p className="text-muted-foreground font-medium">Keep your streak alive to unlock Legendary rewards!</p>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-10">
                        {REWARDS.map((reward) => {
                            const isToday = reward.day === currentDay;
                            const isPast = reward.day < currentDay;
                            const isFuture = reward.day > currentDay;

                            return (
                                <div
                                    key={reward.day}
                                    className={cn(
                                        "relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-500",
                                        isToday && "bg-primary/20 border-primary/40 scale-110 shadow-lg shadow-primary/20 z-10",
                                        isPast && "bg-emerald-500/5 border-emerald-500/20 grayscale-[0.5] opacity-60",
                                        isFuture && "bg-white/[0.02] border-white/5 opacity-40"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Day {reward.day}</span>
                                    <div className={cn(
                                        "p-2 rounded-xl mb-2",
                                        reward.type === "coins" ? "bg-amber-500/10 text-amber-500" :
                                            reward.type === "xp" ? "bg-blue-500/10 text-blue-500" : "bg-primary/20 text-primary"
                                    )}>
                                        {reward.type === "coins" ? <Coins className="w-5 h-5" /> :
                                            reward.type === "xp" ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                    </div>
                                    <span className="text-xs font-black tracking-tight">
                                        {reward.day === 7 ? "PRO" : `+${reward.amount}`}
                                    </span>

                                    {isPast && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] rounded-2xl">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        </div>
                                    )}

                                    {isToday && !claimedToday && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            disabled={claimedToday}
                            className={cn(
                                "h-16 w-full text-base font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500",
                                !claimedToday ? "bg-primary hover:bg-primary/90 text-background shadow-xl shadow-primary/20" : "bg-white/5 text-muted-foreground border border-white/5"
                            )}
                            onClick={handleClaim}
                        >
                            {claimedToday ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Already Claimed
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Claim Day {currentDay} Reward
                                </span>
                            )}
                        </Button>

                        {!claimedToday && (
                            <Button
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest"
                                onClick={() => setIsOpen(false)}
                            >
                                Remind me later
                            </Button>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.02] py-4 px-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Streak: {userStats.streak} Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-500/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Balance: {userStats.coins}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
