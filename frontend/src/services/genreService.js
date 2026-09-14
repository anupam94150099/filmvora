import API from "./api";

export const genreService = {
  getGenres: async () => {
    const response = await API.get("/genres");
    return response.data;
  },

  getGenreBySlug: async (slug) => {
    const response = await API.get(`/genres/${slug}`);
    return response.data;
  },
};
