
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Megaphone,
    Video,
    ShoppingBag,
    MessageCircle,
    Send,
    CheckCircle2,
    ArrowRight,
    Globe,
    Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

export type PromotionCategory = 'advertise' | 'video' | 'product' | 'publish' | 'general';

interface PromotionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialCategory?: PromotionCategory;
}

export function PromotionModal({ open, onOpenChange, initialCategory = 'general' }: PromotionModalProps) {
    const { t } = useTranslation();
    const [category, setCategory] = useState<PromotionCategory>(initialCategory);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        link: "",
        message: ""
    });

    const categories = [
        { id: 'advertise', label: t('Advertise'), icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'video', label: t('Video'), icon: Video, color: 'text-red-500', bg: 'bg-red-500/10' },
        { id: 'product', label: t('Product'), icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'publish', label: t('Publish'), icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'general', label: t('Direct'), icon: MessageCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API transmission
        setTimeout(() => {
            setStatus('success');
            toast.success(t("Inquiry Transmitted"), {
                description: t("Our Nexus agents will contact you shortly.")
            });
        }, 1500);
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStatus('idle');
            setFormData({ name: "", email: "", link: "", message: "" });
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 bg-card rounded-3xl shadow-2xl">
                <AnimatePresence mode="wait">
                    {status !== 'success' ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8"
                        >
                            <DialogHeader className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                        <Megaphone className="w-5 h-5 text-primary" />
                                    </div>
                                    <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                                        {t('Nexus Promotion')}
                                    </DialogTitle>
                                </div>
                                <DialogDescription className="text-muted-foreground">
                                    {t('Commandeer our platform to broadcast your vision to the TypingOS network.')}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    const active = category === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id as PromotionCategory)}
                                            className={cn(
                                                "flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all",
                                                active
                                                    ? cn("border-transparent shadow-lg scale-105", cat.bg, cat.color)
                                                    : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Name')}</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                className="h-11 bg-secondary/30 border-white/5 pl-9 focus:ring-primary/20"
                                                placeholder="Nexus Pilot"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Protocol Address')}</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                className="h-11 bg-secondary/30 border-white/5 pl-9 focus:ring-primary/20"
                                                placeholder="pilot@nexus.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {(category === 'video' || category === 'product' || category === 'advertise' || category === 'publish') && (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                                            {category === 'video' ? t('Video Link') : category === 'product' ? t('Product Link') : category === 'publish' ? t('Content Link/URL') : t('Website Link')}
                                        </Label>
                                        <Input
                                            className="h-11 bg-secondary/30 border-white/5 focus:ring-primary/20"
                                            placeholder="https://..."
                                            value={formData.link}
                                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">{t('Transmission Details')}</Label>
                                    <Textarea
                                        className="bg-secondary/30 border-white/5 min-h-[100px] resize-none focus:ring-primary/20"
                                        placeholder={t('Detail your objectives components...')}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button
                                    className="w-full h-12 font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? t('Transmitting...') : (
                                        <>
                                            {t('Initialize Promotion')}
                                            <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{t('Transmission Confirmed')}</h2>
                            <p className="text-muted-foreground mb-8 text-sm">
                                {t('Your request has been routed through our central neural node. Expected contact within 24 standard cycles.')}
                            </p>
                            <Button
                                onClick={handleClose}
                                className="w-full h-12 font-black uppercase tracking-widest"
                            >
                                {t('Back to Bridge')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
