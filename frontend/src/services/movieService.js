import API from "./api";

export const movieService = {
  // Fetch movies with filters, search, and pagination
  getMovies: async (params = {}) => {
    const response = await API.get("/movies", { params });
    return response.data;
  },

  // Fetch single movie by ID or Slug with full metadata, cast & where-to-watch sources
  getMovieByIdOrSlug: async (idOrSlug) => {
    const response = await API.get(`/movies/${idOrSlug}`);
    return response.data;
  },

  // Instant Autocomplete search for header dropdown
  getAutocomplete: async (query) => {
    const response = await API.get("/movies/instant-search", { params: { q: query } });
    return response.data;
  },

  // Fetch curated category rows (trending, popular, top-rated, upcoming, bollywood, hollywood, south-indian, korean, anime, web-series, free-stream)
  getCategoryMovies: async (category, page = 1) => {
    const response = await API.get(`/movies/categories/${category}`, { params: { page } });
    return response.data;
  },

  // Request legal download
  requestDownload: async (movieId, quality = "1080p") => {
    const response = await API.post(`/movies/${movieId}/download`, { quality });
    return response.data;
  },

  // Add review
  addReview: async (movieId, reviewData) => {
    const response = await API.post(`/movies/${movieId}/reviews`, reviewData);
    return response.data;
  },

  // Get reviews
  getReviews: async (movieId) => {
    const response = await API.get(`/movies/${movieId}/reviews`);
    return response.data;
  },
};

