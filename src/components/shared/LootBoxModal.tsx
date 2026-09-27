import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Package, Star, Volume2, X } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";

interface LootBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: "standard" | "rare" | "epic";
}

export function LootBoxModal({ isOpen, onClose, type = "standard" }: LootBoxModalProps) {
    const [step, setStep] = useState<"idle" | "shaking" | "opening" | "revealed">("idle");
    const { addXP, addCoins } = useGamification();
    const [reward, setReward] = useState<{ type: string; value: number; label: string } | null>(null);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep("idle");
            setReward(null);
        }
    }, [isOpen]);

    const handleOpen = () => {
        if (step !== "idle") return;
        setStep("shaking");

        // Simulate network/calc delay
        setTimeout(() => {
            setStep("opening");
            // Determine reward
            const mockReward = { type: "coins", value: 100, label: "100 Coins" };
            setReward(mockReward);

            setTimeout(() => {
                setStep("revealed");
                addCoins(mockReward.value);
                // Confetti removed
            }, 600); // Wait for explosion animation
        }, 1500); // Shake duration
    };

    const shakeVariants = {
        idle: { rotate: 0, scale: 1 },
        shaking: {
            rotate: [-5, 5, -5, 5, -5, 5],
            scale: [1, 1.05, 1, 1.05, 1],
            transition: { repeat: Infinity, duration: 0.5 }
        },
        opening: { scale: 1.5, opacity: 0, filter: "brightness(2)" },
        revealed: { scale: 0, opacity: 0 }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0 flex items-center justify-center min-h-[400px]">
                <div className="relative w-full flex flex-col items-center">

                    <AnimatePresence mode="wait">
                        {step !== "revealed" ? (
                            <motion.div
                                key="box"
                                variants={shakeVariants}
                                initial="idle"
                                animate={step}
                                onClick={handleOpen}
                                className="cursor-pointer group relative"
                            >
                                <div className="w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/50 border-4 border-amber-200/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
                                    <Package className="w-24 h-24 text-white drop-shadow-lg" />
                                    {step === "idle" && (
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-orange-600 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap"
                                        >
                                            Click to Open
                                        </motion.div>
                                    )}
                                </div>
                                <div className="absolute -inset-4 bg-orange-500/30 blur-2xl rounded-full -z-10 animate-pulse" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reward"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-card border border-border/50 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden w-full max-w-sm"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                                <div className="relative">
                                    <div className="absolute -inset-8 bg-yellow-500/20 blur-xl rounded-full" />
                                    <Star className="w-20 h-20 text-yellow-400 fill-yellow-400/20 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-yellow-600">+100</span>
                                    </div>
                                </div>

                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Epic Loot!</h3>
                                    <p className="text-muted-foreground font-medium">You found {reward?.label}</p>
                                </div>

                                <Button onClick={onClose} className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                                    Claim Reward
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {step === "shaking" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -bottom-12 text-white font-black text-lg tracking-widest uppercase animate-pulse"
                        >
                            Opening...
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
