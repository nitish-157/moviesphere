import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { updateProfile } from "../features/auth/authSlice.js";
import { getMyReviews } from "../services/reviewService.js";
import { getMovieDetails, IMAGE_BASE } from "../services/movieService.js";
import StarRating from "../components/StarRating.jsx";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { watchlist, favorites } = useSelector((state) => state.lists);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewMovies, setReviewMovies] = useState({}); // movieId -> movie details
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    getMyReviews()
      .then(async (myReviews) => {
        setReviews(myReviews);
        // Fetch basic movie info (poster/title) for each reviewed movie
        const entries = await Promise.all(
          myReviews.map(async (r) => {
            try {
              const movie = await getMovieDetails(r.movieId);
              return [r.movieId, movie];
            } catch {
              return [r.movieId, null];
            }
          })
        );
        setReviewMovies(Object.fromEntries(entries));
      })
      .catch(() => toast.error("Couldn't load your reviews."))
      .finally(() => setReviewsLoading(false));
  }, []);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name can't be empty.");

    setSaving(true);
    const result = await dispatch(updateProfile(name.trim()));
    setSaving(false);

    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      setEditing(false);
    } else {
      toast.error(result.payload || "Couldn't update profile.");
    }
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-cine-gold/20 text-cine-gold text-2xl font-semibold flex items-center justify-center shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          {editing ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="rounded-md bg-cine-surface2 border border-cine-border px-3 py-1.5
                  text-cine-text outline-none focus:ring-2 focus:ring-cine-gold/60 focus:border-cine-gold"
              />
              <button
                type="submit"
                disabled={saving}
                className="text-sm font-medium bg-cine-gold hover:bg-cine-goldSoft text-cine-bg px-3 py-1.5 rounded-md disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                }}
                className="text-sm text-cine-muted hover:text-cine-text px-2"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl tracking-wide text-cine-text">{user?.name}</h1>
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit name"
                className="text-cine-muted hover:text-cine-gold transition-colors"
              >
                <FiEdit2 size={15} />
              </button>
            </div>
          )}
          <p className="text-sm text-cine-muted mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Link
          to="/watchlist"
          className="bg-cine-surface border border-cine-border rounded-lg p-4 text-center hover:border-cine-gold transition-colors"
        >
          <p className="text-2xl font-semibold text-cine-text">{watchlist.length}</p>
          <p className="text-sm text-cine-muted mt-1">Watchlist</p>
        </Link>
        <Link
          to="/favorites"
          className="bg-cine-surface border border-cine-border rounded-lg p-4 text-center hover:border-cine-gold transition-colors"
        >
          <p className="text-2xl font-semibold text-cine-text">{favorites.length}</p>
          <p className="text-sm text-cine-muted mt-1">Favorites</p>
        </Link>
        <div className="bg-cine-surface border border-cine-border rounded-lg p-4 text-center">
          <p className="text-2xl font-semibold text-cine-text">{reviews.length}</p>
          <p className="text-sm text-cine-muted mt-1">Reviews</p>
        </div>
      </div>

      {/* My reviews */}
      <div className="mt-10">
        <h2 className="font-display text-xl tracking-wide text-cine-text mb-4">Your Reviews</h2>

        {reviewsLoading ? (
          <p className="text-sm text-cine-muted">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-cine-muted">
            You haven't reviewed any movies yet. Find one and share your thoughts.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const movie = reviewMovies[review.movieId];
              return (
                <Link
                  key={review._id}
                  to={`/movie/${review.movieId}`}
                  className="flex items-center gap-4 bg-cine-surface border border-cine-border rounded-lg p-3 hover:border-cine-gold transition-colors"
                >
                  <img
                    src={
                      movie?.poster_path
                        ? `${IMAGE_BASE}${movie.poster_path}`
                        : "https://placehold.co/92x138/1B1F29/8A8F98?text=?"
                    }
                    alt={movie?.title || "Movie"}
                    loading="lazy"
                    className="w-12 h-[72px] object-cover rounded bg-cine-surface2 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cine-text truncate">
                      {movie?.title || "Loading…"}
                    </p>
                    <StarRating value={review.rating} readOnly size={13} />
                    <p className="text-xs text-cine-muted mt-1 line-clamp-1">{review.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
