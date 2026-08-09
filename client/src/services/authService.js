import api from "./api.js";

export const registerRequest = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data; // { success, token, user }
};

export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { success, token, user }
};

export const getMeRequest = async () => {
  const { data } = await api.get("/auth/me");
  return data; // { success, user }
};

export const updateProfileRequest = async (name) => {
  const { data } = await api.put("/auth/me", { name });
  return data; // { success, user }
};
