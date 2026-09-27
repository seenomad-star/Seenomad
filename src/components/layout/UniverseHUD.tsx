import React from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { useUniversePulse } from "@/contexts/UniversePulseContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Zap,
    Sparkles,
    Flame,
    Trophy,
    Crown,
    ShoppingCart,
    Activity,
    Users,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";

export const OSHUD: React.FC = () => {
    const { t } = useTranslation();
    const { userStats, getXPForNextLevel } = useGamification();
    const { events } = useUniversePulse();

    const currentXP = userStats.xp;
    const levelXPStart = Math.pow(userStats.level - 1, 2) * 100;
    const levelXPEnd = Math.pow(userStats.level, 2) * 100;
    const progress = ((currentXP - levelXPStart) / (levelXPEnd - levelXPStart)) * 100;

    return (
        <div className="fixed top-[114px] left-0 right-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b border-white/5 shadow-sm overflow-hidden flex flex-col">
            {/* MAIN HUD CONTENT */}
            <div className="max-w-7xl mx-auto w-full py-1.5 px-4 flex items-center justify-between gap-8 overflow-x-auto no-scrollbar">
                {/* Left Side: Level & XP */}
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative w-10 h-10 rounded-full bg-secondary border border-white/10 flex items-center justify-center font-black text-primary shadow-xl">
                            {userStats.level}
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-amber-500" />
                                {t('Level')} {userStats.level}
                            </span>
                            <span className="text-primary">{Math.floor(progress)}% {t('to Level')} {userStats.level + 1}</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-secondary/50" />
                    </div>
                </div>

                {/* Center: Daily Ritual Status */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-1 rounded-full bg-primary/5 border border-primary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                        {t('Daily Ritual')}: 0/5 {t('Lessons')}
                    </span>
                </div>

                {/* Right Side: Currency & Stats */}
                <div className="flex items-center gap-3">
                    <Link to="/marketplace">
                        <div className="flex items-center gap-2 bg-secondary/30 hover:bg-secondary/50 border border-white/5 px-3 py-1.5 rounded-full transition-all group active:scale-95 shadow-lg">
                            <Sparkles className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform" />
                            <span className="text-sm font-black text-yellow-500">{userStats.coins.toLocaleString()}</span>
                            <ShoppingCart className="w-3 h-3 text-muted-foreground/50 ml-1" />
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 bg-secondary/30 border border-white/5 px-3 py-1.5 rounded-full shadow-lg">
                        <Flame className={cn(
                            "w-4 h-4 transition-all",
                            userStats.streak > 0 ? "text-orange-500 animate-pulse fill-orange-500/20" : "text-muted-foreground/30"
                        )} />
                        <span className={cn(
                            "text-sm font-black",
                            userStats.streak > 0 ? "text-orange-500" : "text-muted-foreground/30"
                        )}>{userStats.streak}d</span>
                    </div>

                    {userStats.isPremium && (
                        <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] animate-shimmer text-white border-0 font-black shadow-lg">
                            <Crown className="w-3 h-3 mr-1" />
                            PRO
                        </Badge>
                    )}

                    {!userStats.isPremium && (
                        <Link to="/marketplace">
                            <Button size="sm" variant="outline" className="h-8 rounded-full border-primary/20 hover:bg-primary/5 text-primary text-xs gap-2 font-bold shadow-lg">
                                <Zap className="w-3 h-3 fill-primary" />
                                Get PRO
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* GLOBAL PULSE TICKER (Social Retention) */}
            <div className="w-full bg-primary/5 py-0.5 border-t border-white/5">
                <motion.div
                    animate={{ x: [0, -2000] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 items-center text-[8px] font-black uppercase tracking-widest text-muted-foreground/50"
                >
                    {events.map((event) => (
                        <div key={event.id} className="flex gap-12 items-center">
                            <span className="flex items-center gap-1">
                                {event.type === 'achievement' && <Trophy className="w-2.5 h-2.5 text-amber-500" />}
                                {event.type === 'social' && <Users className="w-2.5 h-2.5 text-blue-500" />}
                                {event.type === 'system' && <Activity className="w-2.5 h-2.5 text-green-500" />}
                                {event.message}
                            </span>
                        </div>
                    ))}
                    {/* Double for continuous scroll effect */}
                    {events.map((event) => (
                        <div key={`${event.id}-double`} className="flex gap-12 items-center">
                            <span className="flex items-center gap-1">
                                {event.type === 'achievement' && <Trophy className="w-2.5 h-2.5 text-amber-500" />}
                                {event.type === 'social' && <Users className="w-2.5 h-2.5 text-blue-500" />}
                                {event.type === 'system' && <Activity className="w-2.5 h-2.5 text-green-500" />}
                                {event.message}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
