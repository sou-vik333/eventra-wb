import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BookingSummary from "../../components/event/BookingSummary";
import EventChecklist from "../../components/event/EventChecklist";

import {
  deleteEvent,
  getEventById,
} from "../../services/event.service";

import {
  getEventTasks,
} from "../../services/event-task.service";

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

type EventTask = {
  id: number;
  eventId: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(
    null,
  );

  const [tasks, setTasks] = useState<EventTask[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        setError("Event ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getEventById(Number(id));

        setEvent(
          response?.data?.event ?? null,
        );
      } catch (eventError) {
        if (eventError instanceof Error) {
          setError(eventError.message);
        } else {
          setError("Failed to load event");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadEvent();
  }, [id]);

  useEffect(() => {
    async function loadTasks() {
      if (!id) {
        setLoadingTasks(false);
        return;
      }

      try {
        setLoadingTasks(true);

        const response =
          await getEventTasks(Number(id));

        setTasks(
          response?.data?.tasks ?? [],
        );
      } catch {
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    }

    void loadTasks();
  }, [id]);

  function formatEventDate(
    eventDate: string | null,
  ) {
    if (!eventDate) {
      return "Date not set";
    }

    return new Date(
      eventDate,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatEventType(type: string) {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }

  function formatCreatedDate(
    createdAt: string,
  ) {
    return new Date(
      createdAt,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  }

  async function handleDelete() {
    if (!event) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteEvent(event.id);

      navigate("/events");
    } catch (deleteError) {
      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError("Failed to delete event");
      }
    } finally {
      setDeleting(false);
    }
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "COMPLETED",
  ).length;

  const remainingTasks =
    totalTasks - completedTasks;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) *
            100,
        );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading event details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load event
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error || "Event not found"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/events")}
              className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
            >
              Back to My Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mb-5 text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            ← Back to My Events
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
                {formatEventType(event.type)}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {event.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {formatStatus(event.status)}
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/events/${event.id}/edit`,
                  )
                }
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                Edit Event
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Event"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Event Date
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {event.eventDate
                ? formatEventDate(
                    event.eventDate,
                  )
                : "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Guests
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {event.guestCount !== null
                ? event.guestCount
                : "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Estimated Budget
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {event.budget
                ? `₹${Number(
                    event.budget,
                  ).toLocaleString("en-IN")}`
                : "Not set"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Event Status
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {formatStatus(event.status)}
            </p>
          </div>
        </div>

        {!loadingTasks &&
          totalTasks > 0 && (
            <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Planning Progress
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {completedTasks} of{" "}
                    {totalTasks} tasks
                    completed
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    {completionPercentage}%
                  </p>

                  <p className="text-xs text-gray-500">
                    {remainingTasks}{" "}
                    remaining
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Event Overview
          </h2>

          {event.description && (
            <p className="mt-3 leading-7 text-gray-600">
              {event.description}
            </p>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Event Date
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                {formatEventDate(
                  event.eventDate,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Number of Guests
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                {event.guestCount ?? "Not set"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Estimated Budget
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                {event.budget
                  ? `₹${Number(
                      event.budget,
                    ).toLocaleString(
                      "en-IN",
                    )}`
                  : "Not set"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-2 font-semibold text-gray-900">
                {event.locationId
                  ? `Location #${event.locationId}`
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {event.budgetNotes && (
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Budget Notes
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {event.budgetNotes}
            </p>
          </div>
        )}

        <div className="mt-6">
          <EventChecklist eventId={event.id} />
        </div>

        <div className="mt-6">
          <BookingSummary eventId={event.id} />
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Event Information
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4 border-b pb-4 text-sm">
              <span className="text-gray-500">
                Event ID
              </span>

              <span className="font-medium text-gray-900">
                #{event.id}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b pb-4 text-sm">
              <span className="text-gray-500">
                Event Type
              </span>

              <span className="font-medium text-gray-900">
                {formatEventType(event.type)}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b pb-4 text-sm">
              <span className="text-gray-500">
                Status
              </span>

              <span className="font-medium text-gray-900">
                {formatStatus(event.status)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">
                Created
              </span>

              <span className="font-medium text-gray-900">
                {formatCreatedDate(
                  event.createdAt,
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Event Planning
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            More event planning tools will be
            added here as we continue building
            Eventra WB.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4">
              <p className="font-medium text-gray-900">
                AI Planner
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming soon
              </p>
            </div>

            <div className="rounded-lg bg-white p-4">
              <p className="font-medium text-gray-900">
                Vendor Recommendations
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;