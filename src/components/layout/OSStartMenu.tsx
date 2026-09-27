
import React, { useState } from "react";
import {
    Keyboard,
    Library,
    Globe,
    GraduationCap,
    Gamepad2,
    Bot,
    Car,
    Trophy,
    Users,
    Coins,
    BarChart3,
    Search,
    Settings,
    Sparkles,
    Settings2,
    Home,
    BookOpen,
    Hash,
    Zap,
    Gift,
    ShoppingCart,
    Medal,
    Building2,
    Crown,
    Activity,
    History,
    Share2,
    Share,
    Star,
    Play,
    Rocket,
    Swords,
    FileText,
    Quote,
    MapPin,
    Monitor,
    Type,
    Briefcase,
    Heart,
    Hammer,
    Shield,
    Cpu
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useGamification } from "@/contexts/GamificationContext";
import { AISettingsModal } from "@/components/ai/AISettingsModal";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { UserProfileCard } from "./start-menu/UserProfileCard";
import { NavigationList } from "./start-menu/NavigationList";
import { DynamicContent } from "./start-menu/DynamicContent";
import { Logo } from "../shared/Logo";
import { useTranslation } from "react-i18next";
import { Languages as LangIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { navigationCategories, themeOptions } from "@/data/navigationData";

export function OSStartMenu() {
    const { t, i18n } = useTranslation();
    const { userStats, getXPForNextLevel } = useGamification();
    const [open, setOpen] = useState(false);
    const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const xpForNext = getXPForNextLevel();
    const currentLevelXP = Math.pow(userStats.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(userStats.level, 2) * 100;
    const progressInLevel = userStats.xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const progressPercent = xpNeededForLevel > 0 ? (progressInLevel / xpNeededForLevel) * 100 : 0;

    return (
        <DropdownMenu open={open} onOpenChange={(v) => {
            setOpen(v);
            if (!v) setActiveCategory(null);
        }}>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden cursor-pointer border border-primary/20"
                >
                    <div className="relative">
                        <Logo size={28} className="text-background" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </div>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[850px] p-0 bg-card/95 backdrop-blur-3xl border-border/50 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
                sideOffset={15}
                align="start"
            >
                <div className="flex h-[600px]">
                    {/* LEFT PANEL - NAVIGATION & PROFILE */}
                    <div className="w-[320px] bg-muted/20 border-r border-border/30 p-8 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <UserProfileCard />
                        </div>
                        <NavigationList activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

                        {/* PROGRESS FOOTER */}
                        <div className="space-y-3 mt-auto">
                            <div className="flex justify-between items-end px-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{t('XP Pulse')}</span>
                                <span className="text-[9px] font-black text-primary">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL - DYNAMIC CONTENT */}
                    <DynamicContent
                        activeCategory={activeCategory}
                        setSubModalOpen={setSubModalOpen}
                        setOpen={setOpen}
                        setAiSettingsOpen={setAiSettingsOpen}
                    />
                </div>
            </DropdownMenuContent>
            <AISettingsModal open={aiSettingsOpen} onOpenChange={setAiSettingsOpen}>
                <span className="hidden" />
            </AISettingsModal>
            <SubscriptionModal open={subModalOpen} onOpenChange={setSubModalOpen}>
                <span className="hidden" />
            </SubscriptionModal>
        </DropdownMenu>
    );
}
