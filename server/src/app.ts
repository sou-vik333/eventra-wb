import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Eventra WB API is running",
  });
});

export default app;