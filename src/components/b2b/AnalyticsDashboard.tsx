import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, Activity, Trophy, TrendingUp, Sparkles, BrainCircuit, Target, Zap, Shell } from 'lucide-react';
import { cn } from '@/utils/utils';
import { AnalysisEngine, COACH_PROFILES, CoachPersona } from '@/services/ai/AnalysisEngine';
import { useNeuralSync } from '@/hooks/useNeuralSync';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ACTIVITY_DATA = [
    { name: 'Mon', active: 400, lessons: 240 },
    { name: 'Tue', active: 300, lessons: 398 },
    { name: 'Wed', active: 520, lessons: 480 },
    { name: 'Thu', active: 450, lessons: 390 },
    { name: 'Fri', active: 600, lessons: 520 },
    { name: 'Sat', active: 380, lessons: 200 },
    { name: 'Sun', active: 350, lessons: 180 },
];

const MOCK_GROWTH_DATA = [
    { name: 'Week 1', wpm: 25 },
    { name: 'Week 2', wpm: 32 },
    { name: 'Week 3', wpm: 38 },
    { name: 'Week 4', wpm: 45 },
    { name: 'Week 5', wpm: 48 },
    { name: 'Week 6', wpm: 55 },
];

interface AnalyticsDashboardProps {
    type: 'school' | 'business';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ type }) => {
    const isSchool = type === 'school';
    const primaryColor = isSchool ? "#3b82f6" : "#10b981"; // Blue for school, Emerald for business
    const secondaryColor = isSchool ? "#8b5cf6" : "#059669";

    // AI Analysis State
    const coachType: CoachPersona = isSchool ? 'sensei' : 'analytical_bot';
    const coachProfile = COACH_PROFILES[coachType];
    const [analysis, setAnalysis] = React.useState<any>(AnalysisEngine.analyzeGroupPerformance([], coachType));
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    const { history: neuralHistory } = useNeuralSync();

    React.useEffect(() => {
        const fetchAnalysis = async () => {
            setIsAnalyzing(true);
            try {
                // In a real scenario, we'd pass aggregate data here
                const result = await AnalysisEngine.generateGroupAIAnalysis([], coachType);
                setAnalysis(result);
            } catch (error) {
                console.error("Dashboard AI Error:", error);
            } finally {
                setIsAnalyzing(false);
            }
        };
        fetchAnalysis();
    }, [coachType]);

    const KEYBOARD_LAYOUT = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    return (
        <div className="space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-secondary/50 to-background border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {isSchool ? "Total Students" : "Active Employees"}
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-emerald-400 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/50 to-background border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg. WPM
                        </CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48.2</div>
                        <p className="text-xs text-muted-foreground mt-1">Top 15% globally</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/50 to-background border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {isSchool ? "Lessons Completed" : "Productivity Score"}
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isSchool ? "15,403" : "94/100"}</div>
                        <p className="text-xs text-emerald-400 mt-1">+5.2% this week</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/50 to-background border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Engagement Rate
                        </CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">88%</div>
                        <p className="text-xs text-muted-foreground mt-1">Daily active users</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI INSIGHTS */}
            <Card className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-to-b" />
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">AI Performance Analysis</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {isAnalyzing ? "Syncing neural data..." : `Insights from ${coachProfile.name}`}
                                </p>
                            </div>
                        </div>
                        <div className="text-4xl">{coachProfile.avatar}</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400" /> Recommendation
                            </h4>
                            <p className="text-sm italic">"{analysis.recommendation}"</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-red-400" /> Focus Area
                            </h4>
                            <p className="text-sm">
                                Weak Keys: <span className="font-mono text-red-300">{analysis.weakKeys.join(', ')}</span>
                            </p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-400" /> Suggested Action
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{analysis.suggestedLesson}</span>
                                <button className="text-xs bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-full transition-colors">
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LIVE NEURAL FEED */}
                <Card className="lg:col-span-1 bg-black/20 border-white/5 flex flex-col h-[500px] overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4 text-primary animate-pulse" /> Neural Sync Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence initial={false}>
                            {neuralHistory.map((evt, i) => (
                                <motion.div
                                    key={evt.payload.timestamp + i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] space-y-1"
                                >
                                    <div className="flex justify-between items-center opacity-50">
                                        <span className="font-black uppercase tracking-widest text-[8px]">{evt.type}</span>
                                        <span>{new Date(evt.payload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-white font-medium">
                                        {evt.type === 'GLOBAL_ACHIEVEMENT' && <><span className="text-primary font-black">{evt.payload.username}</span> {evt.payload.achievement}</>}
                                        {evt.type === 'SEASON_UPDATE' && <span className="text-yellow-400 font-bold">{evt.payload.message}</span>}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                {/* COMPETENCY HEATMAP */}
                <Card className="lg:col-span-2 bg-secondary/10 border-white/5 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Shell className="w-5 h-5 text-primary" /> Key Competency Heatmap
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 scale-90 origin-top-left">
                            {KEYBOARD_LAYOUT.map((row, i) => (
                                <div key={i} className={cn("flex gap-2 justify-center", i === 1 && "ml-5", i === 2 && "ml-10")}>
                                    {row.map(key => {
                                        const isWeak = analysis.weakKeys.includes(key.toLowerCase());
                                        return (
                                            <div
                                                key={key}
                                                className={cn(
                                                    "w-12 h-12 rounded-lg flex items-center justify-center font-bold border transition-all",
                                                    isWeak
                                                        ? "bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                                        : "bg-white/5 border-white/10 text-white/40"
                                                )}
                                            >
                                                {key}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase text-primary">Mastery Insight</p>
                                <p className="text-sm text-white/80">Collective accuracy on the <span className="text-red-400 font-bold">top row</span> is lagging by 12%.</p>
                            </div>
                            <button className="h-10 px-6 rounded-lg bg-primary text-background font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                Deploy Drill
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* ACTIVITY CHART */}
                <Card className="bg-secondary/10 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">
                            {isSchool ? "Student Activity" : "Department Engagement"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_ACTIVITY_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="active" name="Active Users" fill={primaryColor} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="lessons" name="Lessons Done" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* GROWTH CHART */}
                <Card className="bg-secondary/10 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Speed Improvement (Avg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_GROWTH_DATA}>
                                    <defs>
                                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="wpm" stroke={primaryColor} fillOpacity={1} fill="url(#colorWpm)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};
