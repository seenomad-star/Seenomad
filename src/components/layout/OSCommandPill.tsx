import React, { useState, useEffect, useMemo, useRef } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import {
    Search,
    Mic,
    Command as CommandIcon,
    User,
    Settings as SettingsIcon,
    GraduationCap,
    Globe,
    BookOpen,
    Zap as ZapIcon,
    Play,
    Rocket,
    Sparkles,
    ChevronDown,
    LayoutGrid,
    Target
} from "lucide-react";
import { cn } from "@/utils/utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { navigationCategories } from "@/data/navigationData";
import { exams } from "@/data/examsData";
import { globalExams } from "@/data/globalExamsData";
import { quickActions } from "@/data/enterpriseFeaturesData";

export function OSCommandPill() {
    const [open, setOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputRef.current?.focus();
                setOpen(true);
            }
            if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                navigate("/");
                setOpen(false);
            }
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                navigate("/settings");
                setOpen(false);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [navigate]);

    const toggleVoice = () => {
        setIsListening(true);
        toast.info(t("Listening for voice commands..."), { icon: <Mic className="w-4 h-4 text-primary" /> });
        setTimeout(() => {
            setIsListening(false);
            toast.success(t("Voice search processed (simulated)"));
        }, 3000);
    };

    const runCommand = (url: string) => {
        setOpen(false);
        setSearchValue("");
        navigate(url);
    };

    // Deep Indexing Logic
    const searchableItems = useMemo(() => {
        const items: any[] = [];

        // 1. Navigation Categories & Sub-options (System Features)
        navigationCategories.forEach(cat => {
            cat.subOptions.forEach(opt => {
                items.push({
                    id: `nav-${cat.id}-${opt.title}`,
                    type: "System Features",
                    title: opt.title,
                    desc: opt.desc,
                    url: opt.url,
                    icon: opt.icon,
                    keywords: `${cat.label} ${opt.title} ${opt.desc || ""} universal feature system portal navigation`.toLowerCase()
                });
            });
        });

        // 2. Exams
        exams.forEach(exam => {
            items.push({
                id: `exam-in-${exam.id}`,
                type: "Exams",
                title: exam.name,
                desc: `${exam.fullName} | ${exam.authority}`,
                url: `/exams`,
                icon: GraduationCap,
                keywords: `${exam.name} ${exam.fullName} ${exam.authority} ${exam.country} india government education`.toLowerCase()
            });
        });

        // 3. Quick Actions
        quickActions.forEach(action => {
            items.push({
                id: `action-${action.id}`,
                type: "Quick Actions",
                title: action.title,
                desc: action.description,
                url: action.route,
                icon: ZapIcon,
                keywords: `${action.title} ${action.description} quick action reward`.toLowerCase()
            });
        });

        return items;
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-lg" aria-label="Universal Search" title="Universal Search">
            <Command label="Universal Search" title="Universal Search" className="overflow-visible bg-transparent border-none">
                <div
                    className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-muted/20 border border-white/5 hover:border-white/10 transition-all",
                        "group focus-within:bg-muted/40 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5",
                        open && "rounded-b-none border-b-transparent bg-muted/40"
                    )}
                >
                    <Search className={cn(
                        "w-4 h-4 transition-colors",
                        open ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />

                    <CommandInput
                        ref={inputRef}
                        placeholder={t('Search everything in the OS...')}
                        value={searchValue}
                        onValueChange={setSearchValue}
                        onFocus={() => setOpen(true)}
                        className="h-8 border-none focus:ring-0 bg-transparent text-xs w-full placeholder:text-muted-foreground/50"
                    />

                    <div className="flex items-center gap-2">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleVoice();
                            }}
                            role="button"
                            title={t("Voice Search")}
                            aria-label={t("Activate Voice Search")}
                            className={cn(
                                "p-1.5 rounded-lg hover:bg-primary/20 transition-all cursor-pointer",
                                isListening && "animate-pulse text-primary bg-primary/20"
                            )}
                        >
                            <Mic className="w-3.5 h-3.5" />
                        </div>
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/60">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 z-[101] bg-card/95 backdrop-blur-3xl border border-white/10 rounded-b-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            <CommandList className="max-h-[450px] overflow-y-auto custom-scrollbar p-2">
                                <CommandEmpty className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Sparkles className="w-8 h-8 text-muted-foreground/20" />
                                        <p className="text-sm text-muted-foreground">{t('No results found.')}</p>
                                    </div>
                                </CommandEmpty>

                                {searchValue.length === 0 ? (
                                    <>
                                        {/* Show top-level categories as quick links */}
                                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                                            {navigationCategories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => runCommand(cat.subOptions[0].url)}
                                                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group"
                                                >
                                                    <cat.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{t(cat.label)}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Suggested Features Group */}
                                        <CommandGroup heading={t('Featured Modules')}>
                                            {searchableItems.slice(0, 15).map(item => (
                                                <CommandItem
                                                    key={item.id}
                                                    value={`${item.title} ${item.keywords}`}
                                                    onSelect={() => runCommand(item.url)}
                                                    className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-primary/10 cursor-pointer group"
                                                >
                                                    <div className="w-9 h-9 rounded-xl bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                                        <item.icon className="h-4.5 w-4.5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all text-primary" />
                                                    </div>
                                                    <div className="flex flex-col flex-1 pl-1">
                                                        <span className="font-bold text-[13px] tracking-tight text-foreground/90">{t(item.title)}</span>
                                                        <span className="text-[10px] text-muted-foreground/60 line-clamp-1">{t(item.desc || '')}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/20 group-hover:text-primary/40 transition-colors uppercase">
                                                        {item.type.split(' ')[0]}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </>
                                ) : (
                                    <>
                                        {["System Features", "Exams", "Quick Actions"].map(type => {
                                            const items = searchableItems.filter(i => i.type === type);
                                            if (items.length === 0) return null;

                                            return (
                                                <CommandGroup key={type} heading={t(type)}>
                                                    {items.map(item => (
                                                        <CommandItem
                                                            key={item.id}
                                                            value={`${item.title} ${item.keywords}`}
                                                            onSelect={() => runCommand(item.url)}
                                                            className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-primary/10 cursor-pointer group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                                                <item.icon className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="font-bold text-sm tracking-tight">{t(item.title)}</span>
                                                                {item.desc && (
                                                                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                                                                        {t(item.desc)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {item.title === "Standard Test" && <CommandShortcut className="text-[9px] font-black opacity-30">⌘P</CommandShortcut>}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            );
                                        })}
                                    </>
                                )}
                            </CommandList>

                            {/* Footer hint */}
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground/50 tracking-[0.2em]">Universal OS Matrix active</span>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <kbd className="h-5 min-w-[20px] px-1.5 rounded bg-white/5 border border-white/10 text-[9px] flex items-center justify-center font-mono">ESC</kbd>
                                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Exit</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="h-5 min-w-[20px] px-1.5 rounded bg-white/5 border border-white/10 text-[9px] flex items-center justify-center font-mono">↵</kbd>
                                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Execute</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Command>
        </div>
    );
}
