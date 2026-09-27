
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Crown, Share2, ChevronRight, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeGalaxy } from "./ThemeGalaxy";
import { useNavigate } from "react-router-dom";
import { navigationCategories } from "@/data/navigationData";
import { useTranslation } from "react-i18next";

interface DynamicContentProps {
    activeCategory: string | null;
    setSubModalOpen: (open: boolean) => void;
    setOpen: (open: boolean) => void;
    setAiSettingsOpen: (open: boolean) => void;
}

export function DynamicContent({ activeCategory, setSubModalOpen, setOpen, setAiSettingsOpen }: DynamicContentProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const activeCatData = navigationCategories.find(c => c.id === activeCategory);

    return (
        <div className="flex-1 p-10 flex flex-col gap-8 bg-background/50 overflow-auto custom-scrollbar">
            <AnimatePresence mode="wait">
                {activeCategory === null ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col gap-8"
                    >
                        {/* TOP ROW: DAILY QUEST & PREMIUM */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-500 p-6 group cursor-pointer shadow-xl shadow-primary/20"
                                onClick={() => navigate("/earn")}
                            >
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                                    <Sparkles className="w-32 h-32" />
                                </div>
                                <Badge className="bg-white/20 text-white border-0 mb-4 font-black text-[10px] uppercase">{t('Active Quest')}</Badge>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">{t('Daily Spin & Win')}</h3>
                                <Button className="mt-8 bg-white text-primary hover:bg-white/90 font-black rounded-xl h-10 text-[10px] uppercase tracking-widest px-6 shadow-lg">
                                    Draw Level-UP Rewards
                                </Button>
                            </motion.div>

                            <div
                                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 p-6 group cursor-pointer shadow-xl shadow-indigo-500/20"
                                onClick={() => navigate("/marketplace")}
                            >
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                                    <Crown className="w-32 h-32 text-indigo-200" />
                                </div>
                                <Badge className="bg-white/20 text-white border-0 mb-4 font-black text-[10px]">VIP OS</Badge>
                                <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-tight">{t('Unlock AI Coach')}</h3>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen(false);
                                        setSubModalOpen(true);
                                    }}
                                    className="mt-8 bg-black/40 hover:bg-black/60 text-white font-black rounded-xl h-10 text-[10px] uppercase tracking-widest px-6 border border-white/20 backdrop-blur-md"
                                >
                                    {t('Get PRO')}
                                </Button>
                            </div>
                        </div>

                        {/* THEME GALAXY */}
                        <ThemeGalaxy setSubModalOpen={setSubModalOpen} />

                        {/* VIRAL REFERRAL */}
                        <div className="bg-muted/30 border border-border/40 rounded-[2.5rem] p-8 flex items-center gap-6 justify-between group hover:bg-muted/50 transition-all cursor-pointer" onClick={() => navigate("/community")}>
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                                    <Share2 className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-base font-black tracking-tighter uppercase leading-none">Refer & Earn Coins</h4>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 mt-1">Unlock exclusive themes with friends</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                {activeCatData && <activeCatData.icon className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">{activeCatData?.label}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Sub-Module Exploration</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {activeCatData?.subOptions.map((opt) => (
                                <button
                                    key={opt.title}
                                    onClick={() => {
                                        if (opt.url === "#ai-settings") {
                                            setOpen(false);
                                            setAiSettingsOpen(true);
                                        } else {
                                            setOpen(false);
                                            navigate(opt.url);
                                        }
                                    }}
                                    className="group bg-muted/20 hover:bg-primary/5 border border-border/30 hover:border-primary/20 rounded-3xl p-6 flex flex-col gap-3 transition-all text-left active:scale-[0.98]"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <opt.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:rotate-3" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">{t(opt.title)}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase group-hover:text-foreground/40 transition-colors mt-0.5">{t(opt.desc)}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* CONTEXTUAL HELP */}
                        <div className="mt-auto p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-6">
                            <div className="p-3 rounded-full bg-primary/20 animate-pulse">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-primary">System Tip</span>
                                <span className="text-[11px] font-bold text-muted-foreground">Mastering {activeCatData?.label} modules increases your OS Efficiency Rank.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
