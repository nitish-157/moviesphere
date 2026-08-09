import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { IMAGE_BASE } from "../services/movieService.js";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : "https://placehold.co/500x750/14171F/8A8F98?text=No+Poster";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <Link
      to={`/movie/${movie.id}`}
      aria-label={`${movie.title}${movie.release_date ? `, ${movie.release_date.slice(0, 4)}` : ""}`}
      className="group flex-shrink-0 w-40 sm:w-48 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
    >
      <div className="relative overflow-hidden rounded-lg bg-cine-surface aspect-[2/3]">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-xs font-medium text-cine-goldSoft opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiStar className="fill-current" size={12} />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-cine-text truncate">{movie.title}</h3>
      <p className="text-xs text-cine-muted">{year}</p>
    </Link>
  );
}

export default MovieCard;
