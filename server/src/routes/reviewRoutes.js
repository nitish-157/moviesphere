import express from "express";
import {
  getReviewsForMovie,
  getMyReview,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - anyone can read a movie's reviews
router.get("/movie/:movieId", getReviewsForMovie);

// Everything else requires a logged-in user
router.get("/my", protect, getMyReviews);
router.get("/my/:movieId", protect, getMyReview);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
