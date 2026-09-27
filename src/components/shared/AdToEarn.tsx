import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Coins, X, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/utils/utils";
import { toast } from "sonner";

interface AdToEarnProps {
    onComplete?: () => void;
    rewardAmount?: number;
}

export const AdToEarn: React.FC<AdToEarnProps> = ({
    onComplete,
    rewardAmount = 50
}) => {
    const { addCoins } = useGamification();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const progressBarRef = React.useRef<HTMLDivElement>(null);

    const startAd = () => {
        setIsPlaying(true);
        setProgress(0);

        // Simulate ad progress
        const duration = 15000; // 15 seconds
        const interval = 100;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    finishAd();
                    return 100;
                }
                return prev + step;
            });
        }, interval);
    };

    const finishAd = () => {
        setIsFinished(true);
        setIsPlaying(false);
        addCoins(rewardAmount);
        toast.success("Reward Earned!", {
            description: `You've received ${rewardAmount} coins for watching the sponsored video.`,
        });
        if (onComplete) onComplete();
    };

    // Update progress bar width imperatively to avoid JSX style= prop
    React.useEffect(() => {
        if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress}%`;
        }
    }, [progress]);

    return (
        <Card className="bg-[#1A1C1E]/60 border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-500">
            <CardContent className="p-0">
                {!isPlaying && !isFinished ? (
                    <div className="p-6 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/5 group-hover:scale-110 transition-transform duration-500">
                                <Coins className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight uppercase">Watch & Earn</h3>
                                <p className="text-xs text-muted-foreground font-medium">Earn {rewardAmount} coins by watching a short video.</p>
                            </div>
                        </div>
                        <Button
                            onClick={startAd}
                            className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-amber-500/20"
                        >
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Watch Now
                        </Button>
                    </div>
                ) : isPlaying ? (
                    <div className="relative h-24 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 animate-pulse">Sponsored Video Playing...</span>
                            <div
                                ref={progressBarRef}
                                className="h-full bg-amber-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            />
                            <span className="text-[10px] font-mono text-amber-500 font-bold">{Math.ceil((100 - progress) / 6.6)}s remaining</span>
                        </div>

                        {/* Visual simulation of "content" */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="w-full h-full bg-gradient-to-r from-primary via-purple-500 to-amber-500 animate-[gradient_3s_infinite]" />
                        </div>
                    </div>
                ) : (
                    <div className="p-6 flex items-center justify-between gap-6 bg-emerald-500/5">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight uppercase text-emerald-500">Reward Claimed!</h3>
                                <p className="text-xs text-muted-foreground font-medium">You received +{rewardAmount} coins. Come back later for more.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            disabled
                            className="h-12 px-8 border-emerald-500/20 text-emerald-500 font-black uppercase tracking-widest text-[10px] rounded-2xl"
                        >
                            Completed
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
