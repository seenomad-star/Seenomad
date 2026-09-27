import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Book,
  BookOpen,
  Search,
  Star,
  Clock,
  ChevronRight,
  Library,
  Filter,
} from "lucide-react";
import { books, genres, difficulties, Book as BookType } from "@/data/booksData";

const BookLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Get progress from localStorage
  const getBookProgress = (bookId: string) => {
    const progress = localStorage.getItem(`book-progress-${bookId}`);
    return progress ? JSON.parse(progress) : { completedChapters: [], lastChapter: null };
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    const matchesDifficulty =
      selectedDifficulty === "All" || book.difficulty === selectedDifficulty;
    return matchesSearch && matchesGenre && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleStartReading = (book: BookType) => {
    const progress = getBookProgress(book.id);
    const chapterIndex = progress.lastChapter
      ? book.chapters.findIndex((c) => c.id === progress.lastChapter)
      : 0;
    navigate(`/book-reader/${book.id}/${book.chapters[Math.max(0, chapterIndex)].id}`);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Library className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Book Library</h1>
            <p className="text-muted-foreground">
              Practice typing with classic literature from around the world
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff === "All" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Book className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{books.length}</p>
              <p className="text-xs text-muted-foreground">Total Books</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">
                {books.reduce((acc, b) => acc + b.chapters.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Chapters</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold">{genres.length - 1}</p>
              <p className="text-xs text-muted-foreground">Genres</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-violet-500" />
            <div>
              <p className="text-2xl font-bold">∞</p>
              <p className="text-xs text-muted-foreground">Practice Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const progress = getBookProgress(book.id);
          const progressPercent =
            (progress.completedChapters.length / book.chapters.length) * 100;

          return (
            <Card
              key={book.id}
              className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30"
              onClick={() => handleStartReading(book)}
            >
              {/* Book Cover */}
              <div
                className={`h-32 bg-gradient-to-br ${book.coverColor} flex items-center justify-center relative overflow-hidden`}
              >
                <Book className="h-16 w-16 text-white/80" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <Badge
                  className={`absolute top-3 right-3 ${getDifficultyColor(book.difficulty)}`}
                >
                  {book.difficulty}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className="text-xs">
                    {book.genre}
                  </Badge>
                  <span className="text-muted-foreground">
                    {book.chapters.length} chapters
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-1.5" />
                </div>

                <Button
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  {progress.completedChapters.length > 0 ? "Continue" : "Start Reading"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <Card className="p-12 text-center">
          <Book className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </Card>
      )}
    </div>
  );
};

export default BookLibrary;
