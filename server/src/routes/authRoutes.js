import express from "express";
import { registerUser, loginUser, getMe, updateMe } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Demo route to verify role-based access - Admin Dashboard routes (Step 20) will use the same pattern
router.get("/admin-check", protect, adminOnly, (req, res) => {
  res.json({ success: true, message: `Welcome admin ${req.user.name}` });
});

export default router;
