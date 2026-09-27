
import { PersonStanding, Ear, Eye, Keyboard, MousePointerClick } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Accessibility() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">

                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                        <PersonStanding className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Inclusive Design</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Typing for Everyone</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        TypingOS is committed to ensuring digital literacy is accessible to people of all abilities.
                    </p>
                </header>

                <section className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Visual Assistance</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    High contrast modes (Cyberpunk, Midnight), scalable typography, and screen-reader optimized ARIA labels throughout the OS interface.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <Keyboard className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Keyboard Navigation</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    Complete functionality without a mouse. Navigate menus, start tests, and configure settings using Tab, Arrows, and Command shortcuts (Cmd+K).
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="p-3 rounded-lg bg-card border border-border">
                                    <Ear className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Auditory Feedback</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    Stereo sound cues for typing rhythm, errors, and success states help users with visual impairments maintain flow.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Card className="bg-muted/30 border-none">
                        <CardContent className="p-8 space-y-6">
                            <h3 className="text-xl font-bold">Conformance Status</h3>
                            <p className="text-muted-foreground text-sm">
                                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities.
                            </p>
                            <p className="text-muted-foreground text-sm">
                                TypingOS is partially conformant with <span className="text-foreground font-bold">WCAG 2.1 level AA</span>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard, largely due to the highly visual/canvas-based nature of some arcade games.
                            </p>
                            <h3 className="text-xl font-bold pt-4">Feedback</h3>
                            <p className="text-muted-foreground text-sm">
                                We welcome your feedback on the accessibility of TypingOS. Please let us know if you encounter accessibility barriers:
                            </p>
                            <ul className="text-sm space-y-2 font-medium">
                                <li>E-mail: accessibility@typingos.com</li>
                                <li>Twitter: @TypingOS_A11y</li>
                            </ul>
                        </CardContent>
                    </Card>
                </section>

            </div>
        </div>
    );
}
