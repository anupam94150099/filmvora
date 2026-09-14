import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
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
      required: [true, "Movie poster URL is required"],
    },
    backdrop: {
      type: String,
      required: [true, "Movie backdrop URL is required"],
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Streaming video URL is required"],
    },
    genre: {
      type: String,
      required: [true, "Primary genre is required"],
    },
    genres: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: "English",
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
    },
    duration: {
      type: Number, // In minutes
      required: [true, "Duration in minutes is required"],
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
    ageRating: {
      type: String,
      default: "13+",
    },
    quality: {
      type: String,
      default: "4K Ultra HD",
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

// Add text index for fast keyword search
movieSchema.index({ title: "text", description: "text", director: "text", cast: "text", tags: "text" });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
