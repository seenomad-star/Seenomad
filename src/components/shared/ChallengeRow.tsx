import React from "react";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, Award, Trophy } from "lucide-react";
import { DailyChallenge } from "@/contexts/GamificationContext";

export const SparkleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
);

interface ChallengeRowProps {
    challenge: DailyChallenge;
}

export const ChallengeRow: React.FC<ChallengeRowProps> = ({ challenge }) => {
    const progress = (challenge.current / challenge.target) * 100;

    const getIcon = () => {
        switch (challenge.type) {
            case "wpm": return <Zap className="w-4 h-4" />;
            case "accuracy": return <Target className="w-4 h-4" />;
            case "tests": return <Award className="w-4 h-4" />;
            default: return <Trophy className="w-4 h-4" />;
        }
    };

    return (
        <div className={`p-4 rounded-xl border transition-all ${challenge.completed ? 'bg-emerald-500/5 border-emerald-500/20 shadow-none' : 'bg-secondary/20 border-border/30 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${challenge.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-card text-muted-foreground'}`}>
                        {getIcon()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight">{challenge.title}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{challenge.description}</span>
                    </div>
                </div>
                {challenge.completed ? (
                    <div className="flex items-center gap-1 text-emerald-500">
                        <Zap className="w-3 h-3 fill-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Done</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-primary/60">
                        <SparkleIcon className="w-3 h-3" />
                        <span className="text-[10px] font-black tracking-tighter">+{challenge.reward}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3">
                <Progress value={progress} className={`h-1.5 flex-1 ${challenge.completed ? 'bg-emerald-500/10' : ''}`} />
                <span className="text-[10px] font-black text-muted-foreground whitespace-nowrap">
                    {challenge.current}/{challenge.target}
                </span>
            </div>
        </div>
    );
};
