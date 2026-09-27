import { useState } from "react";
import { Trophy, Users, Clock, Coins, Zap, Crown, Timer, Target, Medal, Play, Calendar, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tournaments } from "@/data/enterpriseFeaturesData";
import { useEconomy } from "@/contexts/EconomyContext";
import { toast } from "sonner";
import { cn } from "@/utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TournamentSystem } from "@/components/multiplayer/TournamentSystem";
import { TournamentBracket } from "@/components/tournaments/TournamentBracket";
import Confetti from 'react-confetti';

export default function Tournaments() {
  const { wallet, stats, addCurrency, addXp } = useEconomy();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent p-12 overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Trophy className="w-64 h-64 text-amber-500" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Global Competition Hub</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest underline underline-offset-4 cursor-pointer hover:text-white transition-colors">Rules & Regulations</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            The <span className="text-primary">Grand</span> Arena
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
            Compete in scheduled high-stakes tournaments. Earn massive coin prizes, exclusive skins, and secure your place in the global Hall of Fame.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-widest text-xs rounded-2xl group">
              View My History
              <Medal className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
            <div className="flex items-center gap-3 px-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase"><span className="text-emerald-500">1,240+</span> Competing now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tournament Interface */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-2">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            {[
              { id: "all", label: "All Events", icon: Trophy },
              { id: "registered", label: "Registered", icon: Calendar },
              { id: "completed", label: "Hall of Fame", icon: Crown },
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "relative bg-transparent border-0 p-0 text-sm font-black uppercase tracking-widest transition-all h-12",
                  "data-[state=active]:text-primary data-[state=active]:bg-transparent shadow-none",
                  "after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-primary after:transition-all hover:text-white/80",
                  "data-[state=active]:after:w-full"
                )}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Server Time: <span className="text-white">12:45 UTC</span></span>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <TournamentSystem />
        </TabsContent>

        <TabsContent value="registered" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This will eventually filter from real state */}
            <Card className="p-8 text-center bg-white/[0.02] border-white/5 rounded-3xl group cursor-pointer hover:border-primary/20 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-muted/20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <h3 className="font-black uppercase tracking-tight text-lg mb-2">No Active Entry</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                You haven't registered for any upcoming events. Join a tournament to start your climb.
              </p>
              <Button variant="outline" className="h-10 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={() => setActiveTab('all')}>
                Browse Events
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="space-y-6">
            <div className="p-12 text-center bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] border border-white/5">
              <Crown className="w-16 h-16 text-amber-500/20 mx-auto mb-6" />
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Hall of Fame</h2>
              <p className="max-w-md mx-auto text-sm text-muted-foreground mt-4">
                The ultimate record of championship winners. Win a Grand Prix event to immortalize your name here.
              </p>
            </div>
            {/* Mock leaderboard */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "NeonGod_88", prize: "50,000", date: "2 days ago", event: "Velocity GP" },
                { name: "BinaryGhost", prize: "25,000", date: "1 week ago", event: "Shadow Sprint" },
                { name: "CyberX", prize: "25,000", date: "2 weeks ago", event: "Shadow Sprint" },
              ].map((winner, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="w-8 text-xl font-black italic text-white/10">0{idx + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary">
                    {winner.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black uppercase">{winner.name}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase">{winner.event}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-amber-500">{winner.prize} C</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase">{winner.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Season Pass Info Footer */}
      <Card className="p-8 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-purple-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-10 h-10 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">Active Season: <span className="text-purple-500 underline">Neural Protocol</span></h3>
            <p className="text-sm text-muted-foreground">Each tournament win gives you <span className="text-white font-bold">+250 XP</span> towards your season pass.</p>
          </div>
        </div>
        <Button className="h-12 px-10 bg-purple-500 hover:bg-purple-600 font-black uppercase tracking-widest text-xs rounded-2xl group shadow-lg shadow-purple-500/20">
          Open Season Pass
          <Star className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform" />
        </Button>
      </Card>
    </div>
  );
}
