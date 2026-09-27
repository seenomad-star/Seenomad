
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { useNavigate } from "react-router-dom";

export function UserProfileCard() {
    const navigate = useNavigate();
    const { userStats } = useGamification();

    return (
        <div className="flex items-center gap-4 mb-8 group cursor-pointer" onClick={() => navigate("/profile")}>
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center border border-primary/30 shadow-xl shadow-primary/20 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                        alt="User Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-card shadow-sm" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-black text-base uppercase tracking-tight">Local Pilot</span>
                    {userStats.isPremium && <Crown className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />}
                </div>
                <Badge className="w-fit h-3.5 px-1.5 text-[9px] bg-primary/20 text-primary border-0 rounded-full font-black">Level {userStats.level}</Badge>
            </div>
        </div>
    );
}
