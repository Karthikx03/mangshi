import mongoose from "mongoose";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const today = () => new Date().toISOString().slice(0, 10);

const farmSupplySchema = new mongoose.Schema(
  {
    farmer_name: { type: String, default: "示範農友", trim: true, maxlength: 60 },
    veg_key: { type: String, required: true, trim: true, maxlength: 40 },
    name_zh: { type: String, required: true, trim: true, maxlength: 40 },
    name_en: { type: String, required: true, trim: true, maxlength: 60 },
    kg: { type: Number, required: true, min: 0.1, max: 5000 },
    available_from: { type: String, default: today, match: ISO_DATE },
    available_to: { type: String, default: today, match: ISO_DATE },
    status: { type: String, enum: ["available", "reserved", "used"], default: "available" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export default mongoose.model("FarmSupply", farmSupplySchema, "farm_supply");
