import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Award, Gift, Crown, Share2, Copy, Trophy, Briefcase, Download, Package } from "lucide-react";
import { useGamification, DailyChallenge } from "@/contexts/GamificationContext";
import { useToast } from "@/hooks/use-toast";
import { ChallengeRow, SparkleIcon } from "@/components/shared/ChallengeRow";
import { useTranslation } from "react-i18next";

const CardUI = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm ${className || ''}`}>
        {children}
    </div>
);

export const DailyChallengesWidget: React.FC = () => {
    const { dailyChallenges } = useGamification();
    const { t } = useTranslation();

    return (
        <CardUI className="flex flex-col h-full border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <div className="p-5 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-black uppercase tracking-tight text-sm">{t('Daily Challenges')}</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    {dailyChallenges.filter(c => c.completed).length}/3
                </Badge>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {dailyChallenges.map((challenge) => (
                    <ChallengeRow key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </CardUI>
    );
};


export const InviteAndEarnWidget: React.FC = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const inviteCode = "TYPEE4Z69J";

    const copyCode = () => {
        navigator.clipboard.writeText(inviteCode);
        toast({
            title: t("Code Copied!"),
            description: t("Invite code copied to clipboard."),
        });
    };

    return (
        <CardUI className="flex flex-col h-full border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
            <div className="p-5 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-blue-500" />
                    <h3 className="font-black uppercase tracking-tight text-sm">{t('Invite & Earn')}</h3>
                </div>
                <Badge className="text-[9px] font-black bg-blue-500 text-white border-0">{inviteCode}</Badge>
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-black tracking-tighter">{t('Earn 100 coins per friend!')}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                        {t('Invite your typing buddies and unlock exclusive themes and AI perks together.')}
                    </p>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-1 bg-secondary/30 rounded-lg border border-border/30">
                        <span className="flex-1 px-2 py-1 font-mono text-xs tracking-widest text-muted-foreground">{inviteCode}</span>
                        <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-card rounded-md" onClick={copyCode}>
                            <Copy className="w-3 h-3 text-blue-500" />
                        </Button>
                    </div>
                    <Button
                        className="w-full h-8 bg-blue-500 hover:bg-blue-600 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'TypingOS',
                                    text: t('Invite your typing buddies and unlock exclusive themes and AI perks together.'),
                                    url: window.location.origin
                                });
                            } else {
                                copyCode();
                            }
                        }}
                    >
                        <Share2 className="w-3 h-3 mr-2" />
                        {t('Share')}
                    </Button>
                </div>
            </div>
        </CardUI>
    );
};

export const PremiumBannerWidget: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-background p-1">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1510511459019-5dee592da13a?auto=format&fit=crop&w=1200&q=80"
                    className="w-full h-full object-cover opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700"
                    alt="Premium Background"
                />
            </div>
            <div className="relative flex items-center justify-between p-6 rounded-[1.8rem] bg-card/40 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-primary/20 text-primary shadow-xl shadow-primary/10 transition-transform group-hover:scale-110 duration-500">
                        <Crown className="w-8 h-8 fill-primary/30" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-black tracking-tighter uppercase">{t('Remove ads & unlock AI coaching')}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{t('Elevate your typing mastery with real-time fatigue analysis and premium drills.')}</p>
                    </div>
                </div>
                <Button
                    className="h-12 px-8 bg-primary hover:bg-primary-foreground text-background font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20"
                    onClick={() => window.location.href = '/marketplace'}
                >
                    {t('Upgrade Now')}
                </Button>
            </div>

            {/* Decorative pulse element */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full animate-pulse pointer-events-none" />
        </div>
    );
};

export const DashboardLinksWidget: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <CardUI className="relative group cursor-pointer border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5 hover:border-purple-500/50 transition-all">
                <div onClick={() => window.location.href = '/jobs'} className="h-full p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="border-purple-500/20 text-purple-500">{t('Hiring')}</Badge>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">{t('Careers')}</h3>
                        <p className="text-xs text-muted-foreground">{t('Join our global team')}</p>
                    </div>
                </div>
            </CardUI>

            <CardUI className="relative group cursor-pointer border-green-500/20 bg-gradient-to-br from-card to-green-500/5 hover:border-green-500/50 transition-all">
                <div onClick={() => window.location.href = '/download'} className="h-full p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <Download className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">{t('Download')}</h3>
                        <p className="text-xs text-muted-foreground">{t('Get the desktop app')}</p>
                    </div>
                </div>
            </CardUI>
        </div>
    );
};

export const MysteryCrateWidget: React.FC = () => {
    const { t } = useTranslation();
    return (
        <CardUI className="relative group cursor-pointer overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20">
            <div onClick={() => window.location.href = '/earn'} className="h-full p-6 flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                    <Badge className="w-fit bg-white/20 text-white border-0 backdrop-blur-md mb-2">{t('DAILY DROP')}</Badge>
                    <h3 className="font-black text-2xl text-white tracking-tight">{t('Mystery Crate')}</h3>
                    <p className="text-indigo-100/80 text-xs font-medium max-w-[140px]">{t('Open now for XP, Coins & Skins')}</p>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
                    <Package className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </CardUI>
    );
};
