import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires a logged-in user
router.use(protect);

router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist/:movieId", removeFromWatchlist);

router.get("/favorites", getFavorites);
router.post("/favorites", addToFavorites);
router.delete("/favorites/:movieId", removeFromFavorites);

export default router;
