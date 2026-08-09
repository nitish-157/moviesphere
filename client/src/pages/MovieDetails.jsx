import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiStar, FiClock, FiPlus, FiCheck, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";

import MovieDetailsSkeleton from "../components/MovieDetailsSkeleton.jsx";
import CastList from "../components/CastList.jsx";
import MovieRow from "../components/MovieRow.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { getMovieDetails, IMAGE_BASE, BACKDROP_BASE } from "../services/movieService.js";
import { getReviewsForMovie, getMyReview, deleteReview } from "../services/reviewService.js";
import {
  addToWatchlist,
  removeFromWatchlist,
  addToFavorites,
  removeFromFavorites,
} from "../features/lists/listsSlice.js";

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function MovieDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { watchlist, favorites } = useSelector((state) => state.lists);
  const movieIdNum = Number(id);
  const isInWatchlist = watchlist.includes(movieIdNum);
  const isInFavorites = favorites.includes(movieIdNum);

  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const loadReviews = () => {
    getReviewsForMovie(id).then(setReviews).catch(() => {});
    if (user) getMyReview(id).then(setMyReview).catch(() => {});
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then(setMovie)
      .catch(() => toast.error("Couldn't load this movie's details."))
      .finally(() => setLoading(false));
    // Scroll to top when navigating between movies (e.g. via similar movies row)
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <MovieDetailsSkeleton />;
  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const handleReviewSaved = (review) => {
    setMyReview(review);
    setShowReviewForm(false);
    loadReviews();
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    try {
      await deleteReview(myReview._id);
      toast.success("Review deleted");
      setMyReview(null);
      loadReviews();
    } catch {
      toast.error("Couldn't delete review.");
    }
  };
  const handleWatchlist = () => {
    if (!user) return toast.error("Sign in to use your watchlist.");
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movieIdNum));
      toast.success("Removed from watchlist");
    } else {
      dispatch(addToWatchlist(movieIdNum));
      toast.success("Added to watchlist");
    }
  };

  const handleFavorite = () => {
    if (!user) return toast.error("Sign in to save favorites.");
    if (isInFavorites) {
      dispatch(removeFromFavorites(movieIdNum));
      toast.success("Removed from favorites");
    } else {
      dispatch(addToFavorites(movieIdNum));
      toast.success("Added to favorites");
    }
  };

  return (
    <div>
      {/* Backdrop hero */}
      <div
        className="h-[45vh] sm:h-[55vh] bg-cover bg-center relative"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to bottom, rgba(11,13,18,0.3), var(--cine-bg)), url(${BACKDROP_BASE}${movie.backdrop_path})`
            : "none",
          backgroundColor: "var(--cine-surface)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 -mt-24 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Poster */}
          <img
            src={
              movie.poster_path
                ? `${IMAGE_BASE}${movie.poster_path}`
                : "https://placehold.co/500x750/14171F/8A8F98?text=No+Poster"
            }
            alt={movie.title}
            className="w-40 sm:w-56 rounded-lg shadow-xl flex-shrink-0 bg-cine-surface"
          />

          {/* Title + meta */}
          <div className="flex-1 pt-2 sm:pt-24">
            <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-cine-text">
              {movie.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cine-muted">
              <span className="flex items-center gap-1 text-cine-goldSoft font-medium">
                <FiStar className="fill-current" size={14} />
                {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)
              </span>
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {formatRuntime(movie.runtime) && (
                <span className="flex items-center gap-1">
                  <FiClock size={14} />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs px-2.5 py-1 rounded-full border border-cine-border text-cine-muted"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-cine-text/90 leading-relaxed max-w-2xl">{movie.overview}</p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleWatchlist}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors
                  ${
                    isInWatchlist
                      ? "bg-cine-surface2 border border-cine-gold text-cine-gold"
                      : "bg-cine-gold hover:bg-cine-goldSoft text-cine-bg"
                  }`}
              >
                {isInWatchlist ? <FiCheck size={16} /> : <FiPlus size={16} />}
                {isInWatchlist ? "In Watchlist" : "Watchlist"}
              </button>
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border transition-colors
                  ${
                    isInFavorites
                      ? "border-cine-danger text-cine-danger"
                      : "border-cine-border hover:border-cine-gold text-cine-text"
                  }`}
              >
                <FiHeart size={16} className={isInFavorites ? "fill-current" : ""} />
                Favorite
              </button>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="mt-10">
            <h2 className="font-display text-xl tracking-wide text-cine-text mb-4">Trailer</h2>
            <div className="aspect-video rounded-lg overflow-hidden bg-cine-surface">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.credits?.cast?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl tracking-wide text-cine-text mb-4">Cast</h2>
            <CastList cast={movie.credits.cast} />
          </div>
        )}

        {/* Reviews */}
        <div className="mt-10">
          <h2 className="font-display text-xl tracking-wide text-cine-text mb-4">
            Ratings & Reviews
          </h2>

          {user ? (
            myReview && !showReviewForm ? (
              <div className="mb-4">
                <ReviewCard
                  review={myReview}
                  isOwn
                  onEdit={() => setShowReviewForm(true)}
                  onDelete={handleDeleteReview}
                />
              </div>
            ) : (
              <div className="mb-4">
                <ReviewForm
                  movieId={movieIdNum}
                  existingReview={myReview}
                  onSaved={handleReviewSaved}
                  onCancel={myReview ? () => setShowReviewForm(false) : undefined}
                />
              </div>
            )
          ) : (
            <p className="text-sm text-cine-muted mb-4">Sign in to leave a rating and review.</p>
          )}

          <div>
            {reviews
              .filter((r) => !myReview || r._id !== myReview._id)
              .map((review) => (
                <ReviewCard key={review._id} review={review} isOwn={false} />
              ))}
            {reviews.length === 0 && (
              <p className="text-sm text-cine-muted">No reviews yet. Be the first to write one.</p>
            )}
          </div>
        </div>
      </div>

      {/* Similar movies */}
      {movie.similar?.results?.length > 0 && (
        <div className="mt-10">
          <MovieRow title="You Might Also Like" movies={movie.similar.results} loading={false} />
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}

export default MovieDetails;
