import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
  timeout: 8000,
});

export default tmdbClient;
