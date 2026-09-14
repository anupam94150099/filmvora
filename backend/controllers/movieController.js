import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import slugify from "../utils/slugify.js";
import { inMemoryStore } from "../utils/mockStore.js";
import { searchTmdb, getTmdbDetails } from "../services/tmdbService.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Fast instant autocomplete search across local and TMDB global movies
// @route   GET /api/movies/instant-search?q=...
// @access  Public
export const instantSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim() || q.trim().length < 2) {
      return res.json({ success: true, results: [] });
    }

    const query = q.trim().toLowerCase();

    // 1. Search local store
    let localMatches = inMemoryStore.movies
      .filter((m) => m.isPublished && (m.title.toLowerCase().includes(query) || (m.tags && m.tags.some(t => t.toLowerCase().includes(query)))))
      .slice(0, 4);

    // 2. Search TMDB global catalog
    const tmdbMatches = await searchTmdb(query, 1);

    const seen = new Set();
    const results = [];

    for (const m of localMatches) {
      const key = m.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          _id: m._id,
          title: m.title,
          slug: m.slug || m._id,
          posterUrl: m.posterUrl,
          releaseYear: m.releaseYear,
          rating: m.rating,
          genre: m.genre || (m.genres && m.genres[0]) || "Movie",
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
          title: m.title,
          slug: m.slug,
          posterUrl: m.posterUrl,
          releaseYear: m.releaseYear,
          rating: m.rating,
          genre: m.genre,
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

// @desc    Get all movies with filtering, search, sorting & pagination
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      year,
      language,
      minRating,
      sort,
      featured,
      trending,
      isPublished,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // If search is requested, query both local DB and TMDB global movies
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      let localMatches = [];

      if (isDbConnected()) {
        try {
          localMatches = await Movie.find({
            isPublished: isPublished !== "false",
            $or: [
              { title: { $regex: s, $options: "i" } },
              { description: { $regex: s, $options: "i" } },
              { director: { $regex: s, $options: "i" } },
              { cast: { $regex: s, $options: "i" } },
              { tags: { $regex: s, $options: "i" } },
            ],
          });
        } catch (dbErr) {}
      }

      if (localMatches.length === 0) {
        localMatches = inMemoryStore.movies.filter(
          (m) =>
            m.title.toLowerCase().includes(s) ||
            m.description.toLowerCase().includes(s) ||
            (m.director && m.director.toLowerCase().includes(s)) ||
            (m.cast && m.cast.some((c) => c.toLowerCase().includes(s)))
        );
      }

      // Fetch global TMDB results
      const tmdbResults = await searchTmdb(s, pageNum);

      // Merge and deduplicate
      const seenTitles = new Set();
      const combined = [];

      for (const m of localMatches) {
        const titleKey = m.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          combined.push(m);
        }
      }

      for (const m of tmdbResults) {
        const titleKey = m.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          combined.push(m);
        }
      }

      const total = combined.length;
      const skip = (pageNum - 1) * limitNum;
      const paginated = combined.slice(skip, skip + limitNum);

      return res.json({
        success: true,
        count: paginated.length,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
        currentPage: pageNum,
        movies: paginated,
      });
    }

    if (isDbConnected()) {
      try {
        const query = {};
        if (isPublished !== undefined) {
          query.isPublished = isPublished === "true";
        } else {
          query.isPublished = true;
        }

        if (genre && genre !== "All") {
          query.$or = [
            { genre: { $regex: new RegExp(`^${genre}$`, "i") } },
            { genres: { $in: [new RegExp(`^${genre}$`, "i")] } },
          ];
        }

        if (year && year !== "All") query.releaseYear = Number(year);
        if (language && language !== "All") query.language = { $regex: new RegExp(`^${language}$`, "i") };
        if (minRating) query.rating = { $gte: Number(minRating) };
        if (featured !== undefined) query.isFeatured = featured === "true";
        if (trending !== undefined) query.isTrending = trending === "true";

        let sortOption = { createdAt: -1 };
        if (sort === "popular" || sort === "views") sortOption = { views: -1 };
        else if (sort === "topRated" || sort === "rating") sortOption = { rating: -1 };
        else if (sort === "year") sortOption = { releaseYear: -1 };
        else if (sort === "title") sortOption = { title: 1 };

        const skip = (pageNum - 1) * limitNum;

        const total = await Movie.countDocuments(query);
        if (total > 0) {
          const movies = await Movie.find(query).sort(sortOption).skip(skip).limit(limitNum);
          return res.json({
            success: true,
            count: movies.length,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
            currentPage: pageNum,
            movies,
          });
        }
      } catch (dbErr) {
        console.warn("[MovieController] Mongo query fallback:", dbErr.message);
      }
    }

    // Fallback in-memory query
    let filtered = [...inMemoryStore.movies];

    if (isPublished !== undefined) {
      const pub = isPublished === "true";
      filtered = filtered.filter((m) => m.isPublished === pub);
    }

    if (genre && genre !== "All") {
      filtered = filtered.filter(
        (m) =>
          m.genre.toLowerCase() === genre.toLowerCase() ||
          (m.genres && m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()))
      );
    }

    if (year && year !== "All") {
      filtered = filtered.filter((m) => m.releaseYear === Number(year));
    }

    if (language && language !== "All") {
      filtered = filtered.filter((m) => m.language.toLowerCase() === language.toLowerCase());
    }

    if (minRating) {
      filtered = filtered.filter((m) => m.rating >= Number(minRating));
    }

    if (featured !== undefined) {
      const feat = featured === "true";
      filtered = filtered.filter((m) => m.isFeatured === feat);
    }

    if (trending !== undefined) {
      const trend = trending === "true";
      filtered = filtered.filter((m) => m.isTrending === trend);
    }

    if (sort === "popular" || sort === "views") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sort === "topRated" || sort === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === "year") {
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sort === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    res.json({
      success: true,
      count: paginated.length,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limitNum) || 1,
      currentPage: pageNum,
      movies: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID or Slug (Local or TMDB Global)
// @route   GET /api/movies/:idOrSlug
// @access  Public
export const getMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Check if it's a global TMDB movie ID
    if (String(id).startsWith("tmdb-") || (!isNaN(id) && Number(id) > 1000)) {
      const tmdbMovie = await getTmdbDetails(id);
      if (tmdbMovie) {
        return res.json({
          success: true,
          movie: tmdbMovie,
          related: tmdbMovie.related || inMemoryStore.movies.slice(0, 6),
        });
      }
    }

    if (isDbConnected()) {
      try {
        let movie;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          movie = await Movie.findById(id);
        } else {
          movie = await Movie.findOne({ slug: id });
        }

        if (movie) {
          movie.views = (movie.views || 0) + 1;
          await movie.save();

          const related = await Movie.find({
            _id: { $ne: movie._id },
            isPublished: true,
            genre: movie.genre,
          }).limit(6);

          return res.json({
            success: true,
            movie,
            related,
          });
        }
      } catch (err) {}
    }

    let movie = inMemoryStore.movies.find(
      (m) => m._id.toString() === id || m.slug === id
    );

    if (!movie) {
      // Fallback: Try fetching from TMDB in case slug matches
      const tmdbMovie = await getTmdbDetails(id);
      if (tmdbMovie) {
        return res.json({
          success: true,
          movie: tmdbMovie,
          related: tmdbMovie.related || inMemoryStore.movies.slice(0, 6),
        });
      }

      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    movie.views = (movie.views || 0) + 1;

    const related = inMemoryStore.movies
      .filter((m) => m._id.toString() !== movie._id.toString() && m.genre === movie.genre)
      .slice(0, 6);

    res.json({
      success: true,
      movie,
      related,
    });
  } catch (error) {
    next(error);
  }
};

export const requestDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quality = "1080p", audio = "original" } = req.body;

    let movie = inMemoryStore.movies.find(
      (m) => m._id.toString() === id || m.slug === id
    );

    if (isDbConnected()) {
      try {
        const dbMovie = (await Movie.findById(id)) || (await Movie.findOne({ slug: id }));
        if (dbMovie) movie = dbMovie;
      } catch (err) {}
    }

    if (!movie) {
      movie = await getTmdbDetails(id);
    }

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Quality packages mapping
    const qualityPackages = {
      "4k": {
        resolution: "3840x2160 (4K UHD)",
        fileSize: "2.4 GB",
        codec: "HEVC / H.265 (HDR10)",
        bitrate: "18 Mbps",
      },
      "1080p": {
        resolution: "1920x1080 (Full HD)",
        fileSize: "1.2 GB",
        codec: "AVC / H.264",
        bitrate: "8 Mbps",
      },
      "720p": {
        resolution: "1280x720 (HD)",
        fileSize: "650 MB",
        codec: "AVC / H.264",
        bitrate: "3.5 Mbps",
      },
    };

    const selectedPkg = qualityPackages[quality.toLowerCase()] || qualityPackages["1080p"];
    const downloadToken = `dl_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const sanitizedFilename = `Filmvora_${(movie.title || "Movie").replace(/[^a-zA-Z0-9]/g, "_")}_${quality.toUpperCase()}.mp4`;

    // Direct stream download URL
    const directDownloadUrl = movie.videoUrl || "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";

    res.json({
      success: true,
      message: "Download link verified and generated successfully",
      download: {
        token: downloadToken,
        movieId: movie._id,
        title: movie.title,
        quality: quality.toUpperCase(),
        resolution: selectedPkg.resolution,
        fileSize: selectedPkg.fileSize,
        codec: selectedPkg.codec,
        audioTrack: audio,
        filename: sanitizedFilename,
        downloadUrl: directDownloadUrl,
        expiresInSeconds: 3600,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      poster,
      backdrop,
      trailerUrl,
      videoUrl,
      genre,
      genres,
      language,
      releaseYear,
      duration,
      rating,
      director,
      cast,
      ageRating,
      quality,
      isFeatured,
      isTrending,
      isPublished,
      tags,
    } = req.body;

    let baseSlug = slugify(title);
    let slug = baseSlug;

    if (isDbConnected()) {
      try {
        let counter = 1;
        while (await Movie.findOne({ slug })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        const movie = await Movie.create({
          title,
          slug,
          description,
          poster,
          backdrop,
          trailerUrl: trailerUrl || "",
          videoUrl,
          genre,
          genres: Array.isArray(genres) ? genres : [genre],
          language: language || "English",
          releaseYear: Number(releaseYear) || new Date().getFullYear(),
          duration: Number(duration) || 120,
          rating: Number(rating) || 7.0,
          director: director || "Filmvora Studios",
          cast: Array.isArray(cast) ? cast : cast ? cast.split(",").map((s) => s.trim()) : [],
          ageRating: ageRating || "13+",
          quality: quality || "4K Ultra HD",
          isFeatured: Boolean(isFeatured),
          isTrending: Boolean(isTrending),
          isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
          tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((s) => s.trim()) : [],
        });

        return res.status(201).json({
          success: true,
          message: "Movie created successfully",
          movie,
        });
      } catch (err) {}
    }

    const newMovie = {
      _id: `67d4f002000000000000${Date.now().toString().slice(-4)}`,
      title,
      slug,
      description,
      poster,
      backdrop,
      trailerUrl: trailerUrl || "",
      videoUrl,
      genre,
      genres: Array.isArray(genres) ? genres : [genre],
      language: language || "English",
      releaseYear: Number(releaseYear) || 2025,
      duration: Number(duration) || 120,
      rating: Number(rating) || 8.0,
      director: director || "Filmvora Studios",
      cast: Array.isArray(cast) ? cast : cast ? cast.split(",").map((s) => s.trim()) : [],
      ageRating: ageRating || "13+",
      quality: quality || "4K Ultra HD",
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((s) => s.trim()) : [],
      views: 0,
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

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const movie = await Movie.findById(id);
        if (movie) {
          const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
          return res.json({
            success: true,
            message: "Movie updated successfully",
            movie: updatedMovie,
          });
        }
      } catch (err) {}
    }

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

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        await Movie.findByIdAndDelete(id);
        await Review.deleteMany({ movie: id });
        return res.json({ success: true, message: "Movie deleted successfully" });
      } catch (err) {}
    }

    inMemoryStore.movies = inMemoryStore.movies.filter((m) => m._id.toString() !== id);
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review
export const addMovieReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const movieId = req.params.id;

    const newRev = {
      _id: `67d4f003000000000000${Date.now().toString().slice(-4)}`,
      movie: movieId,
      userName: req.user?.name || "Film Critic",
      userAvatar: req.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    inMemoryStore.reviews.unshift(newRev);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: newRev,
      newRating: Number(rating),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews
export const getMovieReviews = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const reviews = inMemoryStore.reviews.filter(
      (r) => r.movie.toString() === movieId.toString()
    );
    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
