import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getVendorBookings } from "../../services/booking.service";
import {
  getMyVendorReviews,
} from "../../services/review.service";

type Booking = {
  id: number;
  status: string;
  totalAmount: number | string;
  eventDate?: string | null;
  serviceId: number;
  quantity: number;
};

type Review = {
  id: number;
  rating: number;
  comment?: string | null;
  status: string;
};

function VendorDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");

  let userName = "Vendor";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);

      userName =
        user.name ||
        user.username ||
        user.email ||
        "Vendor";
    } catch {
      userName = "Vendor";
    }
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [bookingsResponse, reviewsResponse] =
          await Promise.all([
            getVendorBookings(),
            getMyVendorReviews(),
          ]);

        setBookings(
          bookingsResponse?.data?.bookings ?? [],
        );

        setReviews(
          reviewsResponse?.data?.reviews ?? [],
        );
      } catch (err) {
        console.error(err);
        setError("Unable to load vendor dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING",
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "ACCEPTED",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  ).length;

  const publishedReviews = reviews.filter(
    (review) => review.status === "PUBLISHED",
  ).length;

  const totalRevenue = bookings
    .filter(
      (booking) =>
        booking.status === "CONFIRMED" ||
        booking.status === "IN_PROGRESS" ||
        booking.status === "COMPLETED",
    )
    .reduce(
      (total, booking) =>
        total + Number(booking.totalAmount || 0),
      0,
    );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-gray-600">
          Loading vendor dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-purple-600">
            Vendor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Welcome, {userName}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your bookings, packages, services, and customer reviews.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/vendor/bookings"
            className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            View Bookings
          </Link>

          <Link
            to="/vendor/reviews"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Reviews
          </Link>

          <Link
            to="/vendor/packages"
            className="rounded-lg border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Manage Packages
          </Link>

          <Link
            to="/vendor/services"
            className="rounded-lg border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            Manage Services
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Bookings
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Pending Requests
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingBookings}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Confirmed
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {confirmedBookings}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedBookings}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Accepted
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {acceptedBookings}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Published Reviews
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {publishedReviews}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Booking Value
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹
            {totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest booking activity.
            </p>
          </div>

          <Link
            to="/vendor/bookings"
            className="text-sm font-medium text-purple-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-5 rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-600">
              No bookings available yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Booking #{booking.id}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Service #{booking.serviceId}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {booking.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">
                    ₹
                    {Number(
                      booking.totalAmount,
                    ).toLocaleString("en-IN")}
                  </p>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default VendorDashboardPage;