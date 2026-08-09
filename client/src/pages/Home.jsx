import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

import MovieRow from "../components/MovieRow.jsx";
import { getTrending, getPopular, getTopRated, getUpcoming } from "../services/movieService.js";

// Small helper so Popular/Top Rated/Upcoming don't each repeat the same
// page/hasMore/loadingMore bookkeeping by hand.
function usePaginatedMovies(fetchFn) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn(1)
      .then((data) => {
        if (cancelled) return;
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setPage(1);
      })
      .catch(() => toast.error("Couldn't load movies. Please try again."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchFn(nextPage);
      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    } catch {
      toast.error("Couldn't load more movies.");
    } finally {
      setLoadingMore(false);
    }
  }, [fetchFn, page, totalPages, loadingMore]);

  return { movies, loading, loadingMore, hasMore: page < totalPages, loadMore };
}

function Home() {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const popular = usePaginatedMovies(getPopular);
  const topRated = usePaginatedMovies(getTopRated);
  const upcoming = usePaginatedMovies(getUpcoming);

  useEffect(() => {
    getTrending()
      .then(setTrending)
      .catch(() => toast.error("Couldn't load trending movies."))
      .finally(() => setTrendingLoading(false));
  }, []);

  return (
    <div className="py-8">
      <div className="px-6 mb-10">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-cine-text">
          Now Screening
        </h1>
        <p className="mt-1.5 text-cine-muted">
          What's trending, what's rated highest, and what's coming next.
        </p>
      </div>

      <MovieRow title="Trending This Week" movies={trending} loading={trendingLoading} />

      <MovieRow
        title="Popular"
        movies={popular.movies}
        loading={popular.loading}
        loadingMore={popular.loadingMore}
        hasMore={popular.hasMore}
        onLoadMore={popular.loadMore}
      />

      <MovieRow
        title="Top Rated"
        movies={topRated.movies}
        loading={topRated.loading}
        loadingMore={topRated.loadingMore}
        hasMore={topRated.hasMore}
        onLoadMore={topRated.loadMore}
      />

      <MovieRow
        title="Upcoming"
        movies={upcoming.movies}
        loading={upcoming.loading}
        loadingMore={upcoming.loadingMore}
        hasMore={upcoming.hasMore}
        onLoadMore={upcoming.loadMore}
      />
    </div>
  );
}

export default Home;
