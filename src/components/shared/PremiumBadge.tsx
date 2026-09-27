import { Crown, Sparkles, Check, Zap, Shield, Palette, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGamification } from "@/contexts/GamificationContext";
import { Badge } from "@/components/ui/badge";

const premiumFeatures = [
  { icon: Zap, title: "Ad-Free Experience", description: "No interruptions while practicing" },
  { icon: Bot, title: "AI Typing Coach", description: "Personalized tips and insights" },
  { icon: Palette, title: "Exclusive Themes", description: "Premium color themes and fonts" },
  { icon: Shield, title: "Priority Support", description: "Get help faster when you need it" },
  { icon: Sparkles, title: "2x XP Boost", description: "Level up twice as fast" },
  { icon: Crown, title: "Pro Badge", description: "Show off your premium status" },
];

export function PremiumBadge() {
  const { userStats, setPremium } = useGamification();

  if (userStats.isPremium) {
    return (
      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10">
          <Crown className="w-4 h-4" />
          Upgrade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            Go Premium
          </DialogTitle>
          <DialogDescription>
            Unlock all features and supercharge your typing journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {premiumFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            $4.99<span className="text-lg font-normal text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">or $39.99/year (save 33%)</p>
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            onClick={() => setPremium(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Premium (Demo)
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PremiumUpsell({ feature }: { feature: string }) {
  const { userStats } = useGamification();

  if (userStats.isPremium) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Crown className="w-5 h-5 text-yellow-500" />
        <div>
          <p className="font-medium text-foreground">{feature}</p>
          <p className="text-sm text-muted-foreground">Unlock with Premium</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-600">
            Upgrade
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Crown className="w-6 h-6 text-yellow-500" />
              Go Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {premiumFeatures.map((feat) => (
              <div key={feat.title} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">{feat.title}</span>
              </div>
            ))}
          </div>
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            Start 7-Day Free Trial
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
