import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Zap,
  Heart,
  Snowflake,
  Bomb,
  Star,
  Trophy,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause
} from "lucide-react";
import { useKeyboardSounds, SoundType } from "@/hooks/useKeyboardSounds";
import { commonWordsEnglish } from "@/data/wordLists";

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
  points: number;
  color: string;
}

interface PowerUp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  active: boolean;
  cooldown: number;
  maxCooldown: number;
}

const WORD_COLORS = [
  "text-primary",
  "text-blue-400",
  "text-green-400",
  "text-yellow-400",
  "text-purple-400",
  "text-pink-400",
  "text-orange-400",
];

const DIFFICULTY_LEVELS = [
  { name: "Easy", minSpeed: 0.3, maxSpeed: 0.5, spawnRate: 2500, color: "bg-green-500" },
  { name: "Medium", minSpeed: 0.5, maxSpeed: 0.8, spawnRate: 2000, color: "bg-yellow-500" },
  { name: "Hard", minSpeed: 0.8, maxSpeed: 1.2, spawnRate: 1500, color: "bg-orange-500" },
  { name: "Expert", minSpeed: 1.2, maxSpeed: 1.8, spawnRate: 1200, color: "bg-red-500" },
  { name: "Insane", minSpeed: 1.8, maxSpeed: 2.5, spawnRate: 900, color: "bg-purple-500" },
];

/** Renders a falling word with position set imperatively to avoid JSX style= prop */
const FallingWordItem: React.FC<{ word: FallingWord; input: string }> = ({ word, input }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.left = `${word.x}%`;
      ref.current.style.top = `${word.y}%`;
    }
  });
  return (
    <div
      ref={ref}
      className={`absolute font-mono text-lg md:text-xl font-bold transition-all -translate-x-1/2 ${word.color} ${input && word.word.toLowerCase().startsWith(input) ? "scale-110 ring-2 ring-primary rounded px-2" : ""
        }`}
    >
      {word.word.split("").map((char, i) => (
        <span key={i} className={input && word.word.toLowerCase()[i] === input[i] ? "text-green-400" : ""}>
          {char}
        </span>
      ))}
    </div>
  );
};

/** Renders a floating score with position set imperatively to avoid JSX style= prop */
const FloatingScoreItem: React.FC<{ fs: { id: number; x: number; y: number; score: number } }> = ({ fs }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.left = `${fs.x}%`;
      ref.current.style.top = `${fs.y}%`;
      ref.current.style.transform = "translateX(-50%)";
    }
  });
  return (
    <div ref={ref} className="absolute text-green-400 font-bold text-xl animate-float-up pointer-events-none">
      +{fs.score}
    </div>
  );
};


export default function WordCrush() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "gameOver">("idle");
  const [words, setWords] = useState<FallingWord[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [level, setLevel] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: "freeze", name: "Freeze", icon: <Snowflake className="h-4 w-4" />, description: "Slow down all words", active: false, cooldown: 0, maxCooldown: 30 },
    { id: "bomb", name: "Bomb", icon: <Bomb className="h-4 w-4" />, description: "Clear all words on screen", active: false, cooldown: 0, maxCooldown: 45 },
    { id: "shield", name: "Shield", icon: <Heart className="h-4 w-4" />, description: "Gain an extra life", active: false, cooldown: 0, maxCooldown: 60 },
    { id: "double", name: "2x Points", icon: <Star className="h-4 w-4" />, description: "Double points for 10s", active: false, cooldown: 0, maxCooldown: 40 },
  ]);
  const [doublePoints, setDoublePoints] = useState(false);
  const [freezeActive, setFreezeActive] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [floatingScores, setFloatingScores] = useState<{ id: number; x: number; y: number; score: number }[]>([]);

  const { playSound, playErrorSound } = useKeyboardSounds();
  const inputRef = useRef<HTMLInputElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const wordIdRef = useRef(0);
  const floatingScoreIdRef = useRef(0);

  const currentDifficulty = DIFFICULTY_LEVELS[Math.min(level, DIFFICULTY_LEVELS.length - 1)];

  // Spawn new words
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnWord = () => {
      const word = commonWordsEnglish[Math.floor(Math.random() * commonWordsEnglish.length)];
      const speed = currentDifficulty.minSpeed + Math.random() * (currentDifficulty.maxSpeed - currentDifficulty.minSpeed);
      const newWord: FallingWord = {
        id: wordIdRef.current++,
        word,
        x: 5 + Math.random() * 85,
        y: -5,
        speed: freezeActive ? speed * 0.3 : speed,
        points: Math.ceil(word.length * 10 * (level + 1)),
        color: WORD_COLORS[Math.floor(Math.random() * WORD_COLORS.length)],
      };
      setWords(prev => [...prev, newWord]);
    };

    const interval = setInterval(spawnWord, currentDifficulty.spawnRate);
    spawnWord(); // Spawn one immediately

    return () => clearInterval(interval);
  }, [gameState, level, currentDifficulty, freezeActive]);

  // Move words down
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setWords(prev => {
        const updated = prev.map(w => ({
          ...w,
          y: w.y + (freezeActive ? w.speed * 0.3 : w.speed),
        }));

        // Check for words that reached the bottom
        const survived = updated.filter(w => {
          if (w.y >= 95) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState("gameOver");
              }
              return newLives;
            });
            setCombo(0);
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 300);
            if (soundEnabled) playErrorSound("mechanical" as SoundType);
            return false;
          }
          return true;
        });

        return survived;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameState, freezeActive, soundEnabled, playErrorSound]);

  // Level progression
  useEffect(() => {
    const newLevel = Math.floor(wordsTyped / 10);
    if (newLevel > level && newLevel < DIFFICULTY_LEVELS.length) {
      setLevel(newLevel);
    }
  }, [wordsTyped, level]);

  // Power-up cooldowns
  useEffect(() => {
    if (gameState !== "playing") return;

    const cooldownInterval = setInterval(() => {
      setPowerUps(prev => prev.map(p => ({
        ...p,
        cooldown: Math.max(0, p.cooldown - 1),
      })));
    }, 1000);

    return () => clearInterval(cooldownInterval);
  }, [gameState]);

  // Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);

    // Check if any word matches
    const matchingWordIndex = words.findIndex(w => w.word.toLowerCase() === value);
    if (matchingWordIndex !== -1) {
      const word = words[matchingWordIndex];
      const points = doublePoints ? word.points * 2 : word.points;

      // Add floating score
      setFloatingScores(prev => [...prev, {
        id: floatingScoreIdRef.current++,
        x: word.x,
        y: word.y,
        score: points,
      }]);

      // Remove floating score after animation
      setTimeout(() => {
        setFloatingScores(prev => prev.slice(1));
      }, 1000);

      setScore(s => s + points + (combo * 5));
      setCombo(c => {
        const newCombo = c + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
      setWordsTyped(w => w + 1);
      setWords(prev => prev.filter((_, i) => i !== matchingWordIndex));
      setInput("");

      if (soundEnabled) playSound("mechanical" as SoundType, true);
    }
  };

  // Power-up actions
  const activatePowerUp = useCallback((powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.cooldown > 0) return;

    setPowerUps(prev => prev.map(p =>
      p.id === powerUpId ? { ...p, cooldown: p.maxCooldown } : p
    ));

    switch (powerUpId) {
      case "freeze":
        setFreezeActive(true);
        setTimeout(() => setFreezeActive(false), 5000);
        break;
      case "bomb": {
        const clearedPoints = words.reduce((sum, w) => sum + w.points, 0);
        setScore(s => s + Math.floor(clearedPoints * 0.5));
        setWords([]);
        break;
      }
      case "shield":
        setLives(l => Math.min(l + 1, 5));
        break;
      case "double":
        setDoublePoints(true);
        setTimeout(() => setDoublePoints(false), 10000);
        break;
    }

    if (soundEnabled) playSound("mechanical" as SoundType, true);
  }, [powerUps, words, soundEnabled, playSound]);

  const startGame = () => {
    setGameState("playing");
    setWords([]);
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setLevel(0);
    setWordsTyped(0);
    setInput("");
    setDoublePoints(false);
    setFreezeActive(false);
    setPowerUps(prev => prev.map(p => ({ ...p, cooldown: 0 })));
    wordIdRef.current = 0;
    inputRef.current?.focus();
  };

  const togglePause = () => {
    if (gameState === "playing") {
      setGameState("paused");
    } else if (gameState === "paused") {
      setGameState("playing");
      inputRef.current?.focus();
    }
  };

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing") {
      inputRef.current?.focus();
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary" />
              Word Crush
            </h1>
            <p className="text-muted-foreground">Type falling words before they reach the bottom!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            {gameState === "playing" || gameState === "paused" ? (
              <Button variant="outline" size="icon" onClick={togglePause}>
                {gameState === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-primary">{score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`h-5 w-5 ${i < lives ? "text-red-500 fill-red-500" : "text-muted"}`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">Lives</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{combo}x</div>
            <div className="text-xs text-muted-foreground">Combo</div>
          </Card>
          <Card className="p-3 text-center">
            <Badge className={currentDifficulty.color}>{currentDifficulty.name}</Badge>
            <div className="text-xs text-muted-foreground mt-1">Level {level + 1}</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{wordsTyped}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </Card>
        </div>

        {/* Power-ups */}
        <div className="flex gap-2 flex-wrap">
          {powerUps.map(powerUp => (
            <Button
              key={powerUp.id}
              variant={powerUp.cooldown > 0 ? "secondary" : "outline"}
              className="relative"
              disabled={powerUp.cooldown > 0 || gameState !== "playing"}
              onClick={() => activatePowerUp(powerUp.id)}
            >
              {powerUp.icon}
              <span className="ml-2">{powerUp.name}</span>
              {powerUp.cooldown > 0 && (
                <div className="absolute inset-0 bg-background/80 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">{powerUp.cooldown}s</span>
                </div>
              )}
            </Button>
          ))}
          {doublePoints && (
            <Badge className="bg-yellow-500 animate-pulse">2x POINTS ACTIVE!</Badge>
          )}
          {freezeActive && (
            <Badge className="bg-blue-500 animate-pulse">❄️ FREEZE ACTIVE!</Badge>
          )}
        </div>

        {/* Game Area */}
        <Card
          ref={gameAreaRef}
          className={`relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-b from-background to-muted/20 border-2 ${screenShake ? "animate-shake" : ""
            } ${freezeActive ? "border-blue-500" : ""}`}
        >
          {/* Danger zone indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-destructive/20 to-transparent pointer-events-none" />

          {/* Falling words */}
          {words.map(word => (
            <FallingWordItem key={word.id} word={word} input={input} />
          ))}

          {/* Floating scores */}
          {floatingScores.map(fs => (
            <FloatingScoreItem key={fs.id} fs={fs} />
          ))}

          {/* Paused Overlay */}
          {gameState === "paused" && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="text-center">
                <Pause className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Paused</h2>
                <Button onClick={togglePause}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center space-y-6">
                <Zap className="h-20 w-20 text-primary mx-auto" />
                <h2 className="text-3xl font-bold">Word Crush</h2>
                <p className="text-muted-foreground max-w-md">
                  Type the falling words before they reach the bottom. Build combos for bonus points and use power-ups to survive!
                </p>
                <Button size="lg" onClick={startGame} className="gap-2">
                  <Play className="h-5 w-5" />
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === "gameOver" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center space-y-6">
                <Trophy className="h-20 w-20 text-yellow-500 mx-auto" />
                <h2 className="text-3xl font-bold">Game Over!</h2>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <Card className="p-4">
                    <div className="text-3xl font-bold text-primary">{score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Final Score</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-3xl font-bold text-foreground">{wordsTyped}</div>
                    <div className="text-sm text-muted-foreground">Words Typed</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-3xl font-bold text-orange-400">{maxCombo}x</div>
                    <div className="text-sm text-muted-foreground">Max Combo</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-3xl font-bold text-foreground">{level + 1}</div>
                    <div className="text-sm text-muted-foreground">Level Reached</div>
                  </Card>
                </div>
                <Button size="lg" onClick={startGame} className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Input */}
        <div className="flex gap-4">
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={gameState === "playing" ? "Type the words here..." : "Start game to begin typing"}
            className="text-xl font-mono h-14"
            disabled={gameState !== "playing"}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        {/* Level progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress to Level {level + 2}</span>
            <span>{wordsTyped % 10}/10 words</span>
          </div>
          <Progress value={(wordsTyped % 10) * 10} className="h-2" />
        </div>

        {/* Instructions */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Type the words as they fall before they reach the bottom</li>
            <li>• Build combos by typing words consecutively without missing</li>
            <li>• Use power-ups strategically to survive longer</li>
            <li>• Difficulty increases every 10 words</li>
          </ul>
        </Card>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
