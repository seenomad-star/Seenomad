import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Cpu, Lock, Unlock, Zap, Timer, AlertTriangle, ArrowLeft, Database, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/contexts/GamificationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/utils';

const NODES = [
    { id: 1, name: "Firewall Node", passphrase: "bypass core security", time: 15 },
    { id: 2, name: "Encryption Layer", passphrase: "extract secret keys", time: 12 },
    { id: 3, name: "Database Access", passphrase: "query admin records", time: 10 },
    { id: 4, name: "Root Shell", passphrase: "sudo execute exploit", time: 8 },
    { id: 5, name: "Central Intelligence", passphrase: "exfiltrate classified data", time: 6 }
];

export default function HeistMaster() {
    const navigate = useNavigate();
    const { addXP, addCoins } = useGamification();

    const [gameState, setGameState] = useState<'start' | 'hacking' | 'success' | 'busted'>('start');
    const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [hackingLogs, setHackingLogs] = useState<string[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startHacking = () => {
        setGameState('hacking');
        setCurrentNodeIdx(0);
        setHackingLogs(["Connection established. Initiating breach..."]);
        loadNode(0);
    };

    const loadNode = (idx: number) => {
        const node = NODES[idx];
        setTimeLeft(node.time);
        setUserInput("");
        setHackingLogs(prev => [`Accessing ${node.name}...`, ...prev].slice(0, 8));

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setGameState('busted');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserInput(val);

        if (val === NODES[currentNodeIdx].passphrase) {
            handleNodeSuccess();
        }
    };

    const handleNodeSuccess = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        if (currentNodeIdx < NODES.length - 1) {
            setCurrentNodeIdx(prev => prev + 1);
            loadNode(currentNodeIdx + 1);
        } else {
            setGameState('success');
            addXP(300);
            addCoins(100);
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const currentNode = NODES[currentNodeIdx];

    return (
        <div className="min-h-screen bg-[#020406] p-6 md:p-10 flex flex-col items-center justify-center font-mono selection:bg-emerald-500/30 text-emerald-500 overflow-hidden">
            {/* GRID BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="w-full max-w-4xl relative z-10 space-y-8">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                    <Button variant="ghost" onClick={() => navigate('/games')} className="gap-2 text-emerald-500/60 hover:text-emerald-500 hover:bg-emerald-500/5">
                        <ArrowLeft className="w-4 h-4" />
                        Abort Mission
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] font-black uppercase tracking-widest block opacity-50">Stealth Level</span>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={cn("w-3 h-1 rounded-full", i <= currentNodeIdx + 1 ? "bg-emerald-500 shadow-[0_0_5px_theme(colors.emerald.500)]" : "bg-emerald-900/30")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {gameState === 'start' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 text-center">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-full border-2 border-emerald-500/50 flex items-center justify-center animate-pulse">
                                    <Terminal className="w-10 h-10" />
                                </div>
                                <ShieldAlert className="absolute -top-2 -right-2 w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black tracking-tighter uppercase italic shadow-emerald-500/20 drop-shadow-2xl">Heist Master</h1>
                                <p className="text-emerald-500/60 max-w-lg mx-auto font-medium">Precision is speed. Type the encrypted passphrases before the tracer catches you. Silence is mandatory.</p>
                            </div>
                            <Button onClick={startHacking} className="h-16 px-16 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 dark:hover:bg-emerald-400 transition-all rounded-none border-t-4 border-emerald-200">
                                Connect to Mainframe
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'hacking' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            {/* STATUS HUD */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <Database className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-black">Target</span>
                                    </div>
                                    <div className="text-sm font-black uppercase">{currentNode.name}</div>
                                </div>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded relative overflow-hidden">
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <Timer className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-black">Tracer Status</span>
                                    </div>
                                    <div className={cn("text-xl font-black", timeLeft < 5 ? "text-red-500 animate-pulse" : "")}>
                                        {timeLeft}s until detected
                                    </div>
                                    <Progress value={(timeLeft / currentNode.time) * 100} className="h-1 mt-2 bg-emerald-950/30 [--progress-background:theme(colors.emerald.500)]" />
                                </div>
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded">
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <Zap className="w-3 h-3" />
                                        <span className="text-[10px] uppercase font-black">Nodes</span>
                                    </div>
                                    <div className="text-xl font-black">{currentNodeIdx + 1} / {NODES.length}</div>
                                </div>
                            </div>

                            {/* TERMINAL AREA */}
                            <div className="relative p-1 bg-emerald-500/10 border border-emerald-500/30 rounded min-h-[300px] flex flex-col">
                                <div className="p-2 border-b border-emerald-500/20 flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="flex-1 p-8 flex flex-col items-center justify-center gap-8">
                                    <div className="text-center space-y-4">
                                        <div className="flex items-center justify-center gap-2 opacity-30">
                                            <Lock className="w-3 h-3" />
                                            <span className="text-[10px] uppercase tracking-widest font-black">Encrypted Phrase</span>
                                        </div>
                                        <div className="text-3xl md:text-4xl font-black tracking-tight flex flex-wrap justify-center gap-x-4">
                                            {currentNode.passphrase.split(" ").map((word, wIdx) => (
                                                <span key={wIdx} className="relative">
                                                    {word.split("").map((char, cIdx) => (
                                                        <span key={cIdx} className={cn(
                                                            "transition-all duration-75",
                                                            userInput.length > currentNode.passphrase.split(word)[0].length + cIdx
                                                                ? currentNode.passphrase[currentNode.passphrase.split(word)[0].length + cIdx] === userInput[currentNode.passphrase.split(word)[0].length + cIdx]
                                                                    ? "text-emerald-400 drop-shadow-[0_0_8px_theme(colors.emerald.500)]"
                                                                    : "text-red-500"
                                                                : "text-emerald-900/40"
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
                                        className="bg-transparent border-b-2 border-emerald-500/20 text-center text-xl outline-none focus:border-emerald-500 transition-all w-full max-w-md h-12 uppercase font-black tracking-widest"
                                        spellCheck={false}
                                        autoComplete="off"
                                        aria-label="Hacking Input"
                                        title="Hacking Input"
                                    />
                                    <div className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 animate-pulse">
                                        Input synchronized... Secure stream active
                                    </div>
                                </div>
                            </div>

                            {/* CONSOLE LOGS */}
                            <div className="bg-black/50 p-4 rounded border border-emerald-500/10 h-32 overflow-hidden flex flex-col-reverse">
                                {hackingLogs.map((log, i) => (
                                    <div key={i} className={cn("text-[10px] font-bold py-0.5", i === 0 ? "text-emerald-500" : "opacity-30")}>
                                        {`[${new Date().toLocaleTimeString()}] >> ${log}`}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 bg-emerald-500/5 p-16 border-2 border-emerald-500/20">
                            <motion.div initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Unlock className="w-20 h-20 mx-auto text-emerald-400" />
                            </motion.div>
                            <div className="space-y-2">
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter">System Breached</h2>
                                <p className="text-emerald-500/60 uppercase text-[10px] tracking-[0.3em] font-black">All data exfiltrated successfully</p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <div className="px-6 py-4 border border-emerald-500/20 bg-emerald-500/10 rounded">
                                    <div className="text-2xl font-black">+300 XP</div>
                                </div>
                                <div className="px-6 py-4 border border-emerald-500/20 bg-emerald-500/10 rounded">
                                    <div className="text-2xl font-black text-yellow-500">+100 COINS</div>
                                </div>
                            </div>
                            <Button onClick={() => navigate('/games')} className="h-12 px-10 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                                Return to Shadow
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'busted' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 bg-red-500/5 p-16 border-2 border-red-500/20 text-red-500 selection:bg-red-500/30">
                            <AlertTriangle className="w-20 h-20 mx-auto animate-bounce" />
                            <div className="space-y-2">
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter">Mission Compromised</h2>
                                <p className="text-red-500/60 uppercase text-[10px] tracking-[0.3em] font-black">TRACER DETECTED YOUR LOCATION. ABORTING...</p>
                            </div>
                            <Button onClick={startHacking} className="h-14 px-10 bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-600 transition-all">
                                Re-Link Connection
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
