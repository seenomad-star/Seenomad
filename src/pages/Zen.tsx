import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTypingGame } from "@/hooks/useTypingGame";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import { ArrowLeft, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { useKeyboardSounds } from "@/hooks/useKeyboardSounds";
import { ZenWorkspace } from "@/components/typing/ZenWorkspace";
import { cn } from "@/utils/utils";

export default function Zen() {
    const navigate = useNavigate();
    const { playSound, playErrorSound } = useKeyboardSounds();
    const {
        isFocusMode,
        setIsFocusMode,
        toggleFocusMode,
        soundType,
        language,
    } = useTypingSession();

    const [isMuted, setIsMuted] = useState(false);
    const [wordCompletedTrigger, setWordCompletedTrigger] = useState(0);

    const {
        text,
        userInput,
        currentIndex,
        isStarted,
        stats,
        handleKeyPress,
        restart,
    } = useTypingGame({
        wordCount: 50,
        language: language as any || "english",
        mode: "quotes",
    });

    useEffect(() => {
        if (!isFocusMode) {
            toggleFocusMode();
        }
        return () => {
            setIsFocusMode(false);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                navigate("/");
                return;
            }
            if (e.key === "Tab") {
                e.preventDefault();
                restart();
                return;
            }

            if (e.key.length === 1 || e.key === "Backspace" || e.key === " ") {
                if (!isMuted && soundType !== "none") {
                    const expectedChar = text[currentIndex];
                    const isCorrect = e.key === expectedChar;
                    if (isCorrect || e.key === "Backspace") {
                        playSound(soundType, true);
                    } else {
                        playErrorSound(soundType);
                    }

                    if (isCorrect && e.key === " ") {
                        setWordCompletedTrigger(prev => prev + 1);
                    }
                }
                handleKeyPress(e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyPress, restart, navigate, text, currentIndex, isMuted, soundType, playSound, playErrorSound]);

    return (
        <ZenWorkspace isActive={true}>
            <div className="min-h-screen flex flex-col items-center justify-center p-8 select-none">
                {/* TOP CONTROLS */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-10 left-10 right-10 flex items-center justify-between z-50"
                >
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                        aria-label="Exit Zen mode"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-widest uppercase">Exit Zen</span>
                    </button>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={restart}
                            className="text-white/40 hover:text-white transition-colors rotate-0 hover:rotate-180 transition-transform duration-500"
                            aria-label="Restart typing session"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* MAIN CONTENT AREA */}
                <div className="w-full max-w-4xl flex flex-col items-center gap-16">

                    {/* SUBTLE STATS */}
                    <div className="flex items-center gap-12">
                        <motion.div
                            animate={{ opacity: isStarted ? 0.6 : 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">Speed</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-light text-white leading-none">{stats.wpm}</span>
                                <span className="text-xs text-white/30 font-medium tracking-widest">WPM</span>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ opacity: isStarted ? 0.6 : 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-1">Accuracy</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-light text-white leading-none">{stats.accuracy}</span>
                                <span className="text-xs text-white/30 font-medium tracking-widest">%</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* TYPING AREA */}
                    <div className="w-full text-center">
                        <TypingDisplay
                            text={text}
                            userInput={userInput}
                            currentIndex={currentIndex}
                            particleTrigger={wordCompletedTrigger}
                        />
                    </div>

                    {/* FOOTER HINT */}
                    {!isStarted && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-white/30 text-sm font-light tracking-[0.2em] uppercase"
                        >
                            Breathe and start typing...
                        </motion.div>
                    )}
                </div>
            </div>
        </ZenWorkspace>
    );
}
