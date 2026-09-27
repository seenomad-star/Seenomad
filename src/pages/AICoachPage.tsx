import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, Sparkles, TrendingUp, Target, Lightbulb, ChevronRight, Activity, Zap, Brain, Flame, MessageSquare, ArrowRight, ShieldCheck, MousePointer2, BrainCircuit, FileText, CheckCircle2, UserCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { cn } from "@/utils/utils";
import { AnalysisEngine, COACH_PROFILES, CoachPersona } from "@/services/ai/AnalysisEngine";
import { aiService } from "@/services/ai/AIService";
import { toast } from "sonner";

// Mock heatmap data for visualization
const HEATMAP_KEYS = [
    { key: 'A', status: 'optimal' }, { key: 'S', status: 'optimal' }, { key: 'D', status: 'struggle' }, { key: 'F', status: 'optimal' },
    { key: 'J', status: 'struggle' }, { key: 'K', status: 'optimal' }, { key: 'L', status: 'optimal' }, { key: ';', status: 'optimal' },
    { key: 'Q', status: 'optimal' }, { key: 'W', status: 'optimal' }, { key: 'E', status: 'struggle' }, { key: 'R', status: 'optimal' },
    { key: 'U', status: 'optimal' }, { key: 'I', status: 'struggle' }, { key: 'O', status: 'optimal' }, { key: 'P', status: 'optimal' },
];

export default function AICoachPage() {
    const { userStats } = useGamification();
    const { getAverageWpm, getAverageAccuracy, results } = useTestHistoryContext();

    // PERSONA STATE
    const [activePersona, setActivePersona] = useState<CoachPersona>('sensei');
    const profile = COACH_PROFILES[activePersona];

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);

    // Initialize chat with persona greeting
    useEffect(() => {
        setChatMessages([{ role: 'ai', text: profile.greeting }]);
    }, [activePersona]);

    // NEURAL EMPATHY MONITOR & AUTOMATED ANALYSIS
    useEffect(() => {
        const lastResult = results[results.length - 1];
        if (lastResult) {
            const runAnalysis = async () => {
                const analysis = await AnalysisEngine.generateAIAnalysis(results, activePersona);
                if (analysis.recommendation) {
                    setChatMessages(prev => [
                        ...prev,
                        { role: 'ai', text: analysis.recommendation }
                    ]);
                }
            };
            runAnalysis();
        }
    }, [results, activePersona]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const analysis = await AnalysisEngine.generateAIAnalysis(results, activePersona);
            setAnalysisResult(analysis);
            setChatMessages(prev => [
                ...prev,
                { role: 'ai', text: `Analysis complete. ${analysis.recommendation} I suggest you try the "${analysis.suggestedLesson}" lesson.` }
            ]);
        } catch (error) {
            toast.error("AI Analysis failed. Please check your API keys.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSend = async () => {
        if (!userInput.trim()) return;
        const text = userInput.trim();
        setChatMessages(prev => [...prev, { role: 'user', text }]);
        setUserInput("");

        try {
            const response = await aiService.generateText({
                modelId: '', // uses active
                prompt: text,
                systemPrompt: `You are ${profile.name}, a typing coach. Your style is ${profile.style}. 
                The user has an average WPM of ${getAverageWpm()} and accuracy of ${getAverageAccuracy()}%.
                Keep your response concise and in character.`
            });
            setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch (error: any) {
            setChatMessages(prev => [...prev, { role: 'ai', text: `Error: ${error.message}` }]);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            {/* HERO SECTION - PERSONA THEMED */}
            <div className={cn(
                "relative overflow-hidden rounded-[3rem] border p-10 md:p-16 transition-colors duration-500",
                activePersona === 'sensei' && "bg-gradient-to-br from-indigo-500/10 via-background to-transparent border-indigo-500/20",
                activePersona === 'drill_sergeant' && "bg-gradient-to-br from-orange-500/10 via-background to-transparent border-orange-500/20",
                activePersona === 'hype_beast' && "bg-gradient-to-br from-pink-500/10 via-background to-transparent border-pink-500/20",
                activePersona === 'analytical_bot' && "bg-gradient-to-br from-cyan-500/10 via-background to-transparent border-cyan-500/20",
            )}>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <motion.div
                            key={activePersona}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0"
                        >
                            <span className="text-xl">{profile.avatar}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 font-mono">
                                {profile.name} // {profile.id.replace('_', ' ')} MODE
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8]">
                            AI Coach <span className={cn(
                                "italic transition-colors duration-500",
                                activePersona === 'sensei' && "text-indigo-400",
                                activePersona === 'drill_sergeant' && "text-orange-400",
                                activePersona === 'hype_beast' && "text-pink-400",
                                activePersona === 'analytical_bot' && "text-cyan-400",
                            )}>{profile.name}</span>
                        </h1>

                        <p className="text-xl text-muted-foreground/80 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
                            {profile.style} Selected and ready to optimize your neural pathways.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
                            {/* PERSONA SELECTOR */}
                            {(Object.keys(COACH_PROFILES) as CoachPersona[]).map((persona) => (
                                <button
                                    key={persona}
                                    onClick={() => setActivePersona(persona)}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl border transition-all hover:scale-110",
                                        activePersona === persona
                                            ? "bg-white/10 border-white/50 shadow-glow"
                                            : "bg-black/20 border-white/5 opacity-50 hover:opacity-100"
                                    )}
                                    title={COACH_PROFILES[persona].name}
                                >
                                    {COACH_PROFILES[persona].avatar}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:block relative">
                        <Card className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border-white/5 shadow-2xl relative overflow-hidden h-64 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <span className="text-6xl">{profile.avatar}</span>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{profile.name}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{profile.style.split(',')[0]}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT COLLUMN - DYNAMIC INSIGHTS */}
                <div className="xl:col-span-2 space-y-8">
                    {/* WEAKNESS HEATMAP VISUALIZER */}
                    <Card className="p-10 rounded-[3rem] bg-card/20 border-white/5 space-y-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter italic">Neural <span className="text-rose-400">Heatmap.</span></h3>
                            <p className="text-sm text-muted-foreground font-medium">Auto-generated based on your last 10 sessions.</p>
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                            {HEATMAP_KEYS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-16 rounded-2xl border flex items-center justify-center text-lg font-black font-mono transition-all hover:scale-110",
                                        item.status === 'optimal'
                                            ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400/60"
                                            : "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10"
                                    )}
                                >
                                    {item.key}
                                </div>
                            ))}
                        </div>
                        <Button size="lg" onClick={handleAnalyze} className="w-full mt-4 bg-white/5 hover:bg-white/10 uppercase tracking-widest font-bold">
                            {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
                        </Button>
                    </Card>
                </div>

                {/* RIGHT COLUMN - COACH CHAT */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-black uppercase tracking-widest text-sm italic">Direct Intel</h3>
                    </div>

                    <Card className="rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-white/5 h-[640px] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {profile.name} Online
                            </div>
                        </div>

                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            {chatMessages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={cn(
                                        "max-w-[85%] p-4 text-sm font-medium",
                                        msg.role === 'ai'
                                            ? "bg-white/5 rounded-3xl rounded-tl-none border border-white/5 text-foreground/90"
                                            : "bg-indigo-500 text-white rounded-3xl rounded-tr-none ml-auto"
                                    )}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 pt-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask for technique advice..."
                                    className="w-full h-16 bg-white/5 border border-white/5 rounded-3xl px-6 pr-16 outline-none focus:border-indigo-500/50 transition-all text-sm font-medium"
                                />
                                <button
                                    onClick={handleSend}
                                    title="Send message"
                                    className="absolute right-2 top-2 h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg active:scale-95"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
