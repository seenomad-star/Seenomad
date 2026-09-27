import { Gamepad2, Zap, Target, Rocket, Ghost, Swords, Lock, Crown, Terminal, Skull } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AICoach } from "@/pages/AICoach";
import { AdBanner } from "@/components/shared/AdBanner";
import { PremiumBadge, PremiumUpsell } from "@/components/shared/PremiumBadge";
import { useGamification } from "@/contexts/GamificationContext";
import { useNavigate } from "react-router-dom";

// Import game images - using placeholders as assets are missing
const gameWordBlitz = "/assets/images/game_word_blitz_1770053603225.png";
const gameTargetPractice = "https://images.unsplash.com/photo-1533227297464-60f2a8f45031?w=800&h=400&fit=crop";
const gameSpaceRace = "/assets/images/game_space_race_hq_1770053621978.png";
const gameGhostTyper = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop";
const gameTypeDuel = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop";

const games = [
  {
    id: 1,
    title: "Word Blitz",
    description: "Type words as fast as you can before time runs out",
    icon: Zap,
    image: gameWordBlitz,
    difficulty: "Easy",
    players: "1.2k playing",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    premium: false,
    route: "/word-crush",
  },
  {
    id: 2,
    title: "Target Practice",
    description: "Hit the falling words before they reach the bottom",
    icon: Target,
    image: gameTargetPractice,
    difficulty: "Medium",
    players: "856 playing",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    premium: false,
    route: "/word-crush",
  },
  {
    id: 3,
    title: "Space Race",
    description: "Race against others in real-time typing competitions",
    icon: Rocket,
    image: gameSpaceRace,
    difficulty: "Hard",
    players: "2.3k playing",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    premium: false,
    route: "/multiplayer-race",
  },
  {
    id: 7,
    title: "Heist Master",
    description: "Infiltrate secure servers in a high-stakes hacking simulation",
    icon: Terminal,
    image: "https://images.unsplash.com/photo-1510511459019-5dee592da13a?auto=format&fit=crop&w=800&q=80",
    difficulty: "Expert",
    players: "1.5k playing",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    premium: true,
    route: "/heist-master",
    isNew: true,
  },
  {
    id: 4,
    title: "Ghost Typer",
    description: "Type in the dark with only brief glimpses of the text",
    icon: Ghost,
    image: gameGhostTyper,
    difficulty: "Expert",
    players: "432 playing",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    premium: true,
    route: "/word-crush",
  },
  {
    id: 6,
    title: "Neon Knight",
    description: "Battle digital sentinels in a cyberpunk combat simulator",
    icon: Swords,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    difficulty: "Hard",
    players: "3.4k playing",
    color: "text-primary",
    bgColor: "bg-primary/10",
    premium: false,
    route: "/neon-knight",
    isNew: true,
  },
  {
    id: 8,
    title: "Boss Battle",
    description: "Defeat powerful bosses by typing words to deal damage",
    icon: Skull,
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=800&q=80",
    difficulty: "Medium",
    players: "2.1k playing",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    premium: false,
    route: "/games/boss-battle",
    isNew: true,
  },
  {
    id: 5,
    title: "Type Duel",
    description: "Challenge friends to 1v1 typing battles",
    icon: Swords,
    image: gameTypeDuel,
    difficulty: "Medium",
    players: "1.8k playing",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    premium: true,
    route: "/multiplayer-race",
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-success/20 text-success",
  Medium: "bg-primary/20 text-primary",
  Hard: "bg-purple-500/20 text-purple-400",
  Expert: "bg-destructive/20 text-destructive",
};

export default function Games() {
  const { userStats } = useGamification();
  const navigate = useNavigate();

  const handlePlayGame = (game: typeof games[0]) => {
    if (game.premium && !userStats.isPremium) {
      return; // Don't navigate for locked games
    }
    navigate(game.route);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Games</h1>
          </div>
          <PremiumBadge />
        </div>
        <p className="text-muted-foreground">
          Fun and challenging typing games to improve your skills
        </p>
      </div>

      {/* AI Coach */}
      <div className="mb-6">
        <AICoach context="games" />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {games.map((game) => {
          const isLocked = game.premium && !userStats.isPremium;

          return (
            <Card
              key={game.id}
              className={`overflow-hidden bg-card transition-all group ${isLocked ? "opacity-75" : "hover:bg-secondary/30 cursor-pointer"
                }`}
              onClick={() => handlePlayGame(game)}
            >
              {/* Game Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                {isLocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-yellow-500 rounded-full p-3">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className={difficultyColors[game.difficulty]}>
                    {game.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${game.bgColor} ${!isLocked ? "group-hover:scale-110" : ""} transition-transform relative shrink-0`}>
                    <game.icon className={`w-5 h-5 ${game.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{game.title}</h3>
                      {game.isNew && (
                        <Badge className="bg-primary text-background text-[9px] font-black uppercase px-2 h-4">
                          NEW
                        </Badge>
                      )}
                      {game.premium && (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{game.players}</span>
                      <Button
                        size="sm"
                        disabled={isLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayGame(game);
                        }}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Unlock
                          </>
                        ) : (
                          "Play Now"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Premium Upsell */}
      <PremiumUpsell feature="Unlock all premium games" />

      {/* Ad Banner */}
      <div className="mt-6">
        <AdBanner type="banner" />
      </div>
    </div>
  );
}
