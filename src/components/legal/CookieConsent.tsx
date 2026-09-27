import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from 'react-i18next';

export const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consents, setConsents] = useState({
        essential: true,
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        const hasConsented = localStorage.getItem('cookie-consent');
        if (!hasConsented) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const consentData = { essential: true, analytics: true, marketing: true };
        localStorage.setItem('cookie-consent', JSON.stringify(consentData));
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(consents));
        setIsVisible(false);
        setShowSettings(false);
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && !showSettings && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[100]"
                    >
                        <div className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Cookie className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-1">{t("Cookie Notice")}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("We use cookies to enhance your experience, analyze site traffic, and serve personalized ads. By clicking \"Accept All\", you consent to our use of cookies.")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button onClick={handleAcceptAll} className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90">
                                    {t("Accept All")}
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowSettings(true)}
                                        className="flex-1 h-10 rounded-xl bg-secondary/30 border-border/40 hover:bg-secondary/50"
                                    >
                                        <Settings2 className="w-4 h-4 mr-2" />
                                        {t("Settings")}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsVisible(false)}
                                        className="h-10 px-3 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl font-black">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            {t("Privacy Center")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("Customize your cookie preferences. Essential cookies are required for the system to function.")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-foreground">{t("Essential")}</p>
                                <p className="text-xs text-muted-foreground">{t("Required for OS stability and auth.")}</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-foreground">{t("Analytics")}</p>
                                <p className="text-xs text-muted-foreground">{t("Help us improve your typing speed.")}</p>
                            </div>
                            <Switch
                                checked={consents.analytics}
                                onCheckedChange={(v) => setConsents(prev => ({ ...prev, analytics: v }))}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-foreground">{t("Marketing")}</p>
                                <p className="text-xs text-muted-foreground">{t("Personalized themes and news.")}</p>
                            </div>
                            <Switch
                                checked={consents.marketing}
                                onCheckedChange={(v) => setConsents(prev => ({ ...prev, marketing: v }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSavePreferences} className="w-full rounded-xl font-bold">
                            {t("Save Preferences")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
