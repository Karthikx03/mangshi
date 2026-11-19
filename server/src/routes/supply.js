import { Router } from "express";
import FarmSupply from "../models/FarmSupply.js";
import { asyncHandler, ensureFound, HttpError } from "../middleware/errors.js";

const router = Router();
const FIELDS = ["farmer_name", "veg_key", "name_zh", "name_en", "kg", "available_from", "available_to", "status"];

/** Keeps only known fields and normalizes kg to one decimal place. */
function pick(body) {
  const out = {};
  for (const f of FIELDS) if (body[f] !== undefined && body[f] !== "") out[f] = body[f];
  if (out.kg !== undefined) {
    const kg = Number(out.kg);
    if (!Number.isFinite(kg)) throw new HttpError(400, "Invalid kg");
    out.kg = Math.round(kg * 10) / 10;
  }
  return out;
}

// GET /api/supply — latest 60 batches, newest first
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await FarmSupply.find().sort({ created_at: -1 }).limit(60));
  }),
);

// POST /api/supply — a farmer logs a surplus batch
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const doc = await FarmSupply.create(pick(req.body));
    res.status(201).json(doc);
  }),
);

// PATCH /api/supply/:id — edit a batch
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const doc = await FarmSupply.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    res.json(ensureFound(doc));
  }),
);

// DELETE /api/supply/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    ensureFound(await FarmSupply.findByIdAndDelete(req.params.id));
    res.status(204).end();
  }),
);

export default router;
