import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGamification } from "@/contexts/GamificationContext";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    Trophy,
    Target,
    Zap,
    Flame,
    Crown,
    Sparkles,
    History,
    Star,
    Shield,
    Clock,
    Layout,
    User as UserIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";

const Profile = () => {
    const { t } = useTranslation();
    const { userStats, getXPForNextLevel } = useGamification();
    const { currentWPM = 0, currentAccuracy = 100 } = useTypingSession();
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        username: "",
        display_name: "",
        bio: "",
        avatar_url: "",
        social_links: {} as any,
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const STORAGE_KEY = 'typing-user-profile';

    const loadProfile = async () => {
        try {
            setLoading(true);
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                setProfileData({
                    username: data.username || "",
                    display_name: data.display_name || "",
                    bio: data.bio || "",
                    avatar_url: data.avatar_url || "",
                    social_links: data.social_links || {},
                });
            } else {
                // Default profile for new local users
                setProfileData(prev => ({
                    ...prev,
                    username: "local_pilot",
                    display_name: "Local Pilot"
                }));
            }
        } catch (error) {
            console.error('Error in loadProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentLevelXP = Math.pow(userStats.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(userStats.level, 2) * 100;
    const progressInLevel = userStats.xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const progressPercent = xpNeededForLevel > 0 ? (progressInLevel / xpNeededForLevel) * 100 : 0;

    const stats = [
        { label: "Level", value: userStats.level, icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Total XP", value: userStats.xp.toLocaleString(), icon: Zap, color: "text-primary", bg: "bg-primary/10" },
        { label: "Coins", value: userStats.coins.toLocaleString(), icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10" },
        { label: "Streak", value: `${userStats.streak} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[3rem] bg-card border border-white/5 p-8 md:p-12 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <UserIcon className="w-64 h-64" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden shadow-2xl bg-secondary flex items-center justify-center">
                                {profileData.avatar_url ? (
                                    <img
                                        src={profileData.avatar_url}
                                        alt={profileData.display_name || "User avatar"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-muted-foreground/50" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-card">
                                {userStats.level}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-4xl font-black tracking-tight uppercase">
                                    {profileData.display_name || profileData.username || t('Neo-Typist')}
                                </h1>
                                {userStats.isPremium && (
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 py-1 px-3">
                                        <Crown className="w-3 h-3 mr-1.5 fill-current" />
                                        PRO OS
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mb-6">
                                {profileData.bio || t('Status: Combat Ready • Nexus Connected')}
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                                    <span className="text-primary/60">XP Progress</span>
                                    <span className="text-primary">{Math.floor(progressPercent)}% to Level {userStats.level + 1}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => setShowEditModal(true)} variant="outline" className="rounded-2xl border-white/10 h-12 px-6">
                                Edit Bio
                            </Button>
                            <Button className="rounded-2xl bg-primary text-black font-black h-12 px-8 hover:scale-105 transition-transform">
                                Share Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/20 transition-all">
                                <CardContent className="p-6">
                                    <div className={cn("inline-flex p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <h3 className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                                    <p className="text-2xl font-black text-white">{stat.value}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Sections */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-white/5 bg-card/30">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                        <History className="w-5 h-5 text-primary" />
                                        Neural Performance
                                    </CardTitle>
                                    <CardDescription>Historical data from recent typing sorties</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-primary">Full Report</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Peak Speed</p>
                                            <p className="text-xl font-black text-white">{Math.max(currentWPM, 45)} WPM</p>
                                        </div>
                                        <div className="text-center border-x border-white/5">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Avg Accuracy</p>
                                            <p className="text-xl font-black text-white">{Math.min(currentAccuracy, 98)}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Tests Ran</p>
                                            <p className="text-xl font-black text-white">{userStats.totalTests}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Recent Activity</h4>
                                        {[
                                            { icon: Layout, title: "Standard Practice", time: "2h ago", res: "68 WPM • 99%" },
                                            { icon: Trophy, title: "Grand Tournament", time: "1d ago", res: "Rank #12 • 450 Coins" },
                                            { icon: Target, title: "Speed Drill", time: "2d ago", res: "82 WPM • 96%" },
                                        ].map((act, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group/item">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-card border border-white/5">
                                                        <act.icon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-white uppercase">{act.title}</p>
                                                        <p className="text-[10px] text-muted-foreground">{act.time}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-primary">{act.res}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="border-white/5 bg-gradient-to-br from-card to-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-amber-500" />
                                    Unlocked Badges
                                </CardTitle>
                                <CardDescription>Tokens of your typing prowess</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { e: "🔥", l: "On Fire" },
                                        { e: "⚡", l: "Speedster" },
                                        { e: "👑", l: "Premium" },
                                        { e: "🎯", l: "Dead-Eye" },
                                        { e: "💎", l: "OG Status" },
                                    ].map((badge, i) => (
                                        <div key={i} className="group relative">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-help grayscale hover:grayscale-0">
                                                {badge.e}
                                            </div>
                                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-[8px] font-black uppercase tracking-widest text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10">
                                                {badge.l}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-muted-foreground/20 text-xs">
                                        +12
                                    </div>
                                </div>
                                <Button className="w-full mt-8 rounded-2xl border-white/10 variant-outline font-black text-[10px] uppercase tracking-widest h-12">
                                    View Achievement Vault
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-white/5 bg-slate-900 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="p-8 text-center relative z-10">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Star className="w-10 h-10 text-primary fill-current animate-pulse" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Universe Rank</h3>
                                <p className="text-muted-foreground text-xs uppercase font-medium mb-6 italic">"Top 4% of Neural Typists"</p>
                                <Button className="w-full bg-white text-black font-black rounded-2xl h-12 uppercase tracking-widest text-[10px]">
                                    View Leaderboards
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <ProfileEditModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                onProfileUpdated={(optimisticData) => {
                    if (optimisticData) {
                        setProfileData(prev => ({ ...prev, ...optimisticData }));
                    }
                    loadProfile();
                }}
                initialData={profileData}
            />
        </div>
    );
};

export default Profile;
