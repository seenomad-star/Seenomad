import React from "react";
import { Trophy, Share2, Download, Zap, Target, Star, Crown, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { toast } from "sonner";
import { KeystrokeHeatmap } from "@/components/typing/KeystrokeHeatmap";
import { KeystrokeData } from "@/hooks/useTypingGame";
import { cn } from "@/utils/utils";

interface MomentOfGloryProps {
    stats: {
        wpm: number;
        accuracy: number;
        rank: string;
        examName: string;
        percentile: number;
    };
    keystrokes: KeystrokeData[];
    text: string;
    onShare?: () => void;
}

export const MomentOfGlory: React.FC<MomentOfGloryProps> = ({ stats, keystrokes, text, onShare }) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = React.useState(false);
    const [showHeatmap, setShowHeatmap] = React.useState(false);

    React.useEffect(() => {
        // High-dopamine arrival
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                backgroundColor: '#0F1113',
                style: {
                    transform: 'scale(1)',
                    borderRadius: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `TypingOS-Glory-${stats.examName.replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Moment of Glory saved to your device!");
        } catch (err) {
            console.error('oops, something went wrong!', err);
            toast.error("Failed to export glory card.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md mx-auto"
        >
            <div ref={cardRef} className="p-4 bg-[#0F1113]">
                <Card className="overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-[#121417] to-[#0F1113] shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                    <div className="relative h-48 bg-primary/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="relative z-10"
                        >
                            <Crown className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                        </motion.div>

                        {/* Floating Particles Decoration */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-primary rounded-full"
                                animate={{
                                    y: [0, -100],
                                    opacity: [0, 1, 0],
                                    x: Math.sin(i) * 50
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: i * 0.5
                                }}
                                style={{ bottom: 0, left: `${20 + i * 15}%` }}
                            />
                        ))}
                    </div>

                    <CardContent className="p-8 space-y-6 relative">
                        <div className="text-center space-y-1">
                            <Badge variant="outline" className="border-primary/50 text-primary font-black uppercase text-[10px]">Mission Accomplished</Badge>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">{stats.examName}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-500" /> Peak Speed
                                </span>
                                <div className="text-2xl font-black italic">{stats.wpm} <span className="text-xs">WPM</span></div>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                    <Target className="w-3 h-3 text-primary" /> Accuracy
                                </span>
                                <div className="text-2xl font-black italic">{stats.accuracy}%</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center no-export">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Session Flow Heatmap</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={cn("text-[9px] font-black uppercase h-6 px-2 border border-white/5 truncate", showHeatmap ? "text-primary" : "text-muted-foreground")}
                            >
                                {showHeatmap ? 'Hide Map' : 'Show Map'}
                            </Button>
                        </div>

                        {showHeatmap && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="overflow-hidden"
                            >
                                <KeystrokeHeatmap keystrokes={keystrokes} text={text} className="p-4 bg-black/60" />
                            </motion.div>
                        )}

                        <Card className="bg-primary/5 border-dashed border-primary/30 p-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase text-muted-foreground">Global Rank</span>
                                    <div className="text-xl font-black text-primary">#{stats.rank}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[9px] font-black uppercase text-muted-foreground">Percentile</span>
                                    <div className="text-lg font-bold italic">Top {100 - stats.percentile}%</div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex gap-3 no-export">
                            <Button className="flex-1 h-12 font-black uppercase text-xs gap-2" onClick={onShare}>
                                <Share2 className="w-4 h-4" />
                                Share Glory
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 w-12 p-0"
                                onClick={handleDownload}
                                disabled={isExporting}
                                aria-label="Download Card"
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            </Button>
                        </div>

                        <p className="text-[9px] text-center text-muted-foreground font-medium uppercase tracking-widest mt-4">
                            Verified by TypingOS Career Insights • typingos.com
                        </p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};
