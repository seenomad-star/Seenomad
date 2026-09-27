import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureGuardProps {
    children: React.ReactNode;
    requiredTier?: 'free' | 'pro' | 'team';
    featureName?: string;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
    children,
    requiredTier = 'pro',
    featureName = "Pro Feature"
}) => {
    const navigate = useNavigate();
    // Mock user tier - in real app this comes from AuthContext/UserContext
    const userTier = 'free';

    const tiers = ['free', 'pro', 'team'];
    const userTierIndex = tiers.indexOf(userTier);
    const requiredTierIndex = tiers.indexOf(requiredTier);

    const hasAccess = userTierIndex >= requiredTierIndex;

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-secondary/5 group">
            {/* Blurry content preview (optional, or just hide it) */}
            <div className="filter blur-md opacity-30 pointer-events-none select-none" aria-hidden="true">
                {children}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                <div className="p-4 bg-white/10 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Unlock {featureName}</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    This feature is available exclusively for <strong>{requiredTier.toUpperCase()}</strong> members.
                </p>
                <Button
                    variant="default"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 font-bold hover:opacity-90"
                    onClick={() => navigate('/pricing')}
                >
                    Upgrade to {requiredTier === 'team' ? 'Team' : 'Pro'}
                </Button>
            </div>
        </div>
    );
};
