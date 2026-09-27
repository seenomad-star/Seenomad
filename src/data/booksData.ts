export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  genre: string;
  coverColor: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export const books: Book[] = [
  {
    id: "pride-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    language: "English",
    difficulty: "medium",
    genre: "Classic",
    coverColor: "from-rose-500 to-pink-600",
    chapters: [
      {
        id: "pp-1",
        title: "Chapter 1",
        content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
        wordCount: 65,
      },
      {
        id: "pp-2",
        title: "Chapter 2",
        content: "Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.",
        wordCount: 48,
      },
      {
        id: "pp-3",
        title: "Chapter 3",
        content: "Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways, with barefaced questions, ingenious suppositions, and distant surmises.",
        wordCount: 47,
      },
    ],
  },
  {
    id: "sherlock-holmes",
    title: "A Study in Scarlet",
    author: "Arthur Conan Doyle",
    language: "English",
    difficulty: "medium",
    genre: "Mystery",
    coverColor: "from-amber-500 to-orange-600",
    chapters: [
      {
        id: "sh-1",
        title: "Mr. Sherlock Holmes",
        content: "In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the army. Having completed my studies there, I was duly attached to the Fifth Northumberland Fusiliers as Assistant Surgeon.",
        wordCount: 50,
      },
      {
        id: "sh-2",
        title: "The Science of Deduction",
        content: "We met next day as he had arranged, and inspected the rooms at No. 221B, Baker Street, of which he had spoken at our meeting. They consisted of a couple of comfortable bed-rooms and a single large airy sitting-room, cheerfully furnished, and illuminated by two broad windows.",
        wordCount: 49,
      },
    ],
  },
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    language: "English",
    difficulty: "hard",
    genre: "Classic",
    coverColor: "from-emerald-500 to-teal-600",
    chapters: [
      {
        id: "gg-1",
        title: "Chapter 1",
        content: "In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world have not had the advantages that you have had.",
        wordCount: 54,
      },
      {
        id: "gg-2",
        title: "Chapter 2",
        content: "About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes, a fantastic farm where ashes grow like wheat.",
        wordCount: 55,
      },
    ],
  },
  {
    id: "alice-wonderland",
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    language: "English",
    difficulty: "easy",
    genre: "Fantasy",
    coverColor: "from-violet-500 to-purple-600",
    chapters: [
      {
        id: "aw-1",
        title: "Down the Rabbit-Hole",
        content: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, and what is the use of a book, thought Alice, without pictures or conversations.",
        wordCount: 58,
      },
      {
        id: "aw-2",
        title: "The Pool of Tears",
        content: "Curiouser and curiouser! cried Alice. She was so much surprised, that for the moment she quite forgot how to speak good English. Now I am opening out like the largest telescope that ever was! Good-bye, feet! Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now.",
        wordCount: 56,
      },
    ],
  },
  {
    id: "moby-dick",
    title: "Moby Dick",
    author: "Herman Melville",
    language: "English",
    difficulty: "hard",
    genre: "Adventure",
    coverColor: "from-blue-500 to-cyan-600",
    chapters: [
      {
        id: "md-1",
        title: "Loomings",
        content: "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen.",
        wordCount: 55,
      },
      {
        id: "md-2",
        title: "The Carpet-Bag",
        content: "I stuffed a shirt or two into my old carpet-bag, tucked it under my arm, and started for Cape Horn and the Pacific. Quitting the good city of old Manhatto, I duly arrived in New Bedford. It was a Saturday night in December.",
        wordCount: 44,
      },
    ],
  },
  {
    id: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    language: "English",
    difficulty: "medium",
    genre: "Horror",
    coverColor: "from-red-600 to-rose-700",
    chapters: [
      {
        id: "dr-1",
        title: "Jonathan Harker's Journal",
        content: "Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.",
        wordCount: 52,
      },
      {
        id: "dr-2",
        title: "The Castle",
        content: "I must have been asleep, for certainly if I had been fully awake I must have noticed the approach of such a remarkable place. In the gloom the courtyard looked of considerable size, and as several dark ways led from it under great round arches, it perhaps seemed bigger than it really is.",
        wordCount: 54,
      },
    ],
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    language: "English",
    difficulty: "hard",
    genre: "Horror",
    coverColor: "from-slate-600 to-zinc-700",
    chapters: [
      {
        id: "fr-1",
        title: "Letter I",
        content: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
        wordCount: 49,
      },
      {
        id: "fr-2",
        title: "Chapter 1",
        content: "I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.",
        wordCount: 42,
      },
    ],
  },
  {
    id: "1984",
    title: "1984",
    author: "George Orwell",
    language: "English",
    difficulty: "medium",
    genre: "Dystopia",
    coverColor: "from-gray-600 to-stone-700",
    chapters: [
      {
        id: "1984-1",
        title: "Part One, Chapter 1",
        content: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.",
        wordCount: 56,
      },
    ],
  },
];

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};

export const getChapterById = (bookId: string, chapterId: string): Chapter | undefined => {
  const book = getBookById(bookId);
  return book?.chapters.find((chapter) => chapter.id === chapterId);
};

export const genres = ["All", "Classic", "Mystery", "Fantasy", "Adventure", "Horror", "Dystopia"];
export const difficulties = ["All", "easy", "medium", "hard"];
