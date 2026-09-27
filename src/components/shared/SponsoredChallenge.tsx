import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Zap, Star, ExternalLink, Gift, Trophy,
    Clock, ChevronRight, Sparkles
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface SponsoredChallengeData {
    id: string;
    sponsorName: string;
    sponsorLogo: string;
    title: string;
    description: string;
    textPassage: string;
    xpMultiplier: number;
    coinReward: number;
    expiresIn: string;
    bgGradient: string;
    accentColor: string;
}

// Sample sponsored challenges
const SAMPLE_CHALLENGES: SponsoredChallengeData[] = [
    {
        id: "tech_giant_1",
        sponsorName: "TechCorp Pro",
        sponsorLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=techcorp&backgroundColor=3b82f6",
        title: "Speed Challenge",
        description: "Type the future of technology",
        textPassage: "Experience the next generation of innovation with our groundbreaking AI-powered productivity suite.",
        xpMultiplier: 2,
        coinReward: 50,
        expiresIn: "2h 30m",
        bgGradient: "from-blue-600/20 to-cyan-600/20",
        accentColor: "text-blue-400"
    },
    {
        id: "gaming_1",
        sponsorName: "GameForge",
        sponsorLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=gameforge&backgroundColor=8b5cf6",
        title: "Ultimate Typing Quest",
        description: "Master the keyboard, conquer the game",
        textPassage: "Join millions of players in the most immersive gaming experience ever created.",
        xpMultiplier: 3,
        coinReward: 75,
        expiresIn: "5h 15m",
        bgGradient: "from-purple-600/20 to-pink-600/20",
        accentColor: "text-purple-400"
    }
];

interface SponsoredChallengeProps {
    challenge?: SponsoredChallengeData;
    variant?: "compact" | "full";
    onStart?: () => void;
}

export const SponsoredChallenge: React.FC<SponsoredChallengeProps> = ({
    challenge = SAMPLE_CHALLENGES[0],
    variant = "full",
    onStart
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleStart = () => {
        if (onStart) {
            onStart();
        } else {
            // Navigate to typing test with sponsored content
            toast.success(t("Starting sponsored challenge!"));
            navigate(`/speed-typing?sponsored=${challenge.id}`);
        }
    };

    if (variant === "compact") {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card
                    className={cn(
                        "relative overflow-hidden cursor-pointer transition-all border-white/10",
                        `bg-gradient-to-r ${challenge.bgGradient}`
                    )}
                    onClick={handleStart}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            {/* Sponsor Logo */}
                            <img
                                src={challenge.sponsorLogo}
                                alt={challenge.sponsorName}
                                className="w-10 h-10 rounded-lg"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{t("Sponsored")}</span>
                                    <Badge className="bg-yellow-500/20 text-yellow-400 text-[9px]">
                                        {challenge.xpMultiplier}x XP
                                    </Badge>
                                </div>
                                <h4 className="font-bold text-sm truncate">{challenge.title}</h4>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.01 }}
        >
            <Card
                className={cn(
                    "relative overflow-hidden border-white/10",
                    `bg-gradient-to-br ${challenge.bgGradient}`
                )}
            >
                {/* Animated background glow */}
                <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px]"
                    style={{ backgroundColor: isHovered ? "rgba(var(--primary), 0.3)" : "rgba(var(--primary), 0.1)" }}
                    animate={{ scale: isHovered ? 1.2 : 1 }}
                    transition={{ duration: 0.3 }}
                />

                <CardContent className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={challenge.sponsorLogo}
                                alt={challenge.sponsorName}
                                className="w-12 h-12 rounded-xl border border-white/10"
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider border-white/20">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        {t("Sponsored")}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {challenge.expiresIn}
                                    </span>
                                </div>
                                <h3 className="font-black text-lg">{challenge.title}</h3>
                            </div>
                        </div>

                        {/* Rewards */}
                        <div className="flex flex-col items-end gap-1">
                            <Badge className="bg-yellow-500/20 text-yellow-400 font-black">
                                <Zap className="w-3 h-3 mr-1" />
                                {challenge.xpMultiplier}x XP
                            </Badge>
                            <Badge className="bg-emerald-500/20 text-emerald-400">
                                <Gift className="w-3 h-3 mr-1" />
                                +{challenge.coinReward} Coins
                            </Badge>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                        {challenge.description}
                    </p>

                    {/* Preview Text */}
                    <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/5">
                        <p className="text-sm font-mono text-white/70 line-clamp-2">
                            "{challenge.textPassage}"
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            {t("Powered by")}
                            <span className={cn("font-bold", challenge.accentColor)}>
                                {challenge.sponsorName}
                            </span>
                            <ExternalLink className="w-3 h-3" />
                        </span>

                        <Button
                            onClick={handleStart}
                            className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                            <Trophy className="w-4 h-4" />
                            {t("Start Challenge")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Widget version for dashboard
export const SponsoredChallengeWidget: React.FC = () => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {t("Featured Challenge")}
                    </h3>
                    <div className="flex gap-1">
                        {SAMPLE_CHALLENGES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`View challenge ${i + 1}`}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    i === currentIndex ? "bg-primary" : "bg-white/20"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <SponsoredChallenge
                    challenge={SAMPLE_CHALLENGES[currentIndex]}
                    variant="compact"
                />
            </CardContent>
        </Card>
    );
};

export default SponsoredChallenge;
