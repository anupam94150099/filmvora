import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    originalTitle: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Movie description is required"],
    },
    poster: {
      type: String,
      default: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    },
    posterUrl: {
      type: String,
      default: "",
    },
    backdrop: {
      type: String,
      default: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    },
    bannerUrl: {
      type: String,
      default: "",
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    contentType: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    availability: {
      type: String,
      enum: [
        "OWNED",
        "LICENSED",
        "PUBLIC_DOMAIN",
        "CREATIVE_COMMONS",
        "EXTERNAL_STREAMING",
        "RENTAL",
        "PURCHASE",
      ],
      default: "EXTERNAL_STREAMING",
    },
    watchUrl: {
      type: String,
      default: "",
    },
    downloadUrl: {
      type: String,
      default: "",
    },
    officialSources: [
      {
        providerName: { type: String, required: true },
        logoUrl: { type: String, default: "" },
        type: { type: String, enum: ["stream", "rent", "buy", "free"], default: "stream" },
        url: { type: String, required: true },
        price: { type: String, default: "" },
      },
    ],
    genre: {
      type: String,
      default: "Cinema",
    },
    genres: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: "English",
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    country: {
      type: String,
      default: "United States",
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
    releaseDate: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "120 min",
    },
    runtime: {
      type: Number,
      default: 120,
    },
    rating: {
      type: Number,
      default: 7.5,
      min: 0,
      max: 10,
    },
    director: {
      type: String,
      default: "Unknown",
    },
    cast: {
      type: [String],
      default: [],
    },
    castDetails: [
      {
        name: String,
        character: String,
        profileUrl: String,
      },
    ],
    ageRating: {
      type: String,
      default: "13+",
    },
    quality: {
      type: String,
      default: "4K Ultra HD",
    },
    tmdbId: {
      type: String,
      default: "",
    },
    imdbId: {
      type: String,
      default: "",
    },
    productionCompanies: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    subtitles: [
      {
        lang: String,
        label: String,
        src: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

movieSchema.index({
  title: "text",
  description: "text",
  director: "text",
  cast: "text",
  tags: "text",
  genre: "text",
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
