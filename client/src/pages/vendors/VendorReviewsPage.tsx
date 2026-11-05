import { useEffect, useState } from "react";

import {
  getMyVendorReviews,
} from "../../services/review.service";

type Review = {
  id: number;
  userId: number;
  vendorId: number;
  bookingId: number;
  rating: number;
  comment?: string | null;
  status: string;
};

function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getMyVendorReviews();

        setReviews(
          response?.data?.reviews ?? [],
        );
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load your reviews",
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-600">
          Loading reviews...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Reviews
        </h1>

        <p className="mt-2 text-gray-600">
          Reviews submitted by your customers.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && reviews.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            No reviews available yet.
          </p>
        </div>
      )}

      {!error && reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Review #{review.id}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Customer #{review.userId}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Booking #{review.bookingId}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
                    review.status ===
                    "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : review.status ===
                        "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : review.status ===
                          "HIDDEN"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">
                  Rating
                </p>

                <p className="mt-1 text-xl text-yellow-400">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(
                    5 - review.rating,
                  )}
                </p>
              </div>

              {review.comment && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Customer Comment
                  </p>

                  <p className="mt-2 text-gray-700">
                    {review.comment}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default VendorReviewsPage;