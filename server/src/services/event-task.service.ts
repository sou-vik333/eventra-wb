import {
  createEventTask,
  deleteEventTask,
  findEventTaskById,
  findTasksByEventId,
  updateEventTask,
} from "../repositories/event-task.repository.js";

import {
  findEventById,
} from "../repositories/event.repository.js";

import type {
  CreateEventTaskInput,
  UpdateEventTaskInput,
} from "../validators/event-task.validator.js";

export async function createCustomerEventTask(
  userId: number,
  eventId: number,
  data: CreateEventTaskInput,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error(
      "You do not have permission to modify this event",
    );
  }

  return createEventTask({
    eventId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
  });
}

export async function getCustomerEventTasks(
  userId: number,
  eventId: number,
) {
  const event = await findEventById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error(
      "You do not have permission to access this event",
    );
  }

  return findTasksByEventId(eventId);
}

async function getOwnedTask(
  userId: number,
  taskId: number,
) {
  const task = await findEventTaskById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const event = await findEventById(task.eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.userId !== userId) {
    throw new Error(
      "You do not have permission to access this task",
    );
  }

  return task;
}

export async function updateCustomerEventTask(
  userId: number,
  taskId: number,
  data: UpdateEventTaskInput,
) {
  await getOwnedTask(userId, taskId);

  return updateEventTask(taskId, {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    status: data.status,
  });
}

export async function deleteCustomerEventTask(
  userId: number,
  taskId: number,
) {
  await getOwnedTask(userId, taskId);

  return deleteEventTask(taskId);
}