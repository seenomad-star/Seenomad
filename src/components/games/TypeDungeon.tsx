import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Sword, Shield, Skull, Coins, Trophy, RefreshCw } from "lucide-react";
import { useEconomy } from "@/contexts/EconomyContext";
import { toast } from "sonner";
import Confetti from 'react-confetti';

// Game Types
interface Enemy {
    id: string;
    name: string;
    maxHealth: number;
    currentHealth: number;
    damage: number;
    attackSpeed: number; // seconds between attacks
    sprite: string;
    words: string[];
}

const ENEMIES: Enemy[] = [
    {
        id: 'slime',
        name: 'Toxic Slime',
        maxHealth: 100,
        currentHealth: 100,
        damage: 10,
        attackSpeed: 3,
        sprite: '🦠',
        words: ['ooze', 'slime', 'toxic', 'acid', 'melt']
    },
    {
        id: 'goblin',
        name: 'Data Goblin',
        maxHealth: 150,
        currentHealth: 150,
        damage: 15,
        attackSpeed: 2.5,
        sprite: '👺',
        words: ['steal', 'grep', 'sudo', 'hack', 'loot']
    },
    {
        id: 'dragon',
        name: 'Syntax Dragon',
        maxHealth: 300,
        currentHealth: 300,
        damage: 25,
        attackSpeed: 4,
        sprite: '🐉',
        words: ['compile', 'execute', 'terminal', 'function', 'return']
    }
];

export const TypeDungeon: React.FC = () => {
    const { addCurrency } = useEconomy();
    const [gameState, setGameState] = useState<'start' | 'playing' | 'victory' | 'defeat'>('start');
    const [level, setLevel] = useState(0);

    // Player Stats
    const [playerHealth, setPlayerHealth] = useState(100);
    const [maxPlayerHealth] = useState(100);

    // Enemy Stats
    const [enemy, setEnemy] = useState<Enemy | null>(null);

    // Typing Stats
    const [currentWord, setCurrentWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Level
    useEffect(() => {
        if (gameState === 'playing') {
            const currentEnemy = JSON.parse(JSON.stringify(ENEMIES[level % ENEMIES.length]));
            // Scale enemy difficulty
            currentEnemy.maxHealth += level * 20;
            currentEnemy.currentHealth = currentEnemy.maxHealth;
            currentEnemy.damage += level * 2;

            setEnemy(currentEnemy);
            pickNewWord(currentEnemy);

            // Start Enemy Attack Loop
            startEnemyAttacks(currentEnemy);
        }
        return () => stopEnemyAttacks();
    }, [gameState, level]);

    const startEnemyAttacks = (currentEnemy: Enemy) => {
        stopEnemyAttacks();
        attackTimerRef.current = setInterval(() => {
            setPlayerHealth(prev => {
                const newHealth = prev - currentEnemy.damage;
                if (newHealth <= 0) {
                    handleDefeat();
                    return 0;
                }
                triggerShake();
                return newHealth;
            });
        }, currentEnemy.attackSpeed * 1000);
    };

    const stopEnemyAttacks = () => {
        if (attackTimerRef.current) clearInterval(attackTimerRef.current);
    };

    const pickNewWord = (currentEnemy: Enemy) => {
        const word = currentEnemy.words[Math.floor(Math.random() * currentEnemy.words.length)];
        setCurrentWord(word);
        setInputValue('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        if (val === currentWord) {
            // Player Attack
            if (enemy) {
                const damage = 20; // Base player damage
                const newEnemyHealth = enemy.currentHealth - damage;

                setEnemy({ ...enemy, currentHealth: newEnemyHealth });
                triggerAttackAnim();

                if (newEnemyHealth <= 0) {
                    handleVictory();
                } else {
                    pickNewWord(enemy);
                }
            }
        }
    };

    const handleVictory = () => {
        stopEnemyAttacks();
        setScore(curr => curr + 100);
        addCurrency(50, 'coins');

        if (level < ENEMIES.length - 1) {
            // Next Level immediately for flow (or could show a "Next Level" screen)
            setLevel(curr => curr + 1);
            toast.success(`Defeated ${enemy?.name}! +50 Coins`);
        } else {
            setGameState('victory');
            addCurrency(100, 'gems'); // Bonus for clearing dungeon
        }
    };

    const handleDefeat = () => {
        stopEnemyAttacks();
        setGameState('defeat');
    };

    // Visual Effects
    const [shake, setShake] = useState(false);
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const [attackAnim, setAttackAnim] = useState(false);
    const triggerAttackAnim = () => {
        setAttackAnim(true);
        setTimeout(() => setAttackAnim(false), 200);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />

            {gameState === 'start' && (
                <Card className="z-10 bg-black/80 border-white/20 p-12 text-center max-w-lg backdrop-blur-xl">
                    <h1 className="text-5xl font-black mb-6 text-red-500 tracking-tighter">TYPE DUNGEON</h1>
                    <p className="text-gray-400 mb-8 text-lg">Descend into the depths of the mainframe. Defeat the syntax errors. Typists survive, key-mashers perish.</p>
                    <Button
                        size="lg"
                        className="w-full text-xl h-14 bg-red-600 hover:bg-red-700 font-bold"
                        onClick={() => {
                            setPlayerHealth(100);
                            setLevel(0);
                            setGameState('playing');
                        }}
                    >
                        <Sword className="mr-2 w-6 h-6" /> ENTER DUNGEON
                    </Button>
                </Card>
            )}

            {gameState === 'playing' && enemy && (
                <div className={`w-full max-w-4xl z-10 transition-transform ${shake ? 'translate-x-2' : ''}`}>
                    {/* HUD */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-500">
                                <Heart className="w-8 h-8 text-red-500 fill-current" />
                            </div>
                            <div>
                                <div className="text-sm text-red-400 font-bold mb-1">PLAYER HP</div>
                                <Progress value={(playerHealth / maxPlayerHealth) * 100} className="w-48 h-4 bg-red-950" indicatorClassName="bg-red-500" />
                                <div className="text-xs mt-1 text-right">{playerHealth}/{maxPlayerHealth}</div>
                            </div>
                        </div>

                        <div className="text-2xl font-black text-yellow-500 flex items-center gap-2">
                            <Trophy className="w-6 h-6" /> LEVEL {level + 1}
                        </div>

                        <div className="flex items-center gap-4 text-right">
                            <div>
                                <div className="text-sm text-purple-400 font-bold mb-1">{enemy.name.toUpperCase()}</div>
                                <Progress value={(enemy.currentHealth / enemy.maxHealth) * 100} className="w-48 h-4 bg-purple-950" indicatorClassName="bg-purple-500" />
                                <div className="text-xs mt-1">{enemy.currentHealth}/{enemy.maxHealth}</div>
                            </div>
                            <div className="relative w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center border-2 border-purple-500">
                                <Skull className="w-8 h-8 text-purple-500 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* BATTLE ARENA */}
                    <div className="flex justify-between items-end mb-16 px-12">
                        {/* Player Sprite */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: attackAnim ? 50 : 0, opacity: 1 }}
                            className="text-9xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        >
                            🧙‍♂️
                        </motion.div>

                        {/* Vs */}
                        <div className="text-4xl font-black text-white/20">VS</div>

                        {/* Enemy Sprite */}
                        <motion.div
                            key={enemy.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-9xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        >
                            {enemy.sprite}
                        </motion.div>
                    </div>

                    {/* TYPING AREA */}
                    <div className="flex flex-col items-center">
                        <div className="mb-6 text-4xl font-mono font-bold tracking-widest bg-black/50 px-8 py-4 rounded-xl border border-white/10">
                            {currentWord.split('').map((char, index) => (
                                <span key={index} className={index < inputValue.length ? 'text-green-500' : 'text-white'}>
                                    {char}
                                </span>
                            ))}
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            autoFocus
                            title="Attack Input"
                            aria-label="Type the word to attack"
                            className="bg-transparent border-b-2 border-white/20 text-center text-3xl focus:outline-none focus:border-red-500 w-64 text-transparent caret-white"
                        // Make text transparent so custom rendering above shows
                        />
                        <p className="mt-4 text-white/40 text-sm">Type the word to attack!</p>
                    </div>
                </div>
            )}

            {gameState === 'victory' && (
                <div className="z-10 text-center">
                    <Confetti numberOfPieces={200} recycle={false} />
                    <h1 className="text-6xl font-black text-yellow-400 mb-4">DUNGEON CLEARED!</h1>
                    <p className="text-xl text-white/80 mb-8">You have purged the system of all anomalies.</p>
                    <div className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => {
                                setLevel(0);
                                setPlayerHealth(100);
                                setGameState('playing');
                            }}
                        >
                            <RefreshCw className="mr-2 w-4 h-4" /> REPLAY
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setGameState('start')}
                        >
                            MAIN MENU
                        </Button>
                    </div>
                </div>
            )}

            {gameState === 'defeat' && (
                <div className="z-10 text-center bg-black/90 p-12 rounded-2xl border border-red-500/30">
                    <h1 className="text-6xl font-black text-red-600 mb-4">SYSTEM FAILURE</h1>
                    <p className="text-xl text-white/80 mb-8">The viruses have corrupted your session.</p>
                    <Button
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 w-full"
                        onClick={() => {
                            setLevel(0);
                            setPlayerHealth(100);
                            setGameState('playing');
                        }}
                    >
                        <RefreshCw className="mr-2 w-4 h-4" /> RETRY LEVEL
                    </Button>
                </div>
            )}
        </div>
    );
};
