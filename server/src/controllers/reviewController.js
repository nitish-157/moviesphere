import Review from "../models/Review.js";

// @desc   Get all reviews for a movie, newest first, with the reviewer's name attached
// @route  GET /api/reviews/movie/:movieId
// @access Public
export const getReviewsForMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("user", "name") // only pull the reviewer's name, not their whole profile
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all reviews written by the logged-in user, across all movies
// @route  GET /api/reviews/my
// @access Private
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get the logged-in user's own review for a movie (if any) - lets the
//         frontend show "Edit your review" instead of a blank form
// @route  GET /api/reviews/my/:movieId
// @access Private
export const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user._id, movieId: req.params.movieId });
    res.json({ success: true, review: review || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create a review
// @route  POST /api/reviews   body: { movieId, rating, text }
// @access Private
export const createReview = async (req, res) => {
  try {
    const { movieId, rating, text } = req.body;

    if (!movieId || !rating || !text) {
      return res.status(400).json({ success: false, message: "movieId, rating and text are required" });
    }

    const existing = await Review.findOne({ user: req.user._id, movieId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You've already reviewed this movie. Edit your existing review instead.",
      });
    }

    const review = await Review.create({ user: req.user._id, movieId, rating, text });
    await review.populate("user", "name");

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update your own review
// @route  PUT /api/reviews/:id   body: { rating, text }
// @access Private (owner only)
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own review" });
    }

    const { rating, text } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (text !== undefined) review.text = text;
    await review.save();
    await review.populate("user", "name");

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a review - the owner can always delete their own;
//         an admin can delete anyone's (used by the Admin Dashboard in Step 20/21)
// @route  DELETE /api/reviews/:id
// @access Private (owner or admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
