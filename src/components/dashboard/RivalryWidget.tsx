import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Swords, Trophy, Zap, Crown, UserPlus,
    Bell, ChevronRight, Flame, Target, Users
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Mock rivalry data
interface Rival {
    id: string;
    name: string;
    avatar: string;
    bestWpm: number;
    lastActive: string;
    status: "ahead" | "behind" | "tied";
}

const MOCK_RIVALS: Rival[] = [
    {
        id: "1",
        name: "SpeedDemon",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demon",
        bestWpm: 92,
        lastActive: "2h ago",
        status: "ahead"
    },
    {
        id: "2",
        name: "TypeMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master",
        bestWpm: 78,
        lastActive: "5m ago",
        status: "behind"
    },
    {
        id: "3",
        name: "KeyboardNinja",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja",
        bestWpm: 85,
        lastActive: "1d ago",
        status: "tied"
    }
];

// Mock notifications
const MOCK_NOTIFICATIONS = [
    { id: 1, message: "SpeedDemon beat your best WPM!", time: "2h ago", type: "challenge" },
    { id: 2, message: "KeyboardNinja challenged you!", time: "1d ago", type: "invite" }
];

export const RivalryWidget: React.FC = () => {
    const { t } = useTranslation();
    const [userBestWpm, setUserBestWpm] = useState(85);
    const [rivals, setRivals] = useState<Rival[]>(MOCK_RIVALS);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [showNotifications, setShowNotifications] = useState(false);

    // Calculate rivalry stats
    const rivalsAhead = rivals.filter(r => r.status === "ahead").length;
    const rivalsBehind = rivals.filter(r => r.status === "behind").length;

    const handleChallenge = (rival: Rival) => {
        toast.success(t("Challenge sent to {{name}}!", { name: rival.name }));
    };

    const handleAddRival = () => {
        toast.info(t("Invite a friend to become your rival!"));
    };

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getStatusColor = (status: Rival["status"]) => {
        switch (status) {
            case "ahead": return "text-red-500";
            case "behind": return "text-green-500";
            case "tied": return "text-yellow-500";
        }
    };

    const getStatusBadge = (status: Rival["status"]) => {
        switch (status) {
            case "ahead": return { bg: "bg-red-500/20", text: "text-red-500", label: t("Ahead") };
            case "behind": return { bg: "bg-green-500/20", text: "text-green-500", label: t("Behind") };
            case "tied": return { bg: "bg-yellow-500/20", text: "text-yellow-500", label: t("Tied") };
        }
    };

    return (
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-transparent">
            {/* Background effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[60px]" />

            <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/20">
                            <Swords className="w-4 h-4 text-primary" />
                        </div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">
                            {t("Rivalry Zone")}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-[10px] font-bold text-muted-foreground hover:text-foreground"
                            onClick={handleAddRival}
                        >
                            <UserPlus className="w-3 h-3 mr-1" />
                            {t("Add")}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-4">
                {/* Notifications Dropdown */}
                {showNotifications && notifications.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mx-4 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                className="flex items-center justify-between p-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {notif.type === "challenge" ? (
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                    ) : (
                                        <Swords className="w-4 h-4 text-primary" />
                                    )}
                                    <div>
                                        <p className="text-xs font-medium">{notif.message}</p>
                                        <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 text-[10px]"
                                    onClick={() => dismissNotification(notif.id)}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Your Stats */}
                <div className="bg-secondary/30 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                            {t("Your Best")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] font-bold text-orange-500">{t("Hot streak!")}</span>
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-primary">{userBestWpm}</span>
                        <span className="text-sm text-muted-foreground mb-1">WPM</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px]">
                        <span className="text-green-500 font-bold">↑ {rivalsBehind} {t("ahead")}</span>
                        <span className="text-red-500 font-bold">↓ {rivalsAhead} {t("behind")}</span>
                    </div>
                </div>

                {/* Rivals List */}
                <div className="space-y-2">
                    {rivals.map((rival, index) => {
                        const statusBadge = getStatusBadge(rival.status);
                        const wpmDiff = rival.bestWpm - userBestWpm;

                        return (
                            <motion.div
                                key={rival.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={rival.avatar}
                                        alt={rival.name}
                                        className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-primary transition-colors"
                                    />
                                    {rival.status === "ahead" && (
                                        <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm truncate">{rival.name}</span>
                                        <Badge className={cn("text-[9px] px-1.5 py-0", statusBadge.bg, statusBadge.text)}>
                                            {statusBadge.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span className="font-bold">{rival.bestWpm} WPM</span>
                                        <span>•</span>
                                        <span className={cn("font-bold", getStatusColor(rival.status))}>
                                            {wpmDiff > 0 ? `+${wpmDiff}` : wpmDiff}
                                        </span>
                                        <span>•</span>
                                        <span>{rival.lastActive}</span>
                                    </div>
                                </div>

                                {/* Challenge Button */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-[10px] font-black uppercase text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleChallenge(rival);
                                    }}
                                >
                                    <Zap className="w-3 h-3 mr-1" />
                                    {t("Fight")}
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <Button
                    className="w-full h-10 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs uppercase tracking-wider border border-primary/30"
                    variant="ghost"
                >
                    <Users className="w-4 h-4 mr-2" />
                    {t("Find More Rivals")}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default RivalryWidget;
