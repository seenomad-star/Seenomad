import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
    Swords, Heart, Zap, Shield, Skull, Trophy,
    RotateCcw, ArrowLeft, Sparkles, Flame, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Boss data
const BOSSES = [
    {
        id: 1,
        name: "Shadow Sentinel",
        maxHp: 100,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=sentinel&backgroundColor=1a1c1e",
        difficulty: "Easy",
        xpReward: 50,
        coinReward: 25,
        description: "A corrupted guardian of the digital realm"
    },
    {
        id: 2,
        name: "Cyber Hydra",
        maxHp: 200,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=hydra&backgroundColor=1a1c1e",
        difficulty: "Medium",
        xpReward: 100,
        coinReward: 50,
        description: "A multi-headed data serpent"
    },
    {
        id: 3,
        name: "Void Overlord",
        maxHp: 350,
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=overlord&backgroundColor=1a1c1e",
        difficulty: "Hard",
        xpReward: 200,
        coinReward: 100,
        description: "The master of the corrupted sector"
    }
];

// Word pool for typing
const WORD_POOL = [
    "attack", "strike", "power", "blast", "force", "surge", "shock", "beam",
    "sword", "shield", "armor", "spell", "magic", "fire", "ice", "thunder",
    "dragon", "knight", "wizard", "archer", "rogue", "mage", "warrior", "hero",
    "victory", "triumph", "glory", "honor", "legend", "mythic", "epic", "divine"
];

interface BossBattleModeProps {
    bossId?: number;
}

export const BossBattleMode: React.FC<BossBattleModeProps> = ({ bossId = 1 }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addXP, addCoins } = useGamification();
    const inputRef = useRef<HTMLInputElement>(null);

    const boss = BOSSES.find(b => b.id === bossId) || BOSSES[0];

    // Game state
    const [gameState, setGameState] = useState<"idle" | "playing" | "victory" | "defeat">("idle");
    const [bossHp, setBossHp] = useState(boss.maxHp);
    const [playerHp, setPlayerHp] = useState(100);
    const [currentWord, setCurrentWord] = useState("");
    const [targetWord, setTargetWord] = useState("");
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [totalDamage, setTotalDamage] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [damageEffects, setDamageEffects] = useState<{ id: number; damage: number; critical: boolean }[]>([]);
    const [bossAttacking, setBossAttacking] = useState(false);

    // Generate new target word
    const generateNewWord = useCallback(() => {
        const randomWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
        setTargetWord(randomWord);
        setCurrentWord("");
    }, []);

    // Start game
    const startGame = () => {
        setGameState("playing");
        setBossHp(boss.maxHp);
        setPlayerHp(100);
        setCombo(0);
        setMaxCombo(0);
        setTotalDamage(0);
        setTimeRemaining(60);
        generateNewWord();
        inputRef.current?.focus();
    };

    // Calculate damage based on word length and combo
    const calculateDamage = (word: string, currentCombo: number) => {
        const baseDamage = word.length * 2;
        const comboMultiplier = 1 + (currentCombo * 0.1);
        const isCritical = currentCombo >= 10;
        let damage = Math.round(baseDamage * comboMultiplier);
        if (isCritical) damage *= 2;
        return { damage, isCritical };
    };

    // Handle word completion
    const handleWordComplete = () => {
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);

        const { damage, isCritical } = calculateDamage(targetWord, newCombo);
        setTotalDamage(prev => prev + damage);

        // Add damage effect
        const effectId = Date.now();
        setDamageEffects(prev => [...prev, { id: effectId, damage, critical: isCritical }]);
        setTimeout(() => {
            setDamageEffects(prev => prev.filter(e => e.id !== effectId));
        }, 1000);

        // Apply damage to boss
        setBossHp(prev => {
            const newHp = Math.max(0, prev - damage);
            if (newHp === 0) {
                setGameState("victory");
                addXP(boss.xpReward);
                addCoins(boss.coinReward);
                toast.success(`Victory! +${boss.xpReward} XP, +${boss.coinReward} Coins`);
            }
            return newHp;
        });

        generateNewWord();
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setCurrentWord(value);

        // Check if word matches
        if (value === targetWord) {
            handleWordComplete();
        } else if (!targetWord.startsWith(value)) {
            // Wrong character - reset combo
            setCombo(0);
        }
    };

    // Boss attack timer
    useEffect(() => {
        if (gameState !== "playing") return;

        const attackInterval = setInterval(() => {
            setBossAttacking(true);
            setTimeout(() => {
                setPlayerHp(prev => {
                    const damage = Math.floor(Math.random() * 10) + 5;
                    const newHp = Math.max(0, prev - damage);
                    if (newHp === 0) {
                        setGameState("defeat");
                    }
                    return newHp;
                });
                setBossAttacking(false);
            }, 500);
        }, 5000);

        return () => clearInterval(attackInterval);
    }, [gameState]);

    // Game timer
    useEffect(() => {
        if (gameState !== "playing") return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setGameState("defeat");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Keep input focused
    useEffect(() => {
        if (gameState === "playing") {
            inputRef.current?.focus();
        }
    }, [gameState, targetWord]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy": return "bg-green-500/20 text-green-500";
            case "Medium": return "bg-yellow-500/20 text-yellow-500";
            case "Hard": return "bg-red-500/20 text-red-500";
            default: return "bg-primary/20 text-primary";
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1113] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/games")}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("Back to Games")}
                    </Button>

                    <Badge className={getDifficultyColor(boss.difficulty)}>
                        {boss.difficulty}
                    </Badge>
                </div>

                {/* Idle State - Boss Selection */}
                {gameState === "idle" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                                <Swords className="inline w-10 h-10 mr-3 text-primary" />
                                {t("Boss Battle")}
                            </h1>
                            <p className="text-muted-foreground">{t("Type words to attack the boss!")}</p>
                        </div>

                        {/* Boss Preview */}
                        <Card className="max-w-md mx-auto p-8 bg-gradient-to-b from-secondary/20 to-background border-primary/20">
                            <motion.img
                                src={boss.image}
                                alt={boss.name}
                                className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-primary/30"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <h2 className="text-2xl font-black text-foreground mb-2">{boss.name}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{boss.description}</p>
                            <div className="flex justify-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    {boss.maxHp} HP
                                </span>
                                <span className="flex items-center gap-1">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    +{boss.xpReward} XP
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    +{boss.coinReward} Coins
                                </span>
                            </div>
                        </Card>

                        <Button
                            size="lg"
                            onClick={startGame}
                            className="bg-primary hover:bg-primary/90 text-lg px-12 py-6 font-black uppercase tracking-wider gap-2"
                        >
                            <Swords className="w-5 h-5" />
                            {t("Start Battle")}
                        </Button>
                    </motion.div>
                )}

                {/* Playing State */}
                {gameState === "playing" && (
                    <div className="space-y-6">
                        {/* HUD */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Player HP */}
                            <Card className="p-4 bg-secondary/10 border-green-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Heart className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-bold uppercase text-muted-foreground">{t("Your HP")}</span>
                                </div>
                                <Progress value={playerHp} className="h-3 bg-secondary" />
                                <span className="text-sm font-bold text-green-500">{playerHp}/100</span>
                            </Card>

                            {/* Timer & Combo */}
                            <Card className="p-4 bg-secondary/10 border-primary/20 text-center">
                                <div className="text-3xl font-black text-primary mb-1">{timeRemaining}s</div>
                                <div className="flex items-center justify-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-bold text-orange-500">{combo}x {t("Combo")}</span>
                                </div>
                            </Card>

                            {/* Damage */}
                            <Card className="p-4 bg-secondary/10 border-yellow-500/20 text-right">
                                <div className="text-xs font-bold uppercase text-muted-foreground mb-2">{t("Total Damage")}</div>
                                <div className="text-2xl font-black text-yellow-500">{totalDamage}</div>
                            </Card>
                        </div>

                        {/* Boss Arena */}
                        <Card className="relative p-8 bg-gradient-to-b from-red-500/5 to-background border-red-500/20 overflow-hidden">
                            {/* Boss */}
                            <div className="flex flex-col items-center relative">
                                <motion.div
                                    animate={{
                                        scale: bossAttacking ? 1.2 : 1,
                                        x: bossAttacking ? [0, -10, 10, 0] : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                >
                                    <img
                                        src={boss.image}
                                        alt={boss.name}
                                        className={cn(
                                            "w-40 h-40 rounded-full border-4 transition-all",
                                            bossHp < boss.maxHp * 0.3 ? "border-red-500 grayscale-[50%]" : "border-primary/30"
                                        )}
                                    />

                                    {/* Damage numbers */}
                                    <AnimatePresence>
                                        {damageEffects.map(effect => (
                                            <motion.div
                                                key={effect.id}
                                                initial={{ y: 0, opacity: 1, scale: 1 }}
                                                animate={{ y: -60, opacity: 0, scale: 1.5 }}
                                                exit={{ opacity: 0 }}
                                                className={cn(
                                                    "absolute top-0 left-1/2 -translate-x-1/2 font-black text-2xl",
                                                    effect.critical ? "text-yellow-400" : "text-red-500"
                                                )}
                                            >
                                                -{effect.damage}
                                                {effect.critical && <Zap className="inline w-4 h-4 ml-1" />}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                <h3 className="text-xl font-black mt-4 mb-2">{boss.name}</h3>

                                {/* Boss HP Bar */}
                                <div className="w-full max-w-md">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-red-500">HP</span>
                                        <span className="text-muted-foreground">{bossHp}/{boss.maxHp}</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-red-600 to-red-400"
                                            animate={{ width: `${(bossHp / boss.maxHp) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Typing Area */}
                        <Card className="p-8 bg-secondary/10 border-primary/20 text-center">
                            <div className="text-4xl font-mono font-bold tracking-widest mb-6">
                                {targetWord.split("").map((char, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "transition-colors",
                                            i < currentWord.length
                                                ? currentWord[i] === char
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>

                            <input
                                ref={inputRef}
                                type="text"
                                value={currentWord}
                                onChange={handleInputChange}
                                className="w-full max-w-md bg-secondary/50 border border-primary/30 rounded-xl px-6 py-4 text-2xl font-mono text-center text-foreground outline-none focus:border-primary"
                                placeholder="Type to attack..."
                                aria-label="Type the target word to attack the boss"
                                autoComplete="off"
                                autoCapitalize="off"
                                autoCorrect="off"
                            />

                            {combo >= 10 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mt-4 text-yellow-400 font-black uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5" />
                                    {t("Critical Strike Active!")}
                                    <Zap className="w-5 h-5" />
                                </motion.div>
                            )}
                        </Card>
                    </div>
                )}

                {/* Victory State */}
                {gameState === "victory" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-flex p-6 rounded-full bg-green-500/20 mb-4">
                            <Trophy className="w-16 h-16 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-black uppercase text-green-500">{t("Victory!")}</h1>
                        <p className="text-xl text-muted-foreground">{t("You defeated")} {boss.name}!</p>

                        <Card className="max-w-md mx-auto p-6 bg-secondary/10">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-3xl font-black text-primary">{totalDamage}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{t("Total Damage")}</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-orange-500">{maxCombo}x</div>
                                    <div className="text-xs text-muted-foreground uppercase">{t("Max Combo")}</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-yellow-500">+{boss.xpReward}</div>
                                    <div className="text-xs text-muted-foreground uppercase">XP</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-emerald-500">+{boss.coinReward}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{t("Coins")}</div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-center gap-4">
                            <Button onClick={startGame} size="lg" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                {t("Play Again")}
                            </Button>
                            <Button onClick={() => navigate("/games")} variant="outline" size="lg" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                {t("Back to Games")}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Defeat State */}
                {gameState === "defeat" && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="inline-flex p-6 rounded-full bg-red-500/20 mb-4">
                            <Skull className="w-16 h-16 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-black uppercase text-red-500">{t("Defeated")}</h1>
                        <p className="text-xl text-muted-foreground">{boss.name} {t("was too powerful!")}</p>

                        <Card className="max-w-md mx-auto p-6 bg-secondary/10">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-3xl font-black text-primary">{totalDamage}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{t("Damage Dealt")}</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-orange-500">{maxCombo}x</div>
                                    <div className="text-xs text-muted-foreground uppercase">{t("Max Combo")}</div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-center gap-4">
                            <Button onClick={startGame} size="lg" className="gap-2 bg-red-500 hover:bg-red-600">
                                <RotateCcw className="w-4 h-4" />
                                {t("Try Again")}
                            </Button>
                            <Button onClick={() => navigate("/games")} variant="outline" size="lg" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                {t("Back to Games")}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BossBattleMode;
