import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Rocket, Users, Zap, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const GalacticEventsWidget = () => {
    const { t } = useTranslation();
    const [totalWords, setTotalWords] = useState(8420551);
    const [activeAspirants, setActiveAspirants] = useState(1204);

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalWords(prev => prev + Math.floor(Math.random() * 54));
            setActiveAspirants(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-indigo-500/10 via-background to-transparent border-[1.5px] rounded-[2.5rem] shadow-2xl">
            {/* GLOW EFFECT */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

            <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/20">
                            <Globe className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest italic">{t('Galactic Event')}</CardTitle>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{t('Universe-wide objective active')}</p>
                        </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/20 uppercase font-black italic text-[9px]">Phase 12 Live</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
                <div className="p-5 rounded-3xl bg-secondary/30 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('Project Nebula')}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 underline decoration-dotted">18:42:05 {t('Remain')}</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">{t('Universal Progress')}</span>
                            <span className="text-xl font-black italic">8.4M / 10M</span>
                        </div>
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '84%' }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                            />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium italic">
                            TypingOS Galaxy has typed <span className="text-foreground font-bold">{totalWords.toLocaleString()}</span> {t('words today!')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-2 text-primary mb-1">
                                <Users className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-tight">{t('Agents Online')}</span>
                            </div>
                            <div className="text-lg font-black">{activeAspirants.toLocaleString()}</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                <Zap className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-tight">{t('Reward Pool')}</span>
                            </div>
                            <div className="text-lg font-black">50k 🔥</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <img
                                key={i}
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`}
                                className="w-6 h-6 rounded-full border-2 border-background grayscale hover:grayscale-0 transition-all cursor-pointer"
                                alt="Agent"
                            />
                        ))}
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">+ 1.2k {t('others contributing')}</span>
                </div>
            </CardContent>
        </Card>
    );
};
