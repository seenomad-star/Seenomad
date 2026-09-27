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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordResetModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PasswordResetModal({ open, onOpenChange }: PasswordResetModalProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulated local-only reset for database-free system
        setTimeout(() => {
            setEmailSent(true);
            toast.success(t("Email Sent"), {
                description: t("Instructions sent to your local recovery box.")
            });
            setLoading(false);
        }, 1500);
    };

    const handleClose = () => {
        setEmail("");
        setEmailSent(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/50 bg-card">
                <AnimatePresence mode="wait">
                    {!emailSent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-8"
                        >
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">
                                    {t('Reset Password')}
                                </DialogTitle>
                                <DialogDescription>
                                    {t('Enter your email address and we\'ll send you a link to reset your password.')}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handlePasswordReset} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                        {t('Email Address')}
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="reset-email"
                                            placeholder="commander@typingos.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 h-11 bg-secondary/30 border-white/5 focus:ring-primary/20"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        className="flex-1 h-11 font-bold uppercase tracking-widest"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        {t('Cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                        disabled={loading || !email}
                                    >
                                        {loading ? t("Sending...") : t("Send Reset Link")}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">
                                    <span className="text-primary font-black">⚡ {t('Security Note')}:</span> {t('The reset link will expire in 1 hour for your protection.')}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8 text-center"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                            </div>

                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">
                                    {t('Check Your Email')}
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                    {t('We\'ve sent password reset instructions to')}
                                    <br />
                                    <span className="font-bold text-primary">{email}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                        {t('Next Steps')}:
                                    </h4>
                                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                                        <li>{t('Check your email inbox')}</li>
                                        <li>{t('Click the reset link in the email')}</li>
                                        <li>{t('Create a new password')}</li>
                                        <li>{t('Log in with your new password')}</li>
                                    </ol>
                                </div>

                                <Button
                                    onClick={handleClose}
                                    className="w-full h-11 font-black uppercase tracking-widest"
                                >
                                    {t('Done')}
                                </Button>

                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-xs text-primary hover:underline font-bold uppercase tracking-wider"
                                >
                                    {t('Didn\'t receive email? Try again')}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
