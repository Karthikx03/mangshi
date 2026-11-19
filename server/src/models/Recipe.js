import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    veg_key: { type: String, required: true, trim: true },
    name_zh: { type: String, required: true },
    name_en: { type: String, required: true },
    kg_per_100: { type: Number, required: true, min: 0 }, // kg needed per 100 portions
    is_core: { type: Boolean, default: false },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name_zh: { type: String, required: true },
    name_en: { type: String, required: true },
    prep_min: { type: Number, default: 0, min: 0 },
    cook_min: { type: Number, default: 0, min: 0 },
    cost_ntd: { type: Number, default: 0, min: 0 },
    kcal: { type: Number, default: 0, min: 0 },
    protein_g: { type: Number, default: 0, min: 0 },
    carbs_g: { type: Number, default: 0, min: 0 },
    fat_g: { type: Number, default: 0, min: 0 },
    fiber_g: { type: Number, default: 0, min: 0 },
    vegetarian: { type: Boolean, default: true },
    allergens: { type: [String], default: [] },
    max_batch: { type: Number, default: 200, min: 1 },
    note_zh: { type: String, default: null },
    note_en: { type: String, default: null },
    // Embedded rather than a separate collection: ingredients are always read with their recipe.
    ingredients: { type: [ingredientSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Recipe", recipeSchema);
