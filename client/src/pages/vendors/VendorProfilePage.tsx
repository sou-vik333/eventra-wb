
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { getVendorById } from "../../services/vendor.service";
import { getVendorReviews } from "../../services/review.service";

type Vendor = {
  id: number;
  businessName: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  isVerified: boolean;
  status: string;
};

type Review = {
  id: number;
  userId: number;
  vendorId: number;
  bookingId: number;
  rating: number;
  comment?: string | null;
  status: string;
};

function VendorProfilePage() {
  const { id } = useParams();
  const location = useLocation();

  const vendorId = Number(id);

  const backPath =
    location.state?.from === "/packages"
      ? "/packages"
      : "/services";

  const backLabel =
    backPath === "/packages"
      ? "Back to Packages"
      : "Back to Services";

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!Number.isInteger(vendorId) || vendorId <= 0) {
    return;
  }

    async function loadVendorProfile() {
      try {
        setLoading(true);
        setError("");

        const [vendorResponse, reviewsResponse] =
          await Promise.all([
            getVendorById(vendorId),
            getVendorReviews(vendorId),
          ]);

        setVendor(vendorResponse?.data?.vendor ?? null);
        setReviews(reviewsResponse?.data?.reviews ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load vendor profile");
      } finally {
        setLoading(false);
      }
    }

    loadVendorProfile();
  }, [vendorId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    return total / reviews.length;
  }, [reviews]);

  if (!Number.isInteger(vendorId) || vendorId <= 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">
            Invalid vendor ID
          </p>

          <Link
            to={backPath}
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            {backLabel}
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-600">
          Loading vendor profile...
        </p>
      </main>
    );
  }

  if (error || !vendor) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-700">
            {error || "Vendor not found"}
          </p>

          <Link
            to={backPath}
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            {backLabel}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <Link
          to={backPath}
          className="text-sm text-blue-600 hover:underline"
        >
          ← {backLabel}
        </Link>
      </div>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vendor.businessName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {vendor.isVerified && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Verified
                </span>
              )}

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {vendor.status}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 px-4 py-3">
            <p className="text-sm text-gray-500">
              Average Rating
            </p>

            <p className="text-2xl font-bold text-yellow-600">
              {averageRating.toFixed(1)} / 5
            </p>

            <p className="text-sm text-gray-500">
              {reviews.length} reviews
            </p>
          </div>
        </div>

        {vendor.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              About
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-gray-600">
              {vendor.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 border-t pt-6 sm:grid-cols-2">
          {vendor.phone && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Phone
              </p>

              <p className="mt-1 text-gray-900">
                {vendor.phone}
              </p>
            </div>
          )}

          {vendor.email && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Email
              </p>

              <p className="mt-1 text-gray-900">
                {vendor.email}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-500">
              Status
            </p>

            <p className="mt-1 text-gray-900">
              {vendor.status}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="mt-4 rounded-xl border bg-white p-6">
            <p className="text-gray-600">
              No published reviews yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Customer #{review.userId}
                    </p>

                    <p className="mt-1 text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </p>
                  </div>

                  <span className="text-sm text-gray-500">
                    Review #{review.id}
                  </span>
                </div>

                {review.comment && (
                  <p className="mt-4 text-gray-700">
                    {review.comment}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default VendorProfilePage;
