import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/contexts/GamificationContext";
import { useState } from "react";
import { cn } from "@/utils/utils";

interface AdBannerProps {
  type?: "banner" | "sidebar" | "interstitial";
  className?: string;
}

export function AdBanner({ type = "banner", className = "" }: AdBannerProps) {
  const { userStats } = useGamification();
  const [dismissed, setDismissed] = useState(false);

  // Premium users don't see ads
  if (userStats.isPremium || dismissed) {
    return null;
  }

  if (type === "sidebar") {
    return (
      <div className={cn(
        "bg-[#1A1C1E]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden group",
        className
      )} aria-label="Advertisement">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-muted-foreground/30 hover:text-foreground transition-colors z-10"
          aria-label="Dismiss Advertisement"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 mb-4">Sponsored</div>

        {/* AdSense Slot Simulation: Large Rectangle (300x250) */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl min-h-[250px] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-primary/40" />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest">Premium Ad Slot</span>
          <p className="text-[10px] text-muted-foreground/20 mt-2">Standard 300x250 large rectangle placement</p>
        </div>

        <div className="mt-4 text-center">
          <button className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors" onClick={() => { }}>
            Remove ads with Premium
          </button>
        </div>
      </div>
    );
  }

  // Default: Leaderboard / Billboard (728x90)
  return (
    <div className={cn(
      "bg-[#1A1C1E]/40 border border-white/5 rounded-[2rem] p-4 relative overflow-hidden group mb-8",
      className
    )} aria-label="Advertisement">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-muted-foreground/20 hover:text-foreground transition-colors z-10"
        aria-label="Dismiss Advertisement"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-4 h-4 text-primary/60" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">Advertisement</div>
        </div>

        {/* AdSense Slot Simulation: Leaderboard (728x90) */}
        <div className="flex-1 max-w-[728px] bg-white/[0.02] border border-white/5 rounded-2xl h-[90px] flex items-center justify-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/20">Leaderboard Ad Space | 728x90</span>
        </div>

        <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 transition-all">
          <Sparkles className="w-3 h-3 text-primary" />
          Remove
        </button>
      </div>
    </div>
  );
}
