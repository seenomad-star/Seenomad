import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Cosmetic, COSMETIC_ITEMS } from '@/data/cosmetics';

interface Wallet {
    coins: number;
    gems: number;
}

interface Item extends Cosmetic {
    owned: boolean;
}

export const REWARD_POOL: Cosmetic[] = COSMETIC_ITEMS;

interface EconomyContextType {
    wallet: Wallet;
    inventory: string[];
    stats: {
        xp: number;
        level: number;
        streak: number;
        highestWpm: number;
        tournamentsWon: number;
    };
    addCurrency: (amount: number, type: 'coins' | 'gems') => void;
    spendCurrency: (amount: number, type: 'coins' | 'gems') => boolean;
    purchaseItem: (item: Item) => void;
    hasItem: (itemId: string) => boolean;
    openCrate: (type: 'standard' | 'elite') => Item | null;
    addXp: (amount: number) => void;
    updateHighestWpm: (wpm: number) => void;
}

const EconomyContext = createContext<EconomyContextType | undefined>(undefined);

export const useEconomy = () => {
    const context = useContext(EconomyContext);
    if (!context) {
        throw new Error('useEconomy must be used within an EconomyProvider');
    }
    return context;
};

export const EconomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage or default
    const [wallet, setWallet] = useState<Wallet>(() => {
        const saved = localStorage.getItem('typingos_wallet');
        return saved ? JSON.parse(saved) : { coins: 1500, gems: 50 };
    });

    const [inventory, setInventory] = useState<string[]>(() => {
        const saved = localStorage.getItem('typingos_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('typingos_stats');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            level: 1,
            streak: 0,
            highestWpm: 0,
            tournamentsWon: 0
        };
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('typingos_wallet', JSON.stringify(wallet));
    }, [wallet]);

    useEffect(() => {
        localStorage.setItem('typingos_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('typingos_stats', JSON.stringify(stats));
    }, [stats]);

    const addCurrency = (amount: number, type: 'coins' | 'gems') => {
        setWallet(prev => ({
            ...prev,
            [type]: prev[type] + amount
        }));
        toast.success(`Earned ${amount} ${type}!`);
    };

    const spendCurrency = (amount: number, type: 'coins' | 'gems'): boolean => {
        if (wallet[type] >= amount) {
            setWallet(prev => ({
                ...prev,
                [type]: prev[type] - amount
            }));
            return true;
        }
        return false;
    };

    const purchaseItem = (item: Item) => {
        if (inventory.includes(item.id)) {
            toast.info("You already own this item!");
            return;
        }

        if (spendCurrency(item.price, item.currency)) {
            setInventory(prev => [...prev, item.id]);
            toast.success(`Purchased ${item.name}!`);
        } else {
            toast.error(`Not enough ${item.currency}!`);
        }
    };

    const hasItem = (itemId: string) => inventory.includes(itemId);

    const addXp = (amount: number) => {
        setStats(prev => {
            const newXp = prev.xp + amount;
            const xpToNextLevel = prev.level * 1000;
            if (newXp >= xpToNextLevel) {
                toast.success(`LEVEL UP! You are now level ${prev.level + 1}`, {
                    icon: '🚀'
                });
                return {
                    ...prev,
                    xp: newXp - xpToNextLevel,
                    level: prev.level + 1
                };
            }
            return { ...prev, xp: newXp };
        });
    };

    const updateHighestWpm = (wpm: number) => {
        if (wpm > stats.highestWpm) {
            setStats(prev => ({ ...prev, highestWpm: wpm }));
            toast.success(`New Personal Best: ${wpm} WPM!`, {
                icon: '🔥'
            });
        }
    };

    const openCrate = (type: 'standard' | 'elite'): Item | null => {
        const cost = type === 'standard' ? 500 : 25;
        const currency = type === 'standard' ? 'coins' : 'gems';

        if (!spendCurrency(cost, currency)) {
            toast.error(`Not enough ${currency} to open ${type} crate!`);
            return null;
        }

        // Define weights
        const weights = type === 'standard'
            ? { common: 0.7, rare: 0.25, epic: 0.04, legendary: 0.01 }
            : { common: 0.2, rare: 0.5, epic: 0.2, legendary: 0.1 };

        const rand = Math.random();
        let targetRarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';

        let cumulative = 0;
        for (const [rarity, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand <= cumulative) {
                targetRarity = rarity as any;
                break;
            }
        }

        // Filter pool by rarity
        const availableItems = REWARD_POOL.filter(item => item.rarity === targetRarity);
        const wonItemData = availableItems[Math.floor(Math.random() * availableItems.length)];

        const wonItem: Item = { ...wonItemData, owned: true };

        if (!inventory.includes(wonItem.id)) {
            setInventory(prev => [...prev, wonItem.id]);
            toast.success(`You won: ${wonItem.name}!`, {
                description: `Rarity: ${wonItem.rarity.toUpperCase()}`,
                icon: wonItem.rarity === 'legendary' ? '✨' : '🎁'
            });
        } else {
            // Duplicate handling: Give some coins back
            const refund = Math.floor(wonItem.price * 0.2);
            addCurrency(refund, 'coins');
            toast.info(`Duplicate ${wonItem.name}!`, {
                description: `Converted to ${refund} coins.`
            });
        }

        return wonItem;
    };

    return (
        <EconomyContext.Provider value={{
            wallet,
            inventory,
            stats,
            addCurrency,
            spendCurrency,
            purchaseItem,
            hasItem,
            openCrate,
            addXp,
            updateHighestWpm
        }}>
            {children}
        </EconomyContext.Provider>
    );
};
