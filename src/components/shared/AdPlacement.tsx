import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Crown, Info } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/utils/utils";

interface AdPlacementProps {
    type?: "horizontal" | "vertical" | "box" | "skyscraper";
    className?: string;
    mockData?: {
        title: string;
        description: string;
        cta: string;
        color: string;
    };
}

const ads = [
    {
        title: "Master Touch Typing",
        description: "Unlock all lessons and premium certifications today.",
        cta: "Start Learning",
        color: "from-blue-500/20 to-purple-500/20",
    },
    {
        title: "SSC CGL 2024 Prep",
        description: "Get the latest typing sets for SSC CGL with 100% accuracy.",
        cta: "Join Mock Test",
        color: "from-orange-500/20 to-red-500/20",
    },
    {
        title: "TypingOS Pro",
        description: "The ultimate typing companion. No ads, just performance.",
        cta: "Upgrade Now",
        color: "from-emerald-500/20 to-teal-500/20",
    }
];

export const AdPlacement: React.FC<AdPlacementProps> = ({
    type = "horizontal",
    className,
    mockData
}) => {
    const { userStats } = useGamification();

    // Don't show ads for premium users
    if (userStats.isPremium) return null;

    const ad = mockData || ads[Math.floor(Math.random() * ads.length)];

    return (
        <Card className={cn(
            "relative overflow-hidden border-white/5 bg-secondary/10 hover:bg-secondary/20 transition-all group",
            type === "horizontal" && "w-full p-4 flex flex-col md:flex-row items-center gap-4",
            type === "vertical" && "w-full p-4 flex flex-col gap-3 min-w-0",
            type === "skyscraper" && "w-full p-4 flex flex-col gap-4 justify-between border-primary/10 bg-primary/5 overflow-hidden",
            type === "box" && "aspect-square p-6 flex flex-col justify-center gap-4",
            className
        )}>
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50 -z-10",
                ad.color
            )} />

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider py-0 px-1 border-white/10 text-muted-foreground bg-black/20">
                        Sponsored
                    </Badge>
                    <Info className="w-3 h-3 text-muted-foreground/30" />
                </div>
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {ad.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {ad.description}
                </p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="h-8 gap-2 px-4 shadow-xl">
                    {ad.cta}
                    <ExternalLink className="w-3 h-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                >
                    <Crown className="w-3 h-3" />
                    Remove Ads
                </Button>
            </div>
        </Card>
    );
};
