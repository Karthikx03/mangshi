import { Router } from "express";
import SeasonalSurplus from "../models/SeasonalSurplus.js";
import Recipe from "../models/Recipe.js";
import { asyncHandler } from "../middleware/errors.js";

const router = Router();

// GET /api/seasons — month-by-month surplus calendar plus the recipes it maps onto
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [surplus, recipes] = await Promise.all([
      SeasonalSurplus.find().sort({ month: 1, typical_surplus_kg: -1 }),
      Recipe.find().sort({ code: 1 }),
    ]);
    res.json({ surplus, recipes });
  }),
);

export default router;
