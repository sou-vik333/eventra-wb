import type { Request, Response } from "express";

import {
  createCustomerEventTask,
  deleteCustomerEventTask,
  getCustomerEventTasks,
  updateCustomerEventTask,
} from "../services/event-task.service.js";

import {
  createEventTaskSchema,
  updateEventTaskSchema,
} from "../validators/event-task.validator.js";

function getUserId(req: Request): number {
  const user = req.user;

  if (!user) {
    throw new Error("Authentication required");
  }

  return Number(user.userId);
}

function getEventId(req: Request): number {
  const eventId = Number(req.params.eventId);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw new Error("Invalid event ID");
  }

  return eventId;
}

function getTaskId(req: Request): number {
  const taskId = Number(req.params.taskId);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new Error("Invalid task ID");
  }

  return taskId;
}

export async function createEventTaskController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const eventId = getEventId(req);

    const data =
      createEventTaskSchema.parse(req.body);

    const task =
      await createCustomerEventTask(
        userId,
        eventId,
        data,
      );

    return res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create event task",
    });
  }
}

export async function getEventTasksController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const eventId = getEventId(req);

    const tasks =
      await getCustomerEventTasks(
        userId,
        eventId,
      );

    return res.status(200).json({
      success: true,
      data: {
        tasks,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event tasks",
    });
  }
}

export async function updateEventTaskController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const taskId = getTaskId(req);

    const data =
      updateEventTaskSchema.parse(req.body);

    const task =
      await updateCustomerEventTask(
        userId,
        taskId,
        data,
      );

    return res.status(200).json({
      success: true,
      data: {
        task,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update event task",
    });
  }
}

export async function deleteEventTaskController(
  req: Request,
  res: Response,
) {
  try {
    const userId = getUserId(req);
    const taskId = getTaskId(req);

    await deleteCustomerEventTask(
      userId,
      taskId,
    );

    return res.status(200).json({
      success: true,
      message: "Event task deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete event task",
    });
  }
}