import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import MovieCard from "../components/MovieCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { getGenres, getMoviesByGenre } from "../services/movieService.js";

function Genre() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState(null); // { id, name }
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load the genre list once, then select either the one from the URL
  // (so /genre?id=28 is shareable/bookmarkable) or default to the first genre.
  useEffect(() => {
    getGenres()
      .then((list) => {
        setGenres(list);
        const urlGenreId = searchParams.get("id");
        const match = urlGenreId && list.find((g) => String(g.id) === urlGenreId);
        setSelectedGenre(match || list[0] || null);
      })
      .catch(() => toast.error("Couldn't load genres."))
      .finally(() => setGenresLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch movies whenever the selected genre or page changes
  useEffect(() => {
    if (!selectedGenre) return;

    setSearchParams({ id: String(selectedGenre.id), page: String(page) }, { replace: true });

    setLoading(true);
    getMoviesByGenre(selectedGenre.id, page)
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      })
      .catch(() => toast.error("Couldn't load movies for this genre."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, page]);

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-cine-text">
          Browse by Genre
        </h1>
        <p className="mt-1.5 text-cine-muted">Pick a genre and dive into everything it has to offer.</p>
      </div>

      {/* Genre pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide">
        {genresLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-24 h-10 rounded-full bg-cine-surface2 animate-pulse" />
            ))
          : genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleSelectGenre(genre)}
                aria-pressed={selectedGenre?.id === genre.id}
                className={`flex-shrink-0 text-sm px-5 py-2.5 rounded-full border-2 transition-all whitespace-nowrap
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold
                  ${
                    selectedGenre?.id === genre.id
                      ? "bg-cine-gold border-cine-gold text-cine-bg font-semibold shadow-lg shadow-cine-gold/20"
                      : "border-cine-border text-cine-muted hover:text-cine-text hover:border-cine-gold/60"
                  }`}
              >
                {genre.name}
              </button>
            ))}
      </div>

      {/* Movie grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {!loading && movies.length === 0 && selectedGenre && (
        <p className="mt-10 text-center text-cine-muted">No movies found for {selectedGenre.name}.</p>
      )}

      {!loading && movies.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default Genre;
