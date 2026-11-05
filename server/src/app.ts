import express from "express";
import cors from "cors";

import vendorDiscoveryRoutes from "./routes/vendor-discovery.routes.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import eventRoutes from "./routes/event.routes.js";
import serviceCategoryRoutes from "./routes/service-category.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import packageRoutes from "./routes/package.routes.js";
import vendorLocationRoutes from "./routes/vendor-location.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import eventTaskRoutes from "./routes/event-task.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(
  "/api/v1/payments/webhook",
  express.raw({
    type: "application/json",
  }),
);

app.use(express.json());

app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/event-tasks", eventTaskRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use(
  "/api/v1/service-categories",
  serviceCategoryRoutes,
);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use(
  "/api/v1/vendor-locations",
  vendorLocationRoutes,
);
app.use(
  "/api/v1/vendor-discovery",
  vendorDiscoveryRoutes,
);

export default app;