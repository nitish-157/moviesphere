import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex items-center gap-1 text-sm text-cine-muted hover:text-cine-text
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
      >
        <FiChevronLeft size={16} /> Prev
      </button>

      <span className="text-sm text-cine-text" aria-live="polite">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{Math.min(totalPages, 500)}</span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= Math.min(totalPages, 500)}
        aria-label="Next page"
        className="flex items-center gap-1 text-sm text-cine-muted hover:text-cine-text
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
      >
        Next <FiChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;
