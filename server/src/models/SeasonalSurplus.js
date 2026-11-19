import mongoose from "mongoose";

const seasonalSurplusSchema = new mongoose.Schema({
  month: { type: Number, required: true, min: 1, max: 12 },
  veg_key: { type: String, required: true },
  name_zh: { type: String, required: true },
  name_en: { type: String, required: true },
  typical_surplus_kg: { type: Number, required: true, min: 0 },
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  note_zh: { type: String, default: null },
  note_en: { type: String, default: null },
});

export default mongoose.model("SeasonalSurplus", seasonalSurplusSchema, "seasonal_surplus");
