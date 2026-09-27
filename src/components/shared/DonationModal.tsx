
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee, Copy, Check, QrCode, Smartphone, ExternalLink, Heart, Github, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { AdToEarn } from "@/components/shared/AdToEarn";

interface DonationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState<'options' | 'upi'>('options');

    // Placeholder UPI ID - in a real app, this would come from env or backend
    const upiId = "typingos@upi";

    const handleCopyUpi = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        toast.success(t("UPI ID Copied"));
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) setTimeout(() => setView('options'), 300);
        }}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-border/50 bg-card rounded-3xl shadow-2xl">
                <AnimatePresence mode="wait">
                    {view === 'options' ? (
                        <motion.div
                            key="options"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8"
                        >
                            <DialogHeader className="mb-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Heart className="w-8 h-8 text-pink-500 fill-pink-500/20" />
                                </div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                                    {t('Support TypingOS')}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground mt-2">
                                    {t('Your contribution helps us keep the servers running and forge new features.')}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4">
                                <Button
                                    onClick={() => window.open('https://buymeacoffee.com/khanshahru8?new=1', '_blank')}
                                    className="h-14 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-black uppercase tracking-widest rounded-2xl border-0 shadow-lg group"
                                >
                                    <Coffee className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                                    {t('Buy Me a Coffee')}
                                    <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-50" />
                                </Button>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => setView('upi')}
                                        variant="outline"
                                        className="h-14 border-white/10 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest rounded-2xl group transition-all"
                                    >
                                        <Smartphone className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
                                        {t('UPI')}
                                    </Button>

                                    <Button
                                        onClick={() => window.open('https://paypal.me', '_blank')}
                                        variant="outline"
                                        className="h-14 border-white/10 bg-[#0070BA]/10 hover:bg-[#0070BA]/20 text-[#0070BA] font-black uppercase tracking-widest rounded-2xl group transition-all"
                                    >
                                        <div className="w-5 h-5 mr-3 flex items-center justify-center font-bold text-xs italic group-hover:scale-110 transition-transform">PP</div>
                                        {t('PayPal')}
                                    </Button>
                                </div>

                                <Button
                                    onClick={() => window.open('https://github.com/sponsors', '_blank')}
                                    variant="outline"
                                    className="h-14 border-white/10 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest rounded-2xl group transition-all"
                                >
                                    <Github className="w-5 h-5 mr-3 text-white group-hover:scale-110 transition-transform" />
                                    {t('GitHub Sponsors')}
                                    <Heart className="w-3.5 h-3.5 ml-2 text-pink-500 fill-pink-500" />
                                </Button>

                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary fill-current" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('Non-Monetary Support')}</span>
                                        </div>
                                        <Badge className="bg-primary text-primary-foreground text-[8px] font-black px-1.5 h-4">+75 {t('Coins')}</Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mb-3 font-mediumLeading-relaxed uppercase">
                                        {t('Support TypingOS servers by watching a short transmission.')}
                                    </p>
                                    <AdToEarn rewardAmount={75} />
                                </div>
                            </div>

                            <p className="text-center mt-8 text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-50">
                                TypingOS Protocol · Secure Transmission
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upi"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-8"
                        >
                            <div className="mb-6">
                                <button
                                    onClick={() => setView('options')}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 mb-4"
                                >
                                    ← {t('Back')}
                                </button>
                                <DialogHeader className="text-center">
                                    <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                                        {t('UPI Transfer')}
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        {t('Scan the QR or copy the ID to contribute.')}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 flex flex-col items-center">
                                {/* Stylized QR Placeholder */}
                                <div className="w-48 h-48 bg-white rounded-2xl p-4 mb-6 shadow-xl relative group">
                                    <div className="w-full h-full border-2 border-slate-200 border-dashed rounded-lg flex items-center justify-center">
                                        <QrCode className="w-20 h-20 text-slate-300" />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center font-black text-[10px] uppercase text-primary">
                                        {t('Secure Scan Active')}
                                    </div>
                                </div>

                                <div className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">UPI ID</span>
                                        <span className="text-xs font-bold text-white selection:bg-primary/30">{upiId}</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleCopyUpi}
                                        className={cn("h-10 w-10 rounded-xl transition-all", copied && "bg-emerald-500/20 text-emerald-500")}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-[10px] text-muted-foreground text-center uppercase font-medium">
                                    {t('Contributions help maintain a high-performance environment for all pilots.')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
