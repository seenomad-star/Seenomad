import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Palette,
  Keyboard,
  Crown,
  Sparkles,
  Search,
  ShoppingCart,
  Star,
  Lock,
  Check,
  Zap,
  Music,
  Image,
  Calendar
} from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { toast } from "sonner";


interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "themes" | "keyboards" | "sounds" | "avatars" | "powerups";
  icon: React.ReactNode;
  preview?: string;
  isPremium?: boolean;
  isOwned?: boolean;
  rating: number;
  purchases: number;
}

const marketplaceItems: MarketplaceItem[] = [
  // Themes
  {
    id: "theme-cyberpunk",
    name: "Cyberpunk Neon",
    description: "A futuristic neon theme with vibrant pink and cyan accents",
    price: 500,
    category: "themes",
    icon: <Palette className="w-6 h-6" />,
    preview: "/assets/images/theme_cyberpunk_preview_1770053535481.png",
    rating: 4.8,
    purchases: 2340,
  },
  {
    id: "theme-forest",
    name: "Forest Calm",
    description: "Natural green tones for a relaxing typing experience",
    price: 300,
    category: "themes",
    icon: <Palette className="w-6 h-6" />,
    preview: "/assets/images/theme_forest_preview_1770053549929.png",
    rating: 4.5,
    purchases: 1890,
  },
  {
    id: "theme-sunset",
    name: "Sunset Gradient",
    description: "Warm orange and purple gradients inspired by sunsets",
    price: 400,
    category: "themes",
    icon: <Palette className="w-6 h-6" />,
    preview: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=400&fit=crop",
    rating: 4.7,
    purchases: 2100,
  },
  {
    id: "theme-midnight",
    name: "Midnight Blue",
    description: "Deep blue theme perfect for late night practice",
    price: 350,
    category: "themes",
    icon: <Palette className="w-6 h-6" />,
    preview: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop",
    rating: 4.6,
    purchases: 1560,
  },
  // Keyboards
  {
    id: "keyboard-mechanical",
    name: "Mechanical RGB",
    description: "Animated mechanical keyboard with RGB lighting effects",
    price: 800,
    category: "keyboards",
    icon: <Keyboard className="w-6 h-6" />,
    preview: "/assets/images/keyboard_mechanical_preview_1770053569452.png",
    isPremium: true,
    rating: 4.9,
    purchases: 3200,
  },
  {
    id: "keyboard-minimal",
    name: "Minimalist White",
    description: "Clean, distraction-free keyboard design",
    price: 200,
    category: "keyboards",
    icon: <Keyboard className="w-6 h-6" />,
    preview: "https://images.unsplash.com/photo-1587829741301-dc798b83dadc?w=800&h=400&fit=crop",
    rating: 4.4,
    purchases: 980,
  },
  {
    id: "keyboard-retro",
    name: "Retro Typewriter",
    description: "Vintage typewriter-style keys with authentic feel",
    price: 600,
    category: "keyboards",
    icon: <Keyboard className="w-6 h-6" />,
    preview: "https://images.unsplash.com/photo-1516053303991-56aa276797f0?w=800&h=400&fit=crop",
    rating: 4.7,
    purchases: 1450,
  },
  // Sounds
  {
    id: "sound-mechanical",
    name: "Mechanical Clicks",
    description: "Satisfying mechanical keyboard click sounds",
    price: 150,
    category: "sounds",
    icon: <Music className="w-6 h-6" />,
    rating: 4.6,
    purchases: 4500,
  },
  {
    id: "sound-typewriter",
    name: "Typewriter Classic",
    description: "Authentic vintage typewriter sound effects",
    price: 200,
    category: "sounds",
    icon: <Music className="w-6 h-6" />,
    rating: 4.5,
    purchases: 2800,
  },
  {
    id: "sound-soft",
    name: "Soft Touch",
    description: "Gentle, quiet key press sounds for focus",
    price: 100,
    category: "sounds",
    icon: <Music className="w-6 h-6" />,
    rating: 4.3,
    purchases: 1200,
  },
  // Avatars
  {
    id: "avatar-robot",
    name: "Robot Champion",
    description: "Futuristic robot avatar with animated effects",
    price: 400,
    category: "avatars",
    icon: <Image className="w-6 h-6" />,
    rating: 4.8,
    purchases: 1800,
  },
  {
    id: "avatar-ninja",
    name: "Speed Ninja",
    description: "Swift ninja avatar for fast typers",
    price: 350,
    category: "avatars",
    icon: <Image className="w-6 h-6" />,
    rating: 4.7,
    purchases: 2100,
  },
  // Powerups
  {
    id: "powerup-2x",
    name: "Double XP (1 Day)",
    description: "Earn 2x XP for 24 hours",
    price: 250,
    category: "powerups",
    icon: <Zap className="w-6 h-6" />,
    rating: 4.9,
    purchases: 8900,
  },
  {
    id: "powerup-streak",
    name: "Streak Shield",
    description: "Protect your streak for 3 days",
    price: 500,
    category: "powerups",
    icon: <Zap className="w-6 h-6" />,
    isPremium: true,
    rating: 4.8,
    purchases: 5600,
  },
  {
    id: "powerup-streak-freeze",
    name: "Streak Freeze",
    description: "Protect your daily streak from breaking even if you miss a day",
    price: 300,
    category: "powerups",
    icon: <Calendar className="w-6 h-6 text-blue-400" />,
    rating: 4.9,
    purchases: 12400,
  },
  {
    id: "powerup-coins-2x",
    name: "Double Coins (2h)",
    description: "Earn 2x coins for all activities for the next 2 hours",
    price: 150,
    category: "powerups",
    icon: <Sparkles className="w-6 h-6 text-amber-400" />,
    rating: 4.7,
    purchases: 15600,
  },
  {
    id: "powerup-premium-pass",
    name: "Premium Universe Pass",
    description: "Permanent Pro status. Removes all ads and unlocks all premium themes/keyboards.",
    price: 5000,
    category: "powerups",
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    rating: 5.0,
    purchases: 1250,
  },
];

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { userStats, buyItem, isItemOwned } = useGamification();

  const filteredItems = marketplaceItems.map(item => ({
    ...item,
    isOwned: isItemOwned(item.id)
  })).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async (item: MarketplaceItem) => {
    if (isItemOwned(item.id)) {
      toast.info("Item Owned", {
        description: `You already own ${item.name}.`,
      });
      return;
    }

    if (item.isPremium && !userStats.isPremium) {
      toast.error("Premium Required", {
        description: "This item requires a Premium subscription.",
      });
      return;
    }

    if (userStats.coins < item.price) {
      toast.error("Insufficient Coins", {
        description: `You need ${item.price - userStats.coins} more coins to buy this item.`,
      });
      return;
    }

    // Local purchase logic using GamificationContext
    const success = await buyItem(item.id, item.price);

    if (success) {
      toast.success("Purchase Successful!", {
        description: `You've purchased ${item.name}!`,
      });
    } else {
      toast.error("Purchase Failed", {
        description: "An error occurred while processing your local transaction.",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "themes": return <Palette className="w-4 h-4" />;
      case "keyboards": return <Keyboard className="w-4 h-4" />;
      case "sounds": return <Music className="w-4 h-4" />;
      case "avatars": return <Image className="w-4 h-4" />;
      case "powerups": return <Zap className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Marketplace
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize your typing experience with themes, keyboards, and more
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="keyboards" className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboards
            </TabsTrigger>
            <TabsTrigger value="sounds" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Sounds
            </TabsTrigger>
            <TabsTrigger value="avatars" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="powerups" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Power-ups
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="relative overflow-hidden transition-all hover:shadow-lg">
                  {item.preview && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={item.preview}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform hover:scale-110"
                      />
                    </div>
                  )}

                  {item.isPremium && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {getCategoryIcon(item.category)}
                            <span className="ml-1">{item.category}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{item.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{item.purchases.toLocaleString()} purchases</span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-1 text-lg font-bold">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-500">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={item.isOwned}
                      variant={item.isOwned ? "secondary" : "default"}
                    >
                      {item.isOwned ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Owned
                        </>
                      ) : item.isPremium && !userStats.isPremium ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Premium
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No items found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;
