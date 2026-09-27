
import { Sparkles, Globe, Target, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdSlot } from "@/components/ads/AdSlot";

export default function About() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                        Thinking at the Speed of Light
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        TypingOS isn't just a typing tutor. It's a neural interface designed to synchronize your thought process with your digital output.
                    </p>
                </section>

                {/* Mission Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
                        <CardContent className="p-8 space-y-4">
                            <Target className="w-10 h-10 text-red-500" />
                            <h3 className="text-xl font-bold">Precision Logit</h3>
                            <p className="text-muted-foreground text-sm">
                                We believe in zero-latency expression. Our algorithms analyze micro-hesitations to optimize your cognitive flow.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
                        <CardContent className="p-8 space-y-4">
                            <Globe className="w-10 h-10 text-blue-500" />
                            <h3 className="text-xl font-bold">Global Standard</h3>
                            <p className="text-muted-foreground text-sm">
                                From classrooms in Tokyo to startups in Silicon Valley, TypingOS sets the gold standard for WPM certification.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-colors">
                        <CardContent className="p-8 space-y-4">
                            <Zap className="w-10 h-10 text-yellow-500" />
                            <h3 className="text-xl font-bold">Gamified Mastery</h3>
                            <p className="text-muted-foreground text-sm">
                                Learning shouldn't be a chore. We fuse RPG mechanics with neurological training for addictive skill-building.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Ad Placement: Hybrid Example */}
                <div className="space-y-4">
                    <AdSlot provider="google" slotId="about-top-google" className="max-w-4xl mx-auto" label="Premium Partner Content" />
                    <AdSlot provider="propeller" zoneId="about-mid-propeller" type="banner" className="max-w-4xl mx-auto" />
                </div>

                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Our DNA</span>
                        </div>
                        <h2 className="text-3xl font-bold">Built by Typists, for Typists</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Founded in 2024, TypingOS began as a small experiment: "Can we make typing feel like playing a high-stakes video game?"
                            <br /><br />
                            Today, we process over 5 million keystrokes daily. Our team of engineers, designers, and cognitive scientists works around the clock to push the boundaries of human-computer interaction.
                        </p>
                        <div className="pt-4">
                            <Link to="/jobs">
                                <Button variant="outline" className="gap-2">
                                    Join the Team <Zap className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                        <div className="text-9xl font-black text-primary/20 rotate-12 select-none">OS</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
