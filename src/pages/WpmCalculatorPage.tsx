import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const faqs = [
    {
        question: "How is WPM calculated in typing?",
        answer: "WPM (Words Per Minute) is calculated by taking the number of characters typed and dividing by 5 (the average word length including spaces). This total is then divided by the time taken in minutes."
    },
    {
        question: "Are errors included in WPM calculation?",
        answer: "Gross WPM includes all typed words, while Net WPM subtracts errors. Usually, 1 WPM is deducted for every uncorrected error in a 1-minute test."
    },
    {
        question: "What is a good WPM for data entry?",
        answer: "A good WPM for data entry is typically between 60 and 80 WPM with an accuracy rate of 98% or higher."
    }
];

export default function WpmCalculatorPage() {
    const [chars, setChars] = useState(250);
    const [errors, setErrors] = useState(2);
    const [minutes, setMinutes] = useState(1);

    const grossWpm = Math.round((chars / 5) / minutes) || 0;
    const netWpm = Math.max(0, Math.round(((chars / 5) - errors) / minutes)) || 0;
    const accuracy = chars > 0 ? Math.round(((chars - errors) / chars) * 100) : 100;

    return (
        <>
            <SEOHead
                title="WPM Calculator — Calculate Your Typing Speed & Accuracy"
                description="Use our free WPM calculator to find your typing speed and accuracy. Learn how WPM is calculated and see where you stand among professional typists."
                keywords="wpm calculator, typing speed calculator, calculate typing speed, words per minute calculator, typing accuracy calculator, net wpm vs gross wpm"
                url="https://typingos.com/wpm-calculator"
                faqs={faqs}
            />

            <div className="min-h-screen bg-background text-foreground">
                <div className="max-w-5xl mx-auto px-4 py-12">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Typing Speed (WPM) Calculator
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Quickly calculate your typing speed and accuracy using the industry-standard WPM formula.
                        </p>
                    </div>

                    {/* Calculator Tool */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <Card className="p-8 border-primary/20 bg-card/50">
                            <h2 className="text-xl font-bold mb-6">Enter Your Stats</h2>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Total Characters Typed</Label>
                                        <span className="font-mono text-primary font-bold">{chars}</span>
                                    </div>
                                    <Slider
                                        value={[chars]}
                                        onValueChange={(val) => setChars(val[0])}
                                        max={2000}
                                        step={1}
                                    />
                                    <Input
                                        type="number"
                                        value={chars}
                                        onChange={(e) => setChars(Number(e.target.value))}
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Number of Errors</Label>
                                        <span className="font-mono text-red-500 font-bold">{errors}</span>
                                    </div>
                                    <Slider
                                        value={[errors]}
                                        onValueChange={(val) => setErrors(val[0])}
                                        max={100}
                                        step={1}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Time Taken (Minutes)</Label>
                                        <span className="font-mono text-blue-500 font-bold">{minutes} min</span>
                                    </div>
                                    <Slider
                                        value={[minutes]}
                                        onValueChange={(val) => setMinutes(val[0])}
                                        max={10}
                                        step={0.5}
                                        min={0.5}
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Gross WPM", value: grossWpm, color: "text-foreground", desc: "Total speed including errors." },
                                { label: "Net WPM", value: netWpm, color: "text-primary", desc: "Your actual speed after deducting errors." },
                                { label: "Accuracy", value: `${accuracy}%`, color: "text-green-500", desc: "Percentage of correctly typed characters." },
                            ].map(res => (
                                <Card key={res.label} className="p-6 border-border flex items-center justify-between group hover:border-primary/30 transition-all">
                                    <div>
                                        <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{res.label}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{res.desc}</div>
                                    </div>
                                    <div className={`text-4xl font-black italic ${res.color}`}>{res.value}</div>
                                </Card>
                            ))}

                            <Link
                                to="/"
                                className="mt-4 w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all"
                            >
                                Test Your Speed Now →
                            </Link>
                        </div>
                    </div>

                    {/* Formula Section */}
                    <section className="mb-12 p-8 bg-muted/30 border border-border rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">How is WPM Calculated?</h2>
                        <p className="text-muted-foreground mb-6">
                            TypingOS uses the standard formula for calculating Words Per Minute (WPM):
                        </p>
                        <div className="bg-card p-6 rounded-xl border border-border font-mono text-sm space-y-2 mb-6">
                            <p className="text-primary">WPM = (Total Characters / 5) / Time in Minutes</p>
                            <p className="text-red-400">Net WPM = WPM - (Errors / Time in Minutes)</p>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            A "word" is defined as 5 characters, including spaces, punctuation, and digits. This standardization allows for accurate comparisons between different texts.
                        </p>
                    </section>

                    {/* Table of Scales */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Typing Speed Levels</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { range: "0 - 30 WPM", label: "Beginner", desc: "Looking at keys frequently." },
                                { range: "30 - 50 WPM", label: "Intermediate", desc: "Can touch-type basic words." },
                                { range: "50 - 80 WPM", label: "Advanced", desc: "Fluid professional typing." },
                                { range: "80+ WPM", label: "Expert", desc: "High-speed elite level." },
                            ].map(level => (
                                <div key={level.label} className="p-5 border border-border rounded-xl">
                                    <div className="font-bold text-primary mb-1">{level.range}</div>
                                    <div className="text-sm font-bold uppercase mb-2">{level.label}</div>
                                    <div className="text-xs text-muted-foreground">{level.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
