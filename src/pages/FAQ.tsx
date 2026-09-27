import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I start practicing typing?",
        a: "Simply visit our homepage and start typing in the practice area. You can choose from different modes like timed tests, lessons, or games to improve your skills."
      },
      {
        q: "Do I need to create an account?",
        a: "You can practice without an account, but creating one allows you to track your progress, earn achievements, and appear on leaderboards."
      },
      {
        q: "What keyboard layouts are supported?",
        a: "We support QWERTY, AZERTY, QWERTZ, Dvorak, and Colemak layouts. You can change your preferred layout in Settings."
      }
    ]
  },
  {
    category: "Features",
    questions: [
      {
        q: "What is the difference between lessons and games?",
        a: "Lessons provide structured learning with progressive difficulty, focusing on specific keys and techniques. Games make practice fun with competitive elements like races and challenges."
      },
      {
        q: "How does the multiplayer race work?",
        a: "In multiplayer race, you compete against AI opponents to type a passage the fastest. Your WPM and accuracy determine your position in the race."
      },
      {
        q: "What are typing certificates?",
        a: "After passing certain exams or achieving specific milestones, you can earn certificates that verify your typing skills. These can be shared or downloaded as PDF."
      },
      {
        q: "How does the book library feature work?",
        a: "The book library lets you practice typing by transcribing classic literature. It's a great way to improve while reading interesting content."
      }
    ]
  },
  {
    category: "Account Management",
    questions: [
      {
        q: "How do I change my username or profile?",
        a: "Go to Settings and navigate to the Profile section. There you can update your username, avatar, and other personal information."
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can delete your account from Settings. Please note this action is permanent and all your progress will be lost."
      },
      {
        q: "How do I reset my statistics?",
        a: "You can reset your statistics from the Settings page under the Data section. This will clear all your historical typing data."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Why is my WPM lower than expected?",
        a: "WPM is calculated based on correct characters typed. Errors and corrections reduce your effective WPM. Focus on accuracy first, then speed."
      },
      {
        q: "The keyboard sounds aren't working. What should I do?",
        a: "Make sure sound is enabled in Settings and your browser allows audio playback. Try refreshing the page if issues persist."
      },
      {
        q: "Can I use this on mobile devices?",
        a: "While the app works on mobile, we recommend using a physical keyboard for the best typing practice experience."
      },
      {
        q: "How is accuracy calculated?",
        a: "Accuracy is the percentage of correct keystrokes out of total keystrokes. Backspacing to fix errors still counts the original error."
      }
    ]
  },
  {
    category: "Premium & Support",
    questions: [
      {
        q: "Is the app free to use?",
        a: "Yes! Core features are completely free. Premium features like advanced analytics, custom themes, and ad-free experience are available with a subscription."
      },
      {
        q: "How do I contact support?",
        a: "You can reach us at support@typingos.com or through our Contact page. We also have active Discord and Reddit communities."
      },
      {
        q: "Can I suggest new features?",
        a: "Absolutely! We love feedback. Use our Contact form or join our community on Discord or GitHub to share your ideas."
      }
    ]
  }
];

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black uppercase tracking-tight leading-none italic">{t('Frequently Asked')} <span className="text-primary">{t('Questions')}</span></h1>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{t('Protocol Intelligence & Knowledge Base')} v2.5</p>
      </div>

      <div className="space-y-6">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <h2 className="text-xl font-semibold text-primary">{section.category}</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {section.questions.map((item, itemIndex) => (
                <AccordionItem
                  key={itemIndex}
                  value={`${sectionIndex}-${itemIndex}`}
                  className="border border-border rounded-lg px-4 bg-card/50"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-muted-foreground">
          Still have questions? {" "}
          <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
