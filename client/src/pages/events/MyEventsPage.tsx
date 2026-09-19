import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyEvents } from "../../services/event.service";

type Event = {
  id: number;
  name: string;
  type: string;
  description: string | null;
  eventDate: string | null;
  guestCount: number | null;
  budget: string | null;
  budgetNotes: string | null;
  locationId: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function MyEventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await getMyEvents();

        setEvents(response?.data?.events ?? []);
      } catch (eventError) {
        if (eventError instanceof Error) {
          setError(eventError.message);
        } else {
          setError("Failed to load events");
        }
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  function formatEventDate(
    eventDate: string | null,
  ) {
    if (!eventDate) {
      return "Date not set";
    }

    return new Date(eventDate).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  }

  function formatEventType(type: string) {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading your events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load events
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Events
            </h1>

            <p className="mt-2 text-gray-600">
              Manage all your events from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/events/create")
            }
            className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
          >
            Create Event
          </button>
        </div>

        {/* Events */}
        {events.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No events yet
            </h2>

            <p className="mt-2 text-gray-600">
              Create your first event to get started
              with Eventra WB.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/events/create")
              }
              className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Event Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                      {formatEventType(event.type)}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      {event.name}
                    </h2>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {event.status}
                  </span>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="mt-4 line-clamp-2 text-sm text-gray-600">
                    {event.description}
                  </p>
                )}

                {/* Event Information */}
                <div className="mt-5 space-y-3 border-t pt-5">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Event Date
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatEventDate(
                        event.eventDate,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Guests
                    </span>

                    <span className="font-medium text-gray-900">
                      {event.guestCount ??
                        "Not set"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Budget
                    </span>

                    <span className="font-medium text-gray-900">
                      {event.budget
                        ? `₹${Number(
                            event.budget,
                          ).toLocaleString(
                            "en-IN",
                          )}`
                        : "Not set"}
                    </span>
                  </div>
                </div>

                {/* View Event */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/events/${event.id}`,
                    )
                  }
                  className="mt-6 w-full rounded-lg border border-purple-600 px-4 py-2.5 font-medium text-purple-600 transition hover:bg-purple-50"
                >
                  View Event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEventsPage;