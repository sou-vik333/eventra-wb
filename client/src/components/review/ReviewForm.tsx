import { useState } from "react";

import {
  createReview,
} from "../../services/review.service";

type ReviewFormProps = {
  bookingId: number;
  onSuccess?: () => void;
};

function ReviewForm({
  bookingId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      setRating(0);
      setComment("");
      setSuccess(
        "Review submitted successfully. It is waiting for approval.",
      );

      onSuccess?.();
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Failed to submit review");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">
        Leave a Review
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Share your experience with this vendor.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <div>
          <p className="text-sm font-medium text-gray-900">
            Rating
          </p>

          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setRating(value)
                }
                aria-label={`Rate ${value} out of 5`}
                className={`text-3xl transition ${
                  value <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {rating} out of 5
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="text-sm font-medium text-gray-900"
          >
            Comment
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            maxLength={2000}
            rows={5}
            placeholder="Tell us about your experience..."
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {comment.length}/2000
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;