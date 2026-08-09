import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import MovieCard from "../components/MovieCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import Pagination from "../components/Pagination.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { searchMovies } from "../services/movieService.js";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const abortControllerRef = useRef(null);

  // Reset to page 1 whenever the (debounced) search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // Fetch results whenever the debounced query or page changes.
  // Cancels the previous in-flight request so a slow early response
  // can't overwrite a newer one (classic race condition with fast typing).
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    // Keep the URL shareable/bookmarkable
    setSearchParams(trimmed ? { q: trimmed, page: String(page) } : {}, { replace: true });

    if (!trimmed) {
      setResults([]);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    searchMovies(trimmed, page, controller.signal)
      .then((data) => {
        setResults(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
      })
      .catch((err) => {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          toast.error("Search failed. Please try again.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, page]);

  return (
    <div className="px-6 py-8">
      {/* Search input */}
      <div className="relative max-w-xl">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cine-muted" size={18} />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full rounded-md bg-cine-surface2 border border-cine-border pl-10 pr-10 py-3
            text-cine-text placeholder:text-cine-muted/60 outline-none
            focus:ring-2 focus:ring-cine-gold/60 focus:border-cine-gold transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cine-muted hover:text-cine-text"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Result count */}
      {debouncedQuery.trim() && !loading && (
        <p className="mt-4 text-sm text-cine-muted">
          {totalResults > 0
            ? `${totalResults.toLocaleString()} results for "${debouncedQuery}"`
            : `No results for "${debouncedQuery}"`}
        </p>
      )}

      {/* Results grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {!loading && !debouncedQuery.trim() && (
        <p className="mt-16 text-center text-cine-muted">Start typing to search movies.</p>
      )}

      {!loading && results.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default SearchResults;
