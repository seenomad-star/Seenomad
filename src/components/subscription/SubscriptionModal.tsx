
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, X, Sparkles, Zap } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { cn } from "@/utils/utils";

interface SubscriptionModalProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function SubscriptionModal({ open, onOpenChange, children }: SubscriptionModalProps) {
    const { userStats, subscribe } = useGamification();
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const showOpen = isControlled ? open : internalOpen;
    const setShowOpen = isControlled && onOpenChange ? onOpenChange : setInternalOpen;
    const [loading, setLoading] = useState(false);

    const handleSubscribe = () => {
        setLoading(true);
        // Simulate payment
        setTimeout(() => {
            subscribe();
            setLoading(false);
            setShowOpen(false);
        }, 2000);
    };

    const features = [
        { name: "Global Typing Leaderboards", free: true, pro: true },
        { name: "Daily Earn Quests", free: true, pro: true },
        { name: "Basic Themes (Dark/Light)", free: true, pro: true },
        { name: "Unlimited AI Coach Access", free: false, pro: true },
        { name: "Premium Themes (Cyberpunk, etc.)", free: false, pro: true },
        { name: "Advanced Analytics & History", free: false, pro: true },
        { name: "Ad-Free Experience", free: false, pro: true },
        { name: "Priority Support", free: false, pro: true },
    ];

    return (
        <Dialog open={showOpen} onOpenChange={setShowOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" className="gap-2">
                        <Crown className="w-4 h-4 text-amber-500" />
                        Get Pro Plus
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-none sm:rounded-[2rem]">
                <div className="grid md:grid-cols-2">
                    {/* FREE TIER */}
                    <div className="p-8 md:p-12 bg-muted/20 flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-widest mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-foreground">$0</span>
                                <span className="text-sm font-medium text-muted-foreground">/ forever</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">Perfect for casual typists starting their journey.</p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {feature.free ? (
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <X className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    )}
                                    <span className={cn("text-sm", feature.free ? "text-foreground" : "text-muted-foreground line-through opacity-50")}>
                                        {feature.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="mt-8 w-full rounded-xl" onClick={() => setShowOpen(false)}>
                            Continue Free
                        </Button>
                    </div>

                    {/* PRO PLUS TIER */}
                    <div className="p-8 md:p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold px-3 py-1">MOST POPULAR</Badge>
                        </div>

                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
                            <Sparkles className="w-64 h-64" />
                        </div>

                        <div className="mb-8 relative z-10">
                            <h3 className="text-lg font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Crown className="w-5 h-5" /> Pro Plus
                            </h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">$9.99</span>
                                <span className="text-sm font-medium text-indigo-200">/ month</span>
                            </div>
                            <p className="text-sm text-indigo-100 mt-4">Unleash your full potential with AI and premium tools.</p>
                        </div>

                        <div className="space-y-4 flex-1 relative z-10">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {feature.pro ? (
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    ) : null}
                                    <span className="text-sm text-white font-medium">
                                        {feature.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleSubscribe}
                            disabled={loading || userStats.isPremium}
                            className="mt-8 w-full rounded-xl bg-white text-indigo-600 hover:bg-white/90 font-black h-12 text-base shadow-xl relative z-10"
                        >
                            {loading ? "Processing..." : userStats.isPremium ? "Plan Active" : "Upgrade to Pro Plus"}
                            {!loading && !userStats.isPremium && <Zap className="w-4 h-4 ml-2 fill-current" />}
                        </Button>

                        <p className="text-[10px] text-indigo-200/60 text-center mt-3">
                            Secure payment powered by Stripe (Simulated)
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
