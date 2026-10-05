import { useEffect, useState } from "react";

import {
  getVendorBookings,
  updateVendorBookingStatus,
} from "../../services/booking.service";

type Booking = {
  id: number;
  status: string;
  totalAmount: string | number;
  eventDate?: string;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  eventId?: number;
  serviceId?: number;
  vendorId?: number;
  quantity?: number;
};

function formatPrice(amount: string | number) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0";
  }

  return `₹${numericAmount.toLocaleString("en-IN")}`;
}

function formatDate(date?: string) {
  if (!date) {
    return "Date not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time?: string | null) {
  if (!time) {
    return null;
  }

  const parsedTime = new Date(time);

  if (Number.isNaN(parsedTime.getTime())) {
    return time;
  }

  return parsedTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";

    case "ACCEPTED":
      return "bg-blue-100 text-blue-800";

    case "PAYMENT_PENDING":
      return "bg-orange-100 text-orange-800";

    case "CONFIRMED":
      return "bg-green-100 text-green-800";

    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800";

    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800";

    case "REJECTED":
      return "bg-red-100 text-red-800";

    case "CANCELLED":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingBookingId, setUpdatingBookingId] =
    useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    getVendorBookings()
      .then((response) => {
        if (cancelled) {
          return;
        }

        const bookingData =
          response?.data?.bookings ??
          response?.bookings ??
          response;

        setBookings(
          Array.isArray(bookingData)
            ? bookingData
            : [],
        );
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load vendor bookings:",
          err,
        );

        setError(
          "Unable to load bookings. Please try again.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusUpdate(
    bookingId: number,
    status: "ACCEPTED" | "REJECTED",
  ) {
    try {
      setUpdatingBookingId(bookingId);
      setError("");

      await updateVendorBookingStatus(
        bookingId,
        {
          status,
        },
      );

      const response =
        await getVendorBookings();

      const bookingData =
        response?.data?.bookings ??
        response?.bookings ??
        response;

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : [],
      );
    } catch (err) {
      console.error(
        "Failed to update booking status:",
        err,
      );

      setError(
        "Unable to update booking status. Please try again.",
      );
    } finally {
      setUpdatingBookingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage booking requests from
          customers.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">
            Loading bookings...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        bookings.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-600">
              Customer booking requests will
              appear here.
            </p>
          </div>
        )}

      {!loading &&
        bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const startTime = formatTime(
                booking.startTime,
              );

              const endTime = formatTime(
                booking.endTime,
              );

              const isUpdating =
                updatingBookingId ===
                booking.id;

              return (
                <div
                  key={booking.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Booking #{booking.id}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Event
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            Event #
                            {booking.eventId ??
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Service
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            Service #
                            {booking.serviceId ??
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Event Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(
                              booking.eventDate,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Quantity
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {booking.quantity ??
                              1}
                          </p>
                        </div>

                        {(startTime ||
                          endTime) && (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Time
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {startTime ??
                                "--"}{" "}
                              -{" "}
                              {endTime ??
                                "--"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 lg:text-right">
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {formatPrice(
                          booking.totalAmount,
                        )}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-5 rounded-lg bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-900">
                        Notes
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.status ===
                    "PENDING" && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(
                            booking.id,
                            "ACCEPTED",
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Accept Booking"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(
                            booking.id,
                            "REJECTED",
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Reject Booking"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

export default VendorBookingsPage;