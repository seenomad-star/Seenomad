import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building, Sparkles } from 'lucide-react';
import { cn } from '@/utils/utils';

interface SponsoredSponsorBadgeProps {
    brandName: string;
    className?: string;
}

export const SponsoredSponsorBadge: React.FC<SponsoredSponsorBadgeProps> = ({ brandName, className }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary py-1 px-3 rounded-full flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sponsored Mission</span>
            </Badge>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/30 rounded-full border border-white/5">
                <Building className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">{brandName}</span>
            </div>
        </div>
    );
};
