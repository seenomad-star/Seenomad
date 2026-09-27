import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight, Keyboard, Zap, Target } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  icon: React.ReactNode;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Improve Typing Speed (Without Losing Accuracy)",
    description: "Simple drills and practice routines you can follow daily to build muscle memory and increase your words per minute.",
    readTime: "5 min read",
    category: "Speed",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "Top 10 Common Typing Mistakes",
    description: "Fix these habits to boost consistency and reduce errors. Learn what's holding you back from faster typing.",
    readTime: "4 min read",
    category: "Accuracy",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "Best Keyboard Shortcuts for Faster Work",
    description: "Learn shortcuts that save time and keep you in flow. Master productivity with these essential combinations.",
    readTime: "6 min read",
    category: "Productivity",
    icon: <Keyboard className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "The Science Behind Touch Typing",
    description: "Understanding how your brain learns to type without looking. The neuroscience of muscle memory explained.",
    readTime: "7 min read",
    category: "Learning",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: "5",
    title: "Ergonomic Typing: Prevent RSI and Fatigue",
    description: "Proper posture and hand positioning to type comfortably for hours without strain or injury.",
    readTime: "5 min read",
    category: "Health",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "6",
    title: "From 40 to 100 WPM: A Journey",
    description: "Real stories from users who doubled their typing speed. Their strategies, challenges, and breakthroughs.",
    readTime: "8 min read",
    category: "Stories",
    icon: <Zap className="w-5 h-5" />,
  },
];

const categoryColors: Record<string, string> = {
  Speed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Accuracy: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Productivity: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Learning: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Health: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Stories: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export const TypingBlog = () => {
  return (
    <section className="py-12">
      {/* Hero Section */}
      <div className="relative mb-10 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-950/50 dark:to-teal-900/30 p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-200/50 to-transparent dark:from-teal-800/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-primary">Typing Blog</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Typing Blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Tips, practice strategies, and updates to help you type faster and more accurately.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card 
            key={post.id} 
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden"
          >
            {/* Card Header with gradient */}
            <div className="h-32 bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-950/30 dark:to-teal-900/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center shadow-sm">
                <div className="text-primary">
                  {post.icon}
                </div>
              </div>
            </div>
            
            <CardContent className="p-5">
              {/* Category & Read Time */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {post.description}
              </p>
              
              {/* Read More Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" size="lg" className="gap-2">
          View All Articles
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default TypingBlog;
