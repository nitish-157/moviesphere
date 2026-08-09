import tmdbClient from "../config/tmdb.js";

// Small helper so we don't repeat try/catch in every function
const fetchFromTMDB = async (res, endpoint, params = {}) => {
  try {
    const { data } = await tmdbClient.get(endpoint, { params });
    res.json(data);
  } catch (error) {
    console.error(`TMDB request failed [${endpoint}]:`, error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch data from TMDB",
    });
  }
};

// GET /api/movies/trending
export const getTrending = (req, res) => {
  const { timeWindow = "week" } = req.query; // "day" or "week"
  fetchFromTMDB(res, `/trending/movie/${timeWindow}`);
};

// GET /api/movies/popular
export const getPopular = (req, res) => {
  const { page = 1 } = req.query;
  fetchFromTMDB(res, "/movie/popular", { page });
};

// GET /api/movies/top-rated
export const getTopRated = (req, res) => {
  const { page = 1 } = req.query;
  fetchFromTMDB(res, "/movie/top_rated", { page });
};

// GET /api/movies/upcoming
export const getUpcoming = (req, res) => {
  const { page = 1 } = req.query;
  fetchFromTMDB(res, "/movie/upcoming", { page });
};

// GET /api/movies/search?query=...&page=1
export const searchMovies = (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query || !query.trim()) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }
  fetchFromTMDB(res, "/search/movie", { query, page });
};

// GET /api/movies/genres
export const getGenres = (req, res) => {
  fetchFromTMDB(res, "/genre/movie/list");
};

// GET /api/movies/genre/:genreId?page=1
export const getMoviesByGenre = (req, res) => {
  const { genreId } = req.params;
  const { page = 1 } = req.query;
  fetchFromTMDB(res, "/discover/movie", { with_genres: genreId, page });
};

// GET /api/movies/:id  -> full details + cast + trailer in one response
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await tmdbClient.get(`/movie/${id}`, {
      params: { append_to_response: "credits,videos,similar" },
    });
    res.json(data);
  } catch (error) {
    console.error(`TMDB movie details failed [${id}]:`, error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch movie details",
    });
  }
};
