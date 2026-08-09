import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Number, // TMDB movie id
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

// One review per user per movie - trying to create a second one updates instead
reviewSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
