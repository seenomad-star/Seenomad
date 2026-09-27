import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Swords, Zap, Timer } from 'lucide-react';
import { cn } from "@/utils/utils";

interface MatchProps {
    p1: string;
    p2: string;
    winner?: string | null;
    isUserMatch?: boolean;
    score?: string;
    status?: 'scheduled' | 'live' | 'finished';
}

const BracketMatch = ({ p1, p2, winner, isUserMatch, score, status = 'finished' }: MatchProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className={cn(
            "relative group flex flex-col w-56 p-4 rounded-2xl border transition-all duration-300",
            isUserMatch ? "bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(234,179,8,0.1)]" : "bg-white/[0.02] border-white/5 hover:border-white/10"
        )}
    >
        {status === 'live' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-500 rounded-full flex items-center gap-2 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[8px] font-black uppercase text-white tracking-widest">Live Match</span>
            </div>
        )}

        <div className="space-y-2 relative z-10">
            <div className={cn(
                "flex justify-between items-center p-2 rounded-xl transition-all",
                winner === p1 ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-black/20",
                (winner && winner !== p1) && "opacity-40 grayscale"
            )}>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                        <span className="text-[10px] font-black">{p1[0]}</span>
                    </div>
                    <span className="text-[11px] font-black uppercase truncate max-w-[100px]">{p1}</span>
                </div>
                {winner === p1 && <Crown className="w-3 h-3 text-primary" />}
            </div>

            <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[8px] font-black uppercase text-muted-foreground italic">VS</span>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className={cn(
                "flex justify-between items-center p-2 rounded-xl transition-all",
                winner === p2 ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-black/20",
                (winner && winner !== p2) && "opacity-40 grayscale"
            )}>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
                        <span className="text-[10px] font-black">{p2[0]}</span>
                    </div>
                    <span className="text-[11px] font-black uppercase truncate max-w-[100px]">{p2}</span>
                </div>
                {winner === p2 && <Crown className="w-3 h-3 text-primary" />}
            </div>
        </div>

        {score && (
            <div className="mt-3 text-center">
                <span className="text-[9px] font-black font-mono text-muted-foreground tracking-widest">{score}</span>
            </div>
        )}
    </motion.div>
);

const Connector = ({ type }: { type: 'split' | 'merge' }) => (
    <div className="w-16 flex items-center justify-center relative">
        <svg width="64" height="100%" viewBox="0 0 64 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-full w-full">
            {type === 'merge' ? (
                <path d="M0 40H32V120H0M32 80H64" stroke="currentColor" strokeWidth="2" className="text-white/10" strokeLinecap="round" />
            ) : (
                <path d="M64 40H32V120H64M32 80H0" stroke="currentColor" strokeWidth="2" className="text-white/10" strokeLinecap="round" />
            )}
        </svg>
    </div>
);

export const TournamentBracket = ({ status }: { status: 'registered' | 'quarter' | 'semi' | 'final' | 'won' }) => {
    return (
        <div className="relative pt-16 pb-8 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center gap-0 min-w-[max-content] mx-auto">

                {/* Quarter Finals */}
                <div className="flex flex-col gap-16">
                    <div className="text-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Quarter Finals</span>
                    </div>
                    <BracketMatch p1="You" p2="Bot_Alpha" score="120 - 95" winner={status !== 'registered' ? "You" : undefined} isUserMatch />
                    <BracketMatch p1="SpeedDemon" p2="TypistX" score="138 - 142" winner="TypistX" />
                    <BracketMatch p1="KeyMaster" p2="ProTyper" score="115 - 112" winner="KeyMaster" />
                    <BracketMatch p1="NeonUser" p2="CyberBot" score="98 - 85" winner="NeonUser" />
                </div>

                <div className="flex flex-col gap-[144px] mt-12">
                    <Connector type="merge" />
                    <Connector type="merge" />
                </div>

                {/* Semi Finals */}
                <div className="flex flex-col gap-40 mt-12">
                    <div className="text-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Semi Finals</span>
                    </div>
                    <BracketMatch
                        p1="You" p2="TypistX"
                        score={['semi', 'final', 'won'].includes(status) ? "125 - 110" : "Upcoming"}
                        winner={['semi', 'final', 'won'].includes(status) ? "You" : undefined}
                        status={status === 'quarter' ? 'live' : 'finished'}
                        isUserMatch
                    />
                    <BracketMatch
                        p1="KeyMaster" p2="NeonUser"
                        score={['semi', 'final', 'won'].includes(status) ? "122 - 118" : "Upcoming"}
                        winner={['semi', 'final', 'won'].includes(status) ? "KeyMaster" : undefined}
                    />
                </div>

                <div className="flex flex-col gap-0 mt-[100px]">
                    <Connector type="merge" />
                </div>

                {/* Finals */}
                <div className="flex flex-col gap-8 mt-12 relative">
                    <div className="text-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Grand Finals</span>
                    </div>

                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <Trophy className={cn(
                            "w-12 h-12 transition-all duration-1000",
                            status === 'won' ? "text-amber-500 scale-125 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "text-white/10"
                        )} />
                    </div>

                    <BracketMatch
                        p1="You" p2="KeyMaster"
                        score={status === 'won' ? "142 - 138" : status === 'final' ? "Upcoming" : "TBD"}
                        winner={status === 'won' ? "You" : undefined}
                        status={status === 'final' ? 'live' : ['quarter', 'semi', 'registered'].includes(status) ? 'scheduled' : 'finished'}
                        isUserMatch
                    />
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-64 bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        </div>
    );
};
