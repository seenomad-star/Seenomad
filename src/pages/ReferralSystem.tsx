import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGamification } from "@/contexts/GamificationContext";
import { Gift, Copy, Share2, Users, Check, Coins, Trophy, Star } from "lucide-react";
import { toast } from "sonner";

interface Referral {
  code: string;
  usedBy: string;
  timestamp: number;
  coinsEarned: number;
}

const REFERRAL_REWARD = 100; // Coins per referral
const REFEREE_BONUS = 50; // Bonus coins for new users who use a referral code

export const ReferralSystem: React.FC = () => {
  const { userStats, addCoins } = useGamification();
  const [referralCode] = useState(() => {
    const stored = localStorage.getItem("user-referral-code");
    if (stored) return stored;
    const newCode = `TYPE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    localStorage.setItem("user-referral-code", newCode);
    return newCode;
  });
  
  const [referrals] = useState<Referral[]>(() => {
    const stored = localStorage.getItem("user-referrals");
    return stored ? JSON.parse(stored) : [];
  });

  const [redeemCode, setRedeemCode] = useState("");
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  const totalEarned = referrals.reduce((sum, r) => sum + r.coinsEarned, 0);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on TypeMaster!",
          text: `Use my referral code ${referralCode} to get ${REFEREE_BONUS} bonus coins when you sign up!`,
          url: referralLink,
        });
      } catch {
        copyToClipboard(referralLink);
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  const redeemReferral = () => {
    if (!redeemCode.trim()) {
      toast.error("Please enter a referral code");
      return;
    }
    
    if (redeemCode.toUpperCase() === referralCode) {
      toast.error("You can't use your own referral code!");
      return;
    }

    const usedCodes = JSON.parse(localStorage.getItem("used-referral-codes") || "[]");
    if (usedCodes.includes(redeemCode.toUpperCase())) {
      toast.error("You've already used a referral code!");
      return;
    }

    // Simulate successful redemption
    addCoins(REFEREE_BONUS);
    usedCodes.push(redeemCode.toUpperCase());
    localStorage.setItem("used-referral-codes", JSON.stringify(usedCodes));
    toast.success(`🎉 You earned ${REFEREE_BONUS} bonus coins!`);
    setRedeemCode("");
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="w-5 h-5 text-primary" />
          Invite Friends & Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rewards Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-card rounded-lg p-2 border border-border">
            <div className="flex items-center justify-center gap-1 text-primary font-bold">
              <Coins className="w-4 h-4" />
              {REFERRAL_REWARD}
            </div>
            <p className="text-xs text-muted-foreground">Per Invite</p>
          </div>
          <div className="bg-card rounded-lg p-2 border border-border">
            <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold">
              <Users className="w-4 h-4" />
              {referrals.length}
            </div>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </div>
          <div className="bg-card rounded-lg p-2 border border-border">
            <div className="flex items-center justify-center gap-1 text-green-500 font-bold">
              <Trophy className="w-4 h-4" />
              {totalEarned}
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Your Referral Code</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={referralCode}
                readOnly
                className="font-mono text-center text-lg font-bold pr-10 bg-secondary/50"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => copyToClipboard(referralCode)}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <Button onClick={shareReferral} className="w-full gap-2" variant="default">
          <Share2 className="w-4 h-4" />
          Share with Friends
        </Button>

        {/* Referral Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Or share your link</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-xs bg-secondary/30 truncate"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(referralLink)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Redeem Code Section */}
        <div className="pt-4 border-t border-border space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Have a referral code?
          </label>
          <div className="flex gap-2">
            <Input
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="font-mono uppercase"
            />
            <Button onClick={redeemReferral} variant="secondary">
              Redeem
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get <Badge variant="secondary" className="text-xs">{REFEREE_BONUS} coins</Badge> when you use a friend's code!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact version for sidebar
export const ReferralWidget: React.FC = () => {
  const [referralCode] = useState(() => {
    const stored = localStorage.getItem("user-referral-code");
    if (stored) return stored;
    const newCode = `TYPE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    localStorage.setItem("user-referral-code", newCode);
    return newCode;
  });

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div 
      onClick={copyCode}
      className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 cursor-pointer hover:from-primary/15 hover:to-primary/10 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Invite & Earn</span>
        </div>
        <Badge variant="secondary" className="text-xs font-mono group-hover:bg-primary/20">
          {referralCode}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Earn 100 coins per friend!
      </p>
    </div>
  );
};
