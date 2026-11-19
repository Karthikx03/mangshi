import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import systemRoutes from "./routes/system.js";
import supplyRoutes from "./routes/supply.js";
import preorderRoutes from "./routes/preorders.js";
import recipeRoutes from "./routes/recipes.js";
import seasonRoutes from "./routes/seasons.js";
import joinRoutes from "./routes/join.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export function createApp() {
  const app = express();

  const origins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173").split(",").map((s) => s.trim());
  app.use(cors({ origin: origins }));
  app.use(express.json({ limit: "100kb" }));
  if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
  });

  app.use("/api/system", systemRoutes);
  app.use("/api/supply", supplyRoutes);
  app.use("/api/preorders", preorderRoutes);
  app.use("/api/recipes", recipeRoutes);
  app.use("/api/seasons", seasonRoutes);
  app.use("/api/join", joinRoutes);
  app.use("/api", notFound);

  // In production, serve the built React app from client/dist and let React Router
  // handle every non-API path.
  const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../client/dist");
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get("*", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
  }

  app.use(errorHandler);
  return app;
}
