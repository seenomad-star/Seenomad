import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FileText,
    Clock,
    Target,
    Languages,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    RefreshCw,
    X,
    BookOpen,
    ShieldCheck,
    Eye,
    Star
} from "lucide-react";
import { Exam } from "@/data/examsData";
import { ExamSet, sscExamSets } from "@/data/examSetsData";
import { Language } from "@/data/wordLists";
import { ExamConfig } from "@/contexts/ExamContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { getRecommendedDifficulty, getDifficultyMastery } from "@/utils/difficultyRecommendation";

interface UnifiedExam extends Exam {
    typingSpeed: {
        english?: number;
        hindi?: number;
        native?: number;
    };
    countryCode?: string;
}

interface ExamRulesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exam: UnifiedExam | null;
    isMock: boolean;
    initialLanguage?: Language;
    onStart: (config: ExamConfig) => void;
}

export const ExamRulesDialog: React.FC<ExamRulesDialogProps> = ({
    open,
    onOpenChange,
    exam,
    isMock,
    initialLanguage = "english",
    onStart
}) => {
    const [selectedLang, setSelectedLang] = useState<Language>(initialLanguage);
    const [selectedSetFn, setSelectedSetFn] = useState<string>("random"); // 'random' or set ID
    const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");

    // Get user stats for recommendations
    const { getAverageWpm, getAverageAccuracy, results } = useTestHistoryContext();
    const recommendedDifficulty = getRecommendedDifficulty(getAverageWpm(), getAverageAccuracy());
    const masteryStatus = getDifficultyMastery(results);

    // Reset state when dialog opens with a new exam
    // Reset state when dialog opens with a new exam
    useEffect(() => {
        if (open && exam) {
            setSelectedLang(initialLanguage);
            const sets = sscExamSets.filter(
                s => s.examId === exam.id && s.language === initialLanguage
            );
            setSelectedSetFn(sets.length > 0 ? sets[0].id : "random");
        }
    }, [open, exam, initialLanguage]);

    if (!exam) return null;

    const availableSets = sscExamSets.filter(
        s => s.examId === exam.id && s.language === selectedLang &&
            (selectedDifficulty === "all" || s.difficulty === selectedDifficulty)
    );

    const currentWPM = selectedLang === "hindi"
        ? (exam.typingSpeed.hindi || 30)
        : (exam.typingSpeed.english || 30);

    const handleStart = () => {
        const selectedSet = availableSets.find(s => s.id === selectedSetFn);

        const config: ExamConfig = {
            id: exam.id,
            name: exam.name,
            fullName: exam.fullName,
            targetWpm: currentWPM,
            duration: exam.duration,
            language: selectedLang,
            isMockTest: isMock,
            selectedSetId: selectedSet?.id,
            selectedSetText: selectedSet?.content,
        };
        onStart(config);
        onOpenChange(false);
    };

    // Get preview text (first 150 chars)
    const selectedSet = availableSets.find(s => s.id === selectedSetFn);
    const previewText = selectedSet?.content.substring(0, 150) + "..." || "Select a set to view preview...";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl gap-0">
                {/* Header */}
                <div className="p-6 border-b border-border/40 bg-muted/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/10">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <DialogTitle className="text-2xl font-bold tracking-tight">{exam.name}</DialogTitle>
                                {exam.authority && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                        <ShieldCheck className="w-3 h-3 fill-blue-500/20" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Official</span>
                                    </div>
                                )}
                                {isMock && <Badge variant="secondary" className="text-[10px] uppercase">Mock Test</Badge>}
                            </div>
                            <DialogDescription className="text-foreground/70 font-medium flex items-center gap-2">
                                {exam.fullName}
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Controls Row */}
                    <div className="space-y-4">
                        {/* Difficulty Filter */}
                        {sscExamSets.filter(s => s.examId === exam.id && s.language === selectedLang).length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Star className="w-3.5 h-3.5" /> Difficulty Level
                                </label>

                                {/* Recommended Difficulty Badge */}
                                {recommendedDifficulty && (
                                    <div className="mb-2 flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">
                                            <Star className="w-3 h-3 mr-1" />
                                            Recommended: {recommendedDifficulty.charAt(0).toUpperCase() + recommendedDifficulty.slice(1)}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground">Based on your performance</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={selectedDifficulty === "all" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDifficulty("all")}
                                        className="flex-1"
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={selectedDifficulty === "easy" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDifficulty("easy")}
                                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-500 relative"
                                    >
                                        Easy
                                        {masteryStatus.easy && (
                                            <Star className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-500 text-yellow-500" />
                                        )}
                                    </Button>
                                    <Button
                                        variant={selectedDifficulty === "medium" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDifficulty("medium")}
                                        className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-500 relative"
                                    >
                                        Medium
                                        {masteryStatus.medium && (
                                            <Star className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-500 text-yellow-500" />
                                        )}
                                    </Button>
                                    <Button
                                        variant={selectedDifficulty === "hard" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDifficulty("hard")}
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-500 relative"
                                    >
                                        Hard
                                        {masteryStatus.hard && (
                                            <Star className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-500 text-yellow-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Languages className="w-3.5 h-3.5" /> Select Language
                                </label>
                                <Select
                                    value={selectedLang}
                                    onValueChange={(v) => {
                                        const newLang = v as Language;
                                        setSelectedLang(newLang);
                                        const sets = sscExamSets.filter(
                                            s => s.examId === exam.id && s.language === newLang
                                        );
                                        setSelectedSetFn(sets.length > 0 ? sets[0].id : "random");
                                    }}
                                >
                                    <SelectTrigger className="h-12 border-primary/20 bg-primary/5 focus:ring-primary/20 transition-all font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exam.typingSpeed.english && (
                                            <SelectItem value="english">🇬🇧 English ({exam.typingSpeed.english} WPM)</SelectItem>
                                        )}
                                        {exam.typingSpeed.hindi && (
                                            <SelectItem value="hindi">🇮🇳 Hindi ({exam.typingSpeed.hindi} WPM)</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5" /> Select Question Set
                                </label>
                                <Select value={selectedSetFn} onValueChange={setSelectedSetFn}>
                                    <SelectTrigger className="h-12 border-border/50 bg-secondary/20 focus:ring-primary/20 transition-all font-medium">
                                        <SelectValue placeholder="Random Set" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSets.length > 0 && (
                                            <>
                                                {availableSets.map(set => (
                                                    <SelectItem key={set.id} value={set.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{set.title}</span>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[9px] font-bold uppercase ml-auto ${set.difficulty === "easy" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                                                                        set.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                                                                            "bg-red-500/10 text-red-500 border-red-500/30"
                                                                    }`}
                                                            >
                                                                {set.difficulty}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                <div className="my-1 h-px bg-border/50" />
                                            </>
                                        )}
                                        <SelectItem value="random">
                                            <span className="flex items-center gap-2">
                                                <RefreshCw className="w-3.5 h-3.5 opacity-50" />
                                                Auto-generate (Random)
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Content Preview & Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Stats Column */}
                        <div className="lg:col-span-1 space-y-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 flex flex-col items-center justify-center text-center gap-1 group hover:border-orange-500/40 transition-colors">
                                <span className="text-2xl font-black text-orange-500 group-hover:scale-110 transition-transform">{currentWPM}</span>
                                <span className="text-[9px] uppercase font-bold text-orange-500/70 tracking-widest">Min WPM</span>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col items-center justify-center text-center gap-1 group hover:border-blue-500/40 transition-colors">
                                <span className="text-2xl font-black text-blue-500 group-hover:scale-110 transition-transform">{exam.duration}</span>
                                <span className="text-[9px] uppercase font-bold text-blue-500/70 tracking-widest">Minutes</span>
                            </div>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex flex-col items-center justify-center text-center gap-1 group hover:border-emerald-500/40 transition-colors">
                                <span className="text-2xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{exam.accuracy || 90}%</span>
                                <span className="text-[9px] uppercase font-bold text-emerald-500/70 tracking-widest">Accuracy</span>
                            </div>
                        </div>

                        {/* Preview & Rules Column */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Text Preview */}
                            <div className="p-4 rounded-xl bg-secondary/10 border border-border/50 relative overflow-hidden group">
                                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-background/80 backdrop-blur text-[10px] font-bold text-muted-foreground border border-border/50 shadow-sm flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> Preview
                                </div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Content Snippet</h4>
                                <p className="text-sm text-foreground/80 font-serif leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                                    "{selectedSetFn === 'random' ? "Randomly generated words from the most common dictionary..." : previewText}"
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                            </div>

                            {/* Rules */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-primary" /> Rules & Guidelines
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-center text-xs text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        Timer starts strictly on first keypress.
                                    </div>
                                    <div className="flex gap-2 items-center text-xs text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        Backspace is allowed but consumes time.
                                    </div>
                                    <div className="flex gap-2 items-center text-xs text-foreground/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        Gross speed must be maintained above minimum.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 pb-6 flex justify-end gap-3 bg-gradient-to-t from-background via-background/80 to-transparent">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleStart}
                        className="px-8 h-11 font-bold gap-2 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:scale-105 active:scale-95"
                    >
                        Start Test <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
