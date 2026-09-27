import { Link } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { TypingTestBox } from "@/components/typing/TypingTestBox";

const faqs = [
    {
        question: "How can I practice typing online for free?",
        answer: "TypingOS offers a comprehensive suite of free typing practice tools online. You can practice with common words, sentences, paragraphs, or even specialized code snippets. Our platform tracks your progress and provides real-time feedback."
    },
    {
        question: "What is the best way to practice typing?",
        answer: "The best way is to focus on accuracy first, then speed. Use touch typing techniques, keep your fingers on the home row, and practice for 15-30 minutes daily. TypingOS's adaptive drills help you focus on your weakest keys."
    },
    {
        question: "Can I practice Hindi typing on this site?",
        answer: "Yes, TypingOS supports multiple Indian languages including Hindi (Mangal/Kruti Dev), Tamil, Telugu, and more. You can switch languages in the typing settings."
    },
    {
        question: "Does this site save my typing practice progress?",
        answer: "Yes, if you use the same browser, your progress is saved locally. We also offer cloud synchronization if you create a free account, allowing you to track your stats across multiple devices."
    }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Typing Practice Online — Free Lessons & Drills",
    "description": "Practice typing online for free. Improve your WPM and accuracy with our interactive drills and lessons. Suitable for beginners and experts alike.",
    "url": "https://typingos.com/typing-practice-online",
};

export default function TypingPracticePage() {
    return (
        <>
            <SEOHead
                title="Typing Practice Online — Free Lessons, Drills & Games"
                description="Improve your typing speed and accuracy with free online practice. Lessons for beginners, advanced drills, and fun typing games. Start practicing today!"
                keywords="typing practice online, free typing lessons, online typing drills, improve typing speed, learn touch typing, typing practice for kids, advanced typing practice"
                url="https://typingos.com/typing-practice-online"
                faqs={faqs}
                schema={schema}
            />

            <div className="min-h-screen bg-background text-foreground">
                <div className="max-w-5xl mx-auto px-4 py-12">

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Typing Practice Online
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The ultimate platform to master touch typing. Whether you're a beginner learning the home row or a pro aiming for 100+ WPM, we have the drills you need.
                        </p>
                    </div>

                    {/* Interactive Widget */}
                    <div className="max-w-4xl mx-auto mb-16">
                        <TypingTestBox />
                    </div>

                    {/* Key Practice Areas */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[
                            { title: "Beginner Lessons", desc: "Start from scratch with our step-by-step touch typing course.", link: "/lessons" },
                            { title: "Exam Drills", desc: "Pass government exams like SSC and Railway with timed tests.", link: "/exams" },
                            { title: "Typing Games", desc: "Fun way to build muscle memory and increase your speed.", link: "/games" },
                        ].map(item => (
                            <div key={item.title} className="p-6 bg-card border border-border rounded-xl text-center">
                                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{item.desc}</p>
                                <Link to={item.link} className="text-primary font-bold hover:underline">Explore {item.title} →</Link>
                            </div>
                        ))}
                    </div>

                    {/* Why Practice Matters */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Why Regular Typing Practice is Essential</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In today's digital world, typing is as fundamental as writing. Improving your typing speed from 40 WPM to 80 WPM can save you over 200 hours a year in productivity. Regular practice helps:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                            <li>Build muscle memory so you can type without looking at the keys.</li>
                            <li>Reduce physical strain and prevent repetitive stress injuries.</li>
                            <li>Increase cognitive focus on content rather than the act of typing.</li>
                            <li>Prepare for competitive exams and professional data entry roles.</li>
                        </ul>
                    </section>

                    {/* Features List */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold mb-6">TypingOS Practice Features</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "✅ Custom Text Import: Practice with your own documents",
                                "✅ Language Variety: Support for 15+ global and Indian languages",
                                "✅ AI Recommendations: Drills based on your error patterns",
                                "✅ Interactive Virtual Keyboard: Real-time finger placement guides",
                                "✅ Detailed Analytics: Track progress by finger, key, and hand",
                                "✅ Competitive Mood: Race against friends or global players"
                            ].map(feature => (
                                <div key={feature} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                                    <span className="text-primary">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Practice FAQ</h2>
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <div key={faq.question} className="p-5 bg-card border border-border rounded-xl">
                                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
