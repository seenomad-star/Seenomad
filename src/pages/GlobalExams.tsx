import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Globe, Clock, Target, Languages, ChevronRight, Search, MapPin, ChevronLeft, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExam, ExamConfig } from "@/contexts/ExamContext";
import { AICoach } from "@/pages/AICoach";
import { PremiumBadge } from "@/components/shared/PremiumBadge";
import { globalExams, regionColors, supportedLanguages } from "@/data/globalExamsData";
import { CountryCard } from "@/components/exams/CountryCard";
import type { Language } from "@/data/wordLists";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sscExamSets, ExamSet } from "@/data/examSetsData";
import { useTestHistoryContext } from "@/contexts/TestHistoryContext";
import { getRecommendedDifficulty, getDifficultyMastery } from "@/utils/difficultyRecommendation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search as SearchIcon, FileText, RefreshCw, Star } from "lucide-react";

// Helper to get flag from country code
const getCountryFlag = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function GlobalExams() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setExamConfig } = useExam();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  const [selectedExamState, setSelectedExamState] = useState<any | null>(null);
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [examType, setExamType] = useState<{ isMock: boolean; lang: Language }>({ isMock: false, lang: "english" });

  // Get user stats for recommendations
  const { getAverageWpm, getAverageAccuracy, results } = useTestHistoryContext();
  const recommendedDifficulty = getRecommendedDifficulty(getAverageWpm(), getAverageAccuracy());
  const masteryStatus = getDifficultyMastery(results);

  const regions = ["all", "asia", "europe", "americas", "africa", "oceania"];

  // Aggregate exams by country
  const countriesData = useMemo(() => {
    const grouped = globalExams.reduce((acc, exam) => {
      if (!acc[exam.country]) {
        acc[exam.country] = {
          name: exam.country,
          code: exam.countryCode,
          region: exam.region,
          exams: [],
        };
      }
      acc[exam.country].exams.push(exam);
      return acc;
    }, {} as Record<string, { name: string; code: string; region: string; exams: typeof globalExams }>);

    return Object.values(grouped).sort((a, b) => b.exams.length - a.exams.length);
  }, []);

  // Filter countries based on search and region
  const filteredCountries = countriesData.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const activeCountryData = activeCountry ? countriesData.find(c => c.name === activeCountry) : null;

  const startExam = (exam: typeof globalExams[0], isMockTest: boolean, language: Language, selectedSet?: ExamSet) => {
    const targetWpm = language === "english"
      ? exam.typingSpeed.english || 30
      : exam.typingSpeed.native || 30;

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

  const handlePracticeClick = (exam: typeof globalExams[0], isMock: boolean, lang: Language) => {
    const sets = sscExamSets.filter(s => s.examId === exam.id && s.language === lang);
    if (sets.length > 0) {
      setSelectedExamState(exam);
      setExamType({ isMock, lang });
      setIsSetModalOpen(true);
    } else {
      startExam(exam, isMock, lang);
    }
  };

  const hasBothLanguages = (exam: typeof globalExams[0]) =>
    exam.typingSpeed.english && exam.typingSpeed.native;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {activeCountry ? (
              <Button variant="ghost" size="icon" onClick={() => setActiveCountry(null)} className="mr-2">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            ) : (
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Globe className="w-8 h-8 text-blue-500" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tighter uppercase italic">
                {activeCountry ? (
                  <span className="flex items-center gap-2">
                    {getCountryFlag(activeCountryData?.code || 'US')} {activeCountry} Exams
                  </span>
                ) : (
                  <>Exam Prep: <span className="text-blue-500">Global</span></>
                )}
              </h1>
              <p className="text-muted-foreground">
                {activeCountry
                  ? `Explore available typing tests and certifications in ${activeCountry}`
                  : `Practice for typing exams from ${countriesData.length} countries worldwide`
                }
              </p>
            </div>
          </div>
          <PremiumBadge />
        </div>
      </div>

      {/* AI Coach */}
      <div className="mb-6">
        <AICoach context="exams" />
      </div>

      {!activeCountry && (
        <>
          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full md:w-48">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="asia">🌏 Asia</SelectItem>
                  <SelectItem value="europe">🌍 Europe</SelectItem>
                  <SelectItem value="americas">🌎 Americas</SelectItem>
                  <SelectItem value="africa">🌍 Africa</SelectItem>
                  <SelectItem value="oceania">🌏 Oceania</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Country Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.name}
                country={country.name}
                flag={getCountryFlag(country.code)}
                examCount={country.exams.length}
                region={country.region}
                popularExams={country.exams.map(e => e.name)}
                totalPosts={country.exams.reduce((acc, curr) => acc + curr.posts.length, 0)}
                onClick={() => setActiveCountry(country.name)}
              />
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <Card className="p-12 text-center">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No countries found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          )}
        </>
      )}

      {/* Selected Country View */}
      {activeCountry && activeCountryData && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeCountryData.exams.map((exam) => (
            <Card key={exam.id} className="p-5 bg-card hover:bg-secondary/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-lg text-foreground">{exam.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" aria-hidden="true" />
                      {exam.country}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{exam.authority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{exam.fullName}</p>
                  <p className="text-sm text-muted-foreground mb-3">{exam.description}</p>

                  {/* Sets Count */}
                  {sscExamSets.filter(s => s.examId === exam.id).length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {sscExamSets.filter(s => s.examId === exam.id).length} Practice Sets Available
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm">
                    {exam.typingSpeed.english && (
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-primary" aria-hidden="true" />
                        <span className="text-foreground font-medium">{exam.typingSpeed.english} WPM</span>
                        <span className="text-muted-foreground">(English)</span>
                      </div>
                    )}
                    {exam.typingSpeed.native && exam.nativeLanguage && (
                      <div className="flex items-center gap-1.5">
                        <Languages className="w-4 h-4 text-blue-400" aria-hidden="true" />
                        <span className="text-foreground font-medium">{exam.typingSpeed.native} WPM</span>
                        <span className="text-muted-foreground">({exam.nativeLanguage})</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-muted-foreground">{exam.duration} min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exam.posts.slice(0, 3).map((post) => (
                      <Badge key={post} variant="secondary" className="text-xs bg-secondary/50">
                        {post}
                      </Badge>
                    ))}
                    {exam.posts.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-secondary/50">
                        +{exam.posts.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  {hasBothLanguages(exam) ? (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="flex-1 md:flex-none gap-1"
                            aria-label={`Practice ${exam.name}`}
                          >
                            Practice
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePracticeClick(exam, false, "english")}>
                            🇬🇧 English ({exam.typingSpeed.english} WPM)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePracticeClick(exam, false, "hindi")}>
                            📝 {exam.nativeLanguage} ({exam.typingSpeed.native} WPM)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" className="flex-1 md:flex-none" aria-label={`Start mock test for ${exam.name}`}>
                            Mock Test
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePracticeClick(exam, true, "english")}>
                            🇬🇧 English
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePracticeClick(exam, true, "hindi")}>
                            📝 {exam.nativeLanguage}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <>
                      <Button
                        className="flex-1 md:flex-none gap-1"
                        onClick={() => navigate(`/exams/mission/${exam.id}`)}
                        aria-label={`Practice ${exam.name}`}
                      >
                        Mission HUB
                        <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1 md:flex-none"
                        onClick={() => handlePracticeClick(exam, true, exam.typingSpeed.english ? "english" : "hindi")}
                        aria-label={`Start mock test for ${exam.name}`}
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
      )}

      {/* Set Selection Modal */}
      <Dialog open={isSetModalOpen} onOpenChange={setIsSetModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 overflow-hidden bg-card border-white/10 shadow-2xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
              Select Practice Set
            </DialogTitle>
            <DialogDescription>
              Choose a specific set for {selectedExamState?.name} ({examType.lang}) or start with a random set.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search by title or content..."
                className="pl-10 h-10 bg-secondary/30 border-white/5 focus:ring-primary/20"
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                aria-label="Search practice sets"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="px-6 mb-4">
            {/* Recommended Difficulty Badge */}
            {recommendedDifficulty && (
              <div className="mb-3 flex items-center gap-2">
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

          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-1 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                onClick={() => {
                  if (selectedExamState) {
                    // Get filtered sets based on difficulty
                    const filteredSets = sscExamSets.filter(s =>
                      s.examId === selectedExamState.id &&
                      s.language === examType.lang &&
                      (selectedDifficulty === "all" || s.difficulty === selectedDifficulty)
                    );

                    // Pick a random set if available
                    if (filteredSets.length > 0) {
                      const randomSet = filteredSets[Math.floor(Math.random() * filteredSets.length)];
                      startExam(selectedExamState, examType.isMock, examType.lang, randomSet);
                    } else {
                      // Fallback to no specific set
                      startExam(selectedExamState, examType.isMock, examType.lang);
                    }
                  }
                  setIsSetModalOpen(false);
                }}
              >
                <div className="font-bold flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Random Practice Set
                  {selectedDifficulty !== "all" && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ml-auto ${selectedDifficulty === "easy" ? "bg-green-500/10 text-green-500 border-green-500/30" :
                        selectedDifficulty === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" :
                          "bg-red-500/10 text-red-500 border-red-500/30"
                        }`}
                    >
                      {selectedDifficulty}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {selectedDifficulty === "all"
                    ? "Generate a random set from all difficulty levels. Best for general speed improvement."
                    : `Generate a random ${selectedDifficulty} set. Perfect for targeted practice.`
                  }
                </div>
              </Button>

              <div className="my-2 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Predefined Sets</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              {sscExamSets
                .filter(s =>
                  selectedExamState &&
                  s.examId === selectedExamState.id &&
                  s.language === examType.lang &&
                  (selectedDifficulty === "all" || s.difficulty === selectedDifficulty) &&
                  (s.title.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                    s.content.toLowerCase().includes(modalSearchQuery.toLowerCase()))
                )
                .map((set) => (
                  <Button
                    key={set.id}
                    variant="ghost"
                    className="h-auto py-4 flex flex-col items-start gap-1 hover:bg-secondary/50 border border-transparent hover:border-white/5 transition-all text-left"
                    onClick={() => {
                      if (selectedExamState) startExam(selectedExamState, examType.isMock, examType.lang, set);
                      setIsSetModalOpen(false);
                    }}
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
                        {set.difficulty}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                      "{set.content.substring(0, 120)}..."
                    </div>
                  </Button>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
