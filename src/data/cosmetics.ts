
export type CosmeticRarity = "common" | "rare" | "epic" | "legendary";
export type CosmeticType = "keycap" | "sound" | "particle";

export interface Cosmetic {
    id: string;
    name: string;
    type: CosmeticType;
    rarity: CosmeticRarity;
    icon: string;
    preview?: string;
    description: string;
    price: number;
    currency: 'coins' | 'gems';
}

export const RARITY_CONFIG = {
    common: { weight: 60, color: "text-gray-400", bg: "bg-gray-500/20", glow: "shadow-gray-500/50", border: "border-gray-500/30" },
    rare: { weight: 25, color: "text-blue-400", bg: "bg-blue-500/20", glow: "shadow-blue-500/50", border: "border-blue-500/30" },
    epic: { weight: 12, color: "text-purple-400", bg: "bg-purple-500/20", glow: "shadow-purple-500/50", border: "border-purple-500/30" },
    legendary: { weight: 3, color: "text-yellow-400", bg: "bg-yellow-500/20", glow: "shadow-yellow-500/50", border: "border-yellow-500/30" },
};

export const COSMETIC_ITEMS: Cosmetic[] = [
    // Keycap Skins
    { id: "keycap_neon", name: "Neon Glow", type: "keycap", rarity: "common", icon: "🌈", description: "Vibrant neon gradient keycaps", price: 200, currency: 'coins' },
    { id: "keycap_retro", name: "Retro Wave", type: "keycap", rarity: "common", icon: "🎮", description: "80s retro aesthetic keys", price: 250, currency: 'coins' },
    { id: "keycap_carbon", name: "Carbon Fiber", type: "keycap", rarity: "rare", icon: "⚫", description: "Sleek carbon fiber texture", price: 800, currency: 'coins' },
    { id: "keycap_gold", name: "Golden Touch", type: "keycap", rarity: "epic", icon: "✨", description: "Luxurious golden accents", price: 50, currency: 'gems' },
    { id: "keycap_holographic", name: "Holographic", type: "keycap", rarity: "legendary", icon: "💎", description: "Shifting holographic surface", price: 150, currency: 'gems' },

    // Sound Packs
    { id: "sound_thocky", name: "Thocky Keys", type: "sound", rarity: "common", icon: "🔊", description: "Deep, satisfying thock sounds", price: 300, currency: 'coins' },
    { id: "sound_clicky", name: "Clicky Bliss", type: "sound", rarity: "rare", icon: "🎵", description: "Crisp mechanical clicks", price: 600, currency: 'coins' },
    { id: "sound_typewriter", name: "Typewriter", type: "sound", rarity: "rare", icon: "📝", description: "Classic typewriter sounds", price: 500, currency: 'coins' },
    { id: "sound_asmr", name: "ASMR Keys", type: "sound", rarity: "epic", icon: "🎧", description: "Ultra-satisfying ASMR audio", price: 80, currency: 'gems' },
    { id: "sound_scifi", name: "Sci-Fi Terminal", type: "sound", rarity: "legendary", icon: "🚀", description: "Futuristic computer sounds", price: 200, currency: 'gems' },

    // Particle Effects
    { id: "particle_sparkle", name: "Sparkle Trail", type: "particle", rarity: "common", icon: "✨", description: "Light sparkle on keypress", price: 150, currency: 'coins' },
    { id: "particle_fire", name: "Fire Burst", type: "particle", rarity: "rare", icon: "🔥", description: "Flame particles on type", price: 1000, currency: 'coins' },
    { id: "particle_ice", name: "Ice Crystal", type: "particle", rarity: "rare", icon: "❄️", description: "Frozen crystal effects", price: 900, currency: 'coins' },
    { id: "particle_galaxy", name: "Galaxy Dust", type: "particle", rarity: "epic", icon: "🌌", description: "Cosmic stardust trails", price: 120, currency: 'gems' },
    { id: "particle_quantum", name: "Quantum Flux", type: "particle", rarity: "legendary", icon: "⚛️", description: "Reality-bending particles", price: 300, currency: 'gems' },
];
