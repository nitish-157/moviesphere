import { useState } from "react";
import toast from "react-hot-toast";

import StarRating from "./StarRating.jsx";
import { createReview, updateReview } from "../services/reviewService.js";

function ReviewForm({ movieId, existingReview, onSaved, onCancel }) {
  const [rating, setRating] = useState(existingReview?.rating || 8);
  const [text, setText] = useState(existingReview?.text || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const review = existingReview
        ? await updateReview(existingReview._id, { rating, text })
        : await createReview({ movieId, rating, text });

      toast.success(existingReview ? "Review updated" : "Review posted");
      onSaved(review);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cine-surface rounded-lg p-4 border border-cine-border">
      <label className="block text-sm font-medium text-cine-muted mb-2">Your rating</label>
      <StarRating value={rating} onChange={setRating} />

      <label className="block text-sm font-medium text-cine-muted mt-4 mb-2">Your review</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="What did you think?"
        maxLength={2000}
        className="w-full rounded-md bg-cine-surface2 border border-cine-border px-3.5 py-2.5
          text-sm text-cine-text placeholder:text-cine-muted/60 outline-none resize-none
          focus:ring-2 focus:ring-cine-gold/60 focus:border-cine-gold transition-colors"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="text-sm font-medium bg-cine-gold hover:bg-cine-goldSoft text-cine-bg
            px-4 py-2 rounded-md transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : existingReview ? "Update Review" : "Post Review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-cine-muted hover:text-cine-text px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
