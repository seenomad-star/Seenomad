import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Play,
  Trophy,
  Zap,
  Car,
  Flag,
  Timer,
  RefreshCw,
  Crown,
  Medal,
  Target,
  Keyboard,
  BarChart3,
  Sword,
  Skull,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { useKeyboardSounds, SoundType } from "@/hooks/useKeyboardSounds";
import { useRaceHistory } from "@/hooks/useRaceHistory";
import { RaceLeaderboard } from "@/pages/RaceLeaderboard";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { ViralShareCard } from "@/components/social/ViralShareCard";
import { EliminationUI } from "@/components/multiplayer/EliminationUI";
import { TypingDisplay } from "@/components/typing/TypingDisplay";
import { useGamification } from "@/contexts/GamificationContext";


interface Racer {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  wpm: number;
  accuracy: number;
  isBot: boolean;
  finished: boolean;
  finishTime?: number;
  position?: number;
  isEliminated?: boolean;
}

type GameMode = 'lobby' | 'waiting' | 'countdown' | 'racing' | 'results';

const RACE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is often used for typing practice.",
  "Programming is the art of telling a computer what to do through a set of instructions. It requires patience, logic, and creativity.",
  "In the digital age, typing speed has become an essential skill. Whether for work or personal use, fast and accurate typing saves time.",
  "The best way to predict the future is to create it. Every great achievement started with someone who believed they could make a difference.",
  "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep pushing forward and never give up on your dreams.",
];

const BOT_NAMES = [
  "SpeedyBot", "TypeMaster", "KeyboardKing", "FlashFingers",
  "RapidTyper", "SwiftKeys", "TurboType", "NinjaTypist"
];

const AVATARS = ["🚗", "🏎️", "🚙", "🚕", "🏍️", "🛵", "🚌", "🚐"];

const CAR_COLORS = [
  "from-blue-500 to-blue-600",
  "from-red-500 to-red-600",
  "from-green-500 to-green-600",
  "from-yellow-500 to-yellow-600",
  "from-purple-500 to-purple-600",
  "from-pink-500 to-pink-600",
  "from-orange-500 to-orange-600",
  "from-cyan-500 to-cyan-600",
];

const MultiplayerRace = () => {
  const [gameMode, setGameMode] = useState<GameMode>('lobby');
  const [playerName, setPlayerName] = useState("Player");
  const [roomCode, setRoomCode] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [raceText, setRaceText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [racers, setRacers] = useState<Racer[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [botCount, setBotCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [lastKeyCorrect, setLastKeyCorrect] = useState(true);
  const [isBattleRoyale, setIsBattleRoyale] = useState(false);
  const [eliminationTimer, setEliminationTimer] = useState<number>(15);
  const [eliminationCycle, setEliminationCycle] = useState(0);
  const [wordCompletedTrigger, setWordCompletedTrigger] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound, playErrorSound } = useKeyboardSounds();
  const { userStats } = useGamification();
  const { saveResult } = useRaceHistory();

  const equippedSound = (userStats.equippedCosmetics?.sound?.replace('sound_', '') || 'mechanical') as SoundType;

  // Generate room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create player
  const createPlayer = (name: string, isBot: boolean = false): Racer => ({
    id: Math.random().toString(36).substring(7),
    name,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    progress: 0,
    wpm: 0,
    accuracy: 100,
    isBot,
    finished: false,
  });

  // Difficulty configurations with WPM ranges and consistency
  const difficultyConfig = {
    easy: { minWpm: 25, maxWpm: 45, consistency: 0.7, label: "Easy", color: "text-green-500" },
    medium: { minWpm: 45, maxWpm: 70, consistency: 0.8, label: "Medium", color: "text-yellow-500" },
    hard: { minWpm: 70, maxWpm: 100, consistency: 0.85, label: "Hard", color: "text-orange-500" },
    expert: { minWpm: 100, maxWpm: 140, consistency: 0.9, label: "Expert", color: "text-red-500" },
  };

  // Create bots with varying speeds based on difficulty
  const createBots = (count: number): Racer[] => {
    const usedNames: string[] = [];
    const config = difficultyConfig[difficulty];

    return Array.from({ length: count }, (_, i) => {
      let name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      while (usedNames.includes(name)) {
        name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      }
      usedNames.push(name);

      // Each bot gets a target WPM within the difficulty range
      const targetWpm = config.minWpm + Math.random() * (config.maxWpm - config.minWpm);

      const bot = createPlayer(name, true);
      return { ...bot, targetWpm, consistency: config.consistency };
    });
  };

  // Start a practice race with bots
  const startPracticeRace = () => {
    const text = RACE_TEXTS[Math.floor(Math.random() * RACE_TEXTS.length)];
    setRaceText(text);
    setUserInput("");

    const player = createPlayer(playerName || "Player");
    const bots = createBots(botCount);
    setRacers([player, ...bots]);

    setRoomCode(generateRoomCode());
    setGameMode('countdown');
    setCountdown(3);
  };

  // Placeholder for channel state (assuming it will be added for multiplayer)
  const [channel, setChannel] = useState<any>(null);

  // Cloud real-time channel logic removed for database-free system
  useEffect(() => {
    if (!roomCode) return;

    // In local-only mode, we just simulate joining a room
    // For actual multiplayer, a peer-to-peer or local server solution would be needed
    toast.info(`Local Lobby Joined: ${roomCode}`);
  }, [roomCode]);

  // Broadcast own progress (Disabled in local-only mode)
  const broadcastProgress = useCallback((player: Racer) => {
    // No-op in database-free system
  }, []);

  // Countdown timer
  useEffect(() => {
    if (gameMode === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameMode('racing');
        setStartTime(Date.now());
        inputRef.current?.focus();
      }
    }
  }, [gameMode, countdown]);

  // Race timer
  useEffect(() => {
    if (gameMode === 'racing' && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameMode, startTime]);

  // Bot simulation with realistic WPM-based progress
  useEffect(() => {
    if (gameMode === 'racing' && startTime) {
      botTimerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - startTime) / 60000;

        setRacers(prev => prev.map(racer => {
          if (!racer.isBot || racer.finished) return racer;

          // Get bot's target WPM and consistency
          const botData = racer as Racer & { targetWpm?: number; consistency?: number };
          const targetWpm = botData.targetWpm || 50;
          const consistency = botData.consistency || 0.8;

          // Add some randomness based on consistency (higher consistency = less variance)
          const variance = (1 - consistency) * 0.3;
          const randomFactor = 1 + (Math.random() - 0.5) * variance;
          const currentWpm = Math.round(targetWpm * randomFactor);

          // Calculate expected characters typed based on WPM
          // WPM = words per minute, average word = 5 chars
          const expectedChars = (currentWpm * 5 * elapsedMinutes);
          const newProgress = Math.min(100, (expectedChars / raceText.length) * 100);

          if (newProgress >= 100 && !racer.finished) {
            return {
              ...racer,
              progress: 100,
              wpm: currentWpm,
              finished: true,
              finishTime: currentTime
            };
          }

          return { ...racer, progress: newProgress, wpm: currentWpm };
        }));
      }, 100);

      return () => {
        if (botTimerRef.current) clearInterval(botTimerRef.current);
      };
    }
  }, [gameMode, startTime, raceText.length]);

  // Battle Royale Elimination Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'racing' && isBattleRoyale) {
      interval = setInterval(() => {
        setEliminationTimer(prev => {
          if (prev <= 1) {
            // Elimination Moment
            setRacers(currentRacers => {
              const activeRacers = currentRacers.filter(r => !r.isEliminated && !r.finished);
              if (activeRacers.length <= 1) return currentRacers;

              // Find racer with minimum progress
              const minProgress = Math.min(...activeRacers.map(r => r.progress));
              const racerToEliminate = activeRacers.find(r => r.progress === minProgress);

              if (racerToEliminate) {
                toast.error(`${racerToEliminate.name} ELIMINATED!`, {
                  description: "Too slow for the Battle Royale zone!",
                  icon: "💀"
                });
                return currentRacers.map(r =>
                  r.id === racerToEliminate.id ? { ...r, isEliminated: true } : r
                );
              }
              return currentRacers;
            });
            setEliminationCycle(c => c + 1);
            return 15; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, isBattleRoyale]);

  // Handle user input
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameMode !== 'racing') return;

    const value = e.target.value;
    const player = racers.find(r => !r.isBot);
    if (player?.isEliminated) return;

    const lastChar = value[value.length - 1];
    const expectedChar = raceText[value.length - 1];

    // Play sound feedback
    if (lastChar === expectedChar) {
      playSound(undefined, true); // Uses equipped sound from hook automatically now
      setLastPressedKey(lastChar);
      setLastKeyCorrect(true);

      // Trigger particles on word completion
      if (lastChar === ' ') {
        setWordCompletedTrigger(prev => prev + 1);
      }
    } else if (value.length > userInput.length) {
      playErrorSound(undefined);
      setLastPressedKey(lastChar);
      setLastKeyCorrect(false);
    }

    setUserInput(value);

    // Calculate progress
    const progress = (value.length / raceText.length) * 100;

    // Calculate WPM
    const timeInMinutes = elapsedTime / 60000;
    const wordsTyped = value.trim().split(/\s+/).length;
    const wpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === raceText[i]) correctChars++;
    }
    const accuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;

    // Update player
    setRacers(prev => prev.map(racer => {
      if (!racer.isBot) {
        const finished = value === raceText;
        const updatedPlayer = {
          ...racer,
          progress: Math.min(100, progress),
          wpm,
          accuracy,
          finished,
          finishTime: finished ? Date.now() : undefined
        };

        // Broadcast to others
        broadcastProgress(updatedPlayer);

        return updatedPlayer;
      }
      return racer;
    }));

    // Check if player finished
    if (value === raceText) {
      endRace();
    }
  }, [gameMode, raceText, elapsedTime]);

  // End race
  const endRace = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (botTimerRef.current) clearInterval(botTimerRef.current);

    // Calculate positions and save result
    setRacers(prev => {
      const sorted = [...prev].sort((a, b) => {
        if (a.finished && !b.finished) return -1;
        if (!a.finished && b.finished) return 1;
        if (a.finished && b.finished) {
          return (a.finishTime || 0) - (b.finishTime || 0);
        }
        return b.progress - a.progress;
      });

      const withPositions = sorted.map((racer, index) => ({
        ...racer,
        position: index + 1
      }));

      // Save player result to leaderboard
      const player = withPositions.find(r => !r.isBot);
      if (player && startTime) {
        const finishTimeSeconds = player.finishTime
          ? (player.finishTime - startTime) / 1000
          : elapsedTime / 1000;

        saveResult({
          playerName: player.name,
          wpm: player.wpm,
          accuracy: player.accuracy,
          position: player.position || 1,
          finishTime: finishTimeSeconds,
          difficulty,
          botCount,
        });
      }

      return withPositions;
    });

    setGameMode('results');
  }, [startTime, elapsedTime, difficulty, botCount, saveResult]);

  // Check if all racers finished
  useEffect(() => {
    if (gameMode === 'racing') {
      const allFinished = racers.every(r => r.finished);
      if (allFinished) {
        endRace();
      }
    }
  }, [racers, gameMode, endRace]);

  // Restart race
  const restartRace = () => {
    setGameMode('lobby');
    setUserInput("");
    setElapsedTime(0);
    setStartTime(null);
    setRacers([]);
    setEliminationTimer(15);
    setEliminationCycle(0);
  };

  // Render lobby
  const renderLobby = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Multiplayer Race
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Compete against others in real-time typing races!
          </p>
        </div>

        <Tabs defaultValue="race" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="race" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Battle Arena
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="race" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Practice Race */}
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Race
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Race against AI opponents to practice your speed!
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Your Name</label>
                      <Input
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Number of Opponents</label>
                      <div className="flex gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map(num => (
                          <Button
                            key={num}
                            variant={botCount === num ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBotCount(num)}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center justify-between">
                        <span>Game Mode</span>
                        {isBattleRoyale && <Badge variant="destructive" className="animate-pulse">SUDDEN DEATH</Badge>}
                      </label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant={!isBattleRoyale ? 'default' : 'outline'}
                          onClick={() => setIsBattleRoyale(false)}
                          className="flex-1"
                        >
                          <Car className="w-4 h-4 mr-2" /> Race
                        </Button>
                        <Button
                          size="sm"
                          variant={isBattleRoyale ? 'destructive' : 'outline'}
                          onClick={() => setIsBattleRoyale(true)}
                          className="flex-1"
                        >
                          <Sword className="w-4 h-4 mr-2" /> Battle Royale
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">AI Difficulty</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(['easy', 'medium', 'hard', 'expert'] as const).map(d => {
                          const config = difficultyConfig[d];
                          return (
                            <Button
                              key={d}
                              variant={difficulty === d ? "default" : "outline"}
                              size="sm"
                              onClick={() => setDifficulty(d)}
                              className="flex-col h-auto py-2 px-3"
                            >
                              <span className={`font - semibold ${config.color} `}>{config.label}</span>
                              <span className="text-xs opacity-70">{config.minWpm}-{config.maxWpm} WPM</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={startPracticeRace}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Race
                  </Button>
                </CardContent>
              </Card>

              {/* Multiplayer Room */}
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Join Room
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Enter a room code to join a multiplayer race!
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Your Name</label>
                      <Input
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Room Code</label>
                      <Input
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        placeholder="Enter room code"
                        className="mt-1 uppercase"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!roomCode || roomCode.length < 6}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Room
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Create New Room
                  </Button>

                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      Coming soon with Cloud integration!
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">Focus on Accuracy</h3>
                    <p className="text-sm text-muted-foreground">Mistakes slow you down more than careful typing</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Keyboard className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold">Proper Posture</h3>
                    <p className="text-sm text-muted-foreground">Keep fingers on home row for faster typing</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-semibold">Look Ahead</h3>
                    <p className="text-sm text-muted-foreground">Read upcoming words while typing current ones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <RaceLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Render countdown
  const renderCountdown = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h2 className="text-2xl font-bold text-muted-foreground">Get Ready!</h2>
        <div className="relative">
          <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-7xl font-bold text-white">{countdown}</span>
          </div>
          <div className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-4 border-primary/30 animate-ping" />
        </div>
        <p className="text-lg text-muted-foreground">
          Room: <span className="font-mono font-bold">{roomCode}</span>
        </p>

        {/* Show racers */}
        <div className="flex justify-center gap-4 flex-wrap">
          {racers.map((racer, index) => (
            <div key={racer.id} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
              <span className="text-2xl">{racer.avatar}</span>
              <span className="font-medium">{racer.name}</span>
              {racer.isBot && <Badge variant="secondary" className="text-xs">Bot</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render racing
  const renderRacing = () => {
    const player = racers.find(r => !r.isBot);
    const activeRacers = racers.filter(r => !r.isEliminated && !r.finished);
    const isWinner = isBattleRoyale && activeRacers.length === 1 && player && !player.isEliminated;
    const currentIndex = userInput.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {isBattleRoyale && (
            <EliminationUI
              timer={eliminationTimer}
              isEliminated={!!player?.isEliminated}
              cycle={eliminationCycle}
              totalPlayers={racers.length}
              activePlayers={activeRacers.length}
              isWinner={!!isWinner}
            />
          )}
          {/* Race Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Timer className="w-4 h-4 mr-2" />
                {(elapsedTime / 1000).toFixed(1)}s
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-purple-600">
                Room: {roomCode}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">WPM</div>
                <div className="text-2xl font-bold text-primary">{player?.wpm || 0}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div className="text-2xl font-bold text-green-500">{player?.accuracy || 100}%</div>
              </div>
            </div>
          </div>

          {/* Race Track */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Race Track
                </h3>
                <span className="text-sm text-muted-foreground">
                  {racers.filter(r => r.finished).length}/{racers.length} finished
                </span>
              </div>

              <div className="space-y-3">
                {racers.sort((a, b) => b.progress - a.progress).map((racer, index) => (
                  <div key={racer.id} className="relative">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-6 text-center font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-xl">{racer.avatar}</span>
                      <span className={`font - medium ${!racer.isBot ? 'text-primary' : ''} `}>
                        {racer.name}
                        {!racer.isBot && <Badge className="ml-2" variant="secondary">You</Badge>}
                      </span>
                      <span className="ml-auto text-sm font-mono">
                        {racer.wpm} WPM
                      </span>
                      {racer.finished && (
                        <Badge className="bg-green-500">
                          <Trophy className="w-3 h-3 mr-1" />
                          Finished
                        </Badge>
                      )}
                      {racer.isEliminated && (
                        <Badge variant="destructive" className="bg-destructive">
                          <Skull className="w-3 h-3 mr-1" />
                          Eliminated
                        </Badge>
                      )}
                    </div>

                    <div className="relative h-8 bg-muted/50 rounded-full overflow-hidden border">
                      {/* Danger Zone Overlay for Battle Royale */}
                      {isBattleRoyale && (
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-destructive/10 border-r-2 border-destructive/30 backdrop-blur-[1px] z-0 transition-all duration-1000"
                          initial={{ width: "0%" }}
                          animate={{ width: `${Math.min(95, (eliminationCycle * 10))}%` }}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 text-[8px] font-black text-destructive/60 scale-75 uppercase">
                            <AlertTriangle className="w-2 h-2" /> Danger
                          </div>
                        </motion.div>
                      )}

                      {/* Track markings */}
                      <div className="absolute inset-0 flex">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex-1 border-r border-dashed border-muted-foreground/20" />
                        ))}
                      </div>

                      {/* Racer car */}
                      <motion.div
                        className={cn(
                          "absolute top-0 h-full z-10 flex items-center transition-all duration-200",
                          racer.isEliminated && "opacity-40 grayscale blur-[0.5px]"
                        )}
                        initial={{ left: "0%" }}
                        animate={{
                          left: `${Math.min(racer.progress, 95)}%`,
                          scale: racer.isEliminated ? 0.8 : racer.finished ? 1.2 : 1
                        }}
                        transition={{ type: "spring", stiffness: 50 }}
                      >
                        <div className={cn(
                          "px-3 py-1 rounded-full bg-gradient-to-r text-white font-bold text-sm shadow-lg transform -translate-x-1/2",
                          CAR_COLORS[index % CAR_COLORS.length]
                        )}>
                          {racer.avatar}
                        </div>
                        {racer.isEliminated && (
                          <Skull className="absolute -top-4 left-0 w-4 h-4 text-destructive animate-bounce" />
                        )}
                      </motion.div>

                      {/* Finish line */}
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-checkered-flag" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typing Area */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Text to type */}
              <div className="p-4 bg-muted/30 rounded-lg select-none min-h-[120px]">
                <TypingDisplay
                  text={raceText}
                  userInput={userInput}
                  currentIndex={currentIndex}
                  particleTrigger={wordCompletedTrigger}
                />
              </div>

              {/* Input field */}
              <Input
                ref={inputRef}
                value={userInput}
                onChange={handleInput}
                placeholder="Start typing..."
                className="text-lg font-mono h-14"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{userInput.length} / {raceText.length} characters</span>
                <span>{Math.round((userInput.length / raceText.length) * 100)}% complete</span>
              </div>

              {/* Virtual Keyboard Guidance */}
              <div className="pt-8 border-t border-border/50">
                <VirtualKeyboard
                  currentChar={raceText[userInput.length]}
                  pressedKey={lastPressedKey || undefined}
                  isCorrect={lastKeyCorrect}
                  showFingerGuide={true}
                  showHandGestures={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const sortedRacers = [...racers].sort((a, b) => (a.position || 99) - (b.position || 99));
    const player = racers.find(r => !r.isBot);
    const playerPosition = player?.position || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {playerPosition === 1 ? (
                <div className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-bounce">
                  <Crown className="w-16 h-16 text-white" />
                </div>
              ) : playerPosition <= 3 ? (
                <div className="p-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full">
                  <Medal className="w-16 h-16 text-white" />
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-br from-primary to-purple-600 rounded-full">
                  <Flag className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold">
              {playerPosition === 1 ? "🎉 Victory!" :
                playerPosition <= 3 ? "🏆 Great Job!" : "Race Complete!"}
            </h1>
            <p className="text-xl text-muted-foreground">
              You finished in <span className="font-bold text-primary">#{playerPosition}</span> place!
            </p>
          </div>

          {/* Player Stats / Share Card */}
          <Card className="border-2 border-primary/50 overflow-hidden">
            <div className="bg-primary/5 p-2 text-center text-xs font-bold uppercase tracking-widest text-primary">
              Viral Result Card
            </div>
            <CardContent className="p-6">
              <ViralShareCard
                wpm={player?.wpm || 0}
                accuracy={player?.accuracy || 100}
                rank={`#${playerPosition} Place`}
                username={playerName}
                isBattleRoyale={isBattleRoyale}
                defeatedPlayers={racers.length - playerPosition}
              />
            </CardContent>
          </Card>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Race Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedRacers.map((racer, index) => (
                  <div key={racer.id} className={`flex items - center gap - 4 p - 4 rounded - lg ${!racer.isBot ? 'bg-primary/10 border-2 border-primary/30' : 'bg-muted/50'} `}>
                    <div className={`w - 10 h - 10 rounded - full flex items - center justify - center text - lg font - bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-600 text-white' : 'bg-muted text-muted-foreground'} `}>
                      {index + 1}
                    </div>
                    <span className="text-2xl">{racer.avatar}</span>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {racer.name}
                        {!racer.isBot && <Badge>You</Badge>}
                        {racer.isBot && <Badge variant="outline" className="text-xs">Bot</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {racer.wpm} wpm • {racer.accuracy}% acc
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={startPracticeRace} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600">
              <RefreshCw className="w-5 h-5 mr-2" />
              Race Again
            </Button>
            <Button onClick={() => setGameMode('lobby')} variant="outline" size="lg">
              Back to Lobby
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  switch (gameMode) {
    case 'lobby':
      return renderLobby();
    case 'countdown':
      return renderCountdown();
    case 'racing':
      return renderRacing();
    case 'results':
      return renderResults();
    default:
      return renderLobby();
  }
};

export default MultiplayerRace;
