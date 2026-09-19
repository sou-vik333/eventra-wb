import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  createEventTask,
  deleteEventTask,
  getEventTasks,
  updateEventTask,
} from "../../services/event-task.service";

type EventTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED";

type EventTask = {
  id: number;
  eventId: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: EventTaskStatus;
  createdAt: string;
  updatedAt: string;
};

type EventChecklistProps = {
  eventId: number;
};

function EventChecklist({
  eventId,
}: EventChecklistProps) {
  const [tasks, setTasks] = useState<EventTask[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription, setTaskDescription] =
    useState("");

  const [taskDueDate, setTaskDueDate] =
    useState("");

  const [addingTask, setAddingTask] =
    useState(false);

  const [updatingTaskId, setUpdatingTaskId] =
    useState<number | null>(null);

  const [editingTaskId, setEditingTaskId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editDueDate, setEditDueDate] =
    useState("");

  const [editStatus, setEditStatus] =
    useState<EventTaskStatus>("TODO");

  const [savingEdit, setSavingEdit] =
    useState(false);

  const [deletingTaskId, setDeletingTaskId] =
    useState<number | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [editError, setEditError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      try {
        const response =
          await getEventTasks(eventId);

        if (cancelled) {
          return;
        }

        setTasks(response.data.tasks);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load checklist");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchTasks();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function handleRetry() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await getEventTasks(eventId);

      setTasks(response.data.tasks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load checklist");
      }
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setFormError(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setShowAddForm(true);
  }

  function closeAddForm() {
    if (addingTask) {
      return;
    }

    setShowAddForm(false);
    setFormError(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
  }

  async function handleAddTask(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle =
      taskTitle.trim();

    if (!trimmedTitle) {
      setFormError("Task title is required");
      return;
    }

    try {
      setAddingTask(true);
      setFormError(null);

      const response =
        await createEventTask({
          eventId,
          title: trimmedTitle,
          description:
            taskDescription.trim() || undefined,
          dueDate:
            taskDueDate || undefined,
        });

      const newTask: EventTask =
        response.data.task;

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

      setShowAddForm(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Failed to create task");
      }
    } finally {
      setAddingTask(false);
    }
  }

  async function handleStatusChange(
    task: EventTask,
  ) {
    if (task.status === "COMPLETED") {
      return;
    }

    const nextStatus: EventTaskStatus =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : "COMPLETED";

    try {
      setUpdatingTaskId(task.id);
      setError(null);

      const response =
        await updateEventTask(task.id, {
          status: nextStatus,
        });

      const updatedTask: EventTask =
        response.data.task;

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to update task status",
        );
      }
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function openEditForm(task: EventTask) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(
      task.description ?? "",
    );

    if (task.dueDate) {
      setEditDueDate(
        task.dueDate.substring(0, 10),
      );
    } else {
      setEditDueDate("");
    }

    setEditStatus(task.status);
    setEditError(null);
    setError(null);
  }

  function closeEditForm() {
    if (savingEdit) {
      return;
    }

    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
    setEditStatus("TODO");
    setEditError(null);
  }

  async function handleSaveEdit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (editingTaskId === null) {
      return;
    }

    const trimmedTitle =
      editTitle.trim();

    if (!trimmedTitle) {
      setEditError(
        "Task title is required",
      );
      return;
    }

    try {
      setSavingEdit(true);
      setEditError(null);

      const response =
        await updateEventTask(
          editingTaskId,
          {
            title: trimmedTitle,
            description:
              editDescription.trim() ||
              undefined,
            dueDate:
              editDueDate || null,
            status: editStatus,
          },
        );

      const updatedTask: EventTask =
        response.data.task;

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id ===
          editingTaskId
            ? updatedTask
            : currentTask,
        ),
      );

      closeEditForm();
    } catch (err) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError(
          "Failed to update task",
        );
      }
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteTask(
    task: EventTask,
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${task.title}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTaskId(task.id);
      setError(null);

      await deleteEventTask(task.id);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id,
        ),
      );

      if (editingTaskId === task.id) {
        closeEditForm();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to delete task",
        );
      }
    } finally {
      setDeletingTaskId(null);
    }
  }

  function getStatusLabel(
    status: EventTaskStatus,
  ) {
    if (status === "IN_PROGRESS") {
      return "IN PROGRESS";
    }

    if (status === "COMPLETED") {
      return "COMPLETED";
    }

    return "TODO";
  }

  function getStatusClassName(
    status: EventTaskStatus,
  ) {
    if (status === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "IN_PROGRESS") {
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    }

    return "bg-gray-100 text-gray-700 hover:bg-gray-200";
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

  return (
    <section className="mt-8">
      {/* Checklist Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Checklist
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Keep track of everything you need to
            complete for this event.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="w-fit rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          + Add Task
        </button>
      </div>

      {/* Checklist Progress */}
      {!loading &&
        !error &&
        totalTasks > 0 && (
          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
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

              <div className="flex items-center gap-4">
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
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-5 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Checklist Task
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Add something you need to complete
              for this event.
            </p>
          </div>

          <form
            onSubmit={handleAddTask}
            className="space-y-4"
          >
            {/* Task Title */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>

              <input
                id="task-title"
                type="text"
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(
                    event.target.value,
                  )
                }
                placeholder="e.g. Book wedding venue"
                maxLength={200}
                disabled={addingTask}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="task-description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Description
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="task-description"
                value={taskDescription}
                onChange={(event) =>
                  setTaskDescription(
                    event.target.value,
                  )
                }
                placeholder="Add some details about this task..."
                rows={3}
                maxLength={2000}
                disabled={addingTask}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Due Date
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="task-due-date"
                type="date"
                value={taskDueDate}
                onChange={(event) =>
                  setTaskDueDate(
                    event.target.value,
                  )
                }
                disabled={addingTask}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 sm:max-w-xs"
              />
            </div>

            {/* Form Error */}
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={addingTask}
                className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingTask
                  ? "Adding..."
                  : "Add Task"}
              </button>

              <button
                type="button"
                onClick={closeAddForm}
                disabled={addingTask}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-600">
            Loading checklist...
          </p>
        </div>
      )}

      {/* Loading Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void handleRetry();
            }}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No tasks yet
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Add tasks to start planning your
              event.
            </p>
          </div>
        )}

      {/* Task List */}
      {!loading &&
        !error &&
        tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isUpdating =
                updatingTaskId === task.id;

              const isEditing =
                editingTaskId === task.id;

              const isDeleting =
                deletingTaskId === task.id;

              const isCompleted =
                task.status === "COMPLETED";

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {/* Task Display */}
                  {!isEditing && (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3
                            className={`font-semibold ${
                              isCompleted
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {task.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            void handleStatusChange(
                              task,
                            );
                          }}
                          disabled={
                            isUpdating ||
                            isCompleted ||
                            isDeleting
                          }
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getStatusClassName(
                            task.status,
                          )}`}
                          title={
                            isCompleted
                              ? "Task completed"
                              : "Click to change task status"
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : getStatusLabel(
                                task.status,
                              )}
                        </button>
                      </div>

                      {task.dueDate && (
                        <p className="mt-3 text-sm text-gray-500">
                          Due:{" "}
                          {new Date(
                            task.dueDate,
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      )}

                      {/* Task Actions */}
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(task)
                          }
                          disabled={isDeleting}
                          className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            void handleDeleteTask(
                              task,
                            );
                          }}
                          disabled={
                            isDeleting ||
                            isUpdating
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </>
                  )}

                  {/* Edit Task Form */}
                  {isEditing && (
                    <form
                      onSubmit={
                        handleSaveEdit
                      }
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Edit Task
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Update the details of
                          this checklist task.
                        </p>
                      </div>

                      {/* Edit Title */}
                      <div>
                        <label
                          htmlFor={`edit-task-title-${task.id}`}
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Task Title
                        </label>

                        <input
                          id={`edit-task-title-${task.id}`}
                          type="text"
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(
                              event.target
                                .value,
                            )
                          }
                          maxLength={200}
                          disabled={
                            savingEdit
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
                        />
                      </div>

                      {/* Edit Description */}
                      <div>
                        <label
                          htmlFor={`edit-task-description-${task.id}`}
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>

                        <textarea
                          id={`edit-task-description-${task.id}`}
                          value={
                            editDescription
                          }
                          onChange={(
                            event,
                          ) =>
                            setEditDescription(
                              event.target
                                .value,
                            )
                          }
                          rows={3}
                          maxLength={2000}
                          disabled={
                            savingEdit
                          }
                          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
                        />
                      </div>

                      {/* Edit Due Date */}
                      <div>
                        <label
                          htmlFor={`edit-task-date-${task.id}`}
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Due Date
                        </label>

                        <input
                          id={`edit-task-date-${task.id}`}
                          type="date"
                          value={
                            editDueDate
                          }
                          onChange={(
                            event,
                          ) =>
                            setEditDueDate(
                              event.target
                                .value,
                            )
                          }
                          disabled={
                            savingEdit
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 sm:max-w-xs"
                        />
                      </div>

                      {/* Edit Status */}
                      <div>
                        <label
                          htmlFor={`edit-task-status-${task.id}`}
                          className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>

                        <select
                          id={`edit-task-status-${task.id}`}
                          value={editStatus}
                          onChange={(
                            event,
                          ) =>
                            setEditStatus(
                              event.target
                                .value as EventTaskStatus,
                            )
                          }
                          disabled={
                            savingEdit
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 sm:max-w-xs"
                        >
                          <option value="TODO">
                            TODO
                          </option>

                          <option value="IN_PROGRESS">
                            IN PROGRESS
                          </option>

                          <option value="COMPLETED">
                            COMPLETED
                          </option>
                        </select>
                      </div>

                      {/* Edit Error */}
                      {editError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {editError}
                        </div>
                      )}

                      {/* Edit Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={
                            savingEdit
                          }
                          className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingEdit
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            closeEditForm
                          }
                          disabled={
                            savingEdit
                          }
                          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </section>
  );
}

export default EventChecklist;