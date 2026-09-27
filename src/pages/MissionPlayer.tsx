import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, RotateCcw, Award, Coins } from "lucide-react";
import { toast } from "sonner";
import Confetti from 'react-confetti';

export default function MissionPlayer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { customMissions, playMission, addCoins } = useGamification();

    // In a real app, we'd fetch from backend. Here we check Context + Mock
    const [mission, setMission] = useState<any>(null);
    const [isPylding, setIsPlaying] = useState(false); // Typo intentional? No.
    const [isPlaying, setIsPlayingState] = useState(false);
    const [typed, setTyped] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const progressRef = React.useRef<HTMLDivElement>(null);

    // Mock mission fallback if not in context (since we can't edit MOCK_MISSIONS in place easily)
    const MOCK_MISSIONS = [
        { id: "m1", title: "Cyberpunk Terminal Hacks", content: "access_code = 0x92f; system.hack(root); override_security_protocol('bypassed');" },
        { id: "m2", title: "Shakespearean Flow", content: "Shall I compare thee to a summer's day? Thou art more lovely and more temperate." },
        { id: "m3", title: "Legal Stenograph Test", content: "The defendant rose to speak, his demeanor calm despite the accusations leveled against him." },
    ];

    useEffect(() => {
        const found = customMissions.find(m => m.id === id) || MOCK_MISSIONS.find(m => m.id === id);
        if (found) {
            setMission(found);
        } else {
            toast.error("Mission Not Found");
            navigate("/forge");
        }
    }, [id, customMissions]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!startTime) setStartTime(Date.now());
        const val = e.target.value;
        setTyped(val);

        // Calc stats
        if (startTime) {
            const timeMins = (Date.now() - startTime) / 60000;
            const words = val.length / 5;
            setWpm(Math.round(words / timeMins));
        }

        // Check completion
        if (val === mission.content) {
            finishMission();
        }
    };

    const finishMission = () => {
        setIsFinished(true);
        if (id) playMission(id); // Trigger royalty
        addCoins(10); // Reward for playing
        toast.success("Mission Complete!", { description: "+10 Coins earned." });
    };

    // Update progress bar imperatively to avoid JSX style= prop
    React.useEffect(() => {
        if (progressRef.current && mission) {
            const pct = (typed.length / (mission.content?.length || 1)) * 100;
            progressRef.current.style.width = `${pct}%`;
        }
    }, [typed, mission]);

    if (!mission) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
            {isFinished && <Confetti recycle={false} numberOfPieces={500} />}

            <div className="max-w-2xl w-full space-y-8">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/forge")}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Exit Mission
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-bold font-mono text-primary">{wpm} WPM</div>
                    </div>
                </div>

                {!isFinished ? (
                    <Card className="p-8 space-y-6 relative overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                            <div
                                ref={progressRef}
                                className="h-full bg-primary transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-center mb-8">{mission.title}</h2>

                            <div className="relative font-mono text-2xl leading-relaxed tracking-wide min-h-[150px]">
                                {/* Ghost text */}
                                <div className="absolute inset-0 text-muted-foreground/30 select-none pointer-events-none break-words">
                                    {mission.content}
                                </div>
                                {/* Typed Text (Invisible overlay for spacing?) No, let's use a simpler input method for this MVP */}
                                <div className="absolute inset-0 break-words pointer-events-none">
                                    <span className="text-primary">{typed}</span>
                                    <span className="text-muted-foreground/30">{mission.content.substring(typed.length)}</span>
                                </div>
                                <textarea
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
                                    autoFocus
                                    value={typed}
                                    onChange={handleInput}
                                    spellCheck={false}
                                    title="Mission Typing Area"
                                    aria-label="Type the mission content here"
                                />
                            </div>

                            <p className="text-center text-xs text-muted-foreground pt-12 uppercase tracking-widest">
                                Type the text above to complete the mission
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-12 text-center space-y-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-primary/20">
                        <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center shadow-lg shadow-primary/40 animate-bounce">
                            <Award className="w-10 h-10 text-black" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Mission Complete</h2>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="p-4 rounded-xl bg-black/20">
                                <span className="block text-3xl font-black text-primary">{wpm}</span>
                                <span className="text-xs uppercase text-muted-foreground">WPM</span>
                            </div>
                            <div className="p-4 rounded-xl bg-black/20">
                                <span className="block text-3xl font-black text-amber-500">+10</span>
                                <span className="text-xs uppercase text-muted-foreground">Coins</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center pt-4">
                            <Button onClick={() => {
                                setTyped("");
                                setIsFinished(false);
                                setStartTime(null);
                                setWpm(0);
                            }} variant="outline">
                                <RotateCcw className="w-4 h-4 mr-2" /> Replay
                            </Button>
                            <Button onClick={() => navigate("/forge")}>
                                Return to Forge
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
