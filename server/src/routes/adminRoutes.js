import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllReviews,
  deleteAnyReview,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires a logged-in admin
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteAnyReview);

export default router;
