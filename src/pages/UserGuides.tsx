import { BookOpen, Keyboard, Trophy, Gamepad2, Users, BarChart3, Settings, Award, BookText, Zap, Target, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

const guides = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Keyboard,
    description: "Learn the basics of using TypingOS",
    sections: [
      {
        title: "Your First Typing Test",
        content: `Start your typing journey by taking a quick test on the homepage. Simply click on the typing area and begin typing the displayed text. Your WPM (Words Per Minute) and accuracy will be calculated in real-time.

**Tips for beginners:**
- Keep your fingers on the home row (ASDF JKL;)
- Don't look at the keyboard while typing
- Focus on accuracy first, speed will come naturally
- Take breaks every 15-20 minutes to avoid fatigue`
      },
      {
        title: "Understanding Your Results",
        content: `After completing a test, you'll see:
- **WPM**: Words typed per minute (standard word = 5 characters)
- **Accuracy**: Percentage of correct keystrokes
- **Errors**: Number of mistakes made
- **Time**: Duration of your test

Your results are saved automatically and can be viewed in the Statistics section.`
      },
      {
        title: "Choosing Test Duration",
        content: `Select your preferred test duration:
- **15 seconds**: Quick warm-up or speed check
- **30 seconds**: Standard practice session
- **60 seconds**: Comprehensive test (recommended for accurate results)
- **120 seconds**: Extended endurance test`
      }
    ]
  },
  {
    id: "lessons",
    title: "Typing Lessons",
    icon: GraduationCap,
    description: "Structured learning path for all skill levels",
    sections: [
      {
        title: "Progressive Lessons",
        content: `Our lesson system is designed to teach you proper typing technique from scratch:

**Beginner Level:**
- Home row keys (ASDF JKL;)
- Proper finger placement
- Building muscle memory

**Intermediate Level:**
- Top and bottom row keys
- Common word patterns
- Increasing speed drills

**Advanced Level:**
- Numbers and symbols
- Special characters
- Professional typing speed`
      },
      {
        title: "Skill Progression",
        content: `Track your improvement through our skill tree:
- Complete lessons to unlock new levels
- Earn XP for each completed exercise
- Unlock achievements as you progress
- Get personalized recommendations based on your weaknesses`
      },
      {
        title: "Practice Tips",
        content: `Maximize your learning:
- Practice daily for at least 15 minutes
- Don't skip levels even if they feel easy
- Use the virtual keyboard as a guide
- Review your error patterns in Statistics`
      }
    ]
  },
  {
    id: "games",
    title: "Typing Games",
    icon: Gamepad2,
    description: "Fun ways to improve your typing skills",
    sections: [
      {
        title: "Word Blitz",
        content: `Type as many words as possible before time runs out!
- Words appear on screen one at a time
- Correct words earn points
- Speed bonuses for fast typing
- Compete for high scores on the leaderboard`
      },
      {
        title: "Ghost Typer",
        content: `Race against your own ghost (previous best run):
- Beat your personal records
- See real-time comparison
- Perfect for tracking improvement
- Unlock harder difficulties as you improve`
      },
      {
        title: "Type Duel",
        content: `Head-to-head typing battles:
- Compete against AI opponents
- Different difficulty levels
- Win streaks earn bonus rewards
- Climb the ranked ladder`
      },
      {
        title: "Space Race",
        content: `Type to power your spaceship:
- Avoid obstacles by typing correctly
- Collect power-ups for bonuses
- Multiple levels with increasing difficulty
- Endless mode for high score hunting`
      }
    ]
  },
  {
    id: "multiplayer",
    title: "Multiplayer Racing",
    icon: Users,
    description: "Compete with others in real-time races",
    sections: [
      {
        title: "Starting a Race",
        content: `Join the competitive typing arena:
1. Go to the Multiplayer Race section
2. Choose your difficulty level (Easy, Medium, Hard, Expert)
3. Select number of AI opponents (2-5)
4. Click "Start Race" and get ready!

The race begins after a countdown. Type the displayed text as fast and accurately as possible.`
      },
      {
        title: "Race Mechanics",
        content: `During a race:
- Your car moves based on typing speed
- Errors slow you down temporarily
- Track your position in real-time
- First to finish wins!

**Scoring:**
- Faster completion = higher ranking
- Accuracy bonuses apply
- Results are saved to the leaderboard`
      },
      {
        title: "Leaderboards",
        content: `Track your racing achievements:
- View best times per difficulty
- See highest WPM records
- Compare with other players
- Filter by time period (daily, weekly, all-time)`
      }
    ]
  },
  {
    id: "statistics",
    title: "Statistics & Analytics",
    icon: BarChart3,
    description: "Track your typing progress over time",
    sections: [
      {
        title: "Performance Overview",
        content: `Your dashboard shows:
- Average WPM over time
- Accuracy trends
- Total practice time
- Tests completed
- Improvement graphs`
      },
      {
        title: "Detailed Analytics",
        content: `Dive deeper into your data:
- Per-key accuracy heatmap
- Most common error pairs
- Speed by time of day
- Comparison with previous periods
- Weekly and monthly reports`
      },
      {
        title: "Using Insights",
        content: `Turn data into improvement:
- Focus on weak keys identified in heatmaps
- Practice during your peak performance times
- Set realistic goals based on your trends
- Celebrate milestones and improvements`
      }
    ]
  },
  {
    id: "achievements",
    title: "Achievements & Rewards",
    icon: Trophy,
    description: "Unlock badges and earn rewards",
    sections: [
      {
        title: "Achievement Types",
        content: `Earn achievements for:
- **Speed Milestones**: Reach 50, 75, 100+ WPM
- **Accuracy Awards**: Maintain 95%+ accuracy
- **Consistency**: Practice daily streaks
- **Completion**: Finish lessons and courses
- **Competition**: Win races and tournaments`
      },
      {
        title: "XP & Leveling",
        content: `Gain experience points by:
- Completing typing tests
- Finishing lessons
- Winning games and races
- Earning achievements

Level up to unlock new features, themes, and customization options.`
      },
      {
        title: "Certificates",
        content: `Earn official certificates:
- Complete certification exams
- Download as PDF
- Share on social media
- Verify authenticity with unique codes`
      }
    ]
  },
  {
    id: "book-library",
    title: "Book Library",
    icon: BookText,
    description: "Practice typing with classic literature",
    sections: [
      {
        title: "Browsing Books",
        content: `Explore our collection:
- Classic novels and stories
- Various genres and authors
- Different difficulty levels
- Sortable by length and complexity`
      },
      {
        title: "Reading & Typing",
        content: `Practice with literature:
- Read and type simultaneously
- Track progress through chapters
- Resume where you left off
- Earn XP for completed pages`
      },
      {
        title: "Benefits",
        content: `Why practice with books:
- More engaging than random text
- Improves vocabulary and spelling
- Longer sessions for endurance
- Enjoy great stories while improving`
      }
    ]
  },
  {
    id: "settings",
    title: "Customization",
    icon: Settings,
    description: "Personalize your typing experience",
    sections: [
      {
        title: "Keyboard Settings",
        content: `Configure your preferences:
- Choose keyboard layout (QWERTY, Dvorak, etc.)
- Enable/disable sound effects
- Show/hide virtual keyboard
- Adjust key highlight settings`
      },
      {
        title: "Theme & Appearance",
        content: `Make it yours:
- Light and dark mode
- Custom color themes
- Font size and style
- Background options`
      },
      {
        title: "Test Preferences",
        content: `Customize your tests:
- Default test duration
- Word list selection
- Include punctuation and numbers
- Difficulty presets`
      }
    ]
  }
];

export default function UserGuides() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">User Guides</h1>
        </div>
        <p className="text-muted-foreground">Comprehensive tutorials to help you master TypingOS</p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {guides.map((guide) => (
          <a
            key={guide.id}
            href={`#${guide.id}`}
            className="block"
          >
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 text-center">
                <guide.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                <h3 className="font-semibold text-sm">{guide.title}</h3>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Detailed Guides */}
      <div className="space-y-8">
        {guides.map((guide) => (
          <Card key={guide.id} id={guide.id} className="scroll-mt-20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <guide.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={guide.sections[0].title} className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start">
                  {guide.sections.map((section) => (
                    <TabsTrigger
                      key={section.title}
                      value={section.title}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {guide.sections.map((section) => (
                  <TabsContent key={section.title} value={section.title} className="mt-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {section.content.split('\n\n').map((paragraph, idx) => {
                        const lines = paragraph.split('\n');
                        const isList = lines.every(line => line.startsWith('- ') || line.match(/^\d+\./));

                        if (isList) {
                          const isUnordered = lines[0].startsWith('- ');
                          const listClasses = cn("mb-4 ml-6 space-y-2", isUnordered ? "list-disc" : "list-decimal");

                          if (isUnordered) {
                            return (
                              <ul key={idx} className={listClasses}>
                                {lines.map((line, lineIdx) => {
                                  const content = line.replace(/^- /, '');
                                  if (content.startsWith('**')) {
                                    const match = content.match(/^\*\*(.+?)\*\*: (.+)/);
                                    if (match) {
                                      return <li key={lineIdx} className="text-muted-foreground"><Badge variant="secondary" className="mr-2">{match[1]}</Badge> {match[2]}</li>;
                                    }
                                  }
                                  return <li key={lineIdx} className="text-muted-foreground">{content}</li>;
                                })}
                              </ul>
                            );
                          } else {
                            return (
                              <ol key={idx} className={listClasses}>
                                {lines.map((line, lineIdx) => {
                                  const content = line.replace(/^\d+\. /, '');
                                  return <li key={lineIdx} className="text-muted-foreground">{content}</li>;
                                })}
                              </ol>
                            );
                          }
                        }

                        return (
                          <div key={idx} className="mb-4">
                            {lines.map((line, lineIdx) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <h4 key={lineIdx} className="font-semibold text-foreground mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                              }
                              return <p key={lineIdx} className="text-muted-foreground">{line}</p>;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-lg">Need More Help?</h3>
              <p className="text-muted-foreground">Can't find what you're looking for? Check our FAQ or contact support.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/faq">
                <Button variant="outline">View FAQ</Button>
              </Link>
              <Link to="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
