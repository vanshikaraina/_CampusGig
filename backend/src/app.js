//app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import chatRoutes from "./routes/chatRoutes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

const app = express();
// app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,              // ✅ allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/portfolio", portfolioRoutes); // ✅ matches frontend

export default app;