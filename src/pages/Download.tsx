import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Download as DownloadIcon, Apple, Monitor, Smartphone, Globe, Check, Zap, Share2, Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Download: React.FC = () => {
  const { toast } = useToast();
  const [xpClaimed, setXpClaimed] = useState(false);

  const handleClaimXP = () => {
    if (!xpClaimed) {
      setXpClaimed(true);
      toast({
        title: "500 XP Claimed!",
        description: "You're one step closer to the next level.",
      });
      // In a real app, you would call an API here
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText("Check out TypingOS! The ultimate typing OS.");
    toast({
      title: "Link Copied!",
      description: "Share it with your friends to unlock themes.",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 selection:bg-primary/30">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-12"
      >
        <div className="text-center space-y-6 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge variant="outline" className="text-primary border-primary/50 bg-primary/10 px-6 py-2 text-sm uppercase tracking-widest backdrop-blur-md">
              Note: Native Performance
            </Badge>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 drop-shadow-2xl">
            Download TypingOS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Experience the ultimate flow state.
            Native performance, offline support, and system-level integration.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            {!xpClaimed ? (
              <Button onClick={handleClaimXP} size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                <Zap className="w-5 h-5 fill-black" /> Claim 500 XP Reward
              </Button>
            ) : (
              <Button size="lg" variant="outline" className="border-green-500 text-green-500 gap-2 cursor-default">
                <Check className="w-5 h-5" /> Reward Claimed
              </Button>
            )}

            <Button onClick={handleShare} variant="secondary" size="lg" className="gap-2">
              <Share2 className="w-4 h-4" /> Share & Unlock Themes
            </Button>
          </div>
        </div>

        {/* Desktop Downloads */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div variants={item} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:border-primary/50 transition-all duration-300 shadow-2xl shadow-primary/5 group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Monitor className="w-32 h-32 text-primary/10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-primary text-primary-foreground font-bold">RECOMENDED</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-3xl font-black">
                  <Monitor className="w-8 h-8 text-primary" />
                  Windows
                </CardTitle>
                <CardDescription className="text-base">For Windows 10 & 11 (64-bit)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Native Notification Support
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Offline Mode Enabled
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Auto-updates & Cloud Sync
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button className="w-full gap-2 text-lg h-14 font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow" size="lg">
                  <DownloadIcon className="w-5 h-5" />
                  Download for Windows
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <Card className="relative overflow-hidden border-border/50 bg-card/50 hover:border-foreground/20 transition-all duration-300 shadow-xl group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Apple className="w-32 h-32 text-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-3xl font-black">
                  <Apple className="w-8 h-8" />
                  macOS
                </CardTitle>
                <CardDescription className="text-base">For macOS 11.0+ (Universal)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Apple Silicon Native
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Touch Bar Support
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Menu Bar Integration
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button variant="outline" className="w-full gap-2 text-lg h-14 font-bold border-2 hover:bg-foreground hover:text-background transition-colors">
                  <DownloadIcon className="w-5 h-5" />
                  Download for Mac
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <Card className="relative overflow-hidden border-border/50 bg-card/50 hover:border-foreground/20 transition-all duration-300 shadow-xl group h-full">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Globe className="w-32 h-32 text-foreground/5 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-3xl font-black">
                  <Monitor className="w-8 h-8" />
                  Linux
                </CardTitle>
                <CardDescription className="text-base">Debian, RPM & AppImage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Distro Agnostic
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> CLI Tools Included
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10"><Check className="w-3 h-3 text-green-500" /></div> Open Source
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button variant="outline" className="w-full gap-2 text-lg h-14 font-bold border-2 hover:bg-foreground hover:text-background transition-colors">
                  <DownloadIcon className="w-5 h-5" />
                  Download for Linux
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Mobile Section */}
        <motion.div variants={item} className="mt-16 bg-gradient-to-r from-muted/50 to-card rounded-[2.5rem] p-8 md:p-12 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1 bg-background/50 backdrop-blur">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9 Star Rating
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                TypingOS in your <br />
                <span className="text-primary">Pocket</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sync your stats, compete in daily lightning rounds, and keep your streak alive.
                The multiverse of typing is now mobile.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button className="h-16 px-8 gap-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl">
                  <Smartphone className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Download on</div>
                    <div className="text-lg font-black leading-none">App Store</div>
                  </div>
                </Button>
                <Button className="h-16 px-8 gap-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl">
                  <Smartphone className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">Get it on</div>
                    <div className="text-lg font-black leading-none">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>

            <motion.div
              whileHover={{ rotate: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative w-72 h-[550px] bg-[#1a1a1a] rounded-[3.5rem] border-[12px] border-[#2a2a2a] flex items-center justify-center p-4 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-[2.5rem] overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                      <Zap className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white">TypingOS</h3>
                    <div className="space-y-2 w-full">
                      <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4" />
                      </div>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Level 42</span>
                        <span>75%</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full rounded-full bg-white text-black font-bold">Play Now</Button>
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#2a2a2a] rounded-b-2xl" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Font Resources Section */}
        <motion.div variants={item} className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-bold">Pro Essentials</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight">Hindi & Regional Fonts</h2>
            <p className="text-lg text-muted-foreground">Standard fonts required for government exams and professional typing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-orange-500/20 bg-gradient-to-br from-background to-orange-500/5 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-3xl font-black border border-orange-500/20">
                    अ
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Devanagari (Unicode)</CardTitle>
                    <CardDescription className="text-base">Mangal, Aparajita, Kokila</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Standard for SSC & Railways</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Inscript Layout Supported</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Remington Gail Compatible</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 shadow-lg shadow-orange-500/20">
                  <DownloadIcon className="w-4 h-4" /> Download Pack (12MB)
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-background to-blue-500/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-3xl font-black border border-blue-500/20">
                    K
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Legacy Hindi (Kruti Dev)</CardTitle>
                    <CardDescription className="text-base">Kruti Dev 010, 016 & Devlys</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Required for State Exams (UP, Bihar)</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Remington Machine Layout</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Non-Unicode Standard</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-2 border-blue-500/20 text-blue-500 hover:bg-blue-500/10 font-bold h-12">
                  <DownloadIcon className="w-4 h-4" /> Download Pack (8MB)
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Download;
