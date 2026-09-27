import React from "react";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Check } from "lucide-react";
import { motion } from "framer-motion";

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("i18nextLng", lng);
    };

    const currentLanguage = languages.find((l) => i18n.language.startsWith(l.code)) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-3 h-9 rounded-xl hover:bg-muted transition-all group border border-border/30 bg-card/50"
                >
                    <Languages className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                        {currentLanguage.code}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50 rounded-2xl p-2">
                <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">
                    {t("Language")}
                </div>
                {languages.map((lng) => (
                    <DropdownMenuItem
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className="flex items-center justify-between gap-2 cursor-pointer rounded-xl py-2 px-3 text-xs font-bold hover:bg-primary/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-base">{lng.flag}</span>
                            <span>{lng.name}</span>
                        </div>
                        {i18n.language.startsWith(lng.code) && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Check className="w-3.5 h-3.5 text-primary" />
                            </motion.div>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
