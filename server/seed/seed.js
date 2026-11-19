// Loads the reference data (recipe library, seasonal calendar) plus a demo snapshot of
// supply and preorders into MongoDB. Safe to re-run: it replaces those collections.
//   npm run seed            -> reset everything
//   npm run seed -- --keep  -> only reload recipes + seasonal calendar, keep supply/orders
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDB } from "../src/db.js";
import Recipe from "../src/models/Recipe.js";
import SeasonalSurplus from "../src/models/SeasonalSurplus.js";
import FarmSupply from "../src/models/FarmSupply.js";
import Preorder from "../src/models/Preorder.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const load = (name) => JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), "utf8"));
const keepOperational = process.argv.includes("--keep");

await connectDB(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/mangshi");

async function reset(Model, rows) {
  await Model.deleteMany({});
  await Model.insertMany(rows);
  console.log(`[seed] ${Model.modelName}: ${rows.length}`);
}

await reset(Recipe, load("recipes"));
await reset(SeasonalSurplus, load("seasonalSurplus"));
if (!keepOperational) {
  await reset(FarmSupply, load("farmSupply"));
  await reset(Preorder, load("preorders"));
}

await mongoose.disconnect();
console.log("[seed] done");
