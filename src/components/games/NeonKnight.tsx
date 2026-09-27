import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Zap, Heart, Trophy, RefreshCcw, ArrowLeft, Swords, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/contexts/GamificationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/utils';

const COMBAT_PHRASES = [
    "slash through the firewall",
    "breach the core network",
    "overclock the mainframe",
    "execute critical strike",
    "bypass security protocols",
    "shatter the digital cage",
    "initialize hyperdrive",
    "synchronize neural link",
    "deploy counter measures",
    "terminate active threat"
];

export default function NeonKnight() {
    const navigate = useNavigate();
    const { addXP, addCoins } = useGamification();

    // Game State
    const [gameState, setGameState] = useState<'start' | 'playing' | 'boss' | 'won' | 'lost'>('start');
    const [playerHP, setPlayerHP] = useState(100);
    const [enemyHP, setEnemyHP] = useState(100);
    const [score, setScore] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState("");
    const [userInput, setUserInput] = useState("");
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [attackEffect, setAttackEffect] = useState<'none' | 'player' | 'enemy'>('none');
    const [isBossActive, setIsBossActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const startLevel = useCallback(() => {
        setGameState('playing');
        setPlayerHP(100);
        setEnemyHP(100);
        setScore(0);
        setIsBossActive(false);
        setCombatLog(["Challenge started! Precise typing is your weapon."]);
        generateNewPhrase();
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const generateNewPhrase = () => {
        const phrase = COMBAT_PHRASES[Math.floor(Math.random() * COMBAT_PHRASES.length)];
        setCurrentPhrase(phrase);
        setUserInput("");
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserInput(val);

        if (val === currentPhrase) {
            handleSuccessfulAttack();
        } else if (!currentPhrase.startsWith(val)) {
            // Mistake penalty (Dopamine contrast)
            setAttackEffect('enemy');
            setPlayerHP(prev => Math.max(0, prev - 2));
            setCombatLog(prev => ["Glitch! Damage taken.", ...prev].slice(0, 5));
            setUserInput(""); // Reset on error for combat feel
        }
    };

    const handleSuccessfulAttack = () => {
        setAttackEffect('player');
        const damage = isBossActive ? 15 : 25;
        setEnemyHP(prev => {
            const next = Math.max(0, prev - damage);
            if (next === 0) {
                if (!isBossActive) {
                    initiateBossFight();
                } else {
                    setGameState('won');
                }
            }
            return next;
        });

        setScore(prev => prev + 100);
        setCombatLog(prev => ["Critical Hit! Code executed.", ...prev].slice(0, 5));

        setTimeout(() => {
            setAttackEffect('none');
            generateNewPhrase();
        }, 300);
    };

    const initiateBossFight = () => {
        setIsBossActive(true);
        setEnemyHP(200);
        setCombatLog(prev => ["BOSS DETECTED: Firewalls strengthened!", ...prev].slice(0, 5));
        generateNewPhrase();
    };

    useEffect(() => {
        if (playerHP === 0) setGameState('lost');
    }, [playerHP]);

    return (
        <div className="min-h-screen bg-[#050505] p-6 md:p-10 flex flex-col items-center justify-center font-mono selection:bg-primary/40 overflow-hidden">
            {/* AMBIENT EFFECTS */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2 text-primary/60 hover:text-primary">
                        <ArrowLeft className="w-4 h-4" />
                        Exit Simulation
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 block">Score</span>
                            <span className="text-xl font-black text-primary">{score}</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card/50 backdrop-blur-3xl border border-primary/20 rounded-[3rem] p-12 text-center space-y-8"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
                                <Swords className="w-12 h-12 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black tracking-tighter text-foreground italic uppercase">Neon Knight</h1>
                                <p className="text-muted-foreground max-w-md mx-auto">Master the rhythm. Type phrases perfectly to strike your enemies. Errors will deplete your shields.</p>
                            </div>
                            <Button onClick={startLevel} className="h-16 px-12 rounded-2xl bg-primary text-background font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                <Zap className="w-5 h-5 mr-2" />
                                Initialize Combat
                            </Button>
                        </motion.div>
                    )}

                    {(gameState === 'playing' || gameState === 'boss') && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                            {/* COMBAT VIEW */}
                            <div className="grid grid-cols-2 gap-10 items-center">
                                {/* PLAYER */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs font-black uppercase text-blue-400">Knight_OS</span>
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground">{playerHP}%</span>
                                    </div>
                                    <Progress value={playerHP} className="h-2 bg-blue-950/30 [--progress-background:theme(colors.blue.500)]" />
                                    <motion.div
                                        animate={attackEffect === 'enemy' ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        className={cn(
                                            "aspect-video rounded-3xl border-2 flex items-center justify-center relative overflow-hidden",
                                            attackEffect === 'enemy' ? "border-red-500 bg-red-500/10" : "border-blue-500/20 bg-blue-500/5 shadow-inner shadow-blue-500/10"
                                        )}
                                    >
                                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-200" alt="player" />
                                        <div className="relative z-10 p-6 rounded-2xl bg-blue-500/20 backdrop-blur-md">
                                            <Shield className="w-12 h-12 text-blue-400" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* ENEMY */}
                                <div className="space-y-4 text-right">
                                    <div className="flex justify-between items-end flex-row-reverse">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black uppercase text-red-500">{isBossActive ? 'GATEKEEPER' : 'SENTINEL_X'}</span>
                                            <Zap className="w-4 h-4 text-red-500" />
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground">{enemyHP}%</span>
                                    </div>
                                    <Progress value={isBossActive ? enemyHP / 2 : enemyHP} className="h-2 bg-red-950/30 [--progress-background:theme(colors.red.500)]" />
                                    <motion.div
                                        animate={attackEffect === 'player' ? { x: [10, -10, 10, -10, 0], scale: 0.95 } : {}}
                                        className={cn(
                                            "aspect-video rounded-3xl border-2 flex items-center justify-center relative overflow-hidden",
                                            attackEffect === 'player' ? "border-red-500 bg-red-500/20 shadow-2xl shadow-red-500/20" : "border-red-500/20 bg-red-500/5"
                                        )}
                                    >
                                        <img src={isBossActive ? "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80" : "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=400&q=80"} className="absolute inset-0 w-full h-full object-cover opacity-30 invert brightness-150" alt="enemy" />
                                        <div className="relative z-10 p-6 rounded-2xl bg-red-500/20 backdrop-blur-md">
                                            {isBossActive ? <Swords className="w-12 h-12 text-red-500" /> : <Target className="w-12 h-12 text-red-500" />}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* WORD/INPUT ZONE */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="text-center space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Execute Fragment</span>
                                    <div className="text-4xl font-black text-foreground italic flex gap-4 tracking-tight">
                                        {currentPhrase.split(" ").map((word, wIdx) => (
                                            <span key={wIdx}>
                                                {word.split("").map((char, cIdx) => (
                                                    <span key={cIdx} className={cn(
                                                        "transition-all duration-75",
                                                        userInput.length > currentPhrase.split(word)[0].length + cIdx
                                                            ? currentPhrase[currentPhrase.split(word)[0].length + cIdx] === userInput[currentPhrase.split(word)[0].length + cIdx]
                                                                ? "text-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
                                                                : "text-red-500"
                                                            : "text-muted-foreground/30"
                                                    )}>
                                                        {char}
                                                    </span>
                                                ))}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={handleInput}
                                    autoFocus
                                    className="opacity-0 absolute p-0 w-0 h-0"
                                    aria-label="Combat Input"
                                    title="Combat Input"
                                />

                                <div className="text-[10px] font-black uppercase tracking-widest text-primary/20 animate-pulse">
                                    Simulation Active... Focus on precision
                                </div>
                            </div>

                            {/* LOGS */}
                            <div className="flex flex-col gap-2 p-6 rounded-3xl bg-card border border-border/10 max-w-md mx-auto w-full opacity-60 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Neural Console Output</span>
                                </div>
                                {combatLog.map((log, i) => (
                                    <div key={i} className={cn(
                                        "text-xs font-bold leading-none",
                                        i === 0 ? "text-primary" : "text-muted-foreground/40"
                                    )}>
                                        {`> ${log}`}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'won' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-card/50 backdrop-blur-3xl border border-primary/20 rounded-[3rem] p-12 text-center space-y-8"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 animate-bounce">
                                <Trophy className="w-12 h-12 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter text-foreground italic uppercase">Victory Declared</h2>
                                <p className="text-muted-foreground">The digital threat has been neutralized. System purity restored.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/10 p-4 rounded-2xl border border-white/5">
                                    <div className="text-2xl font-black text-primary">+200</div>
                                    <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">XP Gained</div>
                                </div>
                                <div className="bg-muted/10 p-4 rounded-2xl border border-white/5">
                                    <div className="text-2xl font-black text-yellow-500">+50</div>
                                    <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Coins Earned</div>
                                </div>
                            </div>
                            <Button onClick={startLevel} className="w-full h-16 rounded-2xl bg-primary text-background font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Re-Initialize
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'lost' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-card/50 backdrop-blur-3xl border border-red-500/20 rounded-[3rem] p-12 text-center space-y-8"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-red-500/20 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/20">
                                <Zap className="w-12 h-12 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter text-red-500 italic uppercase">System Failure</h2>
                                <p className="text-muted-foreground">Encryption breach confirmed. The sentinels have overcome your speed.</p>
                            </div>
                            <Button onClick={startLevel} className="w-full h-16 rounded-2xl bg-red-500 text-white font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20">
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Reboot Simulation
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
