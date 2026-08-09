import { useRef } from "react";
import MovieCard from "./MovieCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";

function MovieRow({ title, movies, loading, hasMore = false, loadingMore = false, onLoadMore }) {
  const scrollContainerRef = useRef(null);

  // Sentinel sits at the end of the row - when it scrolls into view
  // (within the horizontal scroll container), we fetch the next page.
  const sentinelRef = useInfiniteScroll(
    onLoadMore || (() => {}),
    Boolean(onLoadMore) && hasMore && !loading && !loadingMore,
    scrollContainerRef
  );

  return (
    <section className="mb-10">
      <h2 className="font-display text-xl sm:text-2xl tracking-wide text-cine-text mb-4 px-6">
        {title}
      </h2>
      <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}

        {!loading && loadingMore &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}

        {/* Invisible trigger element - 1px wide so it doesn't affect layout */}
        {!loading && onLoadMore && <div ref={sentinelRef} className="flex-shrink-0 w-1" />}
      </div>
    </section>
  );
}

export default MovieRow;
