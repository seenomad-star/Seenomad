import { useState } from "react";
import { NativeAdSlot } from "@/components/shared/NativeAdSlot";
import { GalacticEventsWidget } from "@/components/dashboard/GalacticEventsWidget";
import { cn } from "@/utils/utils";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Target,
  Lightbulb,
  Coffee,
  ChevronLeft,
  Sparkles,
  Zap,
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const panelVariants = {
  hidden: { x: 300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { x: 300, opacity: 0 }
};

const cardVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

export function OSRightPanel() {
  const { isTyping, currentWPM, currentAccuracy, focusLevel } = useTypingSession();
  const { dailyChallenges, userStats } = useGamification();
  const [collapsed, setCollapsed] = useState(false);

  const activeChallenges = dailyChallenges.filter(c => !c.completed).slice(0, 2);

  // Get contextual AI tips based on performance
  const getAITip = () => {
    if (currentAccuracy < 90) {
      return {
        icon: Target,
        title: "Accuracy First",
        message: "Slow down slightly to improve accuracy. Speed will follow naturally.",
        color: "text-yellow-500"
      };
    }
    if (currentWPM > 0 && currentWPM < 40) {
      return {
        icon: Lightbulb,
        title: "Keep Practicing",
        message: "You're building muscle memory. Focus on home row position.",
        color: "text-blue-500"
      };
    }
    if (focusLevel > 70) {
      return {
        icon: Zap,
        title: "In The Zone!",
        message: "Your focus is excellent. Keep this rhythm going!",
        color: "text-green-500"
      };
    }
    return {
      icon: Coffee,
      title: "Ready to Type?",
      message: "Start typing to get personalized coaching tips.",
      color: "text-muted-foreground"
    };
  };

  const aiTip = getAITip();

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        className={cn(
          "hidden xl:flex flex-col",
          "fixed right-0 top-0 bottom-0 z-30",
          "pt-14 pb-4 px-3",
          "bg-card/30 backdrop-blur-sm border-l border-border/30",
          "max-h-screen overflow-hidden",
          collapsed ? "w-12" : "w-72",
          isTyping && "opacity-50 pointer-events-none"
        )}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={panelVariants}
      >
        {/* Collapse Toggle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-16 -translate-x-1/2 w-6 h-6 rounded-full bg-card border border-border shadow-sm hover:bg-card/80"
            onClick={() => setCollapsed(!collapsed)}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronLeft className="w-3 h-3" />
            </motion.div>
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              className="flex flex-col gap-4 overflow-y-auto scrollbar-hide pr-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* AI Coach Card */}
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Bot className="w-4 h-4 text-primary" />
                      </motion.div>
                      AI Coach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-32 rounded-lg overflow-hidden border border-primary/20">
                      <img
                        src="/assets/images/blog_brain_typing_1770053586014.png"
                        alt="AI Coach"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-white drop-shadow-md tracking-tighter">Live Analysis Active</span>
                      </div>
                    </div>
                    <motion.div
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-white/5 shadow-inner"
                      )}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <aiTip.icon className={cn("w-5 h-5 mt-0.5 shrink-0", aiTip.color)} />
                      <div>
                        <p className="text-sm font-medium">{aiTip.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {aiTip.message}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Galactic Events Widget */}
              <motion.div variants={cardVariants}>
                <GalacticEventsWidget />
              </motion.div>

              {/* Active Quests */}
              <motion.div variants={cardVariants}>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        Active Quests
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {activeChallenges.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeChallenges.length > 0 ? (
                      activeChallenges.map((challenge, index) => (
                        <motion.div
                          key={challenge.id}
                          className="space-y-1.5"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium truncate">{challenge.title}</span>
                            <span className="text-muted-foreground shrink-0">
                              {challenge.current}/{challenge.target}
                            </span>
                          </div>
                          <Progress
                            value={(challenge.current / challenge.target) * 100}
                            className="h-1.5"
                          />
                          <div className="flex items-center gap-1 text-[10px] text-primary">
                            <Sparkles className="w-3 h-3" />
                            +{challenge.reward} XP
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        All quests completed! 🎉
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={cardVariants}>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Today's Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="text-center p-2 rounded-lg bg-muted/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-lg font-bold text-foreground">{userStats.totalTests}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Tests</p>
                      </motion.div>
                      <motion.div
                        className="text-center p-2 rounded-lg bg-muted/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-lg font-bold text-primary">{userStats.xp}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Total XP</p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rest Suggestion */}
              <AnimatePresence>
                {focusLevel > 80 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Card className="bg-blue-500/10 border-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Coffee className="w-5 h-5 text-blue-500 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-blue-500">Take a Break?</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              You've been focused for a while. A short break can help maintain peak performance.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* PROMOTIONAL ZONE */}
              <motion.div variants={cardVariants}>
                <NativeAdSlot
                  type="sidebar"
                  title="Elite Typist Pro"
                  description="Get detailed heatmap analytics and unlock the full sound library."
                  cta="Upgrade Now"
                  bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </AnimatePresence>
  );
}
