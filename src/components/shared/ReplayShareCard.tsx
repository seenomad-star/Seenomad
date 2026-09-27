import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Share2, Download, Copy, Check, Play, Pause,
    Zap, Target, Clock, Trophy, Sparkles, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { KeystrokeData } from "@/hooks/useTypingGame";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

interface ReplayShareCardProps {
    stats: {
        wpm: number;
        accuracy: number;
        timeElapsed: number;
        correctChars: number;
        totalChars: number;
    };
    keystrokes: KeystrokeData[];
    text: string;
    examName?: string;
    onClose: () => void;
}

export const ReplayShareCard: React.FC<ReplayShareCardProps> = ({
    stats,
    keystrokes,
    text,
    examName,
    onClose
}) => {
    const { t } = useTranslation();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Generate heatmap data from keystrokes
    const heatmapData = React.useMemo(() => {
        if (!keystrokes.length) return [];

        // Calculate time deltas between keystrokes
        const deltas: { char: string; delta: number; correct: boolean }[] = [];
        for (let i = 1; i < keystrokes.length; i++) {
            const delta = keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
            deltas.push({
                char: text[keystrokes[i].index] || '',
                delta,
                correct: keystrokes[i].isCorrect
            });
        }
        return deltas;
    }, [keystrokes, text]);

    // Animation playback
    useEffect(() => {
        if (!isPlaying || currentIndex >= heatmapData.length) {
            setIsPlaying(false);
            return;
        }

        const delay = Math.min(heatmapData[currentIndex]?.delta || 100, 500);
        const timer = setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, delay / 3); // Speed up playback

        return () => clearTimeout(timer);
    }, [isPlaying, currentIndex, heatmapData]);

    const handlePlayPause = () => {
        if (currentIndex >= heatmapData.length) {
            setCurrentIndex(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleExportPNG = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: "#0F1113",
                scale: 2,
                useCORS: true
            });

            const link = document.createElement("a");
            link.download = `typingos-replay-${stats.wpm}wpm.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            toast.success(t("Replay exported as PNG!"));
        } catch (error) {
            toast.error(t("Export failed. Please try again."));
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopyLink = async () => {
        const challengeData = {
            w: stats.wpm,
            a: stats.accuracy,
            g: keystrokes.slice(0, 50).map(k => ({
                i: k.index,
                t: k.timestamp,
                c: k.isCorrect ? 1 : 0
            }))
        };

        const encoded = btoa(JSON.stringify(challengeData));
        const url = `${window.location.origin}/?challenge=${encoded}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success(t("Challenge link copied!"));
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error(t("Failed to copy link"));
        }
    };

    const handleShare = async () => {
        const shareText = t("I just typed {{wpm}} WPM with {{accuracy}}% accuracy on TypingOS! Can you beat me?", {
            wpm: stats.wpm,
            accuracy: stats.accuracy
        });

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "TypingOS Challenge",
                    text: shareText,
                    url: window.location.href
                });
            } catch {
                // User cancelled or share failed
            }
        } else {
            await navigator.clipboard.writeText(shareText);
            toast.success(t("Share text copied!"));
        }
    };

    // Get color based on keystroke speed
    const getHeatColor = (delta: number) => {
        if (delta < 80) return "bg-emerald-500";
        if (delta < 150) return "bg-primary";
        if (delta < 250) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="max-w-lg w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white/50 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {/* THE CARD */}
                    <div
                        ref={cardRef}
                        className="bg-gradient-to-br from-[#1A1C1E] via-[#0F1113] to-[#1A1C1E] rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden relative"
                    >
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg tracking-tight text-white">TypingOS</h3>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                        {t("Replay Card")}
                                    </p>
                                </div>
                            </div>
                            {examName && (
                                <Badge className="bg-white/10 text-white border-0 font-bold text-[10px]">
                                    {examName}
                                </Badge>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="relative z-10 grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
                                <div className="text-3xl font-black text-white">{stats.wpm}</div>
                                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">WPM</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                <Target className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                                <div className="text-3xl font-black text-white">{stats.accuracy}%</div>
                                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{t("Accuracy")}</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                <div className="text-3xl font-black text-white">
                                    {Math.floor(stats.timeElapsed / 60)}:{(stats.timeElapsed % 60).toString().padStart(2, '0')}
                                </div>
                                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{t("Time")}</div>
                            </div>
                        </div>

                        {/* Keystroke Heatmap */}
                        <div className="relative z-10 bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">
                                    {t("Keystroke Heatmap")}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[10px] text-white/70 hover:text-white"
                                    onClick={handlePlayPause}
                                >
                                    {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                                    {isPlaying ? t("Pause") : t("Replay")}
                                </Button>
                            </div>

                            {/* Heatmap visualization */}
                            <div className="flex flex-wrap gap-[2px] max-h-24 overflow-hidden">
                                {heatmapData.slice(0, 100).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: i <= currentIndex || !isPlaying ? 1 : 0,
                                            opacity: i <= currentIndex || !isPlaying ? 1 : 0.3
                                        }}
                                        className={cn(
                                            "w-2 h-2 rounded-sm transition-all",
                                            item.correct ? getHeatColor(item.delta) : "bg-red-500/50"
                                        )}
                                        title={`${item.char}: ${item.delta}ms`}
                                    />
                                ))}
                            </div>

                            {/* Speed Legend */}
                            <div className="flex items-center justify-center gap-4 mt-3 text-[9px] text-white/40 uppercase font-bold">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-emerald-500" /> {t("Fast")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-primary" /> {t("Good")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-yellow-500" /> {t("Slow")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-sm bg-red-500" /> {t("Error")}
                                </span>
                            </div>
                        </div>

                        {/* Branding */}
                        <div className="relative z-10 flex items-center justify-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" />
                            typingos.com
                            <Sparkles className="w-3 h-3" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <Button
                            onClick={handleExportPNG}
                            disabled={isExporting}
                            className="bg-primary hover:bg-primary/90 text-white font-bold gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? t("Exporting...") : t("Download PNG")}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleCopyLink}
                            className="border-white/20 text-white hover:bg-white/10 font-bold gap-2"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? t("Copied!") : t("Copy Link")}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleShare}
                            className="border-white/20 text-white hover:bg-white/10 font-bold gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            {t("Share")}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
