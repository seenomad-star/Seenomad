import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";
import { FileText, Clock, Target, Languages, ChevronRight, BookOpen, Bot, RefreshCw, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExam, ExamConfig } from "@/contexts/ExamContext";
import { AICoach } from "@/pages/AICoach";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge } from "@/components/shared/PremiumBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/data/wordLists";
import { sscExamSets, ExamSet } from "@/data/examSetsData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExamRulesDialog } from "@/components/typing/ExamRulesDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { exams, Exam } from "@/data/examsData";
import { globalExams, GlobalExam } from "@/data/globalExamsData";

type UnifiedExam = Exam | (GlobalExam & { typingSpeed: { english?: number; hindi?: number } });

import { LocationService } from "@/services/LocationService";

// ... existing imports ...

export default function Exams() {
  const navigate = useNavigate();
  const { setExamConfig } = useExam();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState<UnifiedExam | null>(null);
  const [examType, setExamType] = useState<{ isMock: boolean; lang: Language }>({ isMock: false, lang: "english" });
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);

  useEffect(() => {
    LocationService.getUserLocation().then(country => {
      if (country) setUserCountry(country);
    });
  }, []);

  // Merge datasets
  const allExams: UnifiedExam[] = [
    ...exams,
    ...globalExams.map(ge => ({
      ...ge,
      typingSpeed: {
        english: ge.typingSpeed.english,
        hindi: ge.countryCode === 'IN' ? ge.typingSpeed.native : undefined
      }
    })).filter(ge => !exams.some(e => e.id === ge.id)) // Avoid duplicates
  ];

  const filteredExams = allExams.filter(exam =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.authority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const countries = Array.from(new Set(filteredExams.map((e) => e.country))).sort((a, b) => {
    // 1. User's Country First
    if (userCountry) {
      if (a === userCountry) return -1;
      if (b === userCountry) return 1;
    }

    // 2. India Second (Default Preference if no user country, or if user country is neither)
    // If user is from India, rule 1 handles it. If not, we still might want India high up 
    // simply because of the app's user base, but user requested "Country Specific First".
    // Let's keep India as a secondary priority or just alphabetical after the user's country.
    // For now, let's strictly follow "User Country -> Alphabetical" to be cleaner, 
    // OR keep India pinned second if it's a major market. 
    // Let's stick to the prompt: "show to this user there country exam first".
    // So only prioritizing User Country is strictly required. 
    // However, existing logic pinned India No.1. I will unpin India if it's not the user's country,
    // to strictly respect the "User Country First" request, allowing alphabetical for the rest.

    // Wait, if I am in US, I want US first. Then maybe alphabetical.

    return a.localeCompare(b);
  });

  const startExam = (exam: UnifiedExam, isMockTest: boolean, language: Language, selectedSet?: ExamSet) => {
    const targetWpm = language === "hindi"
      ? (exam.typingSpeed as any).hindi || exam.typingSpeed.english || 30
      : exam.typingSpeed.english || (exam.typingSpeed as any).hindi || 30;

    const config: ExamConfig = {
      id: exam.id,
      name: exam.name,
      fullName: exam.fullName,
      targetWpm,
      duration: exam.duration,
      language,
      isMockTest,
      selectedSetId: selectedSet?.id,
      selectedSetText: selectedSet?.content,
    };
    setExamConfig(config);
    navigate("/");
  };

  const handlePracticeClick = (exam: UnifiedExam, isMock: boolean, lang: Language) => {
    setSelectedExam(exam);
    setExamType({ isMock, lang });
    setIsSetModalOpen(true);
  };

  const hasBothLanguages = (exam: UnifiedExam) =>
    exam.typingSpeed.english && (exam.typingSpeed as any).hindi;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 relative rounded-3xl overflow-hidden h-60 group">
        <img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop"
          alt="Exam Practice"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <div className="flex items-center justify-between w-full max-w-5xl">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30">
                <BookOpen className="w-8 h-8 text-primary shadow-glow" />
              </div>
              <div>
                <h1 id="exams-heading" className="text-4xl font-black text-white tracking-tight drop-shadow-md">Global Exam Hub</h1>
                <p className="text-white/80 font-medium">Practice typing tests for 50+ countries and regional standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach */}
      <div className="mb-6">
        <AICoach context="exams" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-card text-center">
          <div className="text-3xl font-bold text-primary mb-1">{allExams.length}</div>
          <div className="text-sm text-muted-foreground">Total Exams</div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="text-3xl font-bold text-foreground mb-1">{countries.length}</div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="text-3xl font-bold text-foreground mb-1">20-225</div>
          <div className="text-sm text-muted-foreground">WPM Range</div>
        </Card>
        <Card className="p-4 bg-card text-center">
          <div className="text-3xl font-bold text-foreground mb-1">Global</div>
          <div className="text-sm text-muted-foreground">Standards</div>
        </Card>
      </div>

      {/* Ad Banner */}
      <div role="complementary" aria-label="Advertisement">
        <AdBanner type="banner" className="mb-6" />
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl">
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by exam name, country, or authority..."
            className="pl-12 h-14 bg-card/50 backdrop-blur-sm border-white/5 rounded-2xl text-lg focus:ring-primary/20 transition-all shadow-xl shadow-primary/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Country sections */}
      {countries.map((country) => (
        <div key={country} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border/50" />
            <h2 className="text-2xl font-black text-foreground uppercase tracking-widest italic flex items-center gap-3">
              <span className="text-primary opacity-50 text-sm not-italic">Portal</span>
              {country}
            </h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExams
              .filter((exam) => exam.country === country)
              .map((exam) => (
                <Card
                  key={exam.id}
                  className="p-6 bg-card/40 backdrop-blur-sm hover:bg-secondary/20 transition-all group border-border/50 hover:border-primary/30"
                >
                  <div className="space-y-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {exam.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-black opacity-60">
                          {exam.authority}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80 font-medium mb-1 line-clamp-1">
                        {exam.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                        {exam.description}
                      </p>

                      {/* Requirements */}
                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        {exam.typingSpeed.english && (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/10">
                            <Target className="w-3.5 h-3.5 text-primary" />
                            <div>
                              <div className="font-black text-foreground">{exam.typingSpeed.english} WPM</div>
                              <div className="text-[10px] text-muted-foreground uppercase">English</div>
                            </div>
                          </div>
                        )}
                        {(exam.typingSpeed as any).hindi && (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <Languages className="w-3.5 h-3.5 text-blue-400" />
                            <div>
                              <div className="font-black text-foreground">{(exam.typingSpeed as any).hindi} WPM</div>
                              <div className="text-[10px] text-muted-foreground uppercase">Local</div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <div>
                            <div className="font-black text-foreground">{exam.duration} min</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Duration</div>
                          </div>
                        </div>
                      </div>

                      {/* Sets Available Badge */}
                      {sscExamSets.filter(s => s.examId === exam.id).length > 0 && (
                        <div className="flex items-center gap-1.5 mb-4">
                          <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">
                            {sscExamSets.filter(s => s.examId === exam.id).length} Practice Sets
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border/30">
                      {hasBothLanguages(exam) ? (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="flex-1 gap-1.5 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
                              >
                                Practice
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                              <DropdownMenuItem onClick={() => handlePracticeClick(exam, false, "english")} className="text-xs font-bold gap-2">
                                🇬🇧 English ({exam.typingSpeed.english} WPM)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePracticeClick(exam, false, "hindi")} className="text-xs font-bold gap-2">
                                🇮🇳 Local ({(exam.typingSpeed as any).hindi} WPM)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                className="flex-1 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
                              >
                                Mock Test
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                              <DropdownMenuItem onClick={() => handlePracticeClick(exam, true, "english")} className="text-xs font-bold gap-2">
                                🇬🇧 English ({exam.typingSpeed.english} WPM)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePracticeClick(exam, true, "hindi")} className="text-xs font-bold gap-2">
                                🇮🇳 Local ({(exam.typingSpeed as any).hindi} WPM)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : (
                        <>
                          <Button
                            className="flex-1 gap-1.5 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            onClick={() => handlePracticeClick(exam, false, exam.typingSpeed.english ? "english" : "hindi")}
                          >
                            Practice
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="secondary"
                            className="flex-1 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            onClick={() => handlePracticeClick(exam, true, exam.typingSpeed.english ? "english" : "hindi")}
                          >
                            Mock Test
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Exam Rules Dialog */}
      <ExamRulesDialog
        open={isSetModalOpen}
        onOpenChange={setIsSetModalOpen}
        exam={selectedExam as any}
        isMock={examType.isMock}
        initialLanguage={examType.lang}
        onStart={(config) => {
          setExamConfig(config);
          navigate("/");
        }}
      />
    </div>
  );
}
