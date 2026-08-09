import api from "./api.js";

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data.stats;
};

export const getAllUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const deleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};

export const getAllReviews = async () => {
  const { data } = await api.get("/admin/reviews");
  return data.reviews;
};

export const deleteAnyReview = async (id) => {
  await api.delete(`/admin/reviews/${id}`);
};
