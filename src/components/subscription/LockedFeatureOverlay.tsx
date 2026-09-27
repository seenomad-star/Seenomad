
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { cn } from "@/utils/utils";
import { useGamification } from "@/contexts/GamificationContext";

interface LockedFeatureOverlayProps {
    children: React.ReactNode;
    isLocked?: boolean;
    featureName?: string;
    description?: string;
    className?: string;
}

export function LockedFeatureOverlay({
    children,
    isLocked,
    featureName = "Premium Feature",
    description = "Upgrade to Pro Plus to unlock this feature.",
    className
}: LockedFeatureOverlayProps) {
    const { userStats } = useGamification();

    // If not explicitly passed, assume locked if not premium
    const locked = isLocked !== undefined ? isLocked : !userStats.isPremium;

    if (!locked) return <>{children}</>;

    return (
        <div className={cn("relative w-full h-full", className)}>
            <div className="w-full h-full filter blur-sm pointer-events-none opacity-50 select-none">
                {children}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[2px] z-10 p-6 text-center animate-in fade-in duration-500">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
                    <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{featureName}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-[80%]">{description}</p>

                <SubscriptionModal>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black shadow-xl rounded-xl">
                        <Crown className="w-4 h-4 mr-2" />
                        Unlock Pro Plus
                    </Button>
                </SubscriptionModal>
            </div>
        </div>
    );
}
