import { useState } from "react";
import { Globe, Users, MessageSquare, Heart, Trophy, Star, Crown, Send, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { communityPosts } from "@/data/enterpriseFeaturesData";
import { useGamification } from "@/contexts/GamificationContext";

const postTypeColors: Record<string, string> = {
  achievement: "bg-green-500/20 text-green-400",
  tip: "bg-blue-500/20 text-blue-400",
  question: "bg-amber-500/20 text-amber-400",
  discussion: "bg-purple-500/20 text-purple-400",
};

const postTypeIcons: Record<string, React.ReactNode> = {
  achievement: <Trophy className="w-3 h-3" />,
  tip: <Star className="w-3 h-3" />,
  question: <MessageSquare className="w-3 h-3" />,
  discussion: <Users className="w-3 h-3" />,
};

export default function Community() {
  const { leaderboard, userStats } = useGamification();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 group">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop"
            alt="Community Hub"
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-8">
            <div className="max-w-md">
              <Badge className="mb-2 bg-blue-500 text-white border-none px-3 py-1">Community Hub</Badge>
              <h2 className="text-3xl font-bold text-white mb-2">Connect, Compete, Succeed</h2>
              <p className="text-blue-100/90 text-sm">Join over 150,000 typists from around the world and share your progress.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Active Discussions</h1>
              <p className="text-muted-foreground">See what's happening in the community today</p>
            </div>
          </div>
          <Badge variant="outline" className="text-muted-foreground">
            <Users className="w-3 h-3 mr-1" />
            12,458 members online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Input */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  L{userStats.level}
                </AvatarFallback>
              </Avatar>
              <Input placeholder="Share your typing journey..." className="flex-1" />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Feed Tabs */}
          <Tabs defaultValue="feed" className="space-y-4">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="feed">Latest</TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="w-4 h-4 mr-1" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="questions">
                <MessageSquare className="w-4 h-4 mr-1" />
                Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="p-5 bg-card hover:bg-secondary/20 transition-all">
                  <div className="flex gap-4">
                    <Avatar className="shrink-0 border border-border/50">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {post.author.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">Lv.{post.authorLevel}</Badge>
                        <span className="text-muted-foreground text-sm">{post.authorCountry}</span>
                        <Badge className={`${postTypeColors[post.type]} text-xs`}>
                          {postTypeIcons[post.type]}
                          <span className="ml-1">{post.type}</span>
                        </Badge>
                      </div>
                      <p className="text-foreground mb-3">{post.content}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <button
                          className={`flex items-center gap-1.5 transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <span className="text-muted-foreground">{formatTime(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending">
              {communityPosts.slice().sort((a, b) => b.likes - a.likes).map((post) => (
                <Card key={post.id} className="p-5 bg-card">
                  <div className="flex gap-4">
                    <Avatar className="shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {post.author.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">Lv.{post.authorLevel}</Badge>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-foreground mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="achievements">
              {communityPosts.filter(p => p.type === "achievement").map((post) => (
                <Card key={post.id} className="p-5 bg-card border-green-500/20">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-green-500/20">
                      <Trophy className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">Lv.{post.authorLevel}</Badge>
                      </div>
                      <p className="text-foreground">{post.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="questions">
              {communityPosts.filter(p => p.type === "question").map((post) => (
                <Card key={post.id} className="p-5 bg-card border-amber-500/20">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <MessageSquare className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">Lv.{post.authorLevel}</Badge>
                      </div>
                      <p className="text-foreground mb-3">{post.content}</p>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Answer ({post.comments})
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Leaderboard */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Top Typists
              </h3>
              <Badge variant="secondary">#130</Badge>
            </div>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {entry.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm truncate">{entry.username}</div>
                    <div className="text-xs text-muted-foreground">{entry.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-sm">{entry.wpm} WPM</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/leaderboard">View Full Leaderboard</a>
            </Button>
          </Card>

          {/* Community Stats */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Global Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Members</span>
                <span className="font-bold text-foreground">156,432</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tests Today</span>
                <span className="font-bold text-foreground">45,230</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Countries</span>
                <span className="font-bold text-foreground">195</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg WPM</span>
                <span className="font-bold text-foreground">52</span>
              </div>
            </div>
          </Card>

          {/* Top Countries */}
          <Card className="p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              Top Countries
            </h3>
            <div className="space-y-3">
              {[
                { country: "🇺🇸 United States", wpm: 68 },
                { country: "🇬🇧 United Kingdom", wpm: 65 },
                { country: "🇨🇦 Canada", wpm: 63 },
                { country: "🇦🇺 Australia", wpm: 61 },
                { country: "🇩🇪 Germany", wpm: 59 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-foreground">{item.country}</span>
                  <Badge variant="outline">{item.wpm} WPM</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
