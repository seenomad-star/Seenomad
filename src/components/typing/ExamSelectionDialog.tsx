import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import {
    FileText,
    Search as SearchIcon,
    RefreshCw,
    BookOpen,
    Star,
} from "lucide-react";
import { globalExams, GlobalExam } from "@/data/globalExamsData";
import { sscExamSets, ExamSet } from "@/data/examSetsData";
import { Language } from "@/data/wordLists";
import { ExamConfig } from "@/contexts/ExamContext";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { getRecommendedDifficulty, getDifficultyMastery } from "@/utils/difficultyRecommendation";
import { cn } from "@/utils/utils";

interface ExamSelectionDialogProps {
    trigger?: React.ReactNode;
    onSelect: (config: ExamConfig) => void;
}

// Country list for the selection bar
const COUNTRIES = [
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Japan", code: "JP", flag: "🇯🇵" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "Canada", code: "CA", flag: "🇨🇦" },
];

export const ExamSelectionDialog: React.FC<ExamSelectionDialogProps> = ({
    trigger,
    onSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<GlobalExam | null>(null);
    const [step, setStep] = useState<"exam" | "set">("exam");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLang, setSelectedLang] = useState<Language>("english");
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
    const { t } = useTranslation();

    // Get user stats for recommendations
    const { getAverageWpm, getAverageAccuracy, results } = useTestHistoryContext();
    const recommendedDifficulty = getRecommendedDifficulty(getAverageWpm(), getAverageAccuracy());
    const masteryStatus = getDifficultyMastery(results);

    const filteredExams = globalExams.filter(e =>
        e.country === selectedCountry &&
        (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const categories = Array.from(new Set(filteredExams.map((e) => e.category)));

    const handleExamSelect = (exam: GlobalExam, lang: string) => {
        const mappedLang = lang === "native"
            ? (exam.nativeLanguage?.toLowerCase() as Language || "hindi")
            : (lang as Language);

        const sets = sscExamSets.filter(s => s.examId === exam.id && s.language === mappedLang);

        if (sets.length > 0) {
            setSelectedExam(exam);
            setSelectedLang(mappedLang);
            setStep("set");
            setSearchQuery("");
        } else {
            const config: ExamConfig = {
                id: exam.id,
                name: exam.name,
                fullName: exam.fullName,
                targetWpm: lang === "native" ? (exam.typingSpeed.native || 30) : (exam.typingSpeed.english || 30),
                duration: exam.duration,
                language: mappedLang,
                isMockTest: false,
            };
            onSelect(config);
            setIsOpen(false);
        }
    };

    const handleSetSelect = (set?: ExamSet) => {
        if (!selectedExam) return;

        const targetWpm = selectedLang === "hindi"
            ? (selectedExam.typingSpeed.native || 30)
            : (selectedExam.typingSpeed.english || 35);

        const config: ExamConfig = {
            id: selectedExam.id,
            name: selectedExam.name,
            fullName: selectedExam.fullName,
            targetWpm: targetWpm,
            duration: selectedExam.duration,
            language: selectedLang,
            isMockTest: false,
            selectedSetId: set?.id,
            selectedSetText: set?.content,
        };
        onSelect(config);
        setIsOpen(false);
        resetState();
    };

    const resetState = () => {
        setSelectedExam(null);
        setStep("exam");
        setSearchQuery("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetState();
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('Select Exam')}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-white/10 shadow-2xl">
                <DialogHeader className="p-6 pb-2 flex-shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {step === "exam" ? (
                            <><BookOpen className="w-6 h-6 text-primary" /> {t('Select Exam')}</>
                        ) : (
                            <><FileText className="w-6 h-6 text-primary" /> {selectedExam?.name} - {t('Sets')}</>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "exam"
                            ? t("Choose a government or competitive exam to practice its specific typing requirements.")
                            : t("Select a specific practice set or start with a random one.")}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 space-y-4 flex-shrink-0">
                    {/* Search Bar */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            placeholder={step === "exam" ? t("Search exams...") : t("Search sets...")}
                            className="pl-10 h-10 bg-secondary/30 border-white/5 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Country Selector */}
                    {step === "exam" && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-1 px-1">
                            {COUNTRIES.map((country) => (
                                <Button
                                    key={country.code}
                                    variant={selectedCountry === country.name ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCountry(country.name)}
                                    className={cn(
                                        "h-9 px-3 gap-2 shrink-0 transition-all",
                                        selectedCountry === country.name
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                            : "hover:bg-primary/10 hover:border-primary/30"
                                    )}
                                >
                                    <span className="text-base">{country.flag}</span>
                                    <span className="text-xs font-semibold">{country.name}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Difficulty Filter - Only show in set selection step */}
                {step === "set" && (
                    <div className="px-6 mb-4 flex-shrink-0">
                        {/* Recommended Difficulty Badge */}
                        {recommendedDifficulty && (
                            <div className="mb-3 flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    {t('Recommended')}: {t(recommendedDifficulty.charAt(0).toUpperCase() + recommendedDifficulty.slice(1) as any)}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">{t('Based on your performance')}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Button
                                variant={selectedDifficulty === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDifficulty("all")}
                                className="flex-1"
                            >
                                {t('All')}
                            </Button>
                            <Button
                                variant={selectedDifficulty === "easy" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDifficulty("easy")}
                                className="flex-1 bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-500 relative"
                            >
                                {t('Easy')}
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
                                {t('Medium')}
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
                                {t('Hard')}
                                {masteryStatus.hard && (
                                    <Star className="w-3 h-3 absolute -top-1 -right-1 fill-yellow-500 text-yellow-500" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex-1 px-6 pb-6 overflow-hidden min-h-0">
                    {step === "exam" ? (
                        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6">
                                {categories.map(category => {
                                    const categoryExams = filteredExams.filter(e => e.category === category);

                                    if (categoryExams.length === 0) return null;
                                    const localizedCategory = t(category as any);

                                    return (
                                        <div key={category} className="space-y-3">
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{localizedCategory}</Badge>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {categoryExams.map(exam => (
                                                    <div key={exam.id} className="group p-4 rounded-xl border border-white/5 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer">
                                                        <div className="font-bold text-foreground mb-1">{exam.name}</div>
                                                        <div className="text-xs text-muted-foreground mb-3 line-clamp-1">{exam.fullName}</div>

                                                        <div className="flex gap-2 flex-wrap">
                                                            {exam.typingSpeed.english && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="h-7 text-[10px] gap-1 px-2"
                                                                    onClick={() => handleExamSelect(exam, "english")}
                                                                >
                                                                    English ({exam.typingSpeed.english} WPM)
                                                                </Button>
                                                            )}
                                                            {exam.typingSpeed.native && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="secondary"
                                                                    className="h-7 text-[10px] gap-1 px-2"
                                                                    onClick={() => handleExamSelect(exam, "native")}
                                                                >
                                                                    {exam.nativeLanguage || "Native"} ({exam.typingSpeed.native} WPM)
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden min-h-0">
                            <div className="flex-shrink-0 space-y-4 mb-4">
                                <Button
                                    variant="outline"
                                    className="w-full h-auto py-4 flex flex-col items-start gap-1 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                                    onClick={() => {
                                        // Get filtered sets based on difficulty
                                        const filteredSets = sscExamSets.filter(s =>
                                            selectedExam &&
                                            s.examId === selectedExam.id &&
                                            s.language === selectedLang &&
                                            (selectedDifficulty === "all" || s.difficulty === selectedDifficulty)
                                        );

                                        // Pick a random set if available
                                        if (filteredSets.length > 0) {
                                            const randomSet = filteredSets[Math.floor(Math.random() * filteredSets.length)];
                                            handleSetSelect(randomSet);
                                        } else {
                                            handleSetSelect();
                                        }
                                    }}
                                >
                                    <div className="font-bold flex items-center gap-2 text-foreground">
                                        <RefreshCw className="w-4 h-4" />
                                        {t('Random Practice Set')}
                                        {selectedDifficulty !== "all" && (
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-bold uppercase ml-auto ${selectedDifficulty === "easy" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                                                    selectedDifficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                                                        "bg-red-500/10 text-red-500 border-red-500/30"
                                                    }`}
                                            >
                                                {t(selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1) as any)}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {selectedDifficulty === "all"
                                            ? `${t("Generate a random set from all difficulty levels for")} ${selectedExam?.name}.`
                                            : `${t("Generate a random")} ${t(selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1) as any)} ${t("set for")} ${selectedExam?.name}.`
                                        }
                                    </div>
                                </Button>

                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 whitespace-nowrap">{t('Predefined Sets')}</span>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                <div className="grid gap-2">
                                    {sscExamSets
                                        .filter(s =>
                                            selectedExam &&
                                            s.examId === selectedExam.id &&
                                            s.language === selectedLang &&
                                            (selectedDifficulty === "all" || s.difficulty === selectedDifficulty) &&
                                            (s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                s.content.toLowerCase().includes(searchQuery.toLowerCase()))
                                        )
                                        .map((set) => (
                                            <Button
                                                key={set.id}
                                                variant="ghost"
                                                className="h-auto py-4 flex flex-col items-start gap-1 hover:bg-secondary/50 border border-transparent hover:border-white/5 transition-all text-left w-full"
                                                onClick={() => handleSetSelect(set)}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="font-bold text-foreground">{set.title}</div>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-bold uppercase ${set.difficulty === "easy" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                                                            set.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                                                                "bg-red-500/10 text-red-500 border-red-500/30"
                                                            }`}
                                                    >
                                                        {t(set.difficulty.charAt(0).toUpperCase() + set.difficulty.slice(1) as any)}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground line-clamp-2 italic">
                                                    "{set.content.substring(0, 100)}..."
                                                </div>
                                            </Button>
                                        ))}
                                </div>
                            </div>

                            <div className="flex-shrink-0 mt-4 pt-2 border-t border-white/5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-primary w-full"
                                    onClick={() => setStep("exam")}
                                >
                                    ← {t('Back to Exams')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
