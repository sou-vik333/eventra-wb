import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEventById,
  updateEvent,
} from "../../services/event.service";

const eventTypes = [
  {
    value: "WEDDING",
    label: "Wedding",
  },
  {
    value: "RECEPTION",
    label: "Reception",
  },
  {
    value: "BIRTHDAY",
    label: "Birthday",
  },
  {
    value: "ANNAPRASHAN",
    label: "Annaprashan",
  },
  {
    value: "RICE_CEREMONY",
    label: "Rice Ceremony",
  },
  {
    value: "BABY_SHOWER",
    label: "Baby Shower",
  },
  {
    value: "ENGAGEMENT",
    label: "Engagement",
  },
  {
    value: "ANNIVERSARY",
    label: "Anniversary",
  },
  {
    value: "HOUSEWARMING",
    label: "Housewarming",
  },
  {
    value: "PUJA",
    label: "Puja",
  },
  {
    value: "CULTURAL_PROGRAM",
    label: "Cultural Program",
  },
  {
    value: "CORPORATE_EVENT",
    label: "Corporate Event",
  },
  {
    value: "COLLEGE_EVENT",
    label: "College Event",
  },
  {
    value: "PARTY",
    label: "Party",
  },
  {
    value: "FUNERAL",
    label: "Funeral",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

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
};

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(
    null,
  );

  const [name, setName] = useState("");
  const [type, setType] = useState("WEDDING");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetNotes, setBudgetNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

        const response = await getEventById(
          Number(id),
        );

        const fetchedEvent =
          response?.data?.event ?? null;

        if (!fetchedEvent) {
          setError("Event not found");
          return;
        }

        setEvent(fetchedEvent);

        setName(fetchedEvent.name);
        setType(fetchedEvent.type);
        setDescription(
          fetchedEvent.description ?? "",
        );

        if (fetchedEvent.eventDate) {
          setEventDate(
            fetchedEvent.eventDate.slice(0, 10),
          );
        }

        setGuestCount(
          fetchedEvent.guestCount
            ? String(fetchedEvent.guestCount)
            : "",
        );

        setBudget(
          fetchedEvent.budget
            ? String(fetchedEvent.budget)
            : "",
        );

        setBudgetNotes(
          fetchedEvent.budgetNotes ?? "",
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

    loadEvent();
  }, [id]);

  async function handleSubmit(
    formEvent: FormEvent<HTMLFormElement>,
  ) {
    formEvent.preventDefault();

    if (!id) {
      setError("Event ID is missing");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const eventData: {
        name: string;
        type: string;
        description?: string;
        eventDate?: string;
        guestCount?: number;
        budget?: number;
        budgetNotes?: string;
      } = {
        name: name.trim(),
        type,
      };

      if (description.trim()) {
        eventData.description =
          description.trim();
      }

      if (eventDate) {
        eventData.eventDate = eventDate;
      }

      if (guestCount) {
        eventData.guestCount =
          Number(guestCount);
      }

      if (budget) {
        eventData.budget = Number(budget);
      }

      if (budgetNotes.trim()) {
        eventData.budgetNotes =
          budgetNotes.trim();
      }

      await updateEvent(
        Number(id),
        eventData,
      );

      navigate(`/events/${id}`);
    } catch (eventError) {
      if (eventError instanceof Error) {
        setError(eventError.message);
      } else {
        setError("Failed to update event");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Loading event...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load event
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/events")
              }
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate(`/events/${id}`)
            }
            className="mb-5 text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            ← Back to Event
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Event
          </h1>

          <p className="mt-2 text-gray-600">
            Update your event details.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Event Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Event Name *
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(formEvent) =>
                  setName(formEvent.target.value)
                }
                minLength={2}
                maxLength={150}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Event Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Event Type *
              </label>

              <select
                id="type"
                value={type}
                onChange={(formEvent) =>
                  setType(formEvent.target.value)
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                {eventTypes.map(
                  (eventType) => (
                    <option
                      key={eventType.value}
                      value={eventType.value}
                    >
                      {eventType.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(formEvent) =>
                  setDescription(
                    formEvent.target.value,
                  )
                }
                maxLength={2000}
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Maximum 2000 characters
              </p>
            </div>

            {/* Date + Guests */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Event Date
                </label>

                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(formEvent) =>
                    setEventDate(
                      formEvent.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="guestCount"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Number of Guests
                </label>

                <input
                  id="guestCount"
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(formEvent) =>
                    setGuestCount(
                      formEvent.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Estimated Budget (₹)
              </label>

              <input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(formEvent) =>
                  setBudget(
                    formEvent.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Budget Notes */}
            <div>
              <label
                htmlFor="budgetNotes"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Budget Notes
              </label>

              <textarea
                id="budgetNotes"
                value={budgetNotes}
                onChange={(formEvent) =>
                  setBudgetNotes(
                    formEvent.target.value,
                  )
                }
                maxLength={1000}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Maximum 1000 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(`/events/${id}`)
                }
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEventPage;