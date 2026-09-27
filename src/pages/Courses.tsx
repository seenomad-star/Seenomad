import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    Star,
    Zap,
    Coins,
    Lock,
    Play,
    CheckCircle2,
    Users,
    Clock,
    ArrowRight,
    Trophy,
    Sparkles,
    Search,
    ChevronRight,
    SearchIcon
} from "lucide-react";
import { courses, Course } from "@/data/coursesData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { NativeAdSlot } from "@/components/shared/NativeAdSlot";
import { cn } from "@/utils/utils";
import { useGamification } from "@/contexts/GamificationContext";

export default function Courses() {
    const { userStats } = useGamification();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "enrolled" | "premium">("all");

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
            {/* HERO SECTION - DOPAMINE START */}
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-10 md:p-16">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap className="w-64 h-64 -rotate-12" />
                </div>

                <div className="relative z-10 max-w-2xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">New Academy OS 2.1</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                        Master the Art of <span className="text-primary italic">Invisible</span> Speed.
                    </h1>

                    <p className="text-lg text-muted-foreground/80 font-medium leading-relaxed">
                        Don't just type. Dominate your digital workflow with structured neuro-pathway building and expert-led masterclasses.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/30 border border-border/50">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold">185k+ Students</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/30 border border-border/50">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-bold">50+ Certifications</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER HUD */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card/50 backdrop-blur-xl p-4 rounded-3xl border border-border/20 sticky top-24 z-40 shadow-xl shadow-black/10">
                <div className="flex items-center gap-2 p-1 bg-muted/20 rounded-2xl">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "all" ? "bg-primary text-background shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Discovery
                    </button>
                    <button
                        onClick={() => setActiveTab("enrolled")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "enrolled" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Enrolled
                    </button>
                    <button
                        onClick={() => setActiveTab("premium")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === "premium" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Premium Tracks
                    </button>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search Mastery Tracks..."
                        className="pl-12 h-12 bg-muted/10 border-border/20 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* COURSES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            key={course.id}
                        >
                            <Card className="group relative h-full overflow-hidden border-border/10 bg-card hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] flex flex-col space-y-0">
                                {/* COURSE THUMBNAIL */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl",
                                            course.isPremium ? "bg-yellow-500/20 text-yellow-500" : "bg-primary/20 text-primary"
                                        )}>
                                            <course.icon className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                                        {course.isPremium ? (
                                            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1 font-black italic backdrop-blur-md">PREMIUM</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-primary/20 text-primary px-3 py-1 font-black italic backdrop-blur-md">FREE</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* CONTENT BOX */}
                                <div className="p-6 space-y-6 flex flex-col flex-1">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 mb-1">
                                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                            {course.stats.rating} ({course.stats.students} students)
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                                        <p className="text-sm text-muted-foreground/70 font-medium leading-relaxed line-clamp-2">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-muted/20 border border-border/10">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-muted-foreground/40" />
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{course.estimatedTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black uppercase tracking-widest text-primary">+{course.rewards.totalXp} XP</span>
                                        </div>
                                    </div>

                                    {/* ACTION */}
                                    <Button className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-background transition-all duration-300 font-black uppercase tracking-widest group/btn shadow-xl shadow-black/10">
                                        Start Practice
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>

                                    {/* DECORATIVE BLUR */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* AD SLOT INTEGRATION - ENTERPRISE LEVEL */}
                <NativeAdSlot
                    type="sidebar"
                    className="md:col-span-2 lg:col-span-1 rounded-[2.5rem] h-full flex items-center justify-center p-10 bg-primary/5 hover:bg-primary/10 border-primary/10 hover:border-primary/20 transition-all cursor-pointer overflow-hidden"
                    title="Unlock the Full Enterprise Suite"
                    description="Get team analytics, custom exam builders, and personalized skill coaching for your whole organization."
                    cta="Go Business"
                    bgImage="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
                />
            </div>

            {/* UPSELL FOOTER - RETENTION HUB */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/10">
                <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tight">Ready for a <span className="text-primary italic text-5xl">Challenge?</span></h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-xl">
                        Join the next Global Tournament and put your course training to the ultimate test. Prize pools reset in 4 hours.
                    </p>
                </div>
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-background font-black uppercase tracking-widest text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20">
                        View Tournaments
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground/40 font-black uppercase tracking-widest text-[10px]">
                        <span>4.2k active players</span>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>5,000 Coins Prize Pool</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
