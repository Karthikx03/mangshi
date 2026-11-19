import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./db.js";

const PORT = Number(process.env.API_PORT ?? process.env.PORT ?? 5050);
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/mangshi";

connectDB(MONGODB_URI)
  .then(() => {
    createApp().listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[db] connection failed:", err.message);
    process.exit(1);
  });
