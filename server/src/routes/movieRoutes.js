import express from "express";
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  searchMovies,
  getGenres,
  getMoviesByGenre,
  getMovieDetails,
} from "../controllers/movieController.js";

const router = express.Router();

// Note: specific routes before the dynamic /:id route, or Express will
// try to match "trending", "search" etc. as an :id param.
router.get("/trending", getTrending);
router.get("/popular", getPopular);
router.get("/top-rated", getTopRated);
router.get("/upcoming", getUpcoming);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/genre/:genreId", getMoviesByGenre);
router.get("/:id", getMovieDetails);

export default router;
