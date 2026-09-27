
import { cn } from "@/utils/utils";
import { Home, ChevronRight } from "lucide-react";
import { navigationCategories } from "@/data/navigationData";
import { useTranslation } from "react-i18next";

interface NavigationListProps {
    activeCategory: string | null;
    setActiveCategory: (id: string | null) => void;
}

export function NavigationList({ activeCategory, setActiveCategory }: NavigationListProps) {
    const { t } = useTranslation();
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-1.5 mb-8">
            <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group font-black uppercase tracking-widest text-[11px]",
                    activeCategory === null ? "bg-primary text-background shadow-lg shadow-primary/20" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
                )}
            >
                <Home className="w-4 h-4" />
                {t('OS Dashboard')}
            </button>

            <div className="pt-2 pb-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-4">{t('Core Modules')}</div>

            {navigationCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group font-black uppercase tracking-widest text-[11px]",
                        activeCategory === cat.id ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-muted/50 text-muted-foreground"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <cat.icon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        {t(cat.label)}
                    </div>
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", activeCategory === cat.id && "rotate-90")} />
                </button>
            ))}
        </div>
    );
}
