import User from "../models/User.js";
import Review from "../models/Review.js";

// All routes here require protect + adminOnly middleware.

// @desc   Dashboard summary stats
// @route  GET /api/admin/stats
// @access Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalReviews, totalAdmins] = await Promise.all([
      User.countDocuments(),
      Review.countDocuments(),
      User.countDocuments({ role: "admin" }),
    ]);

    // Most-reviewed movies - group reviews by movieId, count + average rating,
    // sorted descending, top 5. This is the "MongoDB aggregation" resume feature.
    const mostReviewedMovies = await Review.aggregate([
      {
        $group: {
          _id: "$movieId",
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          reviewCount: 1,
          averageRating: { $round: ["$averageRating", 1] },
        },
      },
    ]);

    // Signups per day for the last 14 days - powers a simple trend chart
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const signupsOverTime = await User.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReviews,
        totalAdmins,
        mostReviewedMovies,
        signupsOverTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   List all users (for the Manage Users table)
// @route  GET /api/admin/users
// @access Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a user (e.g. ban/remove)
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   List all reviews (for the Manage Reviews table)
// @route  GET /api/admin/reviews
// @access Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete any review (moderation)
// @route  DELETE /api/admin/reviews/:id
// @access Private/Admin
export const deleteAnyReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
