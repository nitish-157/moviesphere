import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import MovieCard from "../components/MovieCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { getMovieDetails } from "../services/movieService.js";

function Watchlist() {
  const { watchlist } = useSelector((state) => state.lists);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (watchlist.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(watchlist.map((id) => getMovieDetails(id)))
      .then(setMovies)
      .catch(() => toast.error("Couldn't load your watchlist."))
      .finally(() => setLoading(false));
  }, [watchlist]);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-3xl tracking-wide text-cine-text">Your Watchlist</h1>
      <p className="mt-1.5 text-cine-muted">Movies you've saved to watch later.</p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
        {loading
          ? Array.from({ length: watchlist.length || 6 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {!loading && movies.length === 0 && (
        <p className="mt-16 text-center text-cine-muted">
          Your watchlist is empty. Add movies from their details page.
        </p>
      )}
    </div>
  );
}

export default Watchlist;
