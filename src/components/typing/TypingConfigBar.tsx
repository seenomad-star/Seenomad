
import { cn } from "@/utils/utils";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { motion } from "framer-motion";
import { useExam } from "@/contexts/ExamContext";
import { ExamSelectionDialog } from "@/components/typing/ExamSelectionDialog";
import { Button } from "@/components/ui/button";
import { Zap, Target, TrendingUp, Award, Clock, Hash, AlignLeft, Type, Quote, Settings2, Keyboard, Volume2, VolumeX, Maximize2, Palette, Globe, X, BookOpen, User } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { useTestHistory } from "@/hooks/useTestHistory";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { languageNames, Language } from "@/data/wordLists";
import { useTranslation } from "react-i18next";

const allLanguages: Language[] = [
    "english", "hindi", "tamil", "telugu", "marathi",
    "bengali", "gujarati", "punjabi", "kannada", "malayalam", "odia"
];

export function TypingConfigBar() {
    const {
        contentMode, setContentMode,
        limitMode, setLimitMode,
        testDuration, setTestDuration,
        wordCount, setWordCount,
        includePunctuation, setIncludePunctuation,
        includeNumbers, setIncludeNumbers,
        isTyping,
        language, setLanguage,
        soundType, setSoundType,
        showKeyboard, setShowKeyboard,
        timeElapsed, timeRemaining,
        currentWPM, currentAccuracy,
        correctChars, incorrectChars,
        isFocusMode
    } = useTypingSession();

    const { t } = useTranslation();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const { examConfig, setExamConfig, clearExam } = useExam();
    const { theme, setTheme } = useTheme();

    // Summary stats for the bar
    const { userStats } = useGamification();
    const { getBestWpm, getAverageAccuracy } = useTestHistory();
    const bestWpm = getBestWpm();
    const avgAccuracy = getAverageAccuracy();

    // if (isTyping) return null; // We want to show the bar with the timer now

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: isTyping ? 0.9 : 1,
                y: 0,
                scale: isTyping ? 0.98 : 1
            }}
            className={cn(
                "flex justify-center mb-8 sticky top-20 z-40 transition-all duration-500",
                isTyping && "opacity-80",
                isFocusMode && "opacity-0 pointer-events-none scale-95"
            )}
        >
            <div className={cn(
                "bg-muted/30 backdrop-blur-md border border-white/5 rounded-xl p-1.5 flex flex-wrap items-center justify-center gap-y-3 gap-x-2 md:gap-x-4 lg:gap-x-6 shadow-2xl overflow-x-hidden max-w-[95vw] transition-all duration-500",
                isTyping && "bg-black/40 border-primary/20",
                isFocusMode && "hidden"
            )}>
                {/* GLOBAL USER STATS (MINIFIED) - ONLY HIDE WHEN TYPING */}
                {!isTyping && (
                    <div className="flex items-center gap-2 sm:gap-3 px-3 border-r border-white/10 sm:mr-2 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-1.5 group/stat" title={t('Best WPM')}>
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                                <span className="text-[9px] sm:text-[10px] font-black tabular-nums leading-none">{bestWpm || 0}</span>
                                <span className="hidden lg:inline text-[7px] font-bold uppercase tracking-tighter text-muted-foreground/40 leading-none">{t('Best')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat" title={t('Average Accuracy')}>
                            <Target className="w-3 h-3 text-emerald-500" />
                            <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                                <span className="text-[9px] sm:text-[10px] font-black tabular-nums leading-none">{avgAccuracy?.toFixed(0) || 0}%</span>
                                <span className="hidden lg:inline text-[7px] font-bold uppercase tracking-tighter text-muted-foreground/40 leading-none">{t('Avg')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat" title={t('Tests Today')}>
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                                <span className="text-[9px] sm:text-[10px] font-black tabular-nums leading-none">{userStats.totalTests}</span>
                                <span className="hidden lg:inline text-[7px] font-bold uppercase tracking-tighter text-muted-foreground/40 leading-none">{t('Today')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat" title={t('Current Level')}>
                            <Award className="w-3 h-3 text-purple-500" />
                            <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                                <span className="text-[9px] sm:text-[10px] font-black tabular-nums leading-none">{userStats.level}</span>
                                <span className="hidden lg:inline text-[7px] font-bold uppercase tracking-tighter text-muted-foreground/40 leading-none">{t('LVL')}</span>
                            </div>
                        </div>
                    </div>
                )}


                {/* GROUP 2: CONTENT TYPE (Words/Sentences/Paragraphs/etc.) */}
                <div className={cn("flex items-center gap-1 border-r border-white/10 pr-4", isTyping && "opacity-20 pointer-events-none")}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-all text-xs font-bold uppercase tracking-wider">
                                {contentMode === 'words' && <Type className="w-3.5 h-3.5" />}
                                {contentMode === 'sentences' && <AlignLeft className="w-3.5 h-3.5" />}
                                {contentMode === 'paragraphs' && <AlignLeft className="w-3.5 h-3.5" />}
                                {contentMode === 'numbers' && <Hash className="w-3.5 h-3.5" />}
                                {contentMode === 'quote' && <Quote className="w-3.5 h-3.5" />}
                                {contentMode === 'code' && <Type className="w-3.5 h-3.5" />}
                                {contentMode === 'zen' && <Globe className="w-3.5 h-3.5" />}
                                {contentMode === 'characters' && <Clock className="w-3.5 h-3.5" />}
                                {contentMode === 'custom' && <User className="w-3.5 h-3.5" />}
                                <span className="ml-1 capitalize hidden sm:inline">{t(contentMode === 'words' ? 'Words' : contentMode === 'sentences' ? 'Sentences' : contentMode === 'paragraphs' ? 'Paragraphs' : contentMode === 'numbers' ? 'Numbers' : contentMode === 'quote' ? 'Quotes' : contentMode === 'code' ? 'Code Snippets' : contentMode === 'zen' ? 'Zen Mode' : contentMode === 'characters' ? 'Characters' : 'Custom Text')}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem onClick={() => setContentMode('words')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <Type className="w-3.5 h-3.5" /> {t('Words')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('sentences')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <AlignLeft className="w-3.5 h-3.5" /> {t('Sentences')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('paragraphs')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <AlignLeft className="w-3.5 h-3.5" /> {t('Paragraphs')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('numbers')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <Hash className="w-3.5 h-3.5" /> {t('Numbers')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('characters')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <Clock className="w-3.5 h-3.5" /> {t('Characters')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('code')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <Type className="w-3.5 h-3.5" /> {t('Code Snippets')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('quote')} className="flex items-center gap-2 font-bold text-xs uppercase border-t border-white/5 mt-1 pt-2">
                                <Quote className="w-3.5 h-3.5" /> {t('Quotes')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('zen')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <Globe className="w-3.5 h-3.5" /> {t('Zen Mode')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setContentMode('custom')} className="flex items-center gap-2 font-bold text-xs uppercase">
                                <User className="w-3.5 h-3.5" /> {t('Custom Text')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-1 border-l border-white/10 sm:pl-4 sm:border-r sm:pr-4 font-bold text-sm min-w-fit sm:min-w-[340px] transition-all duration-500 justify-center text-muted-foreground group">
                    {isTyping ? (
                        <div className="flex items-center gap-5 py-0.5 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 text-primary pr-4 border-r border-white/10">
                                <Clock className="w-4 h-4 animate-pulse" />
                                <span className="font-mono text-base font-bold tabular-nums">
                                    {formatTime(timeRemaining !== null ? timeRemaining : timeElapsed)}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                                <div className="flex items-center gap-1.5 hover:text-amber-500/50 transition-colors cursor-default">
                                    <span className="text-amber-500 text-sm font-black tabular-nums tracking-tighter">{currentWPM}</span>
                                    <span>WPM</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-emerald-500/50 transition-colors cursor-default">
                                    <span className="text-emerald-500 text-sm font-black tabular-nums tracking-tighter">{currentAccuracy}%</span>
                                    <span>ACC</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-blue-500/50 transition-colors cursor-default">
                                    <span className="text-blue-500 text-sm font-black tabular-nums tracking-tighter">{correctChars}</span>
                                    <span>COR</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-rose-500/50 transition-colors cursor-default">
                                    <span className="text-rose-500 text-sm font-black tabular-nums tracking-tighter">{incorrectChars}</span>
                                    <span>ERR</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-primary transition-all text-xs font-bold uppercase tracking-wider">
                                    {limitMode === 'time' ? (
                                        <>
                                            <Clock className="w-3.5 h-3.5" />
                                            {testDuration < 60 ? `${testDuration}${t('s').toLowerCase()}` : `${Math.floor(testDuration / 60)}${t('m').toLowerCase()}`}
                                        </>
                                    ) : (
                                        <>
                                            <Hash className="w-3.5 h-3.5" />
                                            {contentMode === 'zen' ? t("Unlimited") :
                                                contentMode === 'quote' ? (wordCount <= 50 ? t("Short") : wordCount <= 100 ? t("Medium") : t("Long")) :
                                                    contentMode === 'words' || contentMode === 'numbers' ? `${wordCount} ${t('Words')}` :
                                                        contentMode === 'sentences' ? `${Math.max(1, Math.floor(wordCount / 10))} ${t('Sentences')}` :
                                                            contentMode === 'paragraphs' ? `${Math.max(1, Math.floor(wordCount / 50))} ${t('Paragraphs')}` :
                                                                contentMode === 'characters' ? `${wordCount} ${t('Characters')}` : `${wordCount} Units`}
                                        </>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-56 max-h-[400px] overflow-y-auto">
                                <div className="px-2 py-1.5 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest border-b border-white/5 mb-1">
                                    {t('Timed mode')}
                                </div>
                                {[15, 30, 60, 120, 300, 600, 900, 1800].map(val => (
                                    <DropdownMenuItem key={`t-${val}`} onClick={() => { setLimitMode('time'); setTestDuration(val); }} className={cn("text-xs font-bold justify-center", limitMode === 'time' && testDuration === val && "text-primary bg-primary/5")}>
                                        {val < 60 ? `${val} ${t('Seconds')}` : `${val / 60} ${t('Minutes')}`}
                                    </DropdownMenuItem>
                                ))}

                                <div className="px-2 py-1.5 text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest border-b border-white/5 mt-2 mb-1">
                                    {contentMode === 'zen' ? t("Training Mode") : t("Fixed Length")}
                                </div>
                                {contentMode === 'zen' ? (
                                    <DropdownMenuItem onClick={() => setLimitMode('count')} className="text-xs font-bold justify-center text-primary">
                                        {t('Endless Flow')}
                                    </DropdownMenuItem>
                                ) : contentMode === 'quote' ? (
                                    <>
                                        {[
                                            { l: "Short", v: 25 },
                                            { l: "Medium", v: 75 },
                                            { l: "Long", v: 150 }
                                        ].map(item => (
                                            <DropdownMenuItem key={item.l} onClick={() => { setLimitMode('count'); setWordCount(item.v); }} className={cn("text-xs font-bold justify-center", limitMode === 'count' && wordCount === item.v && "text-primary bg-primary/5")}>
                                                {t(item.l)} {t('Quotes')}
                                            </DropdownMenuItem>
                                        ))}
                                    </>
                                ) : contentMode === 'sentences' ? [1, 3, 5, 10, 20].map(val => (
                                    <DropdownMenuItem key={`s-${val}`} onClick={() => { setLimitMode('count'); setWordCount(val * 10); }} className={cn("text-xs font-bold justify-center", limitMode === 'count' && Math.floor(wordCount / 10) === val && "text-primary bg-primary/5")}>
                                        {val} {t('Sentences')}
                                    </DropdownMenuItem>
                                )) : contentMode === 'paragraphs' ? [1, 2, 3, 5].map(val => (
                                    <DropdownMenuItem key={`p-${val}`} onClick={() => { setLimitMode('count'); setWordCount(val * 50); }} className={cn("text-xs font-bold justify-center", limitMode === 'count' && Math.floor(wordCount / 50) === val && "text-primary bg-primary/5")}>
                                        {val} {t('Paragraphs')}
                                    </DropdownMenuItem>
                                )) : contentMode === 'characters' ? [25, 50, 100, 250, 500, 1000, 2500, 5000].map(val => (
                                    <DropdownMenuItem key={`c-${val}`} onClick={() => { setLimitMode('count'); setWordCount(val); }} className={cn("text-xs font-bold justify-center", limitMode === 'count' && wordCount === val && "text-primary bg-primary/5")}>
                                        {val} {t('Characters')}
                                    </DropdownMenuItem>
                                )) : [10, 25, 50, 100, 250, 500].map(val => (
                                    <DropdownMenuItem key={`w-${val}`} onClick={() => { setLimitMode('count'); setWordCount(val); }} className={cn("text-xs font-bold justify-center", limitMode === 'count' && wordCount === val && "text-primary bg-primary/5")}>
                                        {val} {t('Words')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* GROUP 4: LANGUAGE & EXAM */}
                <div className={cn("flex items-center gap-2 border-r border-white/10 pr-4", isTyping && "opacity-20 pointer-events-none")}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-all text-xs font-bold uppercase tracking-wider">
                                <Globe className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{languageNames[language as Language] || language}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="max-h-[300px] overflow-y-auto">
                            {allLanguages.map(lang => (
                                <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className="text-xs uppercase font-bold tracking-wider">
                                    {languageNames[lang]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Exam Logic */}
                    <ExamSelectionDialog
                        onSelect={(config) => setExamConfig(config)}
                        trigger={
                            <button className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider",
                                examConfig ? "bg-primary text-background" : "hover:bg-white/5 text-muted-foreground hover:text-primary"
                            )}>
                                {examConfig ? <BookOpen className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                                {examConfig ? examConfig.name : t("Global Exam")}
                            </button>
                        }
                    />
                    {examConfig && (
                        <button onClick={clearExam} title={t("Clear Exam Selection")} className="hover:text-destructive text-muted-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* GROUP 5: TOOLS (Keyboard, Sound, Theme) */}
                <div className={cn("flex items-center gap-1", isTyping && "opacity-20 pointer-events-none")}>
                    <IconButton
                        active={showKeyboard}
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        icon={Keyboard}
                        tooltip={t("Toggle Keyboard")}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button title={t("Sound Settings")} className="p-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-primary transition-all">
                                {soundType === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSoundType('mechanical')}>{t('Mechanical')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSoundType('typewriter')}>{t('Typewriter')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSoundType('soft')}>{t('Soft')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSoundType('none')} className="text-destructive">{t('Mute')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button title={t("Theme Settings")} className="p-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-primary transition-all">
                                <Palette className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                            {[
                                {
                                    id: "light", name: t("Light")
                                },
                                {
                                    id: "dark", name: t("Dark")
                                },
                                {
                                    id: "cyberpunk", name: t("Cyberpunk")
                                },
                                {
                                    id: "ocean", name: t("Ocean")
                                },
                                {
                                    id: "emerald", name: t("Emerald")
                                },
                                {
                                    id: "rose", name: t("Rose Gold")
                                },
                                {
                                    id: "forest", name: t("Forest")
                                },
                                {
                                    id: "midnight", name: t("Midnight")
                                },
                                {
                                    id: "nova", name: t("Nova")
                                },
                                {
                                    id: "earth", name: t("Earth")
                                },
                                {
                                    id: "facebook", name: t("Facebook")
                                },
                            ].map((t_theme) => (
                                <DropdownMenuItem
                                    key={t_theme.id}
                                    onClick={() => setTheme(t_theme.id)}
                                    className={cn("text-xs flex items-center justify-between", theme === t_theme.id && "bg-primary/10 text-primary")}
                                >
                                    {t_theme.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </motion.div>
    );
}


function ModeButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                active ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
        >
            <Icon className={cn("w-3.5 h-3.5", active && "text-primary")} />
            {label}
        </button>
    )
}

function OptionButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                active ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
        >
            {label}
        </button>
    )
}

function IconButton({ active, onClick, icon: Icon, tooltip }: { active: boolean, onClick: () => void, icon: any, tooltip: string }) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={cn(
                "p-2 rounded-lg transition-all",
                active ? "text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
