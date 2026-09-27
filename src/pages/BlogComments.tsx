import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ThumbsUp, Send, Trophy, ShieldCheck, User } from "lucide-react";
import { useGamification } from "@/contexts/GamificationContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
    isVerified?: boolean;
  };
  content: string;
  timestamp: number;
  likes: number;
}

interface BlogCommentsProps {
  postId: string;
  postTitle?: string;
}

export function BlogComments({ postId, postTitle }: BlogCommentsProps) {
  const { userStats, addXP } = useGamification();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments from localStorage
  useEffect(() => {
    const storageKey = `comments-${postId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse comments", e);
      }
    } else {
      // Seed with some fake comments for "social proof" if empty
      const seedComments: Comment[] = [
        {
          id: "seed-1",
          author: { name: "Alex Chen", level: 12, isVerified: true },
          content: "This article completely changed how I practice. Spaced repetition is real!",
          timestamp: Date.now() - 86400000 * 2,
          likes: 45
        },
        {
          id: "seed-2",
          author: { name: "Sarah J.", level: 5 },
          content: "I started tracking my errors like mentioned here and gained 10 WPM in a week.",
          timestamp: Date.now() - 86400000 * 5,
          likes: 12
        }
      ];
      setComments(seedComments);
    }
  }, [postId]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay for "weighty" feel
    setTimeout(() => {
      const comment: Comment = {
        id: crypto.randomUUID(),
        author: {
          name: userStats.isLoggedIn ? "You" : "Guest Typist",
          avatar: userStats.isLoggedIn ? undefined : "https://github.com/shadcn.png",
          level: userStats.level,
          isVerified: userStats.level > 10
        },
        content: newComment,
        timestamp: Date.now(),
        likes: 0
      };

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));

      setNewComment("");
      setIsSubmitting(false);

      // Dopamine Hook: Award XP for engagement
      addXP(15);
      toast.success("Comment Posted!", {
        description: "You earned +15 XP for contributing to the discussion.",
        icon: <Trophy className="w-4 h-4 text-yellow-500" />
      });

    }, 600);
  };

  const handleLike = (commentId: string) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updated));
  };

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-secondary/20 overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-secondary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="w-5 h-5 text-primary" />
            Discussion ({comments.length})
          </CardTitle>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            Earn 15 XP per comment
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">

        {/* Input Area */}
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or typing tips..."
              className="min-h-[100px] resize-none bg-background/50 focus:bg-background transition-all border-border/60 focus:border-primary/50"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Posting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40" />

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="relative">
                <Avatar className={`w-10 h-10 border-2 ${comment.author.isVerified ? 'border-yellow-500/50' : 'border-border'}`}>
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                </Avatar>
                {comment.author.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-[2px] border-2 border-background" title="Verified Typist">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{comment.author.name}</span>
                  {comment.author.level > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-5 font-mono text-muted-foreground">
                      LVL {comment.author.level}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">• {formatDistanceToNow(comment.timestamp, { addSuffix: true })}</span>
                </div>

                <div className="px-4 py-3 bg-secondary/10 rounded-r-2xl rounded-bl-2xl text-sm leading-relaxed text-foreground/90 border border-border/30 group-hover:border-primary/20 transition-colors">
                  {comment.content}
                </div>

                <div className="flex items-center gap-4 pl-1">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                    Like
                  </button>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
