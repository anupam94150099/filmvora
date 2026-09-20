import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import slugify from "../utils/slugify.js";
import { inMemoryStore } from "../utils/mockStore.js";
import {
  searchTmdb,
  autocompleteTmdb,
  getTmdbDetails,
  getTmdbTrending,
  getTmdbPopular,
  getTmdbTopRated,
  getTmdbUpcoming,
  getTmdbBollywood,
  getTmdbHollywood,
  getTmdbSouthIndian,
  getTmdbKorean,
  getTmdbAnime,
  getTmdbWebSeries,
  getTmdbByGenre,
} from "../services/tmdbService.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Instant search & autocomplete suggestions
// @route   GET /api/movies/instant-search?q=...
// @access  Public
export const instantSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim() || q.trim().length < 2) {
      return res.json({ success: true, results: [] });
    }

    const query = q.trim().toLowerCase();

    // 1. Search local curated store
    const localMatches = inMemoryStore.movies
      .filter(
        (m) =>
          m.isPublished &&
          (m.title.toLowerCase().includes(query) ||
            (m.originalTitle && m.originalTitle.toLowerCase().includes(query)) ||
            (m.tags && m.tags.some((t) => t.toLowerCase().includes(query))))
      )
      .slice(0, 4);

    // 2. Search TMDB Autocomplete
    const tmdbMatches = await autocompleteTmdb(query);

    const seen = new Set();
    const results = [];

    for (const m of localMatches) {
      const key = m.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          _id: m._id,
          tmdbId: m.tmdbId || "",
          title: m.title,
          slug: m.slug || m._id,
          posterUrl: m.posterUrl || m.poster,
          releaseYear: m.releaseYear,
          rating: m.rating,
          genre: m.genre || (m.genres && m.genres[0]) || "Movie",
          language: m.language,
          availability: m.availability || "PUBLIC_DOMAIN",
          isGlobal: false,
        });
      }
    }

    for (const m of tmdbMatches) {
      const key = m.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          _id: m._id,
          tmdbId: m.tmdbId,
          title: m.title,
          slug: m.slug,
          posterUrl: m.posterUrl || m.poster,
          releaseYear: m.releaseYear,
          rating: m.rating,
          genre: m.genre,
          language: m.language,
          availability: m.availability || "EXTERNAL_STREAMING",
          isGlobal: true,
        });
      }
    }

    res.json({
      success: true,
      results: results.slice(0, 8),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all movies with multi-attribute filtering & search
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      year,
      language,
      country,
      minRating,
      availability,
      contentType,
      sort = "popularity",
      featured,
      trending,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // If text search is requested, query both local store and TMDB
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();

      // Search local database / memory store
      const localMatches = inMemoryStore.movies.filter((m) => {
        if (!m.isPublished) return false;
        const matchTitle = m.title.toLowerCase().includes(s);
        const matchDirector = m.director && m.director.toLowerCase().includes(s);
        const matchCast = m.cast && m.cast.some((c) => c.toLowerCase().includes(s));
        const matchGenre = m.genre && m.genre.toLowerCase().includes(s);
        const matchTags = m.tags && m.tags.some((t) => t.toLowerCase().includes(s));
        return matchTitle || matchDirector || matchCast || matchGenre || matchTags;
      });

      // Search TMDB
      const tmdbMatches = await searchTmdb(s, pageNum);

      // Merge and deduplicate
      const seenTitles = new Set();
      const combined = [];

      for (const m of localMatches) {
        seenTitles.add(m.title.toLowerCase().trim());
        combined.push(m);
      }

      for (const m of tmdbMatches) {
        const key = m.title.toLowerCase().trim();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          combined.push(m);
        }
      }

      // Apply in-memory secondary filters if provided
      let filtered = combined;
      if (genre && genre !== "All") {
        filtered = filtered.filter(
          (m) =>
            (m.genre && m.genre.toLowerCase() === genre.toLowerCase()) ||
            (m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()))
        );
      }
      if (year && year !== "All") {
        filtered = filtered.filter((m) => m.releaseYear === Number(year));
      }
      if (language && language !== "All") {
        filtered = filtered.filter(
          (m) =>
            (m.language && m.language.toLowerCase() === language.toLowerCase()) ||
            (m.languages && m.languages.some((l) => l.toLowerCase() === language.toLowerCase()))
        );
      }
      if (availability && availability !== "All") {
        filtered = filtered.filter((m) => m.availability === availability);
      }
      if (contentType && contentType !== "All") {
        filtered = filtered.filter((m) => m.contentType === contentType);
      }
      if (minRating) {
        filtered = filtered.filter((m) => m.rating >= Number(minRating));
      }

      const total = filtered.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        movies: paginated,
      });
    }

    // Standard catalog listing without search query
    let list = [...inMemoryStore.movies];

    if (genre && genre !== "All") {
      list = list.filter(
        (m) =>
          (m.genre && m.genre.toLowerCase() === genre.toLowerCase()) ||
          (m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()))
      );
    }
    if (year && year !== "All") {
      list = list.filter((m) => m.releaseYear === Number(year));
    }
    if (language && language !== "All") {
      list = list.filter(
        (m) =>
          (m.language && m.language.toLowerCase() === language.toLowerCase()) ||
          (m.languages && m.languages.some((l) => l.toLowerCase() === language.toLowerCase()))
      );
    }
    if (availability && availability !== "All") {
      list = list.filter((m) => m.availability === availability);
    }
    if (contentType && contentType !== "All") {
      list = list.filter((m) => m.contentType === contentType);
    }
    if (minRating) {
      list = list.filter((m) => m.rating >= Number(minRating));
    }
    if (featured === "true") {
      list = list.filter((m) => m.isFeatured);
    }
    if (trending === "true") {
      list = list.filter((m) => m.isTrending);
    }

    // Sort
    if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === "releaseDate" || sort === "year") {
      list.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    const total = list.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginated.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      movies: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID or slug
// @route   GET /api/movies/:id
// @access  Public
export const getMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if it is a TMDB ID
    if (id.startsWith("tmdb-")) {
      const tmdbMovie = await getTmdbDetails(id);
      if (tmdbMovie) {
        return res.json({ success: true, movie: tmdbMovie });
      }
    }

    // 2. Check local database / mockStore
    const local = inMemoryStore.movies.find(
      (m) => m._id.toString() === id || m.slug === id || (m.tmdbId && m.tmdbId === id)
    );
    if (local) {
      local.views = (local.views || 0) + 1;
      return res.json({ success: true, movie: local });
    }

    // 3. Fallback: try fetching as TMDB ID directly
    const fallbackTmdb = await getTmdbDetails(id);
    if (fallbackTmdb) {
      return res.json({ success: true, movie: fallbackTmdb });
    }

    res.status(404).json({ success: false, message: "No movie found with this ID or slug." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get curated homepage & discovery category rows
// @route   GET /api/movies/categories/:category
// @access  Public
export const getCategoryMovies = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page || 1, 10);

    let movies = [];

    switch (category) {
      case "trending":
        movies = await getTmdbTrending(page);
        break;
      case "popular":
        movies = await getTmdbPopular(page);
        break;
      case "top-rated":
        movies = await getTmdbTopRated(page);
        break;
      case "upcoming":
        movies = await getTmdbUpcoming(page);
        break;
      case "bollywood":
        movies = await getTmdbBollywood(page);
        break;
      case "hollywood":
        movies = await getTmdbHollywood(page);
        break;
      case "south-indian":
        movies = await getTmdbSouthIndian(page);
        break;
      case "korean":
        movies = await getTmdbKorean(page);
        break;
      case "anime":
        movies = await getTmdbAnime(page);
        break;
      case "web-series":
        movies = await getTmdbWebSeries(page);
        break;
      case "free-stream":
        movies = inMemoryStore.movies.filter(
          (m) => m.availability === "PUBLIC_DOMAIN" || m.availability === "CREATIVE_COMMONS" || m.availability === "LICENSED"
        );
        break;
      default:
        // Try genre lookup
        const genreId = Number(category);
        if (!isNaN(genreId)) {
          movies = await getTmdbByGenre(genreId, page);
        } else {
          movies = inMemoryStore.movies.slice(0, 10);
        }
        break;
    }

    res.json({
      success: true,
      category,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request safe legal download
// @route   POST /api/movies/:id/download
// @access  Public
export const requestDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quality = "1080p" } = req.body;

    let targetMovie = inMemoryStore.movies.find(
      (m) => m._id.toString() === id || m.slug === id || m.tmdbId === id
    );

    if (!targetMovie && id.startsWith("tmdb-")) {
      targetMovie = await getTmdbDetails(id);
    }

    if (!targetMovie) {
      return res.status(404).json({ success: false, message: "No movie found." });
    }

    // Strict Legal Check: Only allow download if movie has a legitimate downloadUrl or is Public Domain / Creative Commons
    const isLegalDownload =
      targetMovie.availability === "PUBLIC_DOMAIN" ||
      targetMovie.availability === "CREATIVE_COMMONS" ||
      targetMovie.availability === "LICENSED" ||
      targetMovie.availability === "OWNED";

    if (!isLegalDownload || !targetMovie.downloadUrl) {
      return res.status(403).json({
        success: false,
        isExternal: true,
        message:
          "This title is copyrighted and protected. Unauthorized downloads are not permitted. Please use the official Where to Watch streaming/rental sources.",
        officialSources: targetMovie.officialSources || [],
      });
    }

    const filename = `${targetMovie.title.replace(/[^a-zA-Z0-9]/g, "_")}_${quality}.mp4`;

    res.json({
      success: true,
      download: {
        title: targetMovie.title,
        filename,
        quality: quality.toUpperCase(),
        availability: targetMovie.availability,
        license: targetMovie.availability === "PUBLIC_DOMAIN" ? "Public Domain (Open License)" : "Creative Commons (Legal Free)",
        fileSize: quality === "4k" ? "1.8 GB" : quality === "1080p" ? "950 MB" : "480 MB",
        downloadUrl: targetMovie.downloadUrl,
        expiresIn: "Unlimited (Direct Legal Archive)",
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      originalTitle,
      description,
      poster,
      posterUrl,
      backdrop,
      bannerUrl,
      trailerUrl,
      videoUrl,
      watchUrl,
      downloadUrl,
      availability = "EXTERNAL_STREAMING",
      officialSources = [],
      genre = "Cinema",
      genres = [],
      language = "English",
      languages = ["English"],
      country = "India",
      releaseYear = 2025,
      duration = "120 min",
      rating = 8.0,
      director = "Acclaimed Director",
      cast = [],
      ageRating = "13+",
      quality = "4K Ultra HD",
      contentType = "movie",
      isFeatured = false,
      isTrending = false,
      isPublished = true,
      tags = [],
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const slug = slugify(title) + "-" + Date.now().toString().slice(-4);

    const newMovie = {
      _id: `67d4f002000000000000${Date.now().toString().slice(-4)}`,
      title,
      originalTitle: originalTitle || title,
      slug,
      description,
      poster: posterUrl || poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
      posterUrl: posterUrl || poster,
      backdrop: bannerUrl || backdrop || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
      bannerUrl: bannerUrl || backdrop,
      trailerUrl: trailerUrl || "",
      videoUrl: videoUrl || watchUrl || "",
      watchUrl: watchUrl || videoUrl || "",
      downloadUrl: downloadUrl || "",
      availability,
      officialSources: Array.isArray(officialSources) ? officialSources : [],
      contentType,
      genre,
      genres: Array.isArray(genres) && genres.length > 0 ? genres : [genre],
      language,
      languages: Array.isArray(languages) ? languages : [language],
      country,
      releaseYear: Number(releaseYear) || 2025,
      duration: String(duration),
      rating: Number(rating) || 8.0,
      director,
      cast: Array.isArray(cast) ? cast : typeof cast === "string" ? cast.split(",").map((s) => s.trim()) : [],
      ageRating,
      quality,
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isPublished: Boolean(isPublished),
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((s) => s.trim()) : [],
      views: 0,
      createdAt: new Date().toISOString(),
    };

    inMemoryStore.movies.unshift(newMovie);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie: newMovie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = inMemoryStore.movies.findIndex((m) => m._id.toString() === id);
    if (idx > -1) {
      inMemoryStore.movies[idx] = { ...inMemoryStore.movies[idx], ...req.body };
      return res.json({
        success: true,
        message: "Movie updated successfully",
        movie: inMemoryStore.movies[idx],
      });
    }
    res.status(404).json({ success: false, message: "Movie not found" });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    inMemoryStore.movies = inMemoryStore.movies.filter((m) => m._id.toString() !== id);
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Add movie review
// @route   POST /api/movies/:id/reviews
// @access  Private
export const addMovieReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const movieId = req.params.id;

    const newRev = {
      _id: `67d4f003000000000000${Date.now().toString().slice(-4)}`,
      movie: movieId,
      userName: req.user?.name || "Film Critic",
      userAvatar: req.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      rating: Number(rating) || 8,
      comment: comment || "Great movie discovery experience!",
      createdAt: new Date().toISOString(),
    };

    inMemoryStore.reviews.unshift(newRev);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: newRev,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a movie
// @route   GET /api/movies/:id/reviews
// @access  Public
export const getMovieReviews = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const reviews = inMemoryStore.reviews.filter(
      (r) => r.movie.toString() === movieId.toString()
    );
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};
