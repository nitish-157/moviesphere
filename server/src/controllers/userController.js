import User from "../models/User.js";

// All routes here are protected - req.user is set by the `protect` middleware.

// @desc   Get the logged-in user's watchlist (array of TMDB movie ids)
// @route  GET /api/users/watchlist
export const getWatchlist = async (req, res) => {
  res.json({ success: true, watchlist: req.user.watchlist });
};

// @desc   Add a movie to the watchlist
// @route  POST /api/users/watchlist   body: { movieId }
export const addToWatchlist = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ success: false, message: "movieId is required" });
  }

  // $addToSet avoids duplicates automatically - no need to check first
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { watchlist: movieId } },
    { new: true }
  );

  res.json({ success: true, watchlist: user.watchlist });
};

// @desc   Remove a movie from the watchlist
// @route  DELETE /api/users/watchlist/:movieId
export const removeFromWatchlist = async (req, res) => {
  const movieId = Number(req.params.movieId);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { watchlist: movieId } },
    { new: true }
  );

  res.json({ success: true, watchlist: user.watchlist });
};

// @desc   Get the logged-in user's favorites
// @route  GET /api/users/favorites
export const getFavorites = async (req, res) => {
  res.json({ success: true, favorites: req.user.favorites });
};

// @desc   Add a movie to favorites
// @route  POST /api/users/favorites   body: { movieId }
export const addToFavorites = async (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ success: false, message: "movieId is required" });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: movieId } },
    { new: true }
  );

  res.json({ success: true, favorites: user.favorites });
};

// @desc   Remove a movie from favorites
// @route  DELETE /api/users/favorites/:movieId
export const removeFromFavorites = async (req, res) => {
  const movieId = Number(req.params.movieId);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: movieId } },
    { new: true }
  );

  res.json({ success: true, favorites: user.favorites });
};
