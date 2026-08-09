import api from "./api.js";

export const getMyReviews = async () => {
  const { data } = await api.get("/reviews/my");
  return data.reviews;
};

export const getReviewsForMovie = async (movieId) => {
  const { data } = await api.get(`/reviews/movie/${movieId}`);
  return data.reviews;
};

export const getMyReview = async (movieId) => {
  const { data } = await api.get(`/reviews/my/${movieId}`);
  return data.review; // null if the user hasn't reviewed this movie yet
};

export const createReview = async ({ movieId, rating, text }) => {
  const { data } = await api.post("/reviews", { movieId, rating, text });
  return data.review;
};

export const updateReview = async (id, { rating, text }) => {
  const { data } = await api.put(`/reviews/${id}`, { rating, text });
  return data.review;
};

export const deleteReview = async (id) => {
  await api.delete(`/reviews/${id}`);
};
