// Universal Global Movie & TV Shows Catalog Service (TMDB Integration)
const TMDB_API_KEY = "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Map TMDB genre IDs to human names
const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10765: "Sci-Fi & Fantasy",
};

export const formatTmdbMovie = (tmdbItem) => {
  if (!tmdbItem) return null;

  const id = tmdbItem.id;
  const title = tmdbItem.title || tmdbItem.name || tmdbItem.original_title || tmdbItem.original_name || "Untitled";
  const releaseYear = tmdbItem.release_date
    ? new Date(tmdbItem.release_date).getFullYear()
    : tmdbItem.first_air_date
    ? new Date(tmdbItem.first_air_date).getFullYear()
    : new Date().getFullYear();

  const genres = Array.isArray(tmdbItem.genres)
    ? tmdbItem.genres.map((g) => g.name)
    : (tmdbItem.genre_ids || []).map((gid) => GENRE_MAP[gid]).filter(Boolean);

  const mainGenre = genres[0] || (tmdbItem.first_air_date ? "Web Series" : "Cinema");

  const posterUrl = tmdbItem.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${tmdbItem.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80";

  const bannerUrl = tmdbItem.backdrop_path
    ? `${TMDB_IMAGE_BASE}/original${tmdbItem.backdrop_path}`
    : posterUrl;

  const rating = tmdbItem.vote_average ? Number(tmdbItem.vote_average.toFixed(1)) : 8.0;
  const isTv = Boolean(tmdbItem.first_air_date || tmdbItem.name || tmdbItem.number_of_seasons);

  const streamingMirrors = isTv
    ? [
        { name: "⚡ Server 1 (AutoEmbed TV)", url: `https://player.autoembed.cc/embed/tv/${id}/1/1`, type: "embed" },
        { name: "🎬 Server 2 (VidSrc Cloud)", url: `https://vidsrc.to/embed/tv/${id}/1/1`, type: "embed" },
        { name: "🚀 Server 3 (SuperEmbed Fast)", url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=1&e=1`, type: "embed" },
        { name: "🌐 Server 4 (EmbedSU VIP)", url: `https://embed.su/embed/tv/${id}/1/1`, type: "embed" },
        { name: "📼 Server 5 (Direct Mirror)", url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4", type: "video" },
      ]
    : [
        { name: "⚡ Server 1 (AutoEmbed 4K)", url: `https://player.autoembed.cc/embed/movie/${id}`, type: "embed" },
        { name: "🎬 Server 2 (VidSrc Cloud)", url: `https://vidsrc.to/embed/movie/${id}`, type: "embed" },
        { name: "🚀 Server 3 (SuperEmbed Fast)", url: `https://multiembed.mov/?video_id=${id}&tmdb=1`, type: "embed" },
        { name: "🌐 Server 4 (EmbedSU VIP)", url: `https://embed.su/embed/movie/${id}`, type: "embed" },
        { name: "📼 Server 5 (Direct Mirror)", url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4", type: "video" },
      ];

  return {
    _id: `tmdb-${id}`,
    tmdbId: id,
    title,
    slug: `tmdb-${id}`,
    description: tmdbItem.overview || `Watch ${title} (${releaseYear}) in Ultra HD 4K on FILMVORA.`,
    posterUrl,
    bannerUrl,
    trailerUrl: "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4",
    videoUrl: streamingMirrors[0].url,
    streamingMirrors,
    releaseYear,
    duration: tmdbItem.runtime ? `${tmdbItem.runtime} min` : isTv ? "Series (All Episodes)" : "125 min",
    rating,
    ageRating: tmdbItem.adult ? "18+" : "13+",
    quality: "4K Ultra HD",
    genre: mainGenre,
    genres: genres.length > 0 ? genres : [mainGenre],
    language: tmdbItem.original_language ? tmdbItem.original_language.toUpperCase() : "EN",
    director: "Acclaimed Director",
    cast: ["Star Cast", "Featured Actors"],
    tags: [mainGenre, releaseYear.toString(), "4K", isTv ? "TV Series" : "Movie", "Global"],
    views: Math.floor((tmdbItem.popularity || 50) * 120),
    isFeatured: (tmdbItem.vote_average || 0) >= 7.8,
    isTrending: (tmdbItem.popularity || 0) > 30,
    isPublished: true,
    isGlobal: true,
    isTv,
    createdAt: tmdbItem.release_date || tmdbItem.first_air_date || new Date().toISOString(),
  };
};

const generateSearchVariants = (q) => {
  const clean = q.trim().toLowerCase();
  const variants = new Set([clean]);

  if (clean.endsWith("va")) {
    variants.add(clean.replace(/va$/, "avaan"));
    variants.add(clean.replace(/va$/, "avan"));
    variants.add(clean.replace(/va$/, "awaan"));
    variants.add(clean.replace(/va$/, "awan"));
  }
  if (clean.endsWith("wa")) {
    variants.add(clean.replace(/wa$/, "waan"));
    variants.add(clean.replace(/wa$/, "wan"));
    variants.add(clean.replace(/wa$/, "avaan"));
  }
  if (clean.endsWith("an")) variants.add(clean.replace(/an$/, "aan"));
  if (clean.endsWith("aan")) variants.add(clean.replace(/aan$/, "an"));
  if (clean.endsWith("ey")) variants.add(clean.replace(/ey$/, "ay"));
  if (clean.endsWith("ay")) variants.add(clean.replace(/ay$/, "ey"));
  if (clean.endsWith("a")) variants.add(clean.replace(/a$/, "aa"));
  if (clean.endsWith("aa")) variants.add(clean.replace(/aa$/, "a"));

  variants.add(clean.replace(/v/g, "w"));
  variants.add(clean.replace(/w/g, "v"));
  variants.add(clean.replace(/ee/g, "i"));
  variants.add(clean.replace(/i/g, "ee"));
  variants.add(clean.replace(/oo/g, "u"));
  variants.add(clean.replace(/u/g, "oo"));
  variants.add(clean.replace(/aa/g, "a"));
  variants.add(clean.replace(/a/g, "aa"));
  variants.add(clean.replace(/bahu/g, "baahu"));
  variants.add(clean.replace(/ch/g, "chh"));
  variants.add(clean.replace(/chh/g, "ch"));
  variants.add(clean.replace(/kfg/g, "kgf"));
  variants.add(clean.replace(/kgf/g, "k.g.f"));
  variants.add(clean.replace(/sh/g, "s"));
  variants.add(clean.replace(/ph/g, "f"));
  variants.add(clean.replace(/f/g, "ph"));
  variants.add(clean.replace(/z/g, "j"));
  variants.add(clean.replace(/j/g, "z"));

  return Array.from(variants);
};

export const searchTmdb = async (query, page = 1) => {
  if (!query || !query.trim()) return [];

  const rawQuery = query.trim();
  const variants = generateSearchVariants(rawQuery);

  try {
    const fetchPromises = [];
    for (const v of variants.slice(0, 5)) {
      const q = encodeURIComponent(v);
      fetchPromises.push(
        fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .catch(() => ({ results: [] })),
        fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .catch(() => ({ results: [] })),
        fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .catch(() => ({ results: [] }))
      );
    }

    const responses = await Promise.all(fetchPromises);
    const allRawItems = [];

    for (const r of responses) {
      if (r && Array.isArray(r.results)) {
        for (const item of r.results) {
          if (item.media_type === "person" && Array.isArray(item.known_for)) {
            allRawItems.push(...item.known_for);
          } else if (item.title || item.name) {
            allRawItems.push(item);
          }
        }
      }
    }

    const seenIds = new Set();
    const uniqueRaw = [];

    for (const item of allRawItems) {
      if (item && item.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueRaw.push(item);
      }
    }

    // Smart Ranking: Exact Match > Starts With > Contains > Popularity
    const qLower = rawQuery.toLowerCase();
    uniqueRaw.sort((a, b) => {
      const aTitle = (a.title || a.name || "").toLowerCase();
      const bTitle = (b.title || b.name || "").toLowerCase();

      const aExact = aTitle === qLower;
      const bExact = bTitle === qLower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aTitle.startsWith(qLower);
      const bStarts = bTitle.startsWith(qLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aContains = aTitle.includes(qLower);
      const bContains = bTitle.includes(qLower);
      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;

      return (b.popularity || 0) - (a.popularity || 0);
    });

    return uniqueRaw.map(formatTmdbMovie).filter(Boolean);
  } catch (err) {
    console.error("[TMDB Service] Search error:", err.message);
    return [];
  }
};

export const getTmdbDetails = async (tmdbId) => {
  if (!tmdbId) return null;

  try {
    const cleanId = String(tmdbId).replace(/^tmdb-/, "");
    
    let res = await fetch(`${TMDB_BASE_URL}/movie/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`);
    let data = null;

    if (res.ok) {
      data = await res.json();
    } else {
      res = await fetch(`${TMDB_BASE_URL}/tv/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`);
      if (res.ok) {
        data = await res.json();
      }
    }

    if (!data) return null;

    const movie = formatTmdbMovie(data);

    if (data.credits) {
      if (Array.isArray(data.credits.cast)) {
        movie.cast = data.credits.cast.slice(0, 10).map((c) => c.name);
      }
      if (Array.isArray(data.credits.crew)) {
        const directorObj = data.credits.crew.find((c) => c.job === "Director");
        if (directorObj) movie.director = directorObj.name;
      }
    }

    if (data.created_by && Array.isArray(data.created_by) && data.created_by.length > 0) {
      movie.director = data.created_by.map((c) => c.name).join(", ");
    }

    if (data.videos && Array.isArray(data.videos.results)) {
      const trailer = data.videos.results.find(
        (v) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
      );
      if (trailer && trailer.key) {
        movie.trailerEmbed = `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`;
      }
    }

    if (data.recommendations && Array.isArray(data.recommendations.results)) {
      movie.related = data.recommendations.results.slice(0, 8).map(formatTmdbMovie);
    }

    return movie;
  } catch (err) {
    console.error("[TMDB Service] Details error:", err.message);
    return null;
  }
};
