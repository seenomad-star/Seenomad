import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Notification {
    id: string;
    user_id: string;
    type: 'achievement' | 'social' | 'system' | 'quest';
    title: string;
    message: string;
    read: boolean;
    data?: Record<string, any>;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    clearAll: () => Promise<void>;
    createNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'read'>) => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const STORAGE_KEY = 'typing-notifications';

    const fetchNotifications = useCallback(async () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setNotifications(JSON.parse(stored));
            } else {
                // Initial onboarding notification
                const initial: Notification[] = [{
                    id: 'welcome',
                    user_id: 'local-pilot',
                    type: 'system',
                    title: 'System Initialized',
                    message: 'Welcome to your local TypingOS terminal. All progress is now saved locally.',
                    read: false,
                    created_at: new Date().toISOString()
                }];
                setNotifications(initial);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Cloud real-time subscription removed for loginless architecture
    }, [fetchNotifications]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const saveToLocal = (notifs: Notification[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    };

    const markAsRead = async (notificationId: string) => {
        setNotifications((prev) => {
            const updated = prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
            saveToLocal(updated);
            return updated;
        });
    };

    const markAllAsRead = async () => {
        setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            saveToLocal(updated);
            return updated;
        });
        toast.success('All notifications marked as read');
    };

    const deleteNotification = async (notificationId: string) => {
        setNotifications((prev) => {
            const updated = prev.filter((n) => n.id !== notificationId);
            saveToLocal(updated);
            return updated;
        });
        toast.success('Notification deleted');
    };

    const clearAll = async () => {
        setNotifications([]);
        localStorage.removeItem(STORAGE_KEY);
        toast.success('All notifications cleared');
    };

    const createNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at' | 'read'>) => {
        const newNotif: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            user_id: 'local-pilot',
            created_at: new Date().toISOString(),
            read: false,
        };

        setNotifications((prev) => {
            const updated = [newNotif, ...prev];
            saveToLocal(updated);
            return updated;
        });
        toast.info(newNotif.title, { description: newNotif.message });
    };

    const refreshNotifications = async () => {
        setLoading(true);
        await fetchNotifications();
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
                createNotification,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
