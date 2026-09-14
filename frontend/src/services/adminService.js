import API from "./api";

export const adminService = {
  // Stats
  getStats: async () => {
    const response = await API.get("/admin/stats");
    return response.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const response = await API.get("/admin/users", { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await API.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await API.put(`/admin/users/${userId}/status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Movie CRUD
  createMovie: async (movieData) => {
    const response = await API.post("/movies", movieData);
    return response.data;
  },

  updateMovie: async (movieId, movieData) => {
    const response = await API.put(`/movies/${movieId}`, movieData);
    return response.data;
  },

  deleteMovie: async (movieId) => {
    const response = await API.delete(`/movies/${movieId}`);
    return response.data;
  },

  // Genre CRUD
  createGenre: async (genreData) => {
    const response = await API.post("/genres", genreData);
    return response.data;
  },

  updateGenre: async (genreId, genreData) => {
    const response = await API.put(`/genres/id/${genreId}`, genreData);
    return response.data;
  },

  deleteGenre: async (genreId) => {
    const response = await API.delete(`/genres/id/${genreId}`);
    return response.data;
  },
};
