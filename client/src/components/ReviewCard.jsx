import { FiTrash2, FiEdit2 } from "react-icons/fi";
import StarRating from "./StarRating.jsx";

function ReviewCard({ review, isOwn, onEdit, onDelete }) {
  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border-b border-cine-border py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-cine-text">
              {review.user?.name || "Deleted user"}
              {isOwn && <span className="text-cine-gold"> (You)</span>}
            </span>
            <span className="text-xs text-cine-muted">{date}</span>
          </div>
          <div className="mt-1">
            <StarRating value={review.rating} readOnly size={14} />
          </div>
        </div>

        {isOwn && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onEdit}
              aria-label="Edit review"
              className="text-cine-muted hover:text-cine-gold transition-colors rounded
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-gold"
            >
              <FiEdit2 size={15} />
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete review"
              className="text-cine-muted hover:text-cine-danger transition-colors rounded
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cine-danger"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-cine-text/90 leading-relaxed">{review.text}</p>
    </div>
  );
}

export default ReviewCard;
