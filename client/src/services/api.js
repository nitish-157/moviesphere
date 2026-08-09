import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api", // Vite proxy forwards this to the backend in dev
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (if we have one) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("moviesphere_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request that carried a token comes back 401, the session itself is
// invalid/expired (not just a wrong password on the login form) - clear it
// and send the person back to sign in, instead of letting every page fail
// silently with confusing errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(error.config?.headers?.Authorization);
    const isExpiredSession = error.response?.status === 401 && hadToken;

    if (isExpiredSession && window.location.pathname !== "/login") {
      localStorage.removeItem("moviesphere_token");
      localStorage.removeItem("moviesphere_user");
      toast.error("Your session expired. Please sign in again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
