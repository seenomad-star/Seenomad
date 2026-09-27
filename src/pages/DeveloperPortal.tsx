
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Terminal, Book, Cpu, Copy, Check, Play, Database, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DeveloperPortal() {
    const [apiKey] = useState("ty_live_" + Math.random().toString(36).substring(7));
    const [copied, setCopied] = useState(false);

    const copyKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        toast.success("API Key copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const ENDPOINTS = [
        { method: 'GET', path: '/v1/user/stats', desc: 'Retrieve current professional metrics' },
        { method: 'POST', path: '/v1/clans/broadcast', desc: 'Send an encrypted message to the clan shard' },
        { method: 'GET', path: '/v1/market/prices', desc: 'Real-time commodity valuation' }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                            <Cpu className="w-10 h-10 text-primary" /> The Forge <span className="text-primary/50 text-xl font-mono not-italic font-normal">API v1.0</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl text-lg font-medium">
                            The Neural Interface for TypingOS. Connect your external scripts, custom dashboards, and automation tools to the Nexus.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                            <Book className="w-4 h-4 mr-2" /> Documentation
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-background font-bold">
                            Request OAuth 2.0
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT: API KEY & STATUS */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-secondary/10 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Your Neural Key</CardTitle>
                                <CardDescription>Use this to authenticate your requests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={apiKey}
                                        className="font-mono text-xs bg-black/40 border-white/10"
                                    />
                                    <Button size="icon" variant="outline" onClick={copyKey}>
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                    <span>Status: <span className="text-emerald-400">Synchronized</span></span>
                                    <span>Rate: 100/min</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/20 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-black uppercase tracking-widest">System Health</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> API Gateway</span>
                                    <span className="font-mono text-emerald-400">99.9%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Neural Sync Shard</span>
                                    <span className="font-mono text-emerald-400">Operational</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Database Relays</span>
                                    <span className="font-mono text-yellow-500">Scheduled Maint.</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: EXPLORER & DOCS */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="endpoints" className="w-full">
                            <TabsList className="bg-white/5 p-1 mb-4">
                                <TabsTrigger value="endpoints" className="text-[10px] font-black uppercase tracking-widest">Endpoints</TabsTrigger>
                                <TabsTrigger value="playground" className="text-[10px] font-black uppercase tracking-widest">Playground</TabsTrigger>
                                <TabsTrigger value="webhooks" className="text-[10px] font-black uppercase tracking-widest">Webhooks</TabsTrigger>
                            </TabsList>

                            <TabsContent value="endpoints" className="space-y-4">
                                {ENDPOINTS.map((ep, i) => (
                                    <Card key={i} className="bg-white/[0.02] border-white/5 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4 p-4">
                                            <div className={ep.method === 'GET' ? 'text-blue-400 font-black' : 'text-emerald-400 font-black'}>
                                                {ep.method}
                                            </div>
                                            <div className="flex-1 font-mono text-sm opacity-80">{ep.path}</div>
                                            <div className="text-xs text-muted-foreground italic">{ep.desc}</div>
                                        </div>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="playground">
                                <Card className="bg-black border-white/10">
                                    <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                            </div>
                                            <span className="text-[10px] font-mono text-muted-foreground">bash --terminal</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="font-mono text-xs leading-relaxed">
                                            <p className="text-emerald-400">$ curl -X GET https://api.typingos.com/v1/user/stats \</p>
                                            <p className="text-emerald-400 ml-4">-H "Authorization: Bearer <span className="text-white">{apiKey}</span>"</p>
                                            <br />
                                            <p className="text-white opacity-40">{"{"}</p>
                                            <p className="text-white opacity-80 ml-4">"status": "success",</p>
                                            <p className="text-white opacity-80 ml-4">"data": {"{"}</p>
                                            <p className="text-white opacity-80 ml-8">"username": "User_42",</p>
                                            <p className="text-white opacity-80 ml-8">"wpm_avg": 84.5,</p>
                                            <p className="text-white opacity-80 ml-8">"rank": "Global Elite"</p>
                                            <p className="text-white opacity-80 ml-4">{"}"}</p>
                                            <p className="text-white opacity-40">{"}"}</p>
                                        </div>
                                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-xs">
                                            <Play className="w-3 h-3 mr-2" /> Execute Protocol
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="webhooks">
                                <Card className="bg-secondary/10 border-white/5 p-8 text-center space-y-4">
                                    <Database className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-bold">Neural Listeners (Webhooks)</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                        Subscribe to global events and receive real-time POST requests when significant achievements occur.
                                    </p>
                                    <Button disabled variant="outline" className="opacity-50">
                                        <ShieldCheck className="w-4 h-4 mr-2" /> Configure Endpoint
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground uppercase">Requires Pro Plus Subscription</p>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* BOTTOM CTA */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4 items-center">
                        <Code className="w-12 h-12 text-primary" />
                        <div>
                            <h4 className="text-xl font-bold">Build the Future of Professional Typing</h4>
                            <p className="text-sm text-muted-foreground italic">"Efficiency is the only currency that matters."</p>
                        </div>
                    </div>
                    <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-background font-black shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                        JOIN DEVELOPER DISCORD
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
