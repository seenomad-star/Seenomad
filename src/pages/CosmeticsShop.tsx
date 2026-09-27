import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Package, Keyboard, Volume2, Sparkles, Check,
    Lock, Crown, Star, ArrowLeft, Gift
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Cosmetic, CosmeticType, COSMETIC_ITEMS, RARITY_CONFIG } from "@/data/cosmetics";
import { useGamification } from "@/contexts/GamificationContext";
import { GachaSystem } from "@/components/gacha/GachaSystem";
import { useEconomy } from "@/contexts/EconomyContext";
import { Coins, Gem } from "lucide-react";

// Rarity styling mapped to config
const RARITY_STYLES = RARITY_CONFIG;


export default function CosmeticsShop() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { userStats, equipCosmetic } = useGamification();
    const { wallet, inventory: ownedIds, purchaseItem } = useEconomy();

    // Filter cosmetic items based on owned IDs from EconomyContext
    const inventory = COSMETIC_ITEMS.filter(item => ownedIds.includes(item.id));

    const equipped = userStats.equippedCosmetics || {};

    const [showGacha, setShowGacha] = useState(false);
    const [selectedTab, setSelectedTab] = useState<CosmeticType>("keycap");
    const [previewItem, setPreviewItem] = useState<Cosmetic | null>(null);

    const handleEquip = (item: Cosmetic) => {
        equipCosmetic(item.type, item.id);
    };



    const getItemsByType = (type: CosmeticType) => {
        return COSMETIC_ITEMS.filter(item => item.type === type);
    };

    const handlePurchaseDirect = (item: Cosmetic) => {
        const itemWithOwned = { ...item, owned: true };
        purchaseItem(itemWithOwned as any);
    };

    const isEquipped = (itemId: string) => {
        return Object.values(equipped).includes(itemId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("Back")}
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <Package className="w-8 h-8 text-primary" />
                                {t("Cosmetics Shop")}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("Customize your typing experience")}
                            </p>
                        </div>
                    </div>

                    {/* Open Crate Button */}
                    <Button
                        onClick={() => setShowGacha(true)}
                        className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/20"
                    >
                        <Gift className="w-4 h-4" />
                        {t("Try Your Luck!")}
                    </Button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 bg-secondary/20 border-white/5">
                        <div className="text-xs text-muted-foreground uppercase font-bold mb-1">{t("Collection")}</div>
                        <div className="text-2xl font-black text-foreground">{inventory.length}/30</div>
                    </Card>
                    <Card className="p-4 bg-secondary/20 border-white/5">
                        <div className="text-xs text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
                            <Coins className="w-3 h-3 text-yellow-400" /> {t("Coins")}
                        </div>
                        <div className="text-2xl font-black text-yellow-400">{wallet.coins}</div>
                    </Card>
                    <Card className="p-4 bg-secondary/20 border-white/5">
                        <div className="text-xs text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
                            <Gem className="w-3 h-3 text-cyan-400" /> {t("Gems")}
                        </div>
                        <div className="text-2xl font-black text-cyan-400">{wallet.gems}</div>
                    </Card>
                    <Card className="p-4 bg-secondary/20 border-white/5">
                        <div className="text-xs text-muted-foreground uppercase font-bold mb-1">{t("Equipped")}</div>
                        <div className="text-2xl font-black text-emerald-500">
                            {Object.values(equipped).filter(Boolean).length}
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Inventory Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as CosmeticType)}>
                            <TabsList className="w-full grid grid-cols-3 mb-6">
                                <TabsTrigger value="keycap" className="gap-2">
                                    <Keyboard className="w-4 h-4" />
                                    {t("Keycaps")}
                                </TabsTrigger>
                                <TabsTrigger value="sound" className="gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    {t("Sounds")}
                                </TabsTrigger>
                                <TabsTrigger value="particle" className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    {t("Particles")}
                                </TabsTrigger>
                            </TabsList>

                            {(["keycap", "sound", "particle"] as CosmeticType[]).map(type => (
                                <TabsContent key={type} value={type}>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {getItemsByType(type).map((item) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Card
                                                    className={cn(
                                                        "relative cursor-pointer transition-all overflow-hidden",
                                                        RARITY_STYLES[item.rarity].border,
                                                        isEquipped(item.id) && "ring-2 ring-primary",
                                                        previewItem?.id === item.id && "ring-2 ring-white/50"
                                                    )}
                                                    onClick={() => setPreviewItem(item)}
                                                >
                                                    {/* Status Badge */}
                                                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                                                        {isEquipped(item.id) && (
                                                            <Badge className="bg-primary text-white text-[10px]">
                                                                <Check className="w-3 h-3 mr-1" />
                                                                {t("Equipped")}
                                                            </Badge>
                                                        )}
                                                        {!ownedIds.includes(item.id) && (
                                                            <Badge variant="secondary" className="text-[10px] bg-black/40 backdrop-blur-sm">
                                                                <Lock className="w-3 h-3 mr-1" />
                                                                {t("Locked")}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <CardContent className="p-4 text-center">
                                                        {/* Icon */}
                                                        <div className={cn(
                                                            "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3",
                                                            RARITY_STYLES[item.rarity].bg
                                                        )}>
                                                            {item.icon}
                                                        </div>

                                                        {/* Name */}
                                                        <h3 className="font-bold text-sm mb-1">{item.name}</h3>

                                                        {/* Rarity */}
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] uppercase",
                                                                RARITY_STYLES[item.rarity].color
                                                            )}
                                                        >
                                                            {item.rarity === "legendary" && <Crown className="w-3 h-3 mr-1" />}
                                                            {item.rarity === "epic" && <Star className="w-3 h-3 mr-1" />}
                                                            {item.rarity}
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}

                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    {/* Preview Panel */}
                    <div>
                        <Card className="sticky top-6 border-white/10 bg-secondary/10">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                    {t("Preview")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {previewItem ? (
                                    <div className="text-center space-y-4">
                                        {/* Large Icon */}
                                        <div className={cn(
                                            "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-6xl",
                                            RARITY_STYLES[previewItem.rarity].bg
                                        )}>
                                            {previewItem.icon}
                                        </div>

                                        {/* Name & Rarity */}
                                        <div>
                                            <h3 className={cn(
                                                "text-xl font-black mb-1",
                                                RARITY_STYLES[previewItem.rarity].color
                                            )}>
                                                {previewItem.name}
                                            </h3>
                                            <Badge className={cn(
                                                RARITY_STYLES[previewItem.rarity].bg,
                                                RARITY_STYLES[previewItem.rarity].color
                                            )}>
                                                {previewItem.rarity.toUpperCase()}
                                            </Badge>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground">
                                            {previewItem.description}
                                        </p>

                                        {/* Purchase / Equip Button */}
                                        {ownedIds.includes(previewItem.id) ? (
                                            <Button
                                                className="w-full"
                                                disabled={isEquipped(previewItem.id)}
                                                onClick={() => handleEquip(previewItem)}
                                            >
                                                {isEquipped(previewItem.id) ? (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        {t("Equipped")}
                                                    </>
                                                ) : (
                                                    t("Equip")
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
                                                onClick={() => handlePurchaseDirect(previewItem)}
                                            >
                                                {t("Unlock for")} {previewItem.price} {previewItem.currency === 'coins' ? 'Coins' : 'Gems'}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>{t("Select an item to preview")}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Gacha Modal */}
            <GachaSystem
                isOpen={showGacha}
                onClose={() => setShowGacha(false)}
            />
        </div>
    );
}
