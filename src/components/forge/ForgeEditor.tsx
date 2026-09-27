import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    Hammer, Sparkles, Save, ArrowLeft, Type,
    AlignLeft, Layers, PenTool, BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGamification } from "@/contexts/GamificationContext";
import { toast } from "sonner";

const CATEGORIES = ["Literature", "Code", "Science", "History", "Fantasy", "Cyberpunk"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"];

const MOCK_AI_PROMPTS = [
    { label: "Cyberpunk Intro", text: "The neon rain slicked the streets of Neo-Tokyo as Kaito jacked into the mainframe. His cyber-deck hummed with raw energy, a lifeline in the digital void." },
    { label: "JavaScript Loop", text: "for (let i = 0; i < array.length; i++) { const element = array[i]; console.log(`Processing item ${i}:`, element); if (element.isValid) { process(element); } }" },
    { label: "Fantasy Quest", text: "The dragon's scales shimmered like molten gold under the cavern's torchlight. Eldric drew his sword, the ancient steel singing a song of battle." }
];

export default function ForgeEditor() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { publishMission } = useGamification();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Literature");
    const [difficulty, setDifficulty] = useState("Medium");
    const [isGenerating, setIsGenerating] = useState(false);

    const handlePublish = () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Missing Data", { description: "Please provide a title and content." });
            return;
        }

        publishMission({
            title,
            description: `A ${difficulty} ${category} mission created in The Forge.`,
            content,
            difficulty: difficulty as any,
            category,
            coverEmoji: "🔨", // Default for now
            isPublished: true
        });

        navigate("/marketplace");
    };

    const handleAIGenerate = () => {
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const random = MOCK_AI_PROMPTS[Math.floor(Math.random() * MOCK_AI_PROMPTS.length)];
            setContent(random.text);
            if (!title) setTitle(random.label);
            setIsGenerating(false);
            toast.success("AI Content Generated", { description: "Adjust the text as needed!" });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/marketplace")}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Hammer className="w-8 h-8 text-primary" />
                                The Forge
                            </h1>
                            <p className="text-muted-foreground">Mint your own legacy.</p>
                        </div>
                    </div>
                    <Button onClick={handlePublish} size="lg" className="bg-primary text-background font-black uppercase tracking-widest gap-2">
                        <Save className="w-4 h-4" /> Publish Mission
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Metadata Column */}
                    <div className="space-y-6">
                        <Card className="bg-secondary/10 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Mission Title..."
                                            className="pl-9"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Category</label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Difficulty</label>
                                    <Select value={difficulty} onValueChange={setDifficulty}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Tools */}
                        <Card className="bg-purple-500/10 border-purple-500/20">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4" /> AI Assistant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    className="w-full border-purple-500/30 hover:bg-purple-500/20 text-purple-300"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4 mr-2" />
                                    )}
                                    {isGenerating ? "Dreaming..." : "Generate Content"}
                                </Button>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                    Uses Neural Fabriction Engine v1.0
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editor Column */}
                    <div className="md:col-span-2 space-y-4">
                        <Card className="h-full bg-secondary/5 border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Content
                                </CardTitle>
                                <Badge variant="outline" className="font-mono text-[10px]">
                                    {content.length} chars
                                </Badge>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <Textarea
                                    className="h-full font-mono text-lg leading-relaxed resize-none bg-transparent border-none focus-visible:ring-0 p-0"
                                    placeholder="Type your mission text here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/10 p-3 rounded-lg border border-white/5">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            <span>Pro Tip: Use complex punctuation to increase difficulty rating automatically.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
