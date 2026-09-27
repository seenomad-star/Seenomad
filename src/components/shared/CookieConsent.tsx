import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";

export const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptConsent = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[420px] z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-[#1A1C1E]/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-1">Cookie Notice</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            We use cookies to personalize content and ads, and to analyze our traffic.
                            By clicking "Accept", you consent to our use of cookies.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <Button
                                onClick={acceptConsent}
                                className="flex-1 h-10 bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-widest text-[10px] rounded-xl"
                            >
                                Accept All
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsVisible(false)}
                                className="h-10 px-4 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-[10px] rounded-xl underline"
                            >
                                Privacy Policy
                            </Button>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-muted-foreground hover:text-foreground p-1"
                        aria-label="Close"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
