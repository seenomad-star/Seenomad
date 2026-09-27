import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    Monitor, Volume2, VolumeX, Pause, Play,
    Crown, X, ChevronDown, Settings, Lock
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { useGamification } from "@/contexts/GamificationContext";

export interface AmbientEnvironment {
    id: string;
    name: string;
    description: string;
    videoUrl: string;
    audioUrl: string;
    thumbnail: string;
    isPremium: boolean;
    color: string;
}

const AMBIENT_ENVIRONMENTS: AmbientEnvironment[] = [
    {
        id: "cyberpunk_rain",
        name: "Cyberpunk Rain",
        description: "Neon-soaked streets in the year 2099",
        videoUrl: "https://images.unsplash.com/photo-1514565131-0ce082d47s8-2?auto=format&fit=crop&q=80&w=2000", // Placeholder, ideally a real video
        audioUrl: "https://cdn.freesound.org/previews/343/343605_5641154-lq.mp3", // Rain in car
        thumbnail: "https://images.unsplash.com/photo-1514565131-0ce082d47s8-2?w=400&h=300&fit=crop",
        isPremium: false,
        color: "from-purple-950/80 via-blue-900/60 to-black"
    },
    {
        id: "mountain_cabin",
        name: "Mountain Cabin",
        description: "Cozy fireplace during a snowstorm",
        videoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
        audioUrl: "https://cdn.freesound.org/previews/404/404494_7547191-lq.mp3", // Crackling fire
        thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
        isPremium: true,
        color: "from-orange-950/70 via-stone-900/60 to-black"
    },
    {
        id: "deep_space",
        name: "Deep Space",
        description: "Floating among distant nebulae",
        videoUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000",
        audioUrl: "https://cdn.freesound.org/previews/512/512395_10214840-lq.mp3", // Space drone
        thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
        isPremium: true,
        color: "from-indigo-950/80 via-slate-900/60 to-black"
    },
    {
        id: "emerald_forest",
        name: "Emerald Forest",
        description: "Sunlight filtering through ancient trees",
        videoUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000",
        audioUrl: "https://cdn.freesound.org/previews/244/244583_3889004-lq.mp3", // Forest birds
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        isPremium: false,
        color: "from-emerald-950/70 via-green-900/60 to-black"
    }
];

interface ZenWorkspaceProps {
    children: React.ReactNode;
    isActive?: boolean;
}

export const ZenWorkspace: React.FC<ZenWorkspaceProps> = ({ children, isActive = false }) => {
    const { t } = useTranslation();
    const { userStats } = useGamification();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [selectedEnv, setSelectedEnv] = useState<AmbientEnvironment>(AMBIENT_ENVIRONMENTS[0]);
    const [showSelector, setShowSelector] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [volume, setVolume] = useState([50]);
    const [focusMode, setFocusMode] = useState(false);
    const bgRef = useRef<HTMLDivElement>(null);

    // Handle audio playback
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume[0] / 100;
        }
    }, [volume]);

    // Apply background image imperatively to avoid JSX style= prop
    useEffect(() => {
        if (bgRef.current) {
            bgRef.current.style.backgroundImage = `url(${selectedEnv.videoUrl})`;
        }
    }, [selectedEnv.videoUrl]);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isAudioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => {
                    // Autoplay blocked - user needs to interact first
                });
            }
            setIsAudioPlaying(!isAudioPlaying);
        }
    };

    const selectEnvironment = (env: AmbientEnvironment) => {
        if (env.isPremium && !userStats.isPremium) {
            return; // Block premium for free users
        }
        setSelectedEnv(env);
        setShowSelector(false);
        setIsAudioPlaying(false);
    };

    if (!isActive) return <>{children}</>;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div
                ref={bgRef}
                className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
            />

            {/* Gradient Overlay */}
            <div className={cn(
                "fixed inset-0 z-[1] bg-gradient-to-b transition-all duration-1000",
                selectedEnv.color
            )} />

            {/* Focus Mode Overlay */}
            <AnimatePresence>
                {focusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2] bg-black/60 backdrop-blur-sm pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={selectedEnv.audioUrl}
                loop
                preload="metadata"
            />

            {/* Control Panel */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[50]">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-3 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10"
                >
                    {/* Environment Selector */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
                            onClick={() => setShowSelector(!showSelector)}
                        >
                            <Monitor className="w-4 h-4" />
                            <span className="text-sm font-medium">{selectedEnv.name}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showSelector && "rotate-180")} />
                        </Button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showSelector && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-full left-0 mb-2 w-72 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10"
                                >
                                    <div className="grid gap-1">
                                        {AMBIENT_ENVIRONMENTS.map(env => {
                                            const isLocked = env.isPremium && !userStats.isPremium;
                                            return (
                                                <button
                                                    key={env.id}
                                                    onClick={() => selectEnvironment(env)}
                                                    disabled={isLocked}
                                                    className={cn(
                                                        "flex items-center gap-3 p-2 rounded-lg transition-all text-left",
                                                        selectedEnv.id === env.id
                                                            ? "bg-primary/20 text-white"
                                                            : "hover:bg-white/10 text-white/70 hover:text-white",
                                                        isLocked && "opacity-50 cursor-not-allowed"
                                                    )}
                                                >
                                                    <img
                                                        src={env.thumbnail}
                                                        alt={env.name}
                                                        className="w-12 h-8 rounded object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium truncate">{env.name}</span>
                                                            {env.isPremium && (
                                                                isLocked
                                                                    ? <Lock className="w-3 h-3 text-yellow-500" />
                                                                    : <Crown className="w-3 h-3 text-yellow-500" />
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-white/50">{env.description}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-px h-6 bg-white/20" />

                    {/* Audio Controls */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/80 hover:text-white hover:bg-white/10"
                        onClick={toggleAudio}
                    >
                        {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>

                    <div className="w-24">
                        <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                        />
                    </div>

                    <div className="w-px h-6 bg-white/20" />

                    {/* Focus Mode Toggle */}
                    <Button
                        variant={focusMode ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                            "gap-2 text-sm",
                            focusMode
                                ? "bg-primary text-white"
                                : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setFocusMode(!focusMode)}
                    >
                        <Settings className="w-4 h-4" />
                        {t("Focus")}
                    </Button>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-[10]">
                {children}
            </div>
        </div>
    );
};

export default ZenWorkspace;
