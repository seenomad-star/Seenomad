import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    Timer,
    Users,
    Zap,
    Sword,
    Calendar,
    ChevronRight,
    Search,
    History,
    Crown,
    Medal
} from "lucide-react";
import { useEconomy } from "@/contexts/EconomyContext";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

interface Tournament {
    id: string;
    name: string;
    description: string;
    startTime: number;
    endTime: number;
    participants: number;
    maxParticipants: number;
    entryFee: number;
    prizePool: number;
    status: 'scheduled' | 'active' | 'completed';
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    type: 'Grand Prix' | 'Sprint' | 'Endurance';
}

const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: 't1',
        name: 'Neon Velocity Grand Prix',
        description: 'The fastest typists in the cyberpunk underworld compete for the ultimate crown.',
        startTime: Date.now() + 3600000, // In 1 hour
        endTime: Date.now() + 7200000,
        participants: 42,
        maxParticipants: 100,
        entryFee: 100,
        prizePool: 5000,
        status: 'scheduled',
        difficulty: 'Extreme',
        type: 'Grand Prix'
    },
    {
        id: 't2',
        name: 'Binary Bliss Sprint',
        description: 'Short, high-intensity typing bursts. Perfect for speed demons.',
        startTime: Date.now() + 600000, // In 10 mins
        endTime: Date.now() + 1800000,
        participants: 12,
        maxParticipants: 50,
        entryFee: 0,
        prizePool: 500,
        status: 'scheduled',
        difficulty: 'Medium',
        type: 'Sprint'
    }
];

export const TournamentSystem: React.FC = () => {
    const { wallet, spendCurrency } = useEconomy();
    const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);
    const [joinedTournaments, setJoinedTournaments] = useState<string[]>([]);

    const handleJoin = (tournament: Tournament) => {
        if (joinedTournaments.includes(tournament.id)) {
            toast.info("You're already registered for this event!");
            return;
        }

        if (tournament.entryFee > 0) {
            if (spendCurrency(tournament.entryFee, 'coins')) {
                setJoinedTournaments(prev => [...prev, tournament.id]);
                toast.success(`Registered for ${tournament.name}! Entry fee paid.`);
            } else {
                toast.error("Insufficient coins for entry fee!");
            }
        } else {
            setJoinedTournaments(prev => [...prev, tournament.id]);
            toast.success(`Registered for ${tournament.name}!`);
        }
    };

    const getTimeLeft = (startTime: number) => {
        const diff = startTime - Date.now();
        if (diff <= 0) return "Starting Now";

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        return `${mins}m ${secs}s`;
    };

    // Timer update effect
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-primary/5 border-primary/20 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-16 h-16" />
                    </div>
                    <div className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1">Registered Events</div>
                    <div className="text-4xl font-black">{joinedTournaments.length}</div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <Calendar className="w-3 h-3" /> Next starts in 1h 05m
                    </div>
                </Card>

                <Card className="p-6 bg-amber-500/5 border-amber-500/20 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Crown className="w-16 h-16" />
                    </div>
                    <div className="text-xs font-black text-amber-500/60 uppercase tracking-widest mb-1">Global Ranking</div>
                    <div className="text-4xl font-black">#842</div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <Medal className="w-3 h-3" /> Top 5% worldwide
                    </div>
                </Card>

                <Card className="p-6 bg-purple-500/5 border-purple-500/20 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-16 h-16" />
                    </div>
                    <div className="text-xs font-black text-purple-500/60 uppercase tracking-widest mb-1">Total Prize Won</div>
                    <div className="text-4xl font-black">12.5k <span className="text-xl text-muted-foreground">C</span></div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <History className="w-3 h-3" /> Last win: 2 days ago
                    </div>
                </Card>
            </div>

            {/* Tournament List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" /> Upcoming Tournaments
                    </h2>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">
                        View Schedule
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {tournaments.map((tournament) => (
                        <motion.div
                            key={tournament.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.01 }}
                            className="relative"
                        >
                            <Card className={cn(
                                "p-6 bg-black/40 border-white/5 backdrop-blur-xl hover:border-primary/40 transition-all flex flex-col md:flex-row items-center gap-8 group overflow-hidden",
                                joinedTournaments.includes(tournament.id) && "border-primary/40 bg-primary/5"
                            )}>
                                {/* Ribbon background for joined items */}
                                {joinedTournaments.includes(tournament.id) && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                )}

                                {/* Type Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/40 transition-colors">
                                    {tournament.type === 'Grand Prix' && <Crown className="w-8 h-8 text-amber-500" />}
                                    {tournament.type === 'Sprint' && <Zap className="w-8 h-8 text-primary" />}
                                    {tournament.type === 'Endurance' && <Timer className="w-8 h-8 text-blue-500" />}
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                        <h3 className="text-lg font-black uppercase tracking-tight">{tournament.name}</h3>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] font-black uppercase",
                                            tournament.difficulty === 'Extreme' ? "border-red-500/50 text-red-500 bg-red-500/5" :
                                                tournament.difficulty === 'Hard' ? "border-orange-500/50 text-orange-500 bg-orange-500/5" :
                                                    "border-emerald-500/50 text-emerald-500 bg-emerald-500/5"
                                        )}>
                                            {tournament.difficulty}
                                        </Badge>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10 opacity-60">
                                            {tournament.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-xl">
                                        {tournament.description}
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>{tournament.participants}/{tournament.maxParticipants} Registered</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <Sword className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Prize Pool: <span className="text-emerald-500">{tournament.prizePool}</span> coins</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                    <div className="flex flex-col items-center md:items-end">
                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Starts In</div>
                                        <div className="text-2xl font-black tabular-nums text-primary">{getTimeLeft(tournament.startTime)}</div>
                                    </div>

                                    <Button
                                        onClick={() => handleJoin(tournament)}
                                        disabled={joinedTournaments.includes(tournament.id)}
                                        className={cn(
                                            "min-w-[140px] font-black uppercase tracking-widest text-[10px] h-10 rounded-xl",
                                            joinedTournaments.includes(tournament.id) ? "bg-emerald-500 text-white" : "bg-primary hover:bg-primary/90 text-background"
                                        )}
                                    >
                                        {joinedTournaments.includes(tournament.id) ? (
                                            <>REGISTERED <ChevronRight className="w-3 h-3 ml-2" /></>
                                        ) : (
                                            tournament.entryFee > 0 ? `JOIN FOR ${tournament.entryFee} C` : 'FREE ENTRY'
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Performance Visualization (Placeholder for Phase 8.3) */}
            <Card className="p-8 bg-black/40 border-white/5 backdrop-blur-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Your Progress Curve</h2>
                        <p className="text-sm text-muted-foreground">Tournament performance over the last 30 days</p>
                    </div>
                </div>
                <div className="h-48 flex items-end gap-2 px-4">
                    {[45, 62, 58, 75, 82, 90, 85, 95, 110, 105, 120].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                className={cn(
                                    "w-full rounded-t-lg transition-all duration-500 relative",
                                    i === 10 ? "bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "bg-white/5 group-hover:bg-white/10"
                                )}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    {Math.floor(h * 0.8 + 80)}
                                </div>
                            </motion.div>
                            <span className="text-[8px] font-black text-muted-foreground/30 uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i % 7]}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
