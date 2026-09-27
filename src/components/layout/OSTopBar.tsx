import { useState } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Flame,
  Brain,
  Sparkles,
  Settings,
  Zap,
  Target,
  Search,
  Activity,
  Keyboard,
  Gamepad2,
  Trophy,
  Crown,
  Heart,
  MessageSquare,
  Github,
  Coffee,
  Bell,
  Snowflake,
  LogOut,
  User,
  CheckCircle2,
  ChevronDown,
  PieChart,
  Layout,
  X,
  Trash2,
  Megaphone,
  Video,
  ShoppingBag,
  MessageCircle,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OSCommandPill } from "@/components/layout/OSCommandPill";
import { OSStartMenu } from "@/components/layout/OSStartMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdToEarn } from "@/components/shared/AdToEarn";
import { DonationModal } from "@/components/shared/DonationModal";
import { PromotionModal, type PromotionCategory } from "@/components/shared/PromotionModal";

// Advanced animation variants for dopamine spikes
const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0px rgba(245, 158, 11, 0)",
      "0 0 15px rgba(245, 158, 11, 0.4)",
      "0 0 0px rgba(245, 158, 11, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const resourcePop = {
  initial: { scale: 0.8, opacity: 0, y: 10 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 1.2, opacity: 0, y: -10 }
};

export function OSTopBar() {
  const navigate = useNavigate();
  const { userStats, getXPForNextLevel, logout, earnTasks = [], dailyChallenges = [] } = useGamification();
  const { isTyping, focusLevel, currentWPM = 0, currentAccuracy = 100 } = useTypingSession();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { t } = useTranslation();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionCategory, setPromotionCategory] = useState<PromotionCategory>('general');

  const completedQuests = [...earnTasks, ...dailyChallenges].filter(q => (q as any).isCompleted || (q as any).completed).length;
  const totalQuests = earnTasks.length + dailyChallenges.length;

  const xpForNext = getXPForNextLevel();
  const currentLevelXP = Math.pow(userStats.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(userStats.level, 2) * 100;
  const progressInLevel = userStats.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercent = xpNeededForLevel > 0 ? (progressInLevel / xpNeededForLevel) * 100 : 0;

  return (
    <AnimatePresence>
      <header
        className={cn(
          "fixed top-3 left-0 right-0 z-[60] flex justify-center pointer-events-none"
        )}
      >
        <div className="w-full max-w-7xl px-4 pointer-events-auto">
          <div className={cn(
            "bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-4 py-2",
            "flex items-center justify-between gap-6 relative group/topbar z-10",
          )}>
            {/* Dynamic Animated Border (Nexus Effect) */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

            {/* LEFT SECTION: SYSTEM & LEVEL */}
            <div className="flex items-center gap-4">
              <OSStartMenu />

              {!isTyping && (
                <Button
                  variant="ghost"
                  className="hidden sm:flex items-center gap-3 border-l border-white/5 pl-4 group/level cursor-pointer h-auto py-1.5 px-3 rounded-xl hover:bg-white/5"
                  onClick={() => navigate("/profile")}
                >
                  <div className="relative flex-shrink-0">
                    <motion.div
                      animate={progressPercent > 80 ? {
                        boxShadow: ["0 0 0px #f59e0b", "0 0 15px #f59e0b", "0 0 0px #f59e0b"],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-1 bg-amber-500/20 rounded-full blur-sm group-hover/level:bg-amber-500/30 transition-colors"
                    />
                    <div className="relative w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center font-black text-[11px] text-amber-500 shadow-inner group-hover/level:scale-110 transition-transform">
                      {userStats.level}
                    </div>
                  </div>
                  <div className="hidden xl:flex flex-col min-w-[90px] items-start">
                    <div className="flex justify-between w-full text-[8px] font-black uppercase tracking-tighter leading-none mb-1.5">
                      <span className="text-amber-500/80 group-hover/level:text-amber-500 transition-colors">{t('Rank')} Lvl {userStats.level}</span>
                      <span className="text-amber-400">{Math.floor(progressPercent)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 bg-[length:200%_100%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${progressPercent}%`,
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                          width: { duration: 1.5, ease: "easeOut" },
                          backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                        }}
                      />
                    </div>
                  </div>
                </Button>
              )}
            </div>

            <div className="flex-1 max-w-lg flex items-center gap-3 justify-center">
              {isTyping ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-6 py-1 px-4 rounded-xl bg-primary/5 border border-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                >
                  <TooltipSimple label="Exit Test">
                    <button
                      onClick={() => navigate("/")}
                      aria-label="Typing Test"
                      className="p-1.5 rounded-lg bg-primary/20 text-primary transition-all mr-2 hover:bg-primary/30 hover:scale-105 active:scale-95"
                    >
                      <Keyboard className="w-3.5 h-3.5" />
                    </button>
                  </TooltipSimple>
                  <div className="flex items-center gap-2 group/stat">
                    <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 group-hover/stat:scale-110 transition-transform">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase leading-none tracking-widest hidden sm:inline">WPM</span>
                      <span className="text-sm font-black text-white">{currentWPM}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-l border-white/5 pl-2 sm:pl-6 group/stat">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 group-hover/stat:scale-110 transition-transform">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-muted-foreground uppercase leading-none tracking-widest hidden sm:inline">ACC</span>
                      <span className="text-sm font-black text-white">{currentAccuracy}%</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <OSCommandPill />
                  <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
                    <TooltipSimple label="Typing Test">
                      <button
                        onClick={() => navigate("/")}
                        aria-label="Start Typing Test"
                        className="p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all group"
                      >
                        <Keyboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </TooltipSimple>
                    <TooltipSimple label="Arena Pulse">
                      <button
                        onClick={() => navigate("/tournaments")}
                        aria-label="Enter Arena"
                        className="p-2 rounded-lg hover:bg-orange-500/20 text-muted-foreground hover:text-orange-500 transition-all group relative"
                      >
                        <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                      </button>
                    </TooltipSimple>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <LanguageSwitcher />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 lg:gap-5">
              {!isTyping && (
                <>
                  {/* Quest Tracker (Retention) */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors cursor-pointer group h-auto"
                      >
                        <Activity className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col items-start">
                          <span className="text-[8px] font-black uppercase tracking-widest text-blue-400/70">Quests</span>
                          <span className="text-[9px] font-bold text-blue-400 leading-none">{completedQuests}/{totalQuests} Complete</span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase tracking-wider">Active Quests</h4>
                          <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                            {completedQuests} / {totalQuests}
                          </Badge>
                        </div>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                        {[...earnTasks, ...dailyChallenges].map((quest: any) => (
                          <div
                            key={quest.id}
                            className="p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-white">{quest.title}</span>
                              {quest.isCompleted || quest.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <span className="text-[9px] font-black text-blue-400/50 uppercase">{quest.type}</span>
                              )}
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className={cn("h-full", quest.isCompleted || quest.completed ? "bg-emerald-500" : "bg-blue-500")}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (quest.progress || quest.current || 0) / quest.target * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-white/[0.02] border-t border-white/5">
                        <Button
                          variant="ghost"
                          className="w-full text-xs font-black uppercase tracking-widest h-10 hover:text-primary"
                          onClick={() => navigate("/earn")}
                        >
                          View Quest Terminal
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Resource Section */}
                  <div className="flex items-center gap-4 pr-3 border-r border-white/5">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={userStats.coins}
                        variants={resourcePop}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex items-center gap-1.5 group/coin"
                      >
                        <div className="p-1 rounded-md bg-yellow-500/10 text-yellow-500 group-hover/coin:rotate-12 transition-transform">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-black text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
                          {userStats.coins.toLocaleString()}
                        </span>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center gap-1.5 group/streak">
                      {userStats.streakFrozen ? (
                        <Snowflake className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      ) : (
                        <div className="relative">
                          <Flame className={cn("w-3.5 h-3.5 transition-all",
                            userStats.streak > 0 ? "text-orange-500 fill-orange-500/20" : "opacity-30",
                            userStats.streak > 3 && "animate-bounce"
                          )} />
                          {userStats.streak > 3 && (
                            <div className="absolute inset-0 bg-orange-500 blur-md opacity-30 animate-pulse" />
                          )}
                        </div>
                      )}
                      <span className={cn("text-[11px] font-black",
                        userStats.streakFrozen ? "text-blue-400" : (userStats.streak > 0 ? "text-orange-500" : "opacity-30")
                      )}>
                        {userStats.streak}d
                      </span>
                    </div>
                  </div>

                  {/* Boost Center (Monetization & Ads) */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Nexus Boost Center"
                        className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all relative overflow-hidden"
                      >
                        <Zap className="w-4 h-4 fill-current animate-pulse" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 overflow-hidden bg-slate-900/95 backdrop-blur-2xl border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="p-4 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/20 animate-pulse">
                            <Zap className="w-4 h-4 text-primary fill-current" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider leading-none">Nexus Boost Center</h4>
                            <p className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-tighter font-bold">Protocol Status: Optimal</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <AdToEarn rewardAmount={75} />

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5" />
                          </div>
                          <div className="relative flex justify-start text-[8px] uppercase font-black tracking-[0.2em] text-primary/40">
                            <span className="bg-slate-900/0 pr-2">Expansion Protocols</span>
                          </div>
                        </div>

                        {/* Redesigned Promotional Features Grid - More Compact */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setPromotionCategory('advertise');
                              setShowPromotionModal(true);
                            }}
                            className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-start gap-2 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all group relative overflow-hidden h-24"
                          >
                            <div className="absolute top-[-5%] right-[-5%] opacity-10 group-hover:rotate-12 transition-transform">
                              <Megaphone className="w-12 h-12 text-blue-500" />
                            </div>
                            <Megaphone className="w-5 h-5 text-blue-500 relative z-10" />
                            <div className="relative z-10 mt-auto">
                              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block leading-tight">Advertise</span>
                              <span className="text-[7px] text-blue-400/60 uppercase font-bold tracking-tighter">Broadcast Link</span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setPromotionCategory('video');
                              setShowPromotionModal(true);
                            }}
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-start gap-2 hover:bg-red-500/20 hover:border-red-500/40 transition-all group relative overflow-hidden h-24"
                          >
                            <div className="absolute top-[-5%] right-[-5%] opacity-10 group-hover:rotate-12 transition-transform">
                              <Video className="w-12 h-12 text-red-500" />
                            </div>
                            <Video className="w-5 h-5 text-red-500 relative z-10" />
                            <div className="relative z-10 mt-auto">
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block leading-tight">Promote Video</span>
                              <span className="text-[7px] text-red-400/60 uppercase font-bold tracking-tighter">Boost Stream</span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setPromotionCategory('product');
                              setShowPromotionModal(true);
                            }}
                            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-start gap-2 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group relative overflow-hidden h-24"
                          >
                            <div className="absolute top-[-5%] right-[-5%] opacity-10 group-hover:rotate-12 transition-transform">
                              <ShoppingBag className="w-12 h-12 text-emerald-500" />
                            </div>
                            <ShoppingBag className="w-5 h-5 text-emerald-500 relative z-10" />
                            <div className="relative z-10 mt-auto">
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block leading-tight">Product</span>
                              <span className="text-[7px] text-emerald-400/60 uppercase font-bold tracking-tighter">Feature Tech</span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setPromotionCategory('publish');
                              setShowPromotionModal(true);
                            }}
                            className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-start gap-2 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all group relative overflow-hidden h-24"
                          >
                            <div className="absolute top-[-5%] right-[-5%] opacity-10 group-hover:rotate-12 transition-transform">
                              <BookOpen className="w-12 h-12 text-indigo-500" />
                            </div>
                            <BookOpen className="w-5 h-5 text-indigo-500 relative z-10" />
                            <div className="relative z-10 mt-auto">
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block leading-tight">Publish</span>
                              <span className="text-[7px] text-indigo-400/60 uppercase font-bold tracking-tighter">Submit Content</span>
                            </div>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setPromotionCategory('general');
                            setShowPromotionModal(true);
                          }}
                          className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between hover:bg-amber-500/20 hover:border-amber-500/40 transition-all group"
                        >
                          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[9px] text-amber-500">
                            <MessageCircle className="w-4 h-4" />
                            {t('Direct Contact')}
                          </div>
                          <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => navigate("/marketplace")}
                          className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between hover:bg-amber-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Crown className="w-5 h-5 text-amber-500" />
                            <div className="text-left">
                              <p className="text-xs font-black uppercase tracking-tight text-amber-500">Premium Shop</p>
                              <p className="text-[9px] text-muted-foreground">Unlock 2x XP Multipliers</p>
                            </div>
                          </div>
                          <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-125 transition-transform" />
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer h-auto"
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop"
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[9px] font-black text-white uppercase leading-none">{t('Pilot Interface')}</span>
                          <span className="text-[8px] font-bold text-primary/70 leading-none mt-0.5">Lvl {userStats.level}</span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-primary/50 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl p-2">
                      <DropdownMenuLabel className="px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase text-white tracking-widest">{t('Nexus Interface')}</span>
                          <span className="text-[10px] text-muted-foreground">{t('Status: Active')}</span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5 mx-1" />
                      <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl focus:bg-primary/10 cursor-pointer gap-2 py-2.5">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('Pilot Profile')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/statistics")} className="rounded-xl focus:bg-primary/10 cursor-pointer gap-2 py-2.5">
                        <PieChart className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('Neural Stats')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/achievements")} className="rounded-xl focus:bg-primary/10 cursor-pointer gap-2 py-2.5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('Achievements')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5 mx-1" />
                      <SubscriptionModal>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-xl focus:bg-orange-500/10 cursor-pointer gap-2 py-2.5">
                          <Crown className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-bold uppercase tracking-wider">{userStats.isPremium ? t('Pro Status') : t('Get Pro Plus')}</span>
                        </DropdownMenuItem>
                      </SubscriptionModal>
                      <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-xl focus:bg-primary/10 cursor-pointer gap-2 py-2.5">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('System Settings')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <div className="flex items-center gap-2">
                <TooltipSimple label="Donate">
                  <Button
                    onClick={() => setShowDonationModal(true)}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:border-pink-500/40 text-pink-500 shadow-lg shadow-pink-500/5 transition-all font-bold text-[10px] uppercase tracking-wider mr-2"
                  >
                    <Keyboard className="w-3.5 h-3.5 md:hidden" />
                    <Coffee className="w-3.5 h-3.5" />
                    <span>{t('Donate')}</span>
                  </Button>
                </TooltipSimple>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1.5 rounded-xl hover:bg-muted transition-colors group relative"
                      aria-label="Support & Feedback"
                    >
                      <Heart className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Support & Community</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setShowDonationModal(true)}>
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>{t('Support TypingOS')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setShowDonationModal(true)}>
                      <Coffee className="w-4 h-4 text-amber-500" />
                      <span>Buy us a coffee</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => {
                      window.open('https://github.com', '_blank');
                      toast.success("Thanks for the support!");
                    }}>
                      <Github className="w-4 h-4" />
                      <span>Star on GitHub</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => window.open('mailto:feedback@typingos.com', '_blank')}>
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>Send Feedback</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1.5 rounded-xl hover:bg-muted transition-colors group relative"
                      aria-label="Updates & Notifications"
                    >
                      <Bell className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-primary rounded-full ring-2 ring-card flex items-center justify-center">
                          <span className="text-[8px] font-black text-black px-1">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <div className="flex gap-1">
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] font-black uppercase hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllAsRead();
                            }}
                          >
                            Mark All Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] font-black uppercase hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAll();
                          }}
                        >
                          Clear All
                        </Button>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground font-medium">No notifications</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "flex items-start gap-2 p-3 hover:bg-white/5 transition-colors group/notif relative",
                              !notification.read && "bg-primary/5"
                            )}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2 w-full mb-1">
                                {!notification.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                )}
                                <span className={cn(
                                  "font-semibold text-xs",
                                  !notification.read && "text-primary"
                                )}>
                                  {notification.title}
                                </span>
                                <span className="ml-auto text-[10px] text-muted-foreground flex-shrink-0">
                                  {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className={cn(
                                "text-[11px] text-muted-foreground",
                                !notification.read && "pl-3.5"
                              )}>
                                {notification.message}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover/notif:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="justify-center text-xs text-primary font-medium cursor-pointer"
                          onClick={() => navigate("/notifications")}
                        >
                          View All Notifications
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                  className="p-1.5 rounded-xl hover:bg-muted transition-colors focus:outline-none"
                  aria-label="System Settings"
                >
                  <Settings className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </Button>


              </div>
            </div>
          </div>
        </div>
        <DonationModal
          open={showDonationModal}
          onOpenChange={setShowDonationModal}
        />
        <PromotionModal
          open={showPromotionModal}
          onOpenChange={setShowPromotionModal}
          initialCategory={promotionCategory}
        />
      </header>
    </AnimatePresence >
  );
}

function TooltipSimple({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className="absolute top-full mt-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-bold rounded border border-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}
