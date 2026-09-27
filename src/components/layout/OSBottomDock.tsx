import { NavLink, useLocation } from "react-router-dom";
import { useTypingSession } from "@/contexts/TypingSessionContext";
import { cn } from "@/utils/utils";
import { 
  Home, 
  Swords, 
  TreeDeciduous, 
  User 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dockItems = [
  { 
    id: "home",
    icon: Home, 
    label: "Home", 
    path: "/",
    description: "Daily Ritual"
  },
  { 
    id: "arena",
    icon: Swords, 
    label: "Arena", 
    path: "/multiplayer-race",
    description: "Multiplayer"
  },
  { 
    id: "skill",
    icon: TreeDeciduous, 
    label: "Skill", 
    path: "/skill-progression",
    description: "Skill Tree"
  },
  { 
    id: "profile",
    icon: User, 
    label: "Me", 
    path: "/statistics",
    description: "Profile & Stats"
  },
];

export function OSBottomDock() {
  const location = useLocation();
  const { isTyping } = useTypingSession();

  return (
    <AnimatePresence>
      {!isTyping && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
            "bg-card/90 backdrop-blur-xl border-t border-border/50",
            "pb-[env(safe-area-inset-bottom)]"
          )}
        >
          <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
            {dockItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 py-2 rounded-xl",
                      "transition-colors duration-200",
                      "min-w-[60px]",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <motion.div 
                      className={cn(
                        "relative p-2 rounded-xl",
                        isActive && "bg-primary/15"
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className={cn(
                        "w-5 h-5",
                        isActive && "scale-110"
                      )} />
                      {/* Active indicator dot */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" 
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className={cn(
                      "text-[10px] font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
