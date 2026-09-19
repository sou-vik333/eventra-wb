import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  createCustomerEvent,
  getCustomerEvents,
  getCustomerEvent,
  updateCustomerEvent,
  deleteCustomerEvent,
} from "../services/event.service.js";

import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

export async function createEventController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const input = createEventSchema.parse(req.body);

    const event = await createCustomerEvent(
      req.user.userId,
      input,
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        event,
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
      message: "Something went wrong",
    });
  }
}

export async function getEventsController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const events = await getCustomerEvents(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        events,
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
      message: "Something went wrong",
    });
  }
}

export async function getEventController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await getCustomerEvent(
      req.user.userId,
      eventId,
    );

    return res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function updateEventController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const input = updateEventSchema.parse(req.body);

    const event = await updateCustomerEvent(
      req.user.userId,
      eventId,
      input,
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: {
        event,
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
      message: "Something went wrong",
    });
  }
}

export async function deleteEventController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    await deleteCustomerEvent(
      req.user.userId,
      eventId,
    );

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
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
      message: "Something went wrong",
    });
  }
}