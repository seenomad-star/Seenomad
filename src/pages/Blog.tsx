import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  BookOpen,
  Lightbulb,
  Users,
  Clock,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Keyboard,
  Zap,
  Award,
  Heart,
  Search,
  X,
  Filter,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/shared/AdBanner";

const ITEMS_PER_PAGE = 6;

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [readTimeFilter, setReadTimeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeTab, setActiveTab] = useState("tips");
  const [tipsPage, setTipsPage] = useState(1);
  const [guidesPage, setGuidesPage] = useState(1);
  const [communityPage, setCommunityPage] = useState(1);

  const featuredPost = {
    id: "science-behind-touch-typing",
    title: "The Science Behind Touch Typing: How Your Brain Learns",
    excerpt: "Discover the fascinating neuroscience behind muscle memory and how consistent practice rewires your brain for faster, more accurate typing.",
    category: "Typing Tips",
    readTime: "8 min read",
    date: "January 15, 2026",
    image: "/assets/images/blog_brain_typing_1770053586014.png"
  };

  const typingTips = [
    {
      id: "master-home-row",
      title: "Master the Home Row: Your Foundation for Speed",
      excerpt: "The home row is where your fingers should rest. Learn why ASDF and JKL; are the keys to unlocking your typing potential.",
      readTime: "5 min read",
      date: "January 12, 2026",
      icon: Keyboard,
      views: 4523
    },
    {
      id: "common-typing-mistakes",
      title: "10 Common Typing Mistakes and How to Fix Them",
      excerpt: "From looking at the keyboard to using the wrong fingers, discover the habits holding you back and strategies to overcome them.",
      readTime: "6 min read",
      date: "January 10, 2026",
      icon: Target,
      views: 8921
    },
    {
      id: "perfect-typing-posture",
      title: "The Perfect Typing Posture: Ergonomics 101",
      excerpt: "Proper posture isn't just about comfort—it's about performance. Learn how to set up your workspace for optimal typing.",
      readTime: "4 min read",
      date: "January 8, 2026",
      icon: Zap,
      views: 3215
    },
    {
      id: "speed-vs-accuracy",
      title: "Speed vs Accuracy: Finding the Right Balance",
      excerpt: "Should you focus on speed or accuracy first? We break down the debate and provide a training strategy that works.",
      readTime: "7 min read",
      date: "January 5, 2026",
      icon: TrendingUp,
      views: 6782
    },
    {
      id: "daily-practice-routines",
      title: "Daily Practice Routines for Rapid Improvement",
      excerpt: "Consistency beats intensity. Discover 15-minute daily routines that will dramatically improve your typing skills.",
      readTime: "5 min read",
      date: "January 3, 2026",
      icon: Clock,
      views: 5431
    }
  ];

  const techniqueGuides = [
    {
      id: "advanced-finger-placement",
      title: "Advanced Finger Placement Techniques",
      excerpt: "Go beyond the basics with advanced finger positioning strategies used by professional typists and court reporters.",
      readTime: "10 min read",
      date: "January 14, 2026",
      level: "Advanced",
      views: 2341
    },
    {
      id: "mastering-numbers-symbols",
      title: "Mastering Numbers and Symbols",
      excerpt: "The top row and special characters are often neglected. Learn efficient techniques for typing numbers and symbols without looking.",
      readTime: "8 min read",
      date: "January 11, 2026",
      level: "Intermediate",
      views: 4567
    },
    {
      id: "touch-typing-beginners",
      title: "Touch Typing for Beginners: A Complete Guide",
      excerpt: "Starting from scratch? This comprehensive guide will take you from hunt-and-peck to touch typing in just 30 days.",
      readTime: "15 min read",
      date: "January 9, 2026",
      level: "Beginner",
      views: 12453
    },
    {
      id: "rhythm-and-flow",
      title: "Rhythm and Flow: The Secret to 100+ WPM",
      excerpt: "Speed isn't just about moving faster—it's about finding your rhythm. Learn the techniques that top typists use.",
      readTime: "9 min read",
      date: "January 7, 2026",
      level: "Advanced",
      views: 7823
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts That Will Transform Your Workflow",
      excerpt: "Beyond typing speed, keyboard shortcuts can save hours every week. Master the essential shortcuts for any profession.",
      readTime: "6 min read",
      date: "January 4, 2026",
      level: "All Levels",
      views: 9102
    }
  ];

  const communityHighlights = [
    {
      id: "sarah-journey-120wpm",
      title: "From 30 to 120 WPM: Sarah's Incredible Journey",
      excerpt: "Meet Sarah, a TypeMaster user who transformed her typing skills in just 6 months. She shares her tips and daily routine.",
      readTime: "6 min read",
      date: "January 13, 2026",
      type: "Success Story",
      avatar: "S",
      views: 15234
    },
    {
      id: "community-challenge-winners",
      title: "Community Challenge Winners: December 2025",
      excerpt: "Congratulations to our monthly challenge winners! See who topped the leaderboards and claimed exclusive rewards.",
      readTime: "3 min read",
      date: "January 6, 2026",
      type: "Community",
      avatar: "🏆",
      views: 6789
    },
    {
      id: "teacher-spotlight-johnson",
      title: "Teacher Spotlight: How Mrs. Johnson Uses TypeMaster",
      excerpt: "Learn how educators are using our platform to teach typing skills to students of all ages in innovative ways.",
      readTime: "5 min read",
      date: "January 2, 2026",
      type: "Educator Story",
      avatar: "J",
      views: 3456
    },
    {
      id: "building-typing-club",
      title: "Building a Typing Club: Tips from Community Leaders",
      excerpt: "Want to start a typing club at your school or workplace? Community leaders share their best practices.",
      readTime: "7 min read",
      date: "December 28, 2025",
      type: "Guide",
      avatar: "🎯",
      views: 2134
    },
    {
      id: "interview-200wpm-typist",
      title: "Interview: Meet the 200 WPM Typist",
      excerpt: "We sat down with one of the fastest typists in our community to learn about their journey and secrets to success.",
      readTime: "8 min read",
      date: "December 25, 2025",
      type: "Interview",
      avatar: "⚡",
      views: 11567
    }
  ];

  const getReadTimeMinutes = (readTime: string) => {
    const match = readTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const parseDate = (dateStr: string) => {
    return new Date(dateStr).getTime();
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const sortItems = <T extends { date: string; readTime: string; views: number }>(items: T[]) => {
    const sorted = [...items];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      case "oldest":
        return sorted.sort((a, b) => parseDate(a.date) - parseDate(b.date));
      case "popular":
        return sorted.sort((a, b) => b.views - a.views);
      case "readtime-short":
        return sorted.sort((a, b) => getReadTimeMinutes(a.readTime) - getReadTimeMinutes(b.readTime));
      case "readtime-long":
        return sorted.sort((a, b) => getReadTimeMinutes(b.readTime) - getReadTimeMinutes(a.readTime));
      default:
        return sorted;
    }
  };

  const filterBySearch = <T extends { title: string; excerpt: string }>(items: T[]) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query)
    );
  };

  const filterByReadTime = <T extends { readTime: string }>(items: T[]) => {
    if (readTimeFilter === "all") return items;
    return items.filter(item => {
      const minutes = getReadTimeMinutes(item.readTime);
      switch (readTimeFilter) {
        case "short":
          return minutes <= 5;
        case "medium":
          return minutes > 5 && minutes <= 10;
        case "long":
          return minutes > 10;
        default:
          return true;
      }
    });
  };

  const filteredTypingTips = useMemo(() => {
    return sortItems(filterByReadTime(filterBySearch(typingTips)));
  }, [searchQuery, readTimeFilter, sortBy]);

  const filteredTechniqueGuides = useMemo(() => {
    let filtered = filterBySearch(techniqueGuides);
    filtered = filterByReadTime(filtered);
    if (levelFilter !== "all") {
      filtered = filtered.filter(guide => guide.level === levelFilter);
    }
    return sortItems(filtered);
  }, [searchQuery, levelFilter, readTimeFilter, sortBy]);

  const filteredCommunityHighlights = useMemo(() => {
    return sortItems(filterByReadTime(filterBySearch(communityHighlights)));
  }, [searchQuery, readTimeFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter("all");
    setReadTimeFilter("all");
    setSortBy("newest");
    setTipsPage(1);
    setGuidesPage(1);
    setCommunityPage(1);
  };

  const hasActiveFilters = searchQuery || levelFilter !== "all" || readTimeFilter !== "all" || sortBy !== "newest";

  // Reset pagination when filters/sort change
  useMemo(() => {
    setTipsPage(1);
  }, [searchQuery, readTimeFilter, sortBy]);

  useMemo(() => {
    setGuidesPage(1);
  }, [searchQuery, levelFilter, readTimeFilter, sortBy]);

  useMemo(() => {
    setCommunityPage(1);
  }, [searchQuery, readTimeFilter, sortBy]);

  // Pagination helpers
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const getTotalPages = (totalItems: number) => Math.ceil(totalItems / ITEMS_PER_PAGE);

  const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const pages: (number | 'ellipsis')[] = [];

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage > 3) {
          pages.push('ellipsis');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          pages.push('ellipsis');
        }

        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Paginated data
  const paginatedTips = paginateItems(filteredTypingTips, tipsPage);
  const paginatedGuides = paginateItems(filteredTechniqueGuides, guidesPage);
  const paginatedCommunity = paginateItems(filteredCommunityHighlights, communityPage);

  const tipsTotalPages = getTotalPages(filteredTypingTips.length);
  const guidesTotalPages = getTotalPages(filteredTechniqueGuides.length);
  const communityTotalPages = getTotalPages(filteredCommunityHighlights.length);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <BookOpen className="w-3 h-3 mr-1" />
            TypeMaster Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tips, Guides & <span className="text-primary">Community</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore expert typing tips, comprehensive technique guides, and inspiring stories from our community of typists.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:inline">Filters:</span>
              </div>

              {/* Level Filter */}
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="All Levels">General</SelectItem>
                </SelectContent>
              </Select>

              {/* Read Time Filter */}
              <Select value={readTimeFilter} onValueChange={setReadTimeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Read Time" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="all">Any Length</SelectItem>
                  <SelectItem value="short">Quick (≤5 min)</SelectItem>
                  <SelectItem value="medium">Medium (6-10 min)</SelectItem>
                  <SelectItem value="long">In-depth (10+ min)</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <ArrowUpDown className="w-3 h-3 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="readtime-short">Shortest Read</SelectItem>
                  <SelectItem value="readtime-long">Longest Read</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {levelFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Level: {levelFilter}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setLevelFilter("all")}
                  />
                </Badge>
              )}
              {readTimeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Time: {readTimeFilter === "short" ? "≤5 min" : readTimeFilter === "medium" ? "6-10 min" : "10+ min"}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setReadTimeFilter("all")}
                  />
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge variant="secondary" className="gap-1">
                  Sort: {sortBy === "oldest" ? "Oldest" : sortBy === "popular" ? "Popular" : sortBy === "readtime-short" ? "Shortest" : "Longest"}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSortBy("newest")}
                  />
                </Badge>
              )}
            </div>
          )}
        </Card>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-video md:aspect-auto">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                <Badge variant="outline">{featuredPost.category}</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </span>
                <span>{featuredPost.date}</span>
              </div>
              <Link to={`/blog/${featuredPost.id}`}>
                <Button className="w-fit">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Blog Tabs */}
        <Tabs defaultValue="tips" value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Typing Tips</span>
              <span className="sm:hidden">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Technique Guides</span>
              <span className="sm:hidden">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Community</span>
              <span className="sm:hidden">Community</span>
            </TabsTrigger>
          </TabsList>

          {/* Typing Tips */}
          <TabsContent value="tips">
            {filteredTypingTips.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {paginatedTips.length} of {filteredTypingTips.length} articles
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedTips.map((post) => (
                    <Link to={`/blog/${post.id}`} key={post.id} className="block">
                      <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <post.icon className="w-5 h-5 text-primary" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.readTime}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-3 mb-4">
                            {post.excerpt}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatViews(post.views)}
                              </span>
                            </div>
                            <span className="text-primary text-sm flex items-center">
                              Read More
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {renderPagination(tipsPage, tipsTotalPages, setTipsPage)}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </TabsContent>

          {/* Technique Guides */}
          <TabsContent value="guides">
            {filteredTechniqueGuides.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {paginatedGuides.length} of {filteredTechniqueGuides.length} guides
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedGuides.map((guide) => (
                    <Link to={`/blog/${guide.id}`} key={guide.id} className="block">
                      <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getLevelColor(guide.level)}>
                              {guide.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {guide.readTime}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {guide.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-3 mb-4">
                            {guide.excerpt}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{guide.date}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatViews(guide.views)}
                              </span>
                            </div>
                            <span className="text-primary text-sm flex items-center">
                              Read Guide
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {renderPagination(guidesPage, guidesTotalPages, setGuidesPage)}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No guides found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </TabsContent>

          {/* Community Highlights */}
          <TabsContent value="community">
            {filteredCommunityHighlights.length > 0 ? (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {paginatedCommunity.length} of {filteredCommunityHighlights.length} stories
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCommunity.map((highlight) => (
                    <Link to={`/blog/${highlight.id}`} key={highlight.id} className="block">
                      <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                              {highlight.avatar}
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="text-xs">
                                {highlight.type}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {highlight.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-3 mb-4">
                            {highlight.excerpt}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{highlight.readTime}</span>
                              </div>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatViews(highlight.views)}
                              </span>
                            </div>
                            <span className="text-primary text-sm flex items-center">
                              Read Story
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {renderPagination(communityPage, communityTotalPages, setCommunityPage)}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* AD PLACEMENT - LEADERBOARD */}
        <div className="mb-12">
          <AdBanner type="banner" />
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get the latest typing tips, technique guides, and community highlights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center p-6 hover:border-primary/50 transition-colors">
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Popular Articles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore our most-read articles and guides
            </p>
            <Button variant="outline" size="sm" onClick={() => setSortBy("popular")}>Browse Popular</Button>
          </Card>
          <Card className="text-center p-6 hover:border-primary/50 transition-colors">
            <Award className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Expert Contributors</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Meet the typing experts behind our content
            </p>
            <Button variant="outline" size="sm">Meet Experts</Button>
          </Card>
          <Card className="text-center p-6 hover:border-primary/50 transition-colors">
            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Share Your Story</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have a success story? We'd love to feature you!
            </p>
            <Button variant="outline" size="sm">Submit Story</Button>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
