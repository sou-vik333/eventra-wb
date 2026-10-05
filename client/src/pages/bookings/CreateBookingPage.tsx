import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { createBooking } from "../../services/booking.service";
import { getEventById } from "../../services/event.service";
import { getServiceById } from "../../services/service.service";
import { getVendorById } from "../../services/vendor.service";

type Event = {
  id: number;
  name: string;
  type: string;
  eventDate: string | null;
};

type Service = {
  id: number;
  name: string;
  description?: string | null;
  basePrice: string | number;
  durationMinutes?: number | null;
  vendorId: number;
  categoryId: number;
  isActive: boolean;
};

type Vendor = {
  id: number;
  businessName: string;
  isVerified: boolean;
  status: string;
};

function CreateBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventId = Number(
    searchParams.get("eventId"),
  );

  const serviceId = Number(
    searchParams.get("serviceId"),
  );

  const vendorId = Number(
    searchParams.get("vendorId"),
  );

  const [event, setEvent] =
    useState<Event | null>(null);

  const [service, setService] =
    useState<Service | null>(null);

  const [vendor, setVendor] =
    useState<Vendor | null>(null);

  const [eventDate, setEventDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadBookingData() {
      if (
        !eventId ||
        !serviceId ||
        !vendorId
      ) {
        setError(
          "Event, service, or vendor information is missing.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          eventResponse,
          serviceResponse,
          vendorResponse,
        ] = await Promise.all([
          getEventById(eventId),
          getServiceById(serviceId),
          getVendorById(vendorId),
        ]);

        const loadedEvent =
          eventResponse?.data?.event ?? null;

        const loadedService =
          serviceResponse?.data?.service ?? null;

        const loadedVendor =
          vendorResponse?.data?.vendor ?? null;

        setEvent(loadedEvent);
        setService(loadedService);
        setVendor(loadedVendor);

        if (loadedEvent?.eventDate) {
          const date = new Date(
            loadedEvent.eventDate,
          );

          const year =
            date.getFullYear();

          const month = String(
            date.getMonth() + 1,
          ).padStart(2, "0");

          const day = String(
            date.getDate(),
          ).padStart(2, "0");

          setEventDate(
            `${year}-${month}-${day}`,
          );
        }
      } catch (loadError) {
        if (loadError instanceof Error) {
          setError(loadError.message);
        } else {
          setError(
            "Failed to load booking information.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    void loadBookingData();
  }, [
    eventId,
    serviceId,
    vendorId,
  ]);

  function formatPrice(
    price: string | number,
  ) {
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice)
    ) {
      return "Price unavailable";
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN",
    )}`;
  }

  function formatDuration(
    durationMinutes?: number | null,
  ) {
    if (!durationMinutes) {
      return "Duration not specified";
    }

    const hours = Math.floor(
      durationMinutes / 60,
    );

    const minutes =
      durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }

    if (hours > 0) {
      return `${hours} hr`;
    }

    return `${minutes} min`;
  }

  async function handleSubmit(
    submitEvent: React.FormEvent<HTMLFormElement>,
  ) {
    submitEvent.preventDefault();

    if (
      !event ||
      !service ||
      !vendor
    ) {
      setError(
        "Booking information is incomplete.",
      );
      return;
    }

    if (!eventDate) {
      setError(
        "Please select the event date.",
      );
      return;
    }

    if (!startTime || !endTime) {
      setError(
        "Please select both start and end time.",
      );
      return;
    }

    if (endTime <= startTime) {
      setError(
        "End time must be later than start time.",
      );
      return;
    }

    if (quantity < 1) {
      setError(
        "Quantity must be at least 1.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response =
        await createBooking({
          eventId: event.id,
          vendorId: vendor.id,
          serviceId: service.id,
          eventDate,
          startTime: `${eventDate}T${startTime}`,
          endTime: `${eventDate}T${endTime}`,
          quantity,
          notes: notes.trim() || undefined,
        });

      const booking =
        response?.data?.booking;

      if (!booking?.id) {
        throw new Error(
          "Booking was created but the booking ID was not returned.",
        );
      }

      navigate(
        `/events/${event.id}`,
      );
    } catch (bookingError) {
      if (bookingError instanceof Error) {
        setError(bookingError.message);
      } else {
        setError(
          "Failed to create booking.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading booking information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    error &&
    (!event ||
      !service ||
      !vendor)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to create booking
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/services?eventId=${eventId}`,
                )
              }
              className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    !event ||
    !service ||
    !vendor
  ) {
    return null;
  }

  const estimatedTotal =
    Number(service.basePrice) *
    quantity;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/services?eventId=${event.id}`,
            )
          }
          className="mb-6 text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          ← Back to Services
        </button>

        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
            Eventra WB Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Book Service
          </h1>

          <p className="mt-3 text-gray-600">
            Review the service details and
            provide your booking information.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Service Details
          </h2>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-gray-900">
              {service.name}
            </h3>

            <p className="mt-1 text-sm text-purple-600">
              {vendor.businessName}
            </p>

            {service.description && (
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {service.description}
              </p>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Price
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {formatPrice(
                    service.basePrice,
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Duration
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {formatDuration(
                    service.durationMinutes,
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Vendor Status
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {vendor.status}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Event
          </h2>

          <div className="mt-4 rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Event Name
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {event.name}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Event Type
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {event.type}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Event ID
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              #{event.id}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900">
            Booking Information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-gray-700"
              >
                Event Date
              </label>

              <input
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(inputEvent) =>
                  setEventDate(
                    inputEvent.target.value,
                  )
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(inputEvent) =>
                  setQuantity(
                    Number(
                      inputEvent.target.value,
                    ),
                  )
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Time
              </label>

              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(inputEvent) =>
                  setStartTime(
                    inputEvent.target.value,
                  )
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Time
              </label>

              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(inputEvent) =>
                  setEndTime(
                    inputEvent.target.value,
                  )
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(inputEvent) =>
                setNotes(
                  inputEvent.target.value,
                )
              }
              rows={5}
              maxLength={2000}
              placeholder="Add any special requirements or instructions..."
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {notes.length}/2000
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-purple-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Estimated Total
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatPrice(
                    estimatedTotal,
                  )}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {formatPrice(
                    service.basePrice,
                  )}{" "}
                  × {quantity}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBookingPage;