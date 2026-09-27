import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Trophy, Skull } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';

interface ViralShareCardProps {
    wpm: number;
    accuracy: number;
    rank: string; // e.g., "Top 1%"
    username: string;
    isBattleRoyale?: boolean;
    defeatedPlayers?: number;
}

export const ViralShareCard: React.FC<ViralShareCardProps> = ({
    wpm,
    accuracy,
    rank,
    username,
    isBattleRoyale,
    defeatedPlayers = 0
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleShare = async () => {
        // Construct the dynamic sharing URL
        const shareParams = new URLSearchParams({
            score: wpm.toString(),
            accuracy: accuracy.toString(),
            username,
            id: Math.random().toString(36).substring(7) // In prod, this would be a DB record ID
        });

        const shareLink = `https://typingos.com/share?${shareParams.toString()}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: isBattleRoyale ? 'I Survived Typing Battle Royale!' : 'Check out my TypingOS Speed!',
                    text: isBattleRoyale
                        ? `I defeated ${defeatedPlayers} players in a Typing Battle Royale with ${wpm} WPM! 🔥`
                        : `I just hit ${wpm} WPM on TypingOS! Can you beat me?`,
                    url: shareLink,
                });
                toast.success("Shared successfully!");
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error("Error sharing", error);
                }
            }
        } else {
            // Fallback: Copy link to clipboard
            try {
                await navigator.clipboard.writeText(shareLink);
                toast.success("Share link copied to clipboard!");
            } catch (err) {
                toast.error("Could not copy link.");
            }
        }
    };

    const handleDownload = () => {
        // In a real implementation, we would use html2canvas here
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)),
            {
                loading: 'Generating image...',
                success: 'Image downloaded!',
                error: 'Failed to generate image'
            }
        );
    };

    return (
        <div className="space-y-4">
            <div ref={cardRef} className="relative w-full max-w-md mx-auto aspect-[4/5] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-black italic tracking-tighter">TYPING<span className="text-indigo-400">OS</span></h3>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Main Stats */}
                    <div className="text-center space-y-2">
                        <div className={cn(
                            "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg",
                            isBattleRoyale
                                ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-rose-500/30"
                                : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30"
                        )}>
                            {isBattleRoyale ? <Skull className="w-10 h-10 text-white" /> : <Trophy className="w-10 h-10 text-white" />}
                        </div>
                        <h1 className="text-7xl font-black tracking-tighter italic leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {wpm}
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-[0.5em] text-indigo-400">
                            {isBattleRoyale ? "SURVIVAL WPM" : "WPM Speed"}
                        </p>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Accuracy</p>
                            <p className="text-2xl font-black">{accuracy}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                {isBattleRoyale ? "Defeated" : "Global Rank"}
                            </p>
                            <p className={cn("text-2xl font-black", isBattleRoyale ? "text-rose-500" : "text-amber-400")}>
                                {isBattleRoyale ? `${defeatedPlayers} Players` : rank}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10 text-center">
                        <p className="text-xs font-medium text-white/40">@{username} • typingos.com</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 justify-center">
                <Button onClick={handleShare} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Share2 className="w-4 h-4" /> Share Result
                </Button>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" /> Save Image
                </Button>
            </div>
        </div>
    );
};
