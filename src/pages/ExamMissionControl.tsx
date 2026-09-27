import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ShieldCheck, Users, Trophy, Target, Clock, ArrowLeft, Sparkles, Info, Share2,
    FileText, Rocket, ChevronRight, TrendingUp, Award, Star, Crown,
    Building2, Zap, Activity, Shield, GraduationCap, Gavel, Building, Scale, Mic, Swords,
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/contexts/GamificationContext";
import { useExam } from "@/contexts/ExamContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { toast } from "sonner";
import { MomentOfGlory } from "@/components/shared/MomentOfGlory";
import { indianExamsData } from "@/data/indianExamsData";
import { globalExams } from "@/data/globalExamsData";
import { MissionData } from "@/types/examMissions";

const iconMap: Record<string, any> = {
    Trophy, Users, Target, Clock, ArrowLeft, Sparkles, Info, Share2,
    FileText, Rocket, ChevronRight, TrendingUp, Award, Star, Crown,
    Building2, Zap, Activity, Shield, GraduationCap, Gavel, Building, Scale, Mic, Swords
};

const ReadinessMeter = ({ value }: { value: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                <motion.circle
                    cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-primary"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-foreground">{value}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Ready</span>
            </div>
        </div>
    );
};

export default function ExamMissionControl() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { userStats } = useGamification();
    const { setExamConfig } = useExam();
    const history = useTestHistoryContext();
    const averageWpm = history.getAverageWpm();
    const topWpm = history.getBestWpm();

    const mission = useMemo(() => {
        // Search in Indian Exams (categories)
        if (id && indianExamsData[id]) return indianExamsData[id];

        // Search in Global Exams (specific)
        const globalExam = globalExams.find(e => e.id === id);
        if (globalExam) {
            return {
                id: globalExam.id,
                type: "specific" as const,
                title: globalExam.name,
                subtitle: globalExam.fullName,
                targetWpm: globalExam.typingSpeed.english || globalExam.typingSpeed.native || 30,
                qualifyingMetric: `${globalExam.typingSpeed.english || globalExam.typingSpeed.native || 30} WPM / ${globalExam.duration} min`,
                aspirantSeed: 5000 + (globalExam.name.length * 100),
                rules: globalExam.rules,
                monetization: globalExam.monetization,
                aiPredictor: globalExam.aiPredictor,
                hints: globalExam.hints,
                countryCode: globalExam.countryCode
            } as MissionData;
        }
        return indianExamsData.ssc;
    }, [id]);

    const [aspirantCount, setAspirantCount] = useState(mission.aspirantSeed);
    const [isBossMode, setIsBossMode] = useState(false);
    const [isGloryOpen, setIsGloryOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAspirantCount(prev => prev + Math.floor(Math.random() * 7) - 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const selectionProbability = useMemo(() => {
        const currentWpm = averageWpm || 20; // Default fallback for new users
        const target = isBossMode ? mission.targetWpm + 10 : mission.targetWpm;
        const ratio = currentWpm / target;
        const prob = Math.min(Math.round(ratio * 95), 100);
        return isNaN(prob) ? 0 : prob;
    }, [averageWpm, mission.targetWpm, isBossMode]);

    const handleStartExam = (catTitle?: string) => {
        const config = {
            id: mission.type === "category" ? `${mission.id}-${catTitle?.toLowerCase().replace(/\s+/g, '-')}` : mission.id,
            name: mission.type === "category" ? `${mission.id.toUpperCase()} ${catTitle}` : mission.title,
            fullName: `${mission.title} ${catTitle ? `- ${catTitle}` : ''} Skill Test`,
            targetWpm: isBossMode ? mission.targetWpm + 10 : mission.targetWpm,
            duration: 10,
            language: "english" as const,
            isMockTest: true,
            bossMode: isBossMode
        };
        setExamConfig(config);
        navigate("/");

        toast.success(`${isBossMode ? 'BOSS BATTLE' : 'MISSION'} INITIATED`, {
            description: isBossMode
                ? `Defeat the ${mission.targetWpm + 10} WPM Ghost to earn double XP!`
                : `Qualifying target: ${mission.targetWpm} WPM. Stay focused.`,
            icon: isBossMode ? <Swords className="w-4 h-4 text-red-500" /> : <Rocket className="w-4 h-4" />
        });
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 max-w-7xl mx-auto overflow-x-hidden">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="group mb-2 -ml-2 text-muted-foreground" onClick={() => navigate("/global-exams")}>
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Portal
                    </Button>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                        {mission.title.split(' ')[0]} <span className="text-primary">{mission.title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl font-medium">{mission.subtitle}</p>
                </div>

                <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-3xl border border-border/50 backdrop-blur-3xl">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mission.id}${i}`} alt="Aspirant" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-muted-foreground">Live Aspirants</span>
                        <span className="text-lg font-bold tabular-nums">
                            {aspirantCount.toLocaleString()}
                            <span className="ml-2 w-2 h-2 inline-block bg-green-500 rounded-full animate-pulse" />
                        </span>
                    </div>
                </div>
            </div>

            {/* LIVE GLOBAL TICKER (Social Proof) */}
            <div className="w-full bg-secondary/10 border-y border-border/50 py-2 overflow-hidden whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-12 items-center text-[10px] font-bold uppercase text-muted-foreground"
                >
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center">
                            <span className="flex items-center gap-2"><Trophy className="w-3 h-3 text-yellow-500" /> Rahul S. just qualified for SSC CGL with 42 WPM</span>
                            <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-primary" /> Priya M. earned 2X XP in Boss Battle</span>
                            <span className="flex items-center gap-2"><Star className="w-3 h-3 text-blue-500" /> John D. reached Level 15 in USA Civil Mission</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* MISSION CARD */}
                    <Card className={`relative overflow-hidden transition-all duration-500 border-2 ${isBossMode ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'}`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            {isBossMode ? <Swords className="w-32 h-32 text-red-500" /> : <ShieldCheck className="w-32 h-32 text-primary" />}
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={`${isBossMode ? 'bg-red-500' : 'bg-primary/20 text-primary'} border-0 uppercase font-black`}>
                                    {isBossMode ? 'Boss Battle Active' : 'Live Mission'}
                                </Badge>
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                    Target: {isBossMode ? `${mission.targetWpm + 10} WPM` : mission.qualifyingMetric}
                                </span>
                            </div>
                            <CardTitle className="text-2xl font-black">
                                {mission.type === "specific" ? mission.title : `${mission.categories?.[0].title} Mock Test`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Button size="lg" className={`h-14 px-8 font-black uppercase tracking-widest text-xs ${isBossMode ? 'bg-red-500 hover:bg-red-600' : ''}`} onClick={() => handleStartExam(mission.categories?.[0].title)}>
                                    {isBossMode ? 'Challenge Boss' : 'Start Mission'}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button size="lg" variant="outline" className={`h-14 px-8 font-black uppercase tracking-widest text-xs ${isBossMode ? 'border-red-500/50 text-red-500' : ''}`} onClick={() => setIsBossMode(!isBossMode)}>
                                    {isBossMode ? 'Standard Mode' : 'Toggle Boss Mode'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI PREDICTOR WIDGET (INNOVATIVE) */}
                    <Card className="bg-secondary/10 border-dashed border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                AI Qualification Predictor
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between gap-8 flex-col md:flex-row">
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground">Probability of Selection</span>
                                        <span className={`text-3xl font-black ${selectionProbability > 70 ? 'text-green-500' : 'text-yellow-500'}`}>{selectionProbability}%</span>
                                    </div>
                                    <Progress value={selectionProbability} className="h-2" />
                                    <p className="text-xs text-muted-foreground italic">
                                        "Based on historical cutoffs ({mission.aiPredictor.historicalCutoff} WPM) and your performance trend, you are currently in the <span className="text-foreground font-bold">{selectionProbability > 80 ? 'SAFE' : 'RISKY'} ZONE</span>."
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <span className="text-[8px] font-black uppercase text-muted-foreground mb-1">Market Trend</span>
                                    <Badge variant="outline" className={`font-black uppercase text-[10px] ${mission.aiPredictor.trend === 'rising' ? 'text-red-500' : 'text-green-500'}`}>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {mission.aiPredictor.trend}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI INSIGHTS PANEL (Cognitive Layer) */}
                    <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Elite AI Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 p-4 bg-background/50 rounded-2xl border border-white/5">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase">Optimization Strategy</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Your "Shift" key latency is significantly higher on the left side. Master the <span className="text-primary font-bold">Right Shift</span> for capitals to increase CGL Tier-II speed by approx. <span className="text-green-500 font-bold">8-12%</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-background/50 rounded-2xl border border-white/5">
                                <div className="p-3 bg-yellow-500/10 rounded-xl h-fit">
                                    <Activity className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase">Fatigue Alert</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Data shows you perform best in the first <span className="text-yellow-500 font-bold">7 minutes</span>. For 15-min SSC missions, practice "Interval Bursting" to maintain stamina.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CATEGORIES GRID (only for hubs) */}
                    {mission.type === "category" && mission.categories && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {mission.categories.map((exam, i) => {
                                const Icon = iconMap[exam.icon] || Star;
                                return (
                                    <Card key={i} className="group hover:border-primary/50 cursor-pointer bg-card/40" onClick={() => handleStartExam(exam.title)}>
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl bg-secondary group-hover:bg-primary/10 ${exam.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{exam.title}</h3>
                                                <p className="text-xs text-muted-foreground mt-1">{exam.desc}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* RULES & HINTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-border/40 bg-muted/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black flex items-center gap-2 uppercase">Official Rules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-[10px] space-y-2 text-muted-foreground">
                                    {mission.rules[0].items.map((item, j) => (
                                        <li key={j} className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />{item}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="border-border/40 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black flex items-center gap-2 uppercase">Problem Solving Hints</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-[10px] space-y-2 text-muted-foreground">
                                    {mission.hints.map((hint, j) => (
                                        <li key={j} className="flex gap-2"><Sparkles className="w-3 h-3 text-primary mt-0.5" />{hint}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-8">
                    <Card className="bg-gradient-to-b from-card to-primary/5">
                        <CardContent className="flex flex-col items-center gap-6 p-8">
                            <ReadinessMeter value={78} />
                            <div className="space-y-4 w-full">
                                <div className="flex justify-between text-xs font-bold uppercase"><span>Your Best</span><span>{topWpm || 0} WPM</span></div>
                                <Progress value={Math.min((topWpm / mission.targetWpm) * 100, 100) || 0} className="h-1.5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardContent className="p-6">
                            <Badge className="bg-yellow-500 text-black border-0 mb-4 font-black text-[9px]">PRO OFFER</Badge>
                            <h3 className="text-lg font-black uppercase mb-2 leading-tight">{mission.monetization.offer}</h3>
                            <p className="text-[10px] text-muted-foreground mb-4 uppercase font-bold tracking-tight">Full Mock Series + AI Predicted Ranks</p>
                            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase text-[10px] h-11 shadow-lg shadow-yellow-500/20">
                                Unlock for {mission.monetization.price}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* SPONSORED CAREER PATH (Monetization) */}
                    <Card className="border-primary/20 bg-card/50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-2">
                            <Badge variant="outline" className="text-[8px] opacity-30 border-0">Sponsored</Badge>
                        </div>
                        <CardContent className="p-5 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <Building className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[11px] font-black uppercase tracking-tight">Hiring: Data Entry Expert</h4>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold">Remote • 45k - 60k Coins</p>
                                <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase text-primary mt-1">Submit Your WPM Score</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={() => setIsGloryOpen(true)}
                        className="w-full h-14 bg-gradient-to-r from-primary to-blue-600 font-black uppercase tracking-widest text-xs group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative flex items-center justify-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            View Your Glory Card
                        </span>
                    </Button>
                </div>
            </div>

            <Dialog open={isGloryOpen} onOpenChange={setIsGloryOpen}>
                <DialogContent className="bg-transparent border-none p-0 max-w-md">
                    <MomentOfGlory
                        stats={{
                            wpm: topWpm || 24,
                            accuracy: 98,
                            rank: "1,204",
                            examName: mission.title,
                            percentile: 94
                        }}
                        onShare={() => {
                            toast.success("GLORY SHARED", { description: "Your career card link is copied to clipboard!" });
                            setIsGloryOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div >
    );
}
