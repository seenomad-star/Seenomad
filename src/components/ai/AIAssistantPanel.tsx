
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiService } from "@/services/ai/AIService";
import { AIModel } from "@/services/ai/types";
import { Bot, Send, User, Loader2, Sparkles, Settings2 } from "lucide-react";
import { cn } from "@/utils/utils";
import { AISettingsModal } from "./AISettingsModal";
import { LockedFeatureOverlay } from "@/components/subscription/LockedFeatureOverlay";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function AIAssistantPanel() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your AI typing assistant. How can I help you improve?", timestamp: Date.now() }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [models, setModels] = useState<AIModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadModels();
    }, [isSettingsOpen]); // Reload models when settings might have changed

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const loadModels = async () => {
        const available = await aiService.getAvailableModels();
        setModels(available);
        if (available.length > 0 && !selectedModel) {
            setSelectedModel(available[0].id);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedModel) return;

        const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await aiService.generateText({
                modelId: selectedModel,
                prompt: input,
                systemPrompt: "You are a helpful assistant for a typing practice website. Keep answers concise and motivating."
            });

            const aiMsg: Message = { role: 'assistant', content: response, timestamp: Date.now() };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            const errorMsg: Message = {
                role: 'assistant',
                content: `Error: ${error.message || "Failed to generate response."}`,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LockedFeatureOverlay featureName="AI Assistant" description="Get unlimited access to your personal AI typing coach.">
            <div className="flex flex-col h-[500px] w-[350px] bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-3 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-1.5 rounded-lg">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-semibold text-sm">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="h-7 w-[140px] text-xs">
                                <SelectValue placeholder="Select Model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.length === 0 ? (
                                    <div className="p-2 text-xs text-muted-foreground text-center">No configured models</div>
                                ) : (
                                    models.map(model => (
                                        <SelectItem key={model.id} value={model.id} className="text-xs">
                                            {model.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsSettingsOpen(true)}>
                            <Settings2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                <AISettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex gap-3 text-sm",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className={cn(
                                    "px-3 py-2 rounded-lg max-w-[80%]",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted/50 border border-border rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="bg-muted/50 border border-border px-3 py-2 rounded-lg rounded-tl-none flex items-center">
                                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-border bg-background">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 h-9 text-sm"
                            disabled={models.length === 0}
                        />
                        <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !input.trim() || models.length === 0}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    {models.length === 0 && (
                        <p className="text-[10px] text-destructive mt-1 text-center">
                            Please configure an AI provider in settings to chat.
                        </p>
                    )}
                </div>
            </div>
        </LockedFeatureOverlay>
    );
}
