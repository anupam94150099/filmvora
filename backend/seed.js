import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Genre from "./models/Genre.js";
import Review from "./models/Review.js";
import slugify from "./utils/slugify.js";

dotenv.config();

const genresData = [
  {
    name: "Action",
    slug: "action",
    description: "High-octane adrenaline, explosive stunts, intense tactical combat and heroic journeys.",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    description: "Futuristic technology, deep space exploration, AI revolutions and mind-bending realities.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    name: "Drama",
    slug: "drama",
    description: "Compelling human narratives, emotional depths, moral dilemmas and poignant performances.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    name: "Thriller",
    slug: "thriller",
    description: "Gripping suspense, psychological twists, mysterious conspiracies and breathless pacing.",
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    name: "Comedy",
    slug: "comedy",
    description: "Witty banter, hilarious misadventures, situational comedy and feel-good laughs.",
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    name: "Horror",
    slug: "horror",
    description: "Chilling supernatural phenomena, psychological dread and terrifying mysteries.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    name: "Romance",
    slug: "romance",
    description: "Passionate love stories, unexpected connections, emotional resonance and heartfelt moments.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
  {
    name: "Animation",
    slug: "animation",
    description: "Breathtaking visual artistry, fantastical worlds and unforgettable storytelling for all ages.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
];

const moviesData = [
  {
    title: "The Last Horizon",
    description:
      "In the year 2184, an interstellar deep-reconnaissance team uncovers an ancient beacon on the rim of the solar system, unraveling the origin of humanity and a catastrophic cosmic anomaly.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action", "Adventure"],
    language: "English",
    releaseYear: 2025,
    duration: 138,
    rating: 9.1,
    director: "Marcus Vance",
    cast: ["Elena Rostova", "Julian Thorne", "Sarah Jenkins", "Devon Cole"],
    ageRating: "13+",
    quality: "4K Ultra HD",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    views: 48200,
    tags: ["Space", "Future", "AI", "Epic", "Cosmic"],
  },
  {
    title: "Midnight Echo",
    description:
      "A troubled audio forensic detective in Neo-Chicago begins receiving encrypted sound frequencies from an unknown caller claiming to be trapped in tomorrow.",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    genre: "Thriller",
    genres: ["Thriller", "Mystery", "Sci-Fi"],
    language: "English",
    releaseYear: 2024,
    duration: 114,
    rating: 8.7,
    director: "Sophia Laurent",
    cast: ["David Sterling", "Maya Lin", "Arthur Pendelton"],
    ageRating: "16+",
    quality: "4K Ultra HD",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    views: 36400,
    tags: ["Mystery", "Cyberpunk", "Audio", "Suspense"],
  },
  {
    title: "Silent Roads",
    description:
      "A solitary long-haul courier across a decommissioned transcontinental highway finds herself escorting an enigmatic passenger carrying the only cure to a global cognitive blackout.",
    poster: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Drama",
    genres: ["Drama", "Action", "Adventure"],
    language: "English",
    releaseYear: 2024,
    duration: 122,
    rating: 8.4,
    director: "Aiden Cross",
    cast: ["Rachel Briggs", "Mateo Silva", "Claire Dupont"],
    ageRating: "13+",
    quality: "1080p Full HD",
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    views: 29100,
    tags: ["Highway", "Survival", "Post-Apocalyptic", "Journey"],
  },
  {
    title: "Project Aurora",
    description:
      "When an atmospheric research base in the Arctic Circle detects an unnatural magnetic pulse beneath the glacial shelf, a specialized tactical team descends into an uncharted subterranean ecosystem.",
    poster: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    genre: "Action",
    genres: ["Action", "Sci-Fi", "Thriller"],
    language: "English",
    releaseYear: 2025,
    duration: 130,
    rating: 8.9,
    director: "Victor Krum",
    cast: ["Liam Walker", "Chloe Zhang", "Gabriel O'Connor"],
    ageRating: "16+",
    quality: "4K Ultra HD",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    views: 52100,
    tags: ["Arctic", "Tactical", "Monsters", "Expedition"],
  },
  {
    title: "Beyond the Stars",
    description:
      "A young astrophysics prodigy designs an experimental harmonic drive capable of bridging dimensional thresholds, opening a doorway to celestial civilizations.",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Adventure", "Family"],
    language: "English",
    releaseYear: 2023,
    duration: 108,
    rating: 8.2,
    director: "Hannah Miller",
    cast: ["Lucas Bennett", "Astrid Lind", "Professor Charles"],
    ageRating: "PG",
    quality: "1080p Full HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    views: 18900,
    tags: ["Space", "Young Prodigy", "Discovery"],
  },
  {
    title: "Hidden Truth",
    description:
      "An investigative journalist uncovers a multi-billion dollar pharmaceutical syndicate orchestrating synthetic epidemics across coastal metropolises.",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    genre: "Drama",
    genres: ["Drama", "Thriller", "Crime"],
    language: "English",
    releaseYear: 2024,
    duration: 126,
    rating: 8.6,
    director: "Nora Chen",
    cast: ["Julianne Moore", "Edward Norton", "Ken Watanabe"],
    ageRating: "16+",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    views: 31200,
    tags: ["Conspiracy", "Journalism", "Crime", "Intrigue"],
  },
  {
    title: "Chronicles of Lumina",
    description:
      "In a realm where light is harvested as magical energy, an orphaned clockmaker and a rogue sentinel embark on a quest to restore the Celestial Beacon before eternal darkness claims their world.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Animation",
    genres: ["Animation", "Adventure", "Fantasy"],
    language: "English",
    releaseYear: 2025,
    duration: 98,
    rating: 9.3,
    director: "Hayao Miyazaki Tribute Team",
    cast: ["Voice: Emma Watson", "Voice: Tom Hiddleston", "Voice: Ian McKellen"],
    ageRating: "PG",
    quality: "4K Ultra HD",
    isFeatured: true,
    isTrending: true,
    isPublished: true,
    views: 64500,
    tags: ["Fantasy", "Animation", "Magic", "Epic Quest"],
  },
  {
    title: "Velocity Shift",
    description:
      "A disgraced Formula E engineer and an underground street racer build a kinetic hypercar to take down an illegal betting cartel ruling the neon-lit streets of Tokyo.",
    poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    genre: "Action",
    genres: ["Action", "Thriller", "Crime"],
    language: "English",
    releaseYear: 2024,
    duration: 110,
    rating: 8.0,
    director: "Kenji Sato",
    cast: ["Ren Tanaka", "Mia Gallagher", "Dominic Reed"],
    ageRating: "13+",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    views: 22400,
    tags: ["Racing", "Cars", "Tokyo", "Adrenaline"],
  },
  {
    title: "Shadows in the Mist",
    description:
      "A remote coastal lighthouse keeper witnesses mysterious spectral figures emerging from the maritime fog during the solstice tide, guarding a forgotten seafaring curse.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    genre: "Horror",
    genres: ["Horror", "Mystery", "Thriller"],
    language: "English",
    releaseYear: 2024,
    duration: 104,
    rating: 7.9,
    director: "Gillian Thorne",
    cast: ["Cillian Hayes", "Abigail Ward", "Sean MacLeod"],
    ageRating: "18+",
    quality: "1080p Full HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    views: 19800,
    tags: ["Lighthouse", "Fog", "Ghosts", "Supernatural"],
  },
  {
    title: "Echoes of Autumn",
    description:
      "Two classical musicians reconnect across twenty years of parallel lives through handwritten letters tucked inside vintage vinyl records sold in Paris.",
    poster: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Romance",
    genres: ["Romance", "Drama", "Music"],
    language: "French",
    releaseYear: 2023,
    duration: 118,
    rating: 8.5,
    director: "Jean-Paul Gautier",
    cast: ["Camille Moreau", "Antoine Blanc", "Margot Dubois"],
    ageRating: "PG-13",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    views: 24600,
    tags: ["Paris", "Love", "Music", "Nostalgia"],
  },
  {
    title: "The Quantum Paradox",
    description:
      "When a particle accelerator experiment creates a fracture in linear causality, five scientists must navigate split realities before time irreversibly folds in on itself.",
    poster: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Thriller"],
    language: "English",
    releaseYear: 2025,
    duration: 135,
    rating: 8.8,
    director: "Alan Turing Project",
    cast: ["Alexander Scott", "Priya Sharma", "Oliver Berg"],
    ageRating: "13+",
    quality: "4K Ultra HD",
    isFeatured: false,
    isTrending: true,
    isPublished: true,
    views: 41000,
    tags: ["Multiverse", "Time Travel", "Physics"],
  },
  {
    title: "Laugh Track",
    description:
      "An unscripted sitcom studio discovers that their live studio audience isn't laughing at their jokes, but secretly controlling their real-world personal choices.",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    genre: "Comedy",
    genres: ["Comedy", "Sci-Fi", "Satire"],
    language: "English",
    releaseYear: 2024,
    duration: 96,
    rating: 7.8,
    director: "Seth Rollins",
    cast: ["Chris O'Dowd", "Maya Rudolph", "Keegan-Michael Key"],
    ageRating: "13+",
    quality: "1080p Full HD",
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    views: 17300,
    tags: ["Comedy", "Satire", "Meta", "TV Show"],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/filmvora";
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log("[Seed] Clearing existing collections...");
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    await Review.deleteMany({});

    console.log("[Seed] Creating Admin and Demo User accounts...");
    const adminUser = await User.create({
      name: "Filmvora Administrator",
      email: "admin@filmvora.com",
      password: "admin123", // Will be hashed by User model pre-save hook
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });

    const demoUser = await User.create({
      name: "Alex Mercer",
      email: "user@filmvora.com",
      password: "user123", // Will be hashed
      role: "user",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    });

    console.log("[Seed] Seeding Genres...");
    await Genre.insertMany(genresData);

    console.log("[Seed] Seeding Movies with Slugs...");
    const createdMovies = [];
    for (const item of moviesData) {
      const slug = slugify(item.title);
      const movie = await Movie.create({
        ...item,
        slug,
      });
      createdMovies.push(movie);
    }

    // Add first 2 movies to demo user's watchlist
    demoUser.watchlist = [createdMovies[0]._id, createdMovies[1]._id];
    await demoUser.save();

    console.log("[Seed] Seeding Reviews...");
    await Review.create({
      movie: createdMovies[0]._id,
      user: demoUser._id,
      userName: demoUser.name,
      userAvatar: demoUser.avatar,
      rating: 10,
      comment: "Absolutely breathtaking cinematography and story! One of the best Sci-Fi films I've streamed in years.",
    });

    await Review.create({
      movie: createdMovies[1]._id,
      user: adminUser._id,
      userName: adminUser.name,
      userAvatar: adminUser.avatar,
      rating: 9,
      comment: "A masterpiece of sonic storytelling and cyberpunk suspense. Unmatched sound design!",
    });

    console.log("\n========================================================");
    console.log("   FILMVORA DATABASE SEEDED SUCCESSFULLY!");
    console.log("========================================================");
    console.log(`Admin Account:  admin@filmvora.com  /  admin123`);
    console.log(`Demo User:      user@filmvora.com   /  user123`);
    console.log(`Genres Seeded:  ${genresData.length}`);
    console.log(`Movies Seeded:  ${createdMovies.length}`);
    console.log("========================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("[Seed Error]:", error);
    process.exit(1);
  }
};

seedDatabase();
