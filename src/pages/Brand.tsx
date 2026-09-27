
import { Download, Palette, Type, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Brand() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">Brand Assets</h1>
                        <p className="text-muted-foreground text-lg">Official resources for media, partners, and community creators.</p>
                    </div>
                    <Button size="lg" className="gap-2">
                        <Download className="w-5 h-5" />
                        Download Full Kit (ZIP)
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Logos */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <LayoutTemplate className="w-6 h-6 text-primary" />
                            Logomark
                        </h2>
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="p-12 bg-black/50 flex items-center justify-center border-b border-white/10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center border border-white/20 shadow-2xl">
                                    <div className="w-10 h-10 border-4 border-background rounded-full" />
                                </div>
                            </div>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-foreground">Primary Logomark</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG</p>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border overflow-hidden">
                            <div className="p-12 bg-white flex items-center justify-center border-b border-gray-200">
                                <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center shadow-xl">
                                    <div className="w-10 h-10 border-4 border-white rounded-full" />
                                </div>
                            </div>
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-foreground">Monochrome (Black)</p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG</p>
                                </div>
                                <Button variant="outline" size="sm">Download</Button>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Colors */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Palette className="w-6 h-6 text-primary" />
                            Color System
                        </h2>
                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                                <div className="w-16 h-16 rounded-lg bg-yellow-500 shadow-lg shadow-yellow-500/20" />
                                <div>
                                    <p className="font-bold">Electric Amber</p>
                                    <p className="font-mono text-xs text-muted-foreground">#EAB308</p>
                                    <p className="text-xs text-muted-foreground mt-1">Primary Accents, CTAs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                                <div className="w-16 h-16 rounded-lg bg-black border border-white/10" />
                                <div>
                                    <p className="font-bold">Void Black</p>
                                    <p className="font-mono text-xs text-muted-foreground">#09090B</p>
                                    <p className="text-xs text-muted-foreground mt-1">Backgrounds, UI Shell</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                                <div className="w-16 h-16 rounded-lg bg-slate-500" />
                                <div>
                                    <p className="font-bold">Neural Grey</p>
                                    <p className="font-mono text-xs text-muted-foreground">#64748B</p>
                                    <p className="text-xs text-muted-foreground mt-1">Secondary Text, Borders</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Typography */}
                <section className="space-y-6 pt-8 border-t border-border">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Type className="w-6 h-6 text-primary" />
                        Typography
                    </h2>
                    <div className="p-8 rounded-2xl bg-card border border-border space-y-8">
                        <div>
                            <h3 className="text-4xl font-black tracking-tighter">Inter Display</h3>
                            <p className="text-muted-foreground mt-2">Used for headlines, hero text, and brand moments.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-normal">Inter Variable</h3>
                            <p className="text-muted-foreground mt-2">Used for body copy, UI elements, and readability.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-mono">JetBrains Mono</h3>
                            <p className="text-muted-foreground mt-2">Used for code snippets, keystroke data, and technical readouts.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
