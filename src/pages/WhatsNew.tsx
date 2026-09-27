import { Sparkles, Rocket, Bug, Wrench, Star, Calendar, ChevronRight, Zap, Trophy, Users, BookOpen, Gamepad2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ChangeType = "feature" | "improvement" | "bugfix" | "announcement";

interface Change {
  type: ChangeType;
  title: string;
  description: string;
  icon?: React.ElementType;
}

interface Release {
  version: string;
  date: string;
  title: string;
  highlight?: boolean;
  changes: Change[];
}

const releases: Release[] = [
  {
    version: "2.6.0",
    date: "February 2026",
    title: "Settings & Authentication Overhaul",
    highlight: true,
    changes: [
      {
        type: "feature",
        title: "Global Settings Management",
        description: "New SettingsContext with persistent preferences for sound, typography, test settings, and notifications. All settings sync across sessions.",
        icon: Wrench
      },
      {
        type: "feature",
        title: "Enhanced Authentication",
        description: "Complete sign-up flow with username support, email verification, and seamless toggle between login and registration modes.",
        icon: Users
      },
      {
        type: "feature",
        title: "Comprehensive Internationalization",
        description: "Added 50+ translation keys for Settings and Authentication across 6 languages: English, Hindi, Spanish, Japanese, German, and French.",
        icon: BookOpen
      },
      {
        type: "improvement",
        title: "Fully Functional Settings Page",
        description: "All controls now connected to global state: font family/size, sound effects, volume, word count, smooth caret, live WPM, and notification preferences."
      },
      {
        type: "improvement",
        title: "CSS Variable Injection",
        description: "Font settings automatically apply via CSS variables for real-time typography updates across the entire application."
      }
    ]
  },
  {
    version: "2.5.0",
    date: "January 2026",
    title: "Multiplayer Racing & Leaderboards",
    highlight: false,
    changes: [
      {
        type: "feature",
        title: "Multiplayer Race Mode",
        description: "Compete against AI opponents in real-time typing races. Choose difficulty levels and race to the finish!",
        icon: Users
      },
      {
        type: "feature",
        title: "Race Leaderboards",
        description: "Track your best times and highest WPM scores across different difficulty levels. See how you rank!",
        icon: Trophy
      },
      {
        type: "feature",
        title: "User Guides",
        description: "Comprehensive tutorials covering all features with detailed instructions for beginners and advanced users.",
        icon: BookOpen
      },
      {
        type: "improvement",
        title: "Enhanced Footer Navigation",
        description: "Reorganized footer with Resources, Documentation, and Support sections for easier navigation."
      },
      {
        type: "improvement",
        title: "FAQ Section",
        description: "Added frequently asked questions covering getting started, features, account management, and more."
      }
    ]
  },
  {
    version: "2.4.0",
    date: "December 2025",
    title: "Book Library & Progressive Learning",
    changes: [
      {
        type: "feature",
        title: "Book Library",
        description: "Practice typing with classic literature. Read and type through novels and stories at your own pace.",
        icon: BookOpen
      },
      {
        type: "feature",
        title: "Progressive Lessons",
        description: "Structured learning path from beginner to advanced with XP rewards and skill tracking."
      },
      {
        type: "feature",
        title: "Skill Progression Tree",
        description: "Visual skill tree showing your mastery of different typing techniques and areas."
      },
      {
        type: "improvement",
        title: "Improved Statistics Dashboard",
        description: "More detailed analytics with per-key accuracy heatmaps and trend graphs."
      },
      {
        type: "bugfix",
        title: "Fixed WPM Calculation",
        description: "Corrected edge cases where WPM was calculated incorrectly for very short tests."
      }
    ]
  },
  {
    version: "2.3.0",
    date: "November 2025",
    title: "Gaming & Achievements Update",
    changes: [
      {
        type: "feature",
        title: "New Typing Games",
        description: "Added Word Blitz, Ghost Typer, Type Duel, and Space Race for fun practice sessions.",
        icon: Gamepad2
      },
      {
        type: "feature",
        title: "Achievement System",
        description: "Earn badges and unlock rewards for reaching milestones in speed, accuracy, and consistency."
      },
      {
        type: "feature",
        title: "XP & Leveling",
        description: "Gain experience points from all activities and level up to unlock new features."
      },
      {
        type: "improvement",
        title: "Virtual Keyboard Redesign",
        description: "New visual design with better key highlighting and finger position guides."
      },
      {
        type: "bugfix",
        title: "Sound Effects Fix",
        description: "Resolved issues with keyboard sounds not playing on certain browsers."
      }
    ]
  },
  {
    version: "2.2.0",
    date: "October 2025",
    title: "AI Academy & Smart Learning",
    changes: [
      {
        type: "feature",
        title: "AI-Powered Coaching",
        description: "Get personalized recommendations and tips based on your typing patterns and weaknesses.",
        icon: Zap
      },
      {
        type: "feature",
        title: "Smart Practice Mode",
        description: "AI generates custom exercises targeting your most common error patterns."
      },
      {
        type: "improvement",
        title: "Faster Load Times",
        description: "Optimized application performance for quicker startup and smoother experience."
      },
      {
        type: "improvement",
        title: "Mobile Responsiveness",
        description: "Better layout and usability on tablets and mobile devices."
      }
    ]
  },
  {
    version: "2.1.0",
    date: "September 2025",
    title: "Statistics & Analytics",
    changes: [
      {
        type: "feature",
        title: "Detailed Statistics",
        description: "Track your progress with comprehensive charts, graphs, and historical data.",
        icon: BarChart3
      },
      {
        type: "feature",
        title: "Typing Certificates",
        description: "Earn and download certificates after passing certification exams."
      },
      {
        type: "improvement",
        title: "Dark Mode Improvements",
        description: "Better contrast and readability in dark theme across all pages."
      },
      {
        type: "bugfix",
        title: "Test History Saving",
        description: "Fixed issue where some test results weren't being saved correctly."
      }
    ]
  },
  {
    version: "2.0.0",
    date: "August 2025",
    title: "Major Redesign",
    changes: [
      {
        type: "announcement",
        title: "Complete UI Overhaul",
        description: "Fresh new design with improved navigation, better accessibility, and modern aesthetics."
      },
      {
        type: "feature",
        title: "Multiple Keyboard Layouts",
        description: "Support for QWERTY, AZERTY, QWERTZ, Dvorak, and Colemak layouts."
      },
      {
        type: "feature",
        title: "Custom Themes",
        description: "Create and save your own color themes for a personalized experience."
      },
      {
        type: "feature",
        title: "Global Leaderboards",
        description: "Compare your skills with typists from around the world."
      }
    ]
  }
];

const typeConfig: Record<ChangeType, { label: string; color: string; icon: React.ElementType }> = {
  feature: { label: "New Feature", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Rocket },
  improvement: { label: "Improvement", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Wrench },
  bugfix: { label: "Bug Fix", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Bug },
  announcement: { label: "Announcement", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Star }
};

export default function WhatsNew() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">What's New</h1>
        </div>
        <p className="text-muted-foreground">Latest updates, features, and improvements to TypingOS</p>
      </div>

      {/* Latest Release Highlight */}
      {releases[0] && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Latest</Badge>
              <Badge variant="outline">v{releases[0].version}</Badge>
            </div>
            <CardTitle className="text-2xl">{releases[0].title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {releases[0].date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {releases[0].changes.filter(c => c.icon).slice(0, 3).map((change, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border">
                  {change.icon && (
                    <div className="p-2 rounded-lg bg-primary/10 h-fit">
                      <change.icon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{change.title}</h4>
                    <p className="text-sm text-muted-foreground">{change.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Releases */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Release History</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {releases.map((release, releaseIdx) => (
              <div key={release.version} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${releaseIdx === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-border'
                  }`}>
                  <span className="text-xs font-bold">{release.version.split('.')[1]}</span>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{release.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">v{release.version}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {release.date}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {release.changes.map((change, changeIdx) => {
                        const config = typeConfig[change.type];
                        const TypeIcon = config.icon;

                        return (
                          <div key={changeIdx} className="flex items-start gap-3">
                            <Badge variant="outline" className={`shrink-0 text-xs ${config.color}`}>
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium">{change.title}</span>
                              <span className="text-muted-foreground"> — {change.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-lg flex items-center justify-center md:justify-start gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Stay Updated
              </h3>
              <p className="text-muted-foreground text-sm">Follow us on social media for the latest news and updates.</p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Twitter
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Discord
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
