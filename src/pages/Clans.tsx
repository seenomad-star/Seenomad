import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '@/contexts/GamificationContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Users, Shield, Trophy, Coins, Zap, MessageSquare,
    Crown, ExternalLink, LogOut, Plus, Search, Lock, Activity,
    Palette, Award, Settings, Swords
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/utils";

export default function Clans() {
    const {
        userStats, clans, userClan, clanChat,
        createClan, joinClan, leaveClan, donateToClan, sendClanMessage, updateClan
    } = useGamification();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newClanName, setNewClanName] = useState("");
    const [newClanTag, setNewClanTag] = useState("");
    const [msgText, setMsgText] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [clanChat]);

    const handleCreateWrapper = () => {
        if (createClan(newClanName, newClanTag, "🛡️", "A new legendary clan.")) {
            setIsCreateOpen(false);
        }
    };

    const handleDonate = () => {
        donateToClan(100);
    };

    const handleSendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msgText.trim()) return;
        sendClanMessage(msgText);
        setMsgText("");
    };

    // --- VIEW: DISCOVERY (Not in a Clan) ---
    if (!userClan) {
        return (
            <div className="min-h-screen bg-background p-6 md:p-12 selection:bg-primary/20">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Hero */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black uppercase tracking-tighter italic">
                                Clan <span className="text-primary">Dominion</span>
                            </h1>
                            <p className="text-muted-foreground text-xl max-w-2xl font-medium">
                                Join forces. Pool resources. Dominate the Global Wars.
                            </p>
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest bg-primary text-background hover:scale-105 transition-all">
                                    <Plus className="w-5 h-5 mr-2" /> Establish Clan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-white/5 sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="font-black uppercase tracking-widest text-xl">Establish New Clan</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Clan Name</label>
                                        <Input placeholder="e.g. Neon Strikers" value={newClanName} onChange={e => setNewClanName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Clan Tag (3-4 Chars)</label>
                                        <Input placeholder="NEON" maxLength={4} className="uppercase font-mono" value={newClanTag} onChange={e => setNewClanTag(e.target.value)} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                        <Coins className="w-3 h-3 text-amber-500" /> Cost: <span className="text-amber-500 font-bold">500 Coins</span>
                                    </p>
                                    <Button onClick={handleCreateWrapper} className="w-full font-black uppercase tracking-widest mt-2">
                                        Pay & Create
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Clan List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clans.map(clan => (
                            <motion.div key={clan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="group relative overflow-hidden bg-white/[0.02] border-white/5 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                                                {clan.logo}
                                            </div>
                                            <Badge variant="outline" className={cn(
                                                "uppercase font-black tracking-widest text-[10px]",
                                                clan.tier === 'Legendary' ? 'border-amber-500 text-amber-500' : 'border-white/10'
                                            )}>
                                                {clan.tier} Tier
                                            </Badge>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-black tracking-tight">{clan.name}</h3>
                                                <span className="text-muted-foreground font-mono text-xs">[{clan.tag}]</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{clan.description}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                                            <div className="text-center">
                                                <span className="block font-black text-lg">{clan.members.length}/{clan.maxMembers}</span>
                                                <span className="text-[9px] uppercase text-muted-foreground font-bold">Members</span>
                                            </div>
                                            <div className="text-center border-x border-white/5">
                                                <span className="block font-black text-lg">{clan.level}</span>
                                                <span className="text-[9px] uppercase text-muted-foreground font-bold">Level</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block font-black text-lg text-primary">{clan.warsWon}</span>
                                                <span className="text-[9px] uppercase text-muted-foreground font-bold">Wins</span>
                                            </div>
                                        </div>

                                        <Button onClick={() => joinClan(clan.id)} className="w-full bg-white/5 hover:bg-primary hover:text-background font-black uppercase tracking-widest text-xs h-12">
                                            Request Join
                                        </Button>
                                    </CardContent>

                                    {/* BG Decoration */}
                                    <div className="absolute -bottom-12 -right-12 text-[10rem] opacity-[0.02] font-black select-none pointer-events-none">
                                        {clan.tag}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW: CITADEL (In a Clan) ---
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 selection:bg-primary/20 h-screen overflow-hidden flex flex-col">
            <div className="flex-1 grid grid-cols-12 gap-6 h-full max-w-[1800px] mx-auto w-full">

                {/* LEFT: CLAN INFO & ROSTER */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
                    {/* Clan Header Card */}
                    <Card className="bg-gradient-to-b from-white/[0.05] to-transparent border-white/5 shrink-0">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-4xl shadow-xl border border-white/10 relative">
                                {userClan.logo}
                                <Badge className="absolute -bottom-3 bg-amber-500 text-black font-black uppercase tracking-widest text-[9px] border-none shadow-lg">
                                    Lvl {userClan.level}
                                </Badge>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight">{userClan.name}</h1>
                                <p className="text-muted-foreground font-mono text-xs">[{userClan.tag}] • {userClan.tier} Citadel</p>
                            </div>
                            <Button onClick={leaveClan} variant="ghost" size="sm" className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20 font-bold uppercase tracking-widest text-[10px]">
                                <LogOut className="w-3 h-3 mr-2" /> Leave Clan
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Roster */}
                    <Card className="flex-1 bg-white/[0.02] border-white/5 flex flex-col overflow-hidden min-h-0">
                        <CardHeader className="py-4 border-b border-white/5 px-6">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" /> Active Duty ({userClan.members.length})
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-0">
                            <div className="divide-y divide-white/5">
                                {userClan.members.map((member) => (
                                    <div key={member.userId} className="p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                                            {member.username[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">{member.username}</span>
                                                {member.userId === 'user-current' && <Badge variant="secondary" className="text-[9px] px-1 h-4">YOU</Badge>}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                {member.role} • <Trophy className="w-3 h-3 ml-1 inline text-amber-500" /> {member.contribution}
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* CENTER: TREASURY & WAR ROOM */}
                <div className="col-span-12 md:col-span-6 flex flex-col gap-6 h-full overflow-y-auto">
                    {/* Treasury Card */}
                    <Card className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Coins className="w-48 h-48" />
                        </div>
                        <CardContent className="p-8 relative z-10 flex items-center justify-between">
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                                    <Crown className="w-4 h-4" /> Clan Treasury
                                </h3>
                                <div className="text-5xl font-black tracking-tighter text-white">
                                    {userClan.treasury.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium max-w-xs pt-2">
                                    Pool funds to unlock 2x XP boosts and expand member slots.
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <Button onClick={handleDonate} size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest px-8 shadow-xl shadow-amber-500/20">
                                    Donate 100 <Coins className="w-4 h-4 ml-2" />
                                </Button>
                                <p className="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider">
                                    +10 XP / Donation
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* War Status */}
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-red-500/10 border-red-500/20 p-6 flex flex-col justify-between h-48 group cursor-pointer hover:bg-red-500/20 transition-all" onClick={() => (window.location.href = '/war-zone')}>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2 mb-2">
                                    <Swords className="w-4 h-4" /> Active War
                                </h3>
                                <p className="text-2xl font-black italic uppercase">VS Dark Matter</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>Dominance</span>
                                    <span className="text-red-400">48%</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[48%]" />
                                </div>
                                <Button size="sm" className="w-full mt-2 bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest text-[10px]">
                                    Enter War Zone
                                </Button>
                            </div>
                        </Card>

                        <Card className="bg-blue-500/10 border-blue-500/20 p-6 flex flex-col justify-between h-48">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4" /> Daily Streak
                                </h3>
                                <p className="text-2xl font-black italic uppercase">124 members Online</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-muted-foreground">Check-in daily to maintain the +5% XP Clan Buff.</p>
                                <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                                    Check In
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* TABS: FEED / CUSTOMIZATION / TROPHIES */}
                    <Tabs defaultValue="feed" className="flex-1 flex flex-col min-h-[400px]">
                        <TabsList className="bg-white/5 p-1 rounded-xl mb-4 self-start">
                            <TabsTrigger value="feed" className="text-[10px] font-black uppercase tracking-widest">Activity</TabsTrigger>
                            <TabsTrigger value="trophies" className="text-[10px] font-black uppercase tracking-widest">Trophy Room</TabsTrigger>
                            {userClan.members.find(m => m.userId === 'user-current')?.role === 'Leader' && (
                                <TabsTrigger value="custom" className="text-[10px] font-black uppercase tracking-widest">Customization</TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="feed" className="flex-1">
                            <Card className="h-full bg-white/[0.02] border-white/5 p-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Clan Activity Log</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-3 text-sm">
                                            <div className="w-1 h-full bg-white/10" />
                                            <div>
                                                <p className="font-bold">Glitch00 <span className="text-muted-foreground font-normal">donated 5000 coins.</span></p>
                                                <span className="text-[10px] text-muted-foreground uppercase">{i}h ago</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="trophies" className="flex-1">
                            <Card className="h-full bg-white/[0.02] border-white/5 p-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col items-center text-center gap-3">
                                    <Award className="w-10 h-10 text-amber-500" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-white">#1 Regional</div>
                                        <div className="text-[8px] font-black uppercase text-amber-500/70">Milestone</div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center gap-3 opacity-40">
                                    <Trophy className="w-10 h-10 text-primary" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-white">Global Conquest</div>
                                        <div className="text-[8px] font-black uppercase text-primary/70">Locked</div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center gap-3">
                                    <Shield className="w-10 h-10 text-blue-500" />
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-white">{userClan.warsWon} War Victories</div>
                                        <div className="text-[8px] font-black uppercase text-blue-500/70">Achievement</div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        <TabsContent value="custom" className="flex-1">
                            <Card className="h-full bg-white/[0.02] border-white/5 p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Citadel Identity</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {['🛡️', '⚡', '⚔️', '🔥', '💎', '🚀', '🌟', '🩸'].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => updateClan(userClan.id, { logo: emoji })}
                                                    className={cn(
                                                        "h-14 rounded-xl border flex items-center justify-center text-xl transition-all",
                                                        userClan.logo === emoji ? "border-primary bg-primary/20" : "border-white/5 hover:border-white/20"
                                                    )}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Clan Tag</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    defaultValue={userClan.tag}
                                                    className="uppercase font-mono font-black"
                                                    maxLength={4}
                                                    onBlur={(e) => updateClan(userClan.id, { tag: e.target.value.toUpperCase() })}
                                                />
                                                <Button size="icon" variant="outline"><Settings className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Banner Theme</label>
                                            <div className="flex gap-2">
                                                <div className="h-10 w-full rounded-xl bg-gradient-to-r from-primary to-purple-600 border border-white/10" />
                                                <Button variant="ghost" className="text-[10px] font-black uppercase">Change</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* RIGHT: CLAN CHAT */}
                <div className="col-span-12 md:col-span-3 flex flex-col h-full overflow-hidden">
                    <Card className="flex flex-col h-full bg-white/[0.02] border-white/5">
                        <CardHeader className="py-4 border-b border-white/5 px-4 bg-white/[0.02]">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-500" /> Comm Link
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {clanChat.map(msg => (
                                    <div key={msg.id} className={cn("flex flex-col gap-1", msg.sender === "You" ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed",
                                            msg.sender === "You" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-white/10 rounded-bl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider px-1">
                                            {msg.sender === "You" ? "Me" : msg.sender}
                                        </span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                        </ScrollArea>
                        <form onSubmit={handleSendMsg} className="p-3 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex gap-2">
                                <Input
                                    className="bg-black/20 border-white/10 h-10 text-xs"
                                    placeholder="Type instructions..."
                                    value={msgText}
                                    onChange={e => setMsgText(e.target.value)}
                                />
                                <Button size="icon" className="h-10 w-10 shrink-0 bg-white/10 hover:bg-primary">
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

            </div>
        </div>
    );
}
