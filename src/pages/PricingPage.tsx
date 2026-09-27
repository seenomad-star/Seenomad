import React from 'react';
import { Check, X, Zap, Crown, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

import { toast } from "sonner";

export const PricingPage: React.FC = () => {
    const { t } = useTranslation();

    const handleCheckout = async (tierName: string, price: string) => {
        if (tierName === 'free') return;

        toast.loading("Opening secure terminal...");

        // Simulated local upgrade for database-free system
        setTimeout(() => {
            toast.dismiss();
            toast.success(`${tierName.toUpperCase()} Status Activated!`, {
                description: "Your local terminal has been upgraded to PRO. (Simulation)"
            });
            // Note: In a real app, this would involve a local payment check
            // For now, we'll just simulate the UI feedback. 
            // The isPremium state is managed in GamificationContext.
        }, 1500);
    };

    const tiers = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            description: "Essential typing practice for everyone.",
            features: [
                "Unlimited Typing Tests",
                "Basic Stats & History",
                "3 Daily Games",
                "Standard Themes"
            ],
            notIncluded: [
                "Advanced AI Analysis",
                "Pro Courses",
                "Custom Practice Modes",
                "No Ads"
            ],
            cta: "Current Plan",
            popular: false,
            icon: <Zap className="w-6 h-6 text-blue-400" />
        },
        {
            name: "Pro",
            price: "$4.99",
            period: "/month",
            description: "Supercharge your speed with AI insights.",
            features: [
                "Everything in Free",
                "AI Coach Analysis",
                "Unlimited Game Access",
                "Premium Themes & Sounds",
                "Ad-Free Experience",
                "Certified Speed Tests"
            ],
            notIncluded: [
                "Team Management",
                "API Access"
            ],
            cta: "Upgrade to Pro",
            popular: true,
            icon: <Crown className="w-6 h-6 text-yellow-400" />
        },
        {
            name: "Team",
            price: "$19.99",
            period: "/user/month",
            description: "For schools and businesses.",
            features: [
                "Everything in Pro",
                "Central Dashboard",
                "Member Management",
                "Performance Reports",
                "SSO Integration",
                "Priority Support"
            ],
            notIncluded: [],
            cta: "Contact Sales",
            popular: false,
            icon: <Building className="w-6 h-6 text-purple-400" />
        }
    ];

    return (
        <div className="min-h-screen bg-black/95 text-white py-24 px-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black tracking-tight mb-4">
                        Unlock Your Full <span className="text-primary italic">Potential</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your goals. Upgrade to Pro for the ultimate typing experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative bg-secondary/10 border-white/10 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-8px] ${tier.popular ? 'border-primary shadow-[0_0_30px_rgba(37,99,235,0.2)]' : ''}`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary px-4 py-1">MOST POPULAR</Badge>
                                </div>
                            )}

                            <CardHeader>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        {tier.icon}
                                    </div>
                                    {tier.name === "Pro" && <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">7-Day Free Trial</Badge>}
                                </div>
                                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <CardDescription className="text-base text-muted-foreground">
                                        {tier.description}
                                    </CardDescription>
                                    {tier.name !== "Free" && (
                                        <>
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5">
                                                {Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Kolkata' ? 'UPI Available' :
                                                    Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Sao_Paulo' ? 'Pix Available' :
                                                        Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Amsterdam' ? 'iDEAL Available' :
                                                            'Local Methods Enabled'}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black">{tier.price}</span>
                                    <span className="text-muted-foreground">{tier.period}</span>
                                </div>

                                <ul className="space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm">
                                            <div className="bg-green-500/20 p-1 rounded-full">
                                                <Check className="w-3 h-3 text-green-500" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                    {tier.notIncluded.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground opacity-50">
                                            <div className="bg-red-500/10 p-1 rounded-full">
                                                <X className="w-3 h-3 text-red-500" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    onClick={() => handleCheckout(tier.name.toLowerCase(), tier.price)}
                                    className={`w-full h-12 text-lg font-bold ${tier.popular ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                                    variant={tier.popular ? "default" : "secondary"}
                                >
                                    {tier.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-24 text-center border-t border-white/10 pt-12">
                    <p className="text-muted-foreground">
                        Trusted by top typists from companies like Google, Microsoft, and Amazon.
                    </p>
                    <div className="flex justify-center gap-12 mt-8 opacity-40 grayscale">
                        {/* Mock Logos */}
                        <div className="font-black text-2xl">GOOGLE</div>
                        <div className="font-black text-2xl">MICROSOFT</div>
                        <div className="font-black text-2xl">AMAZON</div>
                        <div className="font-black text-2xl">META</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
