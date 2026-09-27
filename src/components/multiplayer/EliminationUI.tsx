import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, AlertTriangle, Trophy } from "lucide-react";
import { cn } from "@/utils/utils";

interface EliminationUIProps {
    timer: number;
    isEliminated: boolean;
    cycle: number;
    totalPlayers: number;
    activePlayers: number;
    isWinner: boolean;
}

export const EliminationUI: React.FC<EliminationUIProps> = ({
    timer,
    isEliminated,
    cycle,
    totalPlayers,
    activePlayers,
    isWinner
}) => {
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
            <AnimatePresence mode="wait">
                {isWinner ? (
                    <motion.div
                        key="winner"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-yellow-500/90 backdrop-blur-md text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-2 border-4 border-yellow-300"
                    >
                        <Trophy className="w-12 h-12 animate-bounce" />
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Champion!</h2>
                        <p className="font-medium">You survived the Battle Royale</p>
                    </motion.div>
                ) : isEliminated ? (
                    <motion.div
                        key="eliminated"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-destructive/90 backdrop-blur-md text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-2 border-4 border-destructive/50"
                    >
                        <Skull className="w-12 h-12" />
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Eliminated</h2>
                        <p className="font-medium">Better luck next time!</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        {/* Timer Orb */}
                        <div className={cn(
                            "relative w-20 h-20 rounded-full flex items-center justify-center border-4 backdrop-blur-sm transition-colors duration-500",
                            timer <= 5 ? "bg-destructive/20 border-destructive animate-pulse" : "bg-primary/20 border-primary"
                        )}>
                            <div className="text-3xl font-black">{timer}</div>
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    className={cn(
                                        "fill-none stroke-[4px] transition-all duration-1000",
                                        timer <= 5 ? "stroke-destructive" : "stroke-primary"
                                    )}
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * timer) / 15}
                                />
                            </svg>
                        </div>

                        {/* Status Bar */}
                        <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-4 text-white">
                            <div className="flex items-center gap-2">
                                <Skull className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-bold">{activePlayers}/{totalPlayers}</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={cn("w-4 h-4", timer <= 5 ? "text-destructive" : "text-yellow-500")} />
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {timer <= 5 ? "Danger!" : `Wave ${cycle + 1}`}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
