import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Settings2,
    Zap,
    Trash2,
    Copy,
    BookOpen,
    Code,
    Quote,
    Play,
    RotateCcw,
    Sparkles,
    Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCustomText } from "@/contexts/CustomTextContext";
import { TypingTestBox } from "@/components/typing/TypingTestBox";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

const PRESETS = [
    { id: 'code', title: 'JavaScript Logic', icon: Code, text: "export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));\n\nconst [state, setState] = useState(null);\n\nif (x > 0) { return true; }\n\nfunction handleSubmit(e) { e.preventDefault(); }" },
    { id: 'lit', title: 'Classic Literature', icon: BookOpen, text: "To be, or not to be, that is the question.\n\nThe only way to do great work is to love what you do.\n\nLife is what happens when you're busy making other plans." },
    { id: 'quote', title: 'Inspirational', icon: Quote, text: "The greatest glory in living lies not in never falling, but in rising every time we fall.\n\nThe way to get started is to quit talking and begin doing." }
];

export default function CustomPractice() {
    const { setAndActivate, clearCustomText, customText } = useCustomText();
    const [inputText, setInputText] = useState(customText.text || "");
    const [isTestActive, setIsTestActive] = useState(customText.isActive);

    // Sync state with context on mount
    useEffect(() => {
        if (customText.isActive) {
            setIsTestActive(true);
        }
    }, [customText.isActive]);

    const handleIgnite = () => {
        if (!inputText.trim()) {
            toast.error("Enter some text to ignite your practice!");
            return;
        }
        setAndActivate(inputText);
        setIsTestActive(true);
        toast.success("Session Ignited! Focus and type.");

        // Smooth scroll to test
        setTimeout(() => {
            document.getElementById('typing-arena')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handleClear = () => {
        setInputText("");
        clearCustomText();
        setIsTestActive(false);
    };

    const charCount = inputText.length;
    const wordCount = inputText.split(/\s+/).filter(w => w.length > 0).length;

    return (
        <div className="min-h-screen p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            {/* HEADER SECTION */}
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-transparent border border-primary/20 p-10 md:p-16">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Settings2 className="w-80 h-80 -rotate-12" />
                </div>

                <div className="relative z-10 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Lab Environment 1.0</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                        Forge Your Own <span className="text-primary italic">Practice.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground/80 font-medium max-w-2xl leading-relaxed">
                        Paste anything—from your latest code PR to a chapter of your favorite book.
                        We turn it into a high-performance training ground.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* INPUT PANEL */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-white/5 shadow-2xl relative group">
                        <div className="absolute top-6 right-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 transition-opacity group-focus-within:opacity-100 opacity-60">
                            <span className={cn(charCount > 1000 ? "text-yellow-500" : "")}>{charCount} Chars</span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                            <span>{wordCount} Words</span>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste your custom text here..."
                            className="w-full min-h-[320px] bg-transparent border-none outline-none resize-none text-2xl font-medium placeholder:text-muted-foreground/20 custom-scrollbar"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={handleIgnite}
                                    className="h-16 px-10 rounded-2xl bg-primary text-background font-black uppercase tracking-widest group-hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                                >
                                    <Zap className="w-5 h-5 mr-3 fill-current" />
                                    Ignite Session
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClear}
                                    className="h-16 w-16 rounded-2xl border border-white/5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    aria-label="Clear all text"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-widest">
                                Press Cmd+Enter to Ignite
                            </p>
                        </div>
                    </Card>
                </div>

                {/* PRESETS SIDEBAR */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="font-black uppercase tracking-widest text-sm">Quick Presets</h3>
                    </div>

                    <div className="space-y-4">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setInputText(preset.text);
                                    toast.info(`Loaded: ${preset.title}`);
                                }}
                                className="w-full p-6 text-left rounded-[2rem] bg-card/20 hover:bg-primary/5 border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden"
                            >
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                        <preset.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{preset.title}</h4>
                                        <p className="text-xs text-muted-foreground/60 font-medium">Click to load</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Copy className="w-12 h-12" />
                                </div>
                            </button>
                        ))}

                        {/* AI GENERATOR MINI-CARD */}
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 relative overflow-hidden group cursor-pointer">
                            <div className="relative z-10 space-y-3">
                                <Badge className="bg-white/10 text-white border-0 font-black italic">PRO</Badge>
                                <h4 className="font-black text-xl leading-tight">AI Topic <br />Generator</h4>
                                <p className="text-xs text-white/50 font-semibold">Generate text about any topic instantly.</p>
                            </div>
                            <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* TYPING TEST AREA */}
            <AnimatePresence>
                {isTestActive && (
                    <motion.div
                        id="typing-arena"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-12 scroll-mt-32"
                    >
                        <div className="flex flex-col items-center gap-10">
                            <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-secondary/30 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lab Session Active</span>
                            </div>

                            <div className="w-full">
                                <TypingTestBox />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FOOTER INFO */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5 opacity-40">
                <p className="text-xs font-bold uppercase tracking-widest italic">Optimizing for Neuro-Pathway Building</p>
                <div className="flex items-center gap-6">
                    <Badge variant="outline" className="border-white/10 px-4 py-1 text-[10px] font-black">V2.4.0-STRICT</Badge>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Low Latency Engine</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
