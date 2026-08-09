import api from "./api.js";

export const getWatchlistRequest = async () => {
  const { data } = await api.get("/users/watchlist");
  return data.watchlist;
};

export const addToWatchlistRequest = async (movieId) => {
  const { data } = await api.post("/users/watchlist", { movieId });
  return data.watchlist;
};

export const removeFromWatchlistRequest = async (movieId) => {
  const { data } = await api.delete(`/users/watchlist/${movieId}`);
  return data.watchlist;
};

export const getFavoritesRequest = async () => {
  const { data } = await api.get("/users/favorites");
  return data.favorites;
};

export const addToFavoritesRequest = async (movieId) => {
  const { data } = await api.post("/users/favorites", { movieId });
  return data.favorites;
};

export const removeFromFavoritesRequest = async (movieId) => {
  const { data } = await api.delete(`/users/favorites/${movieId}`);
  return data.favorites;
};
