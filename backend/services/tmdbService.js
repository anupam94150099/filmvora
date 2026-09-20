// Universal Global Legal Movie & TV Shows Catalog Service (TMDB Integration)
const TMDB_API_KEY = process.env.TMDB_API_KEY || "4e44d9029b1270a757cddc766a1bcb63";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Map TMDB genre IDs to human names
export const GENRE_MAP = {
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
  const originalTitle = tmdbItem.original_title || tmdbItem.original_name || title;
  const releaseDate = tmdbItem.release_date || tmdbItem.first_air_date || "";
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : new Date().getFullYear();

  const genres = Array.isArray(tmdbItem.genres)
    ? tmdbItem.genres.map((g) => (typeof g === "string" ? g : g.name))
    : (tmdbItem.genre_ids || []).map((gid) => GENRE_MAP[gid]).filter(Boolean);

  const mainGenre = genres[0] || (tmdbItem.first_air_date ? "Web Series" : "Cinema");

  const posterUrl = tmdbItem.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${tmdbItem.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80";

  const bannerUrl = tmdbItem.backdrop_path
    ? `${TMDB_IMAGE_BASE}/original${tmdbItem.backdrop_path}`
    : posterUrl;

  const rating = tmdbItem.vote_average ? Number(tmdbItem.vote_average.toFixed(1)) : 7.8;
  const isTv = Boolean(tmdbItem.first_air_date || tmdbItem.name || tmdbItem.number_of_seasons);

  // Map known TMDB watch provider logos and deep-links if available
  const officialSources = [];
  if (tmdbItem.watchProviders) {
    officialSources.push(...tmdbItem.watchProviders);
  }

  return {
    _id: `tmdb-${id}`,
    tmdbId: String(id),
    title,
    originalTitle,
    slug: `tmdb-${id}`,
    description: tmdbItem.overview || `Discover complete details, cast, official trailers, and where to legally watch ${title} (${releaseYear}) on FILMVORA.`,
    poster: posterUrl,
    posterUrl,
    backdrop: bannerUrl,
    bannerUrl,
    trailerUrl: tmdbItem.trailerUrl || "",
    videoUrl: "",
    watchUrl: "",
    downloadUrl: "",
    contentType: isTv ? "tv" : "movie",
    availability: "EXTERNAL_STREAMING",
    officialSources,
    releaseYear,
    releaseDate,
    duration: tmdbItem.runtime ? `${tmdbItem.runtime} min` : isTv ? "Series" : "120 min",
    runtime: tmdbItem.runtime || 120,
    rating,
    ageRating: tmdbItem.adult ? "18+" : "13+",
    quality: "4K Ultra HD",
    genre: mainGenre,
    genres: genres.length > 0 ? genres : [mainGenre],
    language: tmdbItem.original_language ? tmdbItem.original_language.toUpperCase() : "EN",
    languages: tmdbItem.spoken_languages ? tmdbItem.spoken_languages.map((l) => l.english_name || l.name) : ["English"],
    country: tmdbItem.origin_country && tmdbItem.origin_country[0] ? tmdbItem.origin_country[0] : tmdbItem.production_countries && tmdbItem.production_countries[0] ? tmdbItem.production_countries[0].name : "Global",
    director: tmdbItem.director || "Acclaimed Director",
    cast: Array.isArray(tmdbItem.cast) ? tmdbItem.cast : ["Star Cast", "Featured Cast"],
    castDetails: tmdbItem.castDetails || [],
    productionCompanies: tmdbItem.production_companies ? tmdbItem.production_companies.map((p) => p.name) : [],
    tags: [mainGenre, releaseYear.toString(), isTv ? "TV Series" : "Movie", "Legal Stream", "Discovery"],
    views: Math.floor((tmdbItem.popularity || 50) * 85),
    isFeatured: (tmdbItem.vote_average || 0) >= 7.6 && (tmdbItem.popularity || 0) > 20,
    isTrending: (tmdbItem.popularity || 0) > 25,
    isPublished: true,
    isGlobal: true,
    isTv,
    createdAt: releaseDate || new Date().toISOString(),
  };
};

// Generate phonetic / spelling search variants
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
  variants.add(clean.replace(/bahu/g, "baahu"));
  variants.add(clean.replace(/kgf/g, "k.g.f"));
  variants.add(clean.replace(/kfg/g, "kgf"));
  variants.add(clean.replace(/sh/g, "s"));
  variants.add(clean.replace(/ph/g, "f"));
  variants.add(clean.replace(/f/g, "ph"));

  return Array.from(variants);
};

// Search TMDB across Movies, TV Shows, and People
export const searchTmdb = async (query, page = 1) => {
  if (!query || !query.trim()) return [];

  const rawQuery = query.trim();
  const variants = generateSearchVariants(rawQuery);

  try {
    const fetchPromises = [];
    for (const v of variants.slice(0, 4)) {
      const q = encodeURIComponent(v);
      fetchPromises.push(
        fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .catch(() => ({ results: [] })),
        fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .catch(() => ({ results: [] })),
        fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${q}&page=${page}&include_adult=false`)
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

    return uniqueRaw.slice(0, 30).map(formatTmdbMovie).filter(Boolean);
  } catch (err) {
    console.error("[TMDB Service] Search error:", err.message);
    return [];
  }
};

// Fast Autocomplete Suggestions for live search dropdown
export const autocompleteTmdb = async (query) => {
  if (!query || !query.trim() || query.trim().length < 2) return [];
  const q = encodeURIComponent(query.trim());
  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${q}&page=1&include_adult=false`);
    if (!res.ok) return [];
    const data = await res.json();
    const results = (data.results || [])
      .filter((item) => (item.title || item.name) && (item.poster_path || item.backdrop_path))
      .slice(0, 8)
      .map(formatTmdbMovie);
    return results;
  } catch (err) {
    return [];
  }
};

// Deep Details Fetcher with Watch Providers, Official Trailers, Cast avatars & Recommendations
export const getTmdbDetails = async (tmdbId) => {
  if (!tmdbId) return null;

  try {
    const cleanId = String(tmdbId).replace(/^tmdb-/, "");
    
    // Attempt movie lookup first
    let isTv = false;
    let res = await fetch(
      `${TMDB_BASE_URL}/movie/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations,similar,watch/providers`
    );
    let data = null;

    if (res.ok) {
      data = await res.json();
    } else {
      // Fallback to TV show lookup
      isTv = true;
      res = await fetch(
        `${TMDB_BASE_URL}/tv/${cleanId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations,similar,watch/providers`
      );
      if (res.ok) {
        data = await res.json();
      }
    }

    if (!data) return null;

    const movie = formatTmdbMovie(data);

    // 1. Process Credits (Cast & Director)
    if (data.credits) {
      if (Array.isArray(data.credits.cast)) {
        movie.cast = data.credits.cast.slice(0, 12).map((c) => c.name);
        movie.castDetails = data.credits.cast.slice(0, 12).map((c) => ({
          name: c.name,
          character: c.character || "Cast",
          profileUrl: c.profile_path
            ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}`
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        }));
      }
      if (Array.isArray(data.credits.crew)) {
        const directorObj = data.credits.crew.find((c) => c.job === "Director");
        if (directorObj) movie.director = directorObj.name;
      }
    }

    if (data.created_by && Array.isArray(data.created_by) && data.created_by.length > 0) {
      movie.director = data.created_by.map((c) => c.name).join(", ");
    }

    // 2. Process Official YouTube Trailer
    if (data.videos && Array.isArray(data.videos.results)) {
      const trailer = data.videos.results.find(
        (v) => (v.type === "Trailer" || v.type === "Teaser" || v.type === "Clip") && v.site === "YouTube"
      );
      if (trailer && trailer.key) {
        movie.trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        movie.trailerEmbed = `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`;
      }
    }

    // 3. Process Official Watch Providers (India IN, US, and Global)
    const officialSources = [];
    const wpData = data["watch/providers"]?.results;
    if (wpData) {
      const regionData = wpData.IN || wpData.US || wpData.GB || Object.values(wpData)[0];
      if (regionData) {
        // Stream / Flatrate
        if (Array.isArray(regionData.flatrate)) {
          for (const p of regionData.flatrate) {
            officialSources.push({
              providerName: p.provider_name,
              logoUrl: `${TMDB_IMAGE_BASE}/w92${p.logo_path}`,
              type: "stream",
              url: regionData.link || `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${cleanId}/watch`,
              price: "Subscription",
            });
          }
        }
        // Rent
        if (Array.isArray(regionData.rent)) {
          for (const p of regionData.rent) {
            officialSources.push({
              providerName: p.provider_name,
              logoUrl: `${TMDB_IMAGE_BASE}/w92${p.logo_path}`,
              type: "rent",
              url: regionData.link || `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${cleanId}/watch`,
              price: "Rent / PPV",
            });
          }
        }
        // Buy
        if (Array.isArray(regionData.buy)) {
          for (const p of regionData.buy) {
            officialSources.push({
              providerName: p.provider_name,
              logoUrl: `${TMDB_IMAGE_BASE}/w92${p.logo_path}`,
              type: "buy",
              url: regionData.link || `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${cleanId}/watch`,
              price: "Purchase",
            });
          }
        }
        // Free / Ad-Supported
        if (Array.isArray(regionData.free) || Array.isArray(regionData.ads)) {
          const freeList = regionData.free || regionData.ads || [];
          for (const p of freeList) {
            officialSources.push({
              providerName: p.provider_name,
              logoUrl: `${TMDB_IMAGE_BASE}/w92${p.logo_path}`,
              type: "free",
              url: regionData.link || `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${cleanId}/watch`,
              price: "Free with Ads",
            });
          }
        }
      }
    }

    // If no provider returned, provide fallback legal discovery hub
    if (officialSources.length === 0) {
      officialSources.push({
        providerName: "Check Theatrical / OTT Availability",
        logoUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&q=80",
        type: "stream",
        url: `https://www.themoviedb.org/${isTv ? "tv" : "movie"}/${cleanId}/watch`,
        price: "Official Info",
      });
    }
    movie.officialSources = officialSources;

    // 4. Recommendations & Similar
    const relatedList = [];
    if (data.recommendations && Array.isArray(data.recommendations.results)) {
      relatedList.push(...data.recommendations.results);
    }
    if (data.similar && Array.isArray(data.similar.results)) {
      relatedList.push(...data.similar.results);
    }
    const seenRelated = new Set();
    movie.related = relatedList
      .filter((r) => {
        if (!r || !r.id || seenRelated.has(r.id) || r.id === Number(cleanId)) return false;
        seenRelated.add(r.id);
        return true;
      })
      .slice(0, 10)
      .map(formatTmdbMovie);

    return movie;
  } catch (err) {
    console.error("[TMDB Service] Details error:", err.message);
    return null;
  }
};

// Discovery Endpoints for Categorized Homepage & Explore Rows
const fetchDiscover = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      include_adult: "false",
      page: params.page || 1,
      ...params,
    });
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}?${queryParams}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(formatTmdbMovie).filter(Boolean);
  } catch (err) {
    console.error(`[TMDB Discover] ${endpoint} error:`, err.message);
    return [];
  }
};

export const getTmdbTrending = (page = 1) => fetchDiscover("trending/all/week", { page });
export const getTmdbPopular = (page = 1) => fetchDiscover("movie/popular", { page });
export const getTmdbTopRated = (page = 1) => fetchDiscover("movie/top_rated", { page });
export const getTmdbUpcoming = (page = 1) => fetchDiscover("movie/upcoming", { page });
export const getTmdbBollywood = (page = 1) => fetchDiscover("discover/movie", { with_original_language: "hi", sort_by: "popularity.desc", page });
export const getTmdbHollywood = (page = 1) => fetchDiscover("discover/movie", { with_original_language: "en", sort_by: "popularity.desc", page });
export const getTmdbSouthIndian = (page = 1) => fetchDiscover("discover/movie", { with_original_language: "te|ta|ml|kn", sort_by: "popularity.desc", page });
export const getTmdbKorean = (page = 1) => fetchDiscover("discover/movie", { with_original_language: "ko", sort_by: "popularity.desc", page });
export const getTmdbAnime = (page = 1) => fetchDiscover("discover/movie", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page });
export const getTmdbWebSeries = (page = 1) => fetchDiscover("tv/popular", { page });
export const getTmdbByGenre = (genreId, page = 1) => fetchDiscover("discover/movie", { with_genres: String(genreId), sort_by: "popularity.desc", page });

