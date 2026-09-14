import API from "./api";

export const movieService = {
  // Fetch movies with filters
  getMovies: async (params = {}) => {
    const response = await API.get("/movies", { params });
    return response.data;
  },

  // Fetch single movie by ID or Slug
  getMovieByIdOrSlug: async (idOrSlug) => {
    const response = await API.get(`/movies/${idOrSlug}`);
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
