import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { TypingTestBox } from "@/components/typing/TypingTestBox";

const faqs = [
    {
        question: "What is a good typing speed in WPM?",
        answer: "The average typing speed is around 40 WPM. A good typing speed for professional use is 60–80 WPM. Expert typists and data entry professionals typically type at 80–100+ WPM. Competitive typists can exceed 120 WPM."
    },
    {
        question: "Is this typing speed test free?",
        answer: "Yes, TypingOS offers a completely free typing speed test online with no registration required. You can test your WPM and accuracy instantly."
    },
    {
        question: "How is WPM calculated?",
        answer: "WPM (Words Per Minute) is calculated by dividing the total number of characters typed by 5 (the average word length), then dividing by the number of minutes taken. Errors may also be subtracted depending on the test mode."
    },
    {
        question: "Can I practice for government exams like SSC or Railway?",
        answer: "Yes! TypingOS has dedicated exam modes for SSC CGL, SSC CHSL, Railway NTPC, and Banking exams. These simulate the official exam environment so you can practice under real conditions."
    },
    {
        question: "How long does it take to improve typing speed?",
        answer: "With consistent daily practice of 15–30 minutes, most people see significant improvement within 2–4 weeks. TypingOS's AI coach provides personalized drills targeting your specific weaknesses to accelerate improvement."
    },
    {
        question: "Does typing speed test work on mobile?",
        answer: "Yes, TypingOS is fully mobile-optimized and works on smartphones and tablets, though a physical keyboard gives the best experience for serious speed training."
    }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Typing Speed Test Online",
    "description": "Take a free typing speed test online. Measure your WPM and accuracy in real time. Practice for SSC, Railway, and Banking exams.",
    "url": "https://typingos.com/typing-speed-test",
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://typingos.com" },
            { "@type": "ListItem", "position": 2, "name": "Typing Speed Test", "item": "https://typingos.com/typing-speed-test" }
        ]
    }
};

export default function TypingSpeedTestPage() {
    return (
        <>
            <SEOHead
                title="Free Typing Speed Test Online — Check Your WPM Instantly"
                description="Take a free typing speed test online. Check your WPM and accuracy in real time. No sign-up required. Practice for SSC, Railway, and Banking exams with TypingOS."
                keywords="free typing speed test, typing speed test online, check typing speed, wpm test, online typing test, free wpm test, typing accuracy test"
                url="https://typingos.com/typing-speed-test"
                faqs={faqs}
                schema={schema}
            />

            <div className="min-h-screen bg-background text-foreground">
                <div className="max-w-5xl mx-auto px-4 py-12">

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Free Typing Speed Test Online
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Measure your typing speed in Words Per Minute (WPM) and accuracy instantly — no sign-up required.
                            Used by 100,000+ typists for exam prep, productivity, and personal improvement.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mt-6 mb-12">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
                            >
                                ⚡ Take the Free Test Now
                            </Link>
                            <Link
                                to="/wpm-calculator"
                                className="inline-flex items-center gap-2 border border-border px-8 py-3 rounded-lg font-semibold text-lg hover:bg-muted transition-colors"
                            >
                                📊 WPM Calculator
                            </Link>
                        </div>

                        {/* Interactive Typing Test Widget */}
                        <div className="max-w-4xl mx-auto mb-16">
                            <TypingTestBox />
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 mb-16 p-6 bg-card border border-border rounded-xl">
                        {[
                            { value: "100K+", label: "Tests Taken" },
                            { value: "40 WPM", label: "Average Speed" },
                            { value: "99%", label: "Accuracy Possible" },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* What is a Typing Speed Test */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">What Is a Typing Speed Test?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            A <strong>typing speed test</strong> measures how fast and accurately you can type text in a given time period, usually 1–5 minutes. Your speed is expressed in <strong>Words Per Minute (WPM)</strong> — the number of five-character words you correctly type per minute. Accuracy is measured as the percentage of characters typed correctly out of all characters typed.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            TypingOS provides a free online typing test with real-time WPM tracking, error highlighting, and a detailed performance breakdown after each test. Whether you are a beginner aiming for 40 WPM or a pro chasing 120 WPM, our test adapts to your level.
                        </p>
                    </section>

                    {/* WPM Benchmark Table */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Typing Speed Benchmarks by Profession</h2>
                        <p className="text-muted-foreground mb-6">
                            Here's what constitutes a good typing speed depending on your field:
                        </p>
                        <div className="overflow-x-auto rounded-xl border border-border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Role / Category</th>
                                        <th className="text-left p-4 font-semibold">Target WPM</th>
                                        <th className="text-left p-4 font-semibold">Accuracy Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {[
                                        ["Beginner / Student", "20–40 WPM", "85%+"],
                                        ["Office / Admin", "40–60 WPM", "95%+"],
                                        ["Data Entry", "60–80 WPM", "98%+"],
                                        ["SSC CGL / CHSL Exam", "35 WPM", "95%+"],
                                        ["Railway NTPC Exam", "30 WPM", "95%+"],
                                        ["Court Reporter / Transcriptionist", "120–225 WPM", "98%+"],
                                        ["Professional Programmer", "50–80 WPM", "98%+"],
                                    ].map(([role, wpm, acc]) => (
                                        <tr key={role} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4">{role}</td>
                                            <td className="p-4 font-mono text-primary">{wpm}</td>
                                            <td className="p-4">{acc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* How to Improve */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">How to Improve Your Typing Speed</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "1. Learn Touch Typing",
                                    desc: "Touch typing means typing without looking at the keyboard. Learn the home row keys (ASDF JKL;) and practice keeping your fingers in position. TypingOS lessons guide you step by step from beginner to expert.",
                                    link: "/lessons",
                                    linkText: "Start Touch Typing Lessons →"
                                },
                                {
                                    title: "2. Practice Daily (15–30 min)",
                                    desc: "Consistency beats intensity. Short daily sessions are more effective than long, infrequent ones. TypingOS tracks your daily streaks and gives you personalized drills targeting your weak keys.",
                                    link: "/typing-practice-online",
                                    linkText: "Practice Typing Now →"
                                },
                                {
                                    title: "3. Focus on Accuracy First",
                                    desc: "Speed follows accuracy. If you are making many errors, slow down until you can type cleanly, then gradually increase your pace. Our real-time error highlighting helps you identify problem keys instantly.",
                                    link: "/",
                                    linkText: "Take Accuracy Test →"
                                },
                                {
                                    title: "4. Use Exam-Specific Modes",
                                    desc: "For government job exams, use our dedicated SSC, Railway, and Banking typing test modes that simulate the exact exam interface, language, and passage types used in real exams.",
                                    link: "/exams",
                                    linkText: "Practice Exam Typing →"
                                },
                            ].map(item => (
                                <div key={item.title} className="p-6 bg-card border border-border rounded-xl">
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{item.desc}</p>
                                    <Link to={item.link} className="text-primary hover:underline text-sm font-medium">{item.linkText}</Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Why Use TypingOS for Your Typing Test?</h2>
                        <ul className="space-y-3 text-muted-foreground">
                            {[
                                "✅ 100% free — no sign-up required to take the basic test",
                                "✅ Real-time WPM and accuracy tracking with character-level highlighting",
                                "✅ Multiple test durations: 1, 2, 3, and 5 minutes",
                                "✅ Dedicated modes for SSC, Railway NTPC, Banking, and more",
                                "✅ AI Coach that identifies your weakest keys and creates custom drills",
                                "✅ Multiplayer typing races — compete with others in real time",
                                "✅ Downloadable test certificate to showcase your typing speed",
                                "✅ Hindi typing test (Mangal/Kruti Dev font support)",
                                "✅ Gamification: XP, achievements, streaks, and leaderboards",
                            ].map(item => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-0.5 flex-shrink-0">{item.slice(0, 2)}</span>
                                    <span>{item.slice(3)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <div key={faq.question} className="p-5 bg-card border border-border rounded-xl">
                                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Internal Links */}
                    <section className="p-6 bg-muted/30 rounded-xl border border-border">
                        <h2 className="text-xl font-bold mb-4">Explore More Free Typing Tools</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { to: "/typing-practice-online", label: "Typing Practice Online" },
                                { to: "/wpm-calculator", label: "WPM Calculator" },
                                { to: "/lessons", label: "Touch Typing Lessons" },
                                { to: "/exams", label: "Exam Typing Test (SSC/Railway)" },
                                { to: "/ai-coach", label: "AI Typing Coach" },
                                { to: "/multiplayer-race", label: "Multiplayer Typing Race" },
                            ].map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block p-3 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted hover:border-primary transition-all"
                                >
                                    {link.label} →
                                </Link>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
