import { Temporal } from "@js-temporal/polyfill";

import { db } from "../prisma/db.js";

function toTemporalInstant(
  date: Date | undefined,
): Temporal.Instant | undefined {
  if (!date) {
    return undefined;
  }

  return Temporal.Instant.from(
    date.toISOString(),
  );
}

export async function createEventTask(data: {
  eventId: number;
  title: string;
  description?: string;
  dueDate?: Date;
}) {
  return db.orm.public.EventTask.create({
    eventId: data.eventId,
    title: data.title,
    description: data.description,
    dueDate: toTemporalInstant(data.dueDate),
  });
}

export async function findTasksByEventId(
  eventId: number,
) {
  return db.orm.public.EventTask
    .where({
      eventId,
    })
    .orderBy([
      (task) => task.status.asc(),
      (task) => task.dueDate.asc(),
      (task) => task.createdAt.asc(),
    ])
    .all();
}

export async function findEventTaskById(
  taskId: number,
) {
  return db.orm.public.EventTask.first({
    id: taskId,
  });
}

export async function updateEventTask(
  taskId: number,
  data: {
    title?: string;
    description?: string;
    dueDate?: Date | null;
    status?:
      | "TODO"
      | "IN_PROGRESS"
      | "COMPLETED";
  },
) {
  return db.orm.public.EventTask
    .where({
      id: taskId,
    })
    .update({
      title: data.title,
      description: data.description,
      dueDate:
        data.dueDate === null
          ? null
          : toTemporalInstant(data.dueDate),
      status: data.status,
    });
}

export async function deleteEventTask(
  taskId: number,
) {
  return db.orm.public.EventTask
    .where({
      id: taskId,
    })
    .delete();
}