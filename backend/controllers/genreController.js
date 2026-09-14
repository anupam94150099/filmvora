import mongoose from "mongoose";
import Genre from "../models/Genre.js";
import Movie from "../models/Movie.js";
import slugify from "../utils/slugify.js";
import { inMemoryStore } from "../utils/mockStore.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getGenres = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      try {
        const count = await Genre.countDocuments();
        if (count > 0) {
          const genres = await Genre.find().sort({ name: 1 });
          const genresWithCount = await Promise.all(
            genres.map(async (g) => {
              const count = await Movie.countDocuments({
                $or: [{ genre: g.name }, { genres: g.name }],
                isPublished: true,
              });
              return { ...g.toObject(), movieCount: count };
            })
          );
          return res.json({ success: true, genres: genresWithCount });
        }
      } catch (err) {}
    }

    const genresWithCount = inMemoryStore.genres.map((g) => {
      const count = inMemoryStore.movies.filter(
        (m) => (m.genre === g.name || (m.genres && m.genres.includes(g.name))) && m.isPublished
      ).length;
      return { ...g, movieCount: count };
    });

    res.json({ success: true, genres: genresWithCount });
  } catch (error) {
    next(error);
  }
};

export const getGenreBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDbConnected()) {
      try {
        const genre = await Genre.findOne({ slug });
        if (genre) {
          const movies = await Movie.find({
            $or: [{ genre: genre.name }, { genres: genre.name }],
            isPublished: true,
          }).sort({ rating: -1 });
          return res.json({ success: true, genre, movies });
        }
      } catch (err) {}
    }

    const genre = inMemoryStore.genres.find((g) => g.slug === slug);
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }

    const movies = inMemoryStore.movies.filter(
      (m) => (m.genre === genre.name || (m.genres && m.genres.includes(genre.name))) && m.isPublished
    );

    res.json({ success: true, genre, movies });
  } catch (error) {
    next(error);
  }
};

export const createGenre = async (req, res, next) => {
  try {
    const { name, description, image, featured } = req.body;
    const slug = slugify(name);

    const newGenre = {
      _id: `67d4f001000000000000${Date.now().toString().slice(-4)}`,
      name,
      slug,
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
      featured: Boolean(featured),
    };

    inMemoryStore.genres.push(newGenre);
    res.status(201).json({ success: true, message: "Genre created", genre: newGenre });
  } catch (error) {
    next(error);
  }
};

export const updateGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = inMemoryStore.genres.findIndex((g) => g._id.toString() === id);
    if (idx > -1) {
      inMemoryStore.genres[idx] = { ...inMemoryStore.genres[idx], ...req.body };
      return res.json({ success: true, message: "Genre updated", genre: inMemoryStore.genres[idx] });
    }
    res.status(404).json({ success: false, message: "Genre not found" });
  } catch (error) {
    next(error);
  }
};

export const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    inMemoryStore.genres = inMemoryStore.genres.filter((g) => g._id.toString() !== id);
    res.json({ success: true, message: "Genre deleted successfully" });
  } catch (error) {
    next(error);
  }
};
