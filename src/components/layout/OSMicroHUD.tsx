import { useTypingSession } from "@/contexts/TypingSessionContext";
import { cn } from "@/utils/utils";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OSMicroHUD() {
  const { isTyping, currentWPM, currentAccuracy, sessionXP } = useTypingSession();

  // Only show when typing or has recent data
  const shouldShow = isTyping || currentWPM > 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: isTyping ? 0.6 : 0.9, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25 
          }}
          className={cn(
            "fixed bottom-20 left-1/2 -translate-x-1/2 z-40 lg:bottom-4",
            "pointer-events-none"
          )}
        >
          <motion.div 
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-full",
              "bg-card/80 backdrop-blur-md border border-border/50",
              "shadow-lg"
            )}
            layout
          >
            {/* WPM */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">WPM</span>
              <motion.span 
                className="text-lg font-bold text-foreground tabular-nums"
                key={currentWPM}
                initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                transition={{ duration: 0.3 }}
              >
                {currentWPM}
              </motion.span>
            </div>

            <div className="w-px h-4 bg-border" />

            {/* Accuracy */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">ACC</span>
              <motion.span 
                className={cn(
                  "text-lg font-bold tabular-nums",
                  currentAccuracy >= 95 ? "text-green-500" : 
                  currentAccuracy >= 85 ? "text-yellow-500" : "text-red-500"
                )}
                key={Math.round(currentAccuracy)}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {currentAccuracy.toFixed(0)}%
              </motion.span>
            </div>

            {/* XP Ticks - Only show if earned */}
            <AnimatePresence>
              {sessionXP > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 10, width: 0 }}
                  className="flex items-center gap-1 overflow-hidden"
                >
                  <div className="w-px h-4 bg-border" />
                  <motion.div 
                    className="flex items-center gap-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Zap className="w-3 h-3 text-primary" />
                    <motion.span 
                      className="text-sm font-bold text-primary"
                      key={sessionXP}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      +{sessionXP}
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
