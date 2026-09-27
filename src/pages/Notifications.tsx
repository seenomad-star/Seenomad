import { Bell, Search, Filter, Trash2, CheckCircle2, Clock, Info, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { cn } from "@/utils/utils";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'system' | 'achievement' | 'alert' | 'social';
    read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'System Update v2.4',
        message: 'New location-based exam sorting is now available! Check out the new filters in the Global Exams section.',
        time: 'Just now',
        type: 'system',
        read: false
    },
    {
        id: '2',
        title: 'Maintain Streak',
        message: "You're on a 3-day streak! Keep typing to earn more XP and climb the leaderboards.",
        time: '2h ago',
        type: 'achievement',
        read: false
    },
    {
        id: '3',
        title: 'New Feature',
        message: 'Support options added. You can now donate directly to support the development of TypingOS!',
        time: '1d ago',
        type: 'system',
        read: false
    },
    {
        id: '4',
        title: 'Security Alert',
        message: 'Your account was logged in from a new device. If this wasn\'t you, please change your password.',
        time: '2d ago',
        type: 'alert',
        read: true
    },
    {
        id: '5',
        title: 'Tournament Starting',
        message: 'The Weekly Speed Challenge starts in 1 hour. Get ready to compete!',
        time: '3d ago',
        type: 'social',
        read: true
    }
];

import { useTranslation } from "react-i18next";

const Notifications = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<Notification['type'] | "all">("all");

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'system': return <Info className="w-4 h-4 text-blue-500" />;
            case 'achievement': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'alert': return <ShieldAlert className="w-4 h-4 text-red-500" />;
            case 'social': return <Bell className="w-4 h-4 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 backdrop-blur-xl p-6 rounded-3xl border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{t("Notifications")}</h1>
                            <p className="text-muted-foreground text-sm">{t("Stay updated with your progress and system news")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            className="rounded-xl border-border/50"
                        >
                            {t("Mark all as read")}
                        </Button>
                        <Badge variant="secondary" className="px-3 py-1 rounded-lg">
                            {unreadCount} {t("New")}
                        </Badge>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder={t("Search notifications...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-2xl bg-card/30 border-border/50 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex items-center p-1 bg-secondary/30 rounded-lg border border-border/50">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "all"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t("All")}
                        </button>
                        <button
                            onClick={() => setActiveTab("unread")}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "unread"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {t("Unread")}
                        </button>
                    </div>
                    <Button variant="outline" className="rounded-2xl border-border/50 gap-2">
                        <Filter className="w-4 h-4" />
                        {t("Filter")}
                    </Button>
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "group relative p-4 rounded-2xl border transition-all duration-300",
                                        notif.read
                                            ? "bg-card/20 border-border/30 opacity-70"
                                            : "bg-card/80 border-primary/20 shadow-lg shadow-primary/5"
                                    )}
                                >
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                                            notif.read ? "bg-muted" : "bg-primary/5"
                                        )}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-sm">{notif.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {notif.time}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteNotification(notif.id)}
                                                        aria-label={t("Delete notification")}
                                                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </div>
                                    {!notif.read && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                    <Bell className="w-8 h-8 opacity-20" />
                                </div>
                                <p>No notifications found</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default Notifications;
