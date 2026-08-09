import api from "./api.js";

export const getTrending = async (timeWindow = "week") => {
  const { data } = await api.get("/movies/trending", { params: { timeWindow } });
  return data.results;
};

export const getPopular = async (page = 1) => {
  const { data } = await api.get("/movies/popular", { params: { page } });
  return data;
};

export const getTopRated = async (page = 1) => {
  const { data } = await api.get("/movies/top-rated", { params: { page } });
  return data;
};

export const getUpcoming = async (page = 1) => {
  const { data } = await api.get("/movies/upcoming", { params: { page } });
  return data;
};

export const searchMovies = async (query, page = 1, signal) => {
  const { data } = await api.get("/movies/search", { params: { query, page }, signal });
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get("/movies/genres");
  return data.genres;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const { data } = await api.get(`/movies/genre/${genreId}`, { params: { page } });
  return data;
};

export const getMovieDetails = async (id) => {
  const { data } = await api.get(`/movies/${id}`);
  return data;
};

// TMDB image base - w500 is a good balance of quality/size for posters
export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
