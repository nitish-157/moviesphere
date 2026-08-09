import { FiStar } from "react-icons/fi";

// Rating is stored 1-10 (matches TMDB's scale) but displayed as 5 stars,
// so each star represents 2 points.
function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const filledStars = Math.round(value / 2);

  const handleClick = (starIndex) => {
    if (readOnly || !onChange) return;
    onChange(starIndex * 2);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <button
          key={starIndex}
          type="button"
          disabled={readOnly}
          onClick={() => handleClick(starIndex)}
          aria-label={`${starIndex * 2} out of 10`}
          className={readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
        >
          <FiStar
            size={size}
            className={starIndex <= filledStars ? "fill-cine-gold text-cine-gold" : "text-cine-border"}
          />
        </button>
      ))}
    </div>
  );
}

export default StarRating;
