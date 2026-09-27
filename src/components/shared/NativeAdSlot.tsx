import React from "react";
import { cn } from "@/utils/utils";
import { ExternalLink, Info, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NativeAdSlotProps {
    className?: string;
    type?: "sidebar" | "banner";
    title?: string;
    description?: string;
    cta?: string;
    sponsored?: boolean;
    bgImage?: string;
}

export const NativeAdSlot: React.FC<NativeAdSlotProps> = ({
    className,
    type = "sidebar",
    title = "Upgrade to Pro Plus",
    description = "Unlock exclusive themes, mechanical sounds, and priority support.",
    cta = "Learn More",
    sponsored = true,
    bgImage
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border transition-all duration-500 group",
                !bgImage && "bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border-primary/10 hover:border-primary/30",
                bgImage && "border-white/10 hover:border-primary/30",
                type === "sidebar" ? "p-5" : "p-8 w-full",
                className
            )}
        >
            {bgImage && (
                <div className="absolute inset-0 z-0">
                    <img src={bgImage} className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="ad background" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
                </div>
            )}

            {/* SPARKLE DECO */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 blur-2xl rounded-full group-hover:bg-primary/20 transition-all duration-500" />

            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                    {sponsored && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            <Sparkles className="w-2.5 h-2.5 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Sponsored</span>
                        </div>
                    )}
                    <Info className="w-3.5 h-3.5 text-muted-foreground/30 hover:text-muted-foreground transition-colors cursor-help" />
                </div>

                <div className="space-y-1">
                    <h4 className="text-sm font-black text-foreground/90 tracking-tight">{title}</h4>
                    <p className="text-[11px] leading-relaxed text-muted-foreground/70 font-medium">
                        {description}
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 w-full justify-center">
                    {cta}
                    <ExternalLink className="w-3 h-3" />
                </button>
            </div>

            {/* GLASS OVERLAY */}
            <div className="absolute inset-0 bg-white/[0.02] dark:bg-black/[0.02] pointer-events-none" />
        </motion.div>
    );
};
