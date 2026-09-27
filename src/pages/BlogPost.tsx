import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  BookOpen
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/shared/AdBanner";
import { BlogComments } from "@/pages/BlogComments";

// Blog post data
const blogPosts = {
  "science-behind-touch-typing": {
    id: "science-behind-touch-typing",
    title: "The Science Behind Touch Typing: How Your Brain Learns",
    excerpt: "Discover the fascinating neuroscience behind muscle memory and how consistent practice rewires your brain for faster, more accurate typing.",
    category: "Typing Tips",
    readTime: "8 min read",
    date: "January 15, 2026",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    author: {
      name: "Dr. Sarah Mitchell",
      role: "Cognitive Science Researcher",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      bio: "Dr. Mitchell specializes in motor learning and cognitive development. She has published over 30 papers on skill acquisition."
    },
    content: `
## Introduction

Touch typing is more than just a useful skill—it's a fascinating window into how our brains learn and adapt. When you type without looking at the keyboard, you're demonstrating one of the most remarkable capabilities of the human nervous system: procedural memory.

## The Neuroscience of Muscle Memory

When you first learn to type, your brain relies heavily on the prefrontal cortex—the area responsible for conscious decision-making and working memory. Every keystroke requires deliberate thought: "Where is the 'T' key? Now where is 'H'?"

But as you practice, something remarkable happens. The neural pathways associated with typing gradually shift from the prefrontal cortex to the basal ganglia and cerebellum. These regions specialize in automatic, procedural movements.

### The Three Stages of Skill Acquisition

1. **Cognitive Stage**: You consciously think about each movement. This is slow and error-prone.

2. **Associative Stage**: Movements become more fluid as you start to chunk keystrokes together. Words become single units rather than sequences of letters.

3. **Autonomous Stage**: Typing becomes automatic. You can think about what you're writing, not how you're typing it.

## Why Consistent Practice Matters

Research shows that the quality and consistency of practice significantly impact skill development. Here's what the science tells us:

### Spaced Repetition

Studies have demonstrated that practicing typing for 15-20 minutes daily is more effective than marathon sessions. This is because of a phenomenon called **memory consolidation**, which occurs primarily during sleep.

When you practice, your brain creates new synaptic connections. During sleep, these connections are strengthened and integrated with existing knowledge. By spacing out your practice, you give your brain time to consolidate each session's learning.

### The Role of Feedback

Immediate feedback is crucial for learning. When you make a typing error, your brain's error-detection system (located in the anterior cingulate cortex) fires, helping you adjust your future movements.

This is why typing programs that highlight errors in real-time are so effective—they provide the immediate feedback your brain needs to learn.

## Practical Implications

Understanding the science behind touch typing can help you optimize your learning:

1. **Practice consistently**: 15-20 minutes daily beats occasional hour-long sessions.

2. **Get enough sleep**: Your brain consolidates motor skills during sleep.

3. **Use immediate feedback**: Practice with software that shows your errors instantly.

4. **Be patient**: The shift to automatic typing takes time—typically 20-40 hours of focused practice.

5. **Don't look down**: Force your brain to develop the proper neural pathways by keeping your eyes on the screen.

## Conclusion

Touch typing is a perfect example of how our brains can transform conscious, effortful actions into fluid, automatic skills. By understanding the neuroscience behind this process, you can make your practice more effective and appreciate the remarkable learning machine between your ears.

The next time you type without looking at the keyboard, take a moment to appreciate the billions of neurons firing in perfect coordination—all because you took the time to practice.
    `,
    tags: ["neuroscience", "learning", "muscle memory", "practice"],
    likes: 342,
    comments: 28
  },
  "master-home-row": {
    id: "master-home-row",
    title: "Master the Home Row: Your Foundation for Speed",
    excerpt: "The home row is where your fingers should rest. Learn why ASDF and JKL; are the keys to unlocking your typing potential.",
    category: "Typing Tips",
    readTime: "5 min read",
    date: "January 12, 2026",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&h=600&fit=crop",
    author: {
      name: "Marcus Chen",
      role: "Professional Typing Instructor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      bio: "Marcus has taught typing to over 10,000 students and holds the record for fastest typing speed in his state."
    },
    content: `
## The Foundation of Touch Typing

Every great typist knows that speed and accuracy begin with proper finger placement. The home row—ASDF for your left hand and JKL; for your right—is the foundation upon which all typing skills are built.

## Why the Home Row Matters

When your fingers rest on the home row, they're positioned to reach every key on the keyboard with minimal movement. This efficiency is the secret to typing speed.

### The Home Row Keys

- **Left Hand**: A (pinky), S (ring), D (middle), F (index)
- **Right Hand**: J (index), K (middle), L (ring), ; (pinky)

The F and J keys have small bumps or ridges—these tactile markers help you find the home row without looking.

## Building Muscle Memory

The key to mastering the home row is repetition. Here's a simple exercise routine:

### Week 1: Home Row Only
Practice typing words using only home row keys: sad, lad, flask, salads, dad, fad, all, fall, ask, shall.

### Week 2: Adding the Top Row
Introduce QWERT and YUIOP while always returning to home position.

### Week 3: Adding the Bottom Row
Include ZXCVB and NM,./while maintaining home row discipline.

## Common Mistakes to Avoid

1. **Floating fingers**: Keep your fingers curved and close to the keys
2. **Looking at the keyboard**: Trust your muscle memory
3. **Tensing up**: Stay relaxed for faster typing
4. **Forgetting to return home**: Always bring fingers back to ASDF JKL;

## Practice Makes Perfect

Dedicate 10 minutes daily to home row exercises. Within two weeks, you'll notice significant improvement in both speed and accuracy.
    `,
    tags: ["home row", "beginner", "fundamentals", "technique"],
    likes: 256,
    comments: 19
  },
  "common-typing-mistakes": {
    id: "common-typing-mistakes",
    title: "10 Common Typing Mistakes and How to Fix Them",
    excerpt: "From looking at the keyboard to using the wrong fingers, discover the habits holding you back and strategies to overcome them.",
    category: "Typing Tips",
    readTime: "6 min read",
    date: "January 10, 2026",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=600&fit=crop",
    author: {
      name: "Emily Rodriguez",
      role: "Typing Coach & Author",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      bio: "Emily is the author of 'Type Your Way to Success' and has helped thousands improve their typing skills."
    },
    content: `
## Introduction

Even experienced typists fall into bad habits that limit their speed and accuracy. Here are the ten most common mistakes and how to fix them.

## The Top 10 Mistakes

### 1. Looking at the Keyboard
**The Problem**: You can't type fast if you're constantly looking down.
**The Fix**: Cover your keyboard or use a blank keyboard skin. Force yourself to look at the screen only.

### 2. Using the Wrong Fingers
**The Problem**: Hunt-and-peck typing or using only a few fingers.
**The Fix**: Learn proper finger placement and stick to it, even if it feels slower at first.

### 3. Ignoring Errors
**The Problem**: Not correcting mistakes reinforces bad habits.
**The Fix**: Always fix errors immediately. The backspace key is your friend.

### 4. Typing Too Fast Too Soon
**The Problem**: Rushing leads to more errors and builds bad muscle memory.
**The Fix**: Start slow and focus on accuracy. Speed will come naturally.

### 5. Poor Posture
**The Problem**: Slouching causes fatigue and strain.
**The Fix**: Sit up straight, keep wrists neutral, and position your screen at eye level.

### 6. Inconsistent Practice
**The Problem**: Sporadic practice doesn't build lasting skills.
**The Fix**: Practice for 15-20 minutes daily rather than occasional long sessions.

### 7. Not Using All Ten Fingers
**The Problem**: Underutilizing fingers limits your potential.
**The Fix**: Each finger has assigned keys. Learn and practice them.

### 8. Hitting Keys Too Hard
**The Problem**: Wasted energy and increased fatigue.
**The Fix**: Use a light touch. Modern keyboards don't need force.

### 9. Neglecting Special Characters
**The Problem**: Numbers and symbols slow you down.
**The Fix**: Include special characters in your practice routine.

### 10. Giving Up Too Soon
**The Problem**: Expecting instant results leads to frustration.
**The Fix**: Be patient. Significant improvement takes 2-4 weeks of consistent practice.

## Conclusion

Identifying your bad habits is the first step to fixing them. Focus on one or two improvements at a time, and you'll see steady progress.
    `,
    tags: ["mistakes", "improvement", "habits", "tips"],
    likes: 189,
    comments: 34
  },
  "advanced-finger-placement": {
    id: "advanced-finger-placement",
    title: "Advanced Finger Placement Techniques",
    excerpt: "Go beyond the basics with advanced finger positioning strategies used by professional typists and court reporters.",
    category: "Technique Guides",
    readTime: "10 min read",
    date: "January 14, 2026",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop",
    author: {
      name: "James Thompson",
      role: "Court Reporter & Speed Champion",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "James is a certified court reporter who types at 225 WPM and has won multiple speed typing competitions."
    },
    content: `
## Beyond the Basics

Once you've mastered touch typing fundamentals, it's time to optimize your technique for maximum speed and efficiency.

## Advanced Techniques

### 1. Finger Independence Training
Professional typists train each finger independently. Practice exercises that isolate single fingers while keeping others stationary.

### 2. Chord Typing
Instead of typing letter by letter, learn to press multiple keys in rapid succession as a single "chord." Common words become single movements.

### 3. Optimal Finger Stretching
Develop flexibility to reach distant keys without moving your hands from home position. This minimizes hand movement and increases speed.

### 4. Rhythm Optimization
The fastest typists maintain a consistent rhythm. Practice with a metronome to develop steady, predictable keystroke timing.

### 5. Alternate Hand Patterns
When possible, alternate between hands for consecutive keystrokes. This allows one hand to prepare while the other types.

## Practice Drills

### The Spider Drill
Place all fingers on home row. Lift one finger at a time, pressing its assigned keys while keeping others stationary.

### Speed Bursts
Type at maximum speed for 10 seconds, then rest for 20 seconds. Repeat 10 times.

### Accuracy Focus
Type a paragraph at half your normal speed, focusing on zero errors. Gradually increase speed while maintaining accuracy.

## Equipment Considerations

Professional typists often prefer:
- Mechanical keyboards with specific switch types
- Ergonomic keyboard layouts (split keyboards)
- Proper desk and chair height adjustments

## Conclusion

Advanced typing is about efficiency and consistency. Master these techniques, and you'll be typing like a professional in no time.
    `,
    tags: ["advanced", "technique", "professional", "speed"],
    likes: 167,
    comments: 22
  },
  "sarah-journey-120wpm": {
    id: "sarah-journey-120wpm",
    title: "From 30 to 120 WPM: Sarah's Incredible Journey",
    excerpt: "Meet Sarah, a TypeMaster user who transformed her typing skills in just 6 months. She shares her tips and daily routine.",
    category: "Community",
    readTime: "6 min read",
    date: "January 13, 2026",
    type: "Success Story",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=600&fit=crop",
    author: {
      name: "Sarah Williams",
      role: "TypeMaster Community Member",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
      bio: "Sarah is a content writer who quadrupled her typing speed in 6 months using TypeMaster."
    },
    content: `
## My Typing Transformation

Six months ago, I was a painfully slow typist. At 30 WPM, writing articles for my job was agonizing. Today, I consistently type at 120 WPM with 98% accuracy. Here's how I did it.

## The Starting Point

I'd been a hunt-and-peck typist my entire life. I knew I needed to change, but the idea of "relearning" how to type felt overwhelming.

## The Breakthrough

What changed everything was committing to just 20 minutes of practice daily. No excuses, no skipping days. I used TypeMaster's Progressive Lessons and tracked my progress religiously.

## My Daily Routine

### Morning (10 minutes)
- 5 minutes of warm-up exercises on TypeMaster
- 5 minutes of home row drills

### Evening (10 minutes)
- 5 minutes of speed tests
- 5 minutes of problem key practice (for me, it was B and Y)

## Key Milestones

- **Week 2**: Stopped looking at the keyboard entirely
- **Week 4**: Hit 50 WPM for the first time
- **Month 2**: Reached 70 WPM with 95% accuracy
- **Month 4**: Broke 100 WPM barrier
- **Month 6**: Consistent 120 WPM with 98% accuracy

## Tips That Made the Difference

1. **Never look down**: I covered my keyboard with a cloth
2. **Focus on accuracy first**: Speed follows naturally
3. **Practice with real content**: I typed articles and books, not just drills
4. **Join the community**: Other TypeMaster users kept me motivated
5. **Track everything**: Seeing progress charts kept me going

## The Impact on My Life

My job performance has improved dramatically. I can now write articles in half the time, which has opened up opportunities for more projects and higher income.

## My Advice to You

Start today. The six months will pass anyway—imagine where you could be by then. The journey is worth it, I promise.
    `,
    tags: ["success story", "community", "inspiration", "journey"],
    likes: 423,
    comments: 56
  }
};

const relatedPosts = [
  {
    id: "master-home-row",
    title: "Master the Home Row: Your Foundation for Speed",
    readTime: "5 min read",
    category: "Typing Tips"
  },
  {
    id: "common-typing-mistakes",
    title: "10 Common Typing Mistakes and How to Fix Them",
    readTime: "6 min read",
    category: "Typing Tips"
  },
  {
    id: "advanced-finger-placement",
    title: "Advanced Finger Placement Techniques",
    readTime: "10 min read",
    category: "Technique Guides"
  }
];

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = postId ? blogPosts[postId as keyof typeof blogPosts] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRelatedPosts = () => {
    return relatedPosts.filter(p => p.id !== post.id).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
              {(post as any).level && (
                <Badge variant="outline">{(post as any).level}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {post.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comments} comments
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div>
            {/* Author Card */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.author.name}</h3>
                    <p className="text-sm text-primary mb-2">{post.author.role}</p>
                    <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card className="mb-8">
              <CardContent className="p-6 md:p-10">
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  {post.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-bold text-foreground">{paragraph.replace(/\*\*/g, '')}</p>;
                    } else if (paragraph.startsWith('- ')) {
                      return <ul key={index} className="my-4"><li className="ml-6 text-muted-foreground">{paragraph.replace('- ', '')}</li></ul>;
                    } else if (paragraph.match(/^\d+\./)) {
                      return <ol key={index} className="my-4"><li className="ml-6 text-muted-foreground list-decimal">{paragraph.replace(/^\d+\.\s*/, '')}</li></ol>;
                    } else if (paragraph.trim()) {
                      return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{paragraph}</p>;
                    }
                    return null;
                  })}
                </article>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Share & Actions */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Share this article:</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Like ({post.likes})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <BlogComments postId={post.id} postTitle={post.title} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sticky Container */}
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    In This Article
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {post.content.split('\n')
                      .filter(line => line.startsWith('## '))
                      .map((heading, index) => (
                        <a
                          key={index}
                          href={`#${heading.replace('## ', '').toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {heading.replace('## ', '')}
                        </a>
                      ))
                    }
                  </nav>
                </CardContent>
              </Card>

              {/* SIDEBAR AD */}
              <AdBanner type="sidebar" />

              {/* Related Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getRelatedPosts().map((relatedPost, index) => (
                    <Link
                      key={index}
                      to={`/blog/${relatedPost.id}`}
                      className="block group"
                    >
                      <div className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <Badge variant="outline" className="text-xs mb-2">
                          {relatedPost.category}
                        </Badge>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Get More Tips</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to receive the latest typing tips and guides.
                  </p>
                  <Button className="w-full">Subscribe</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
