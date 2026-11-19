import { Router } from "express";
import Preorder from "../models/Preorder.js";
import { asyncHandler, ensureFound, HttpError } from "../middleware/errors.js";

const router = Router();

function pick(body) {
  const out = {};
  if (body.campus !== undefined && body.campus !== "") out.campus = body.campus;
  if (body.order_date !== undefined && body.order_date !== "") out.order_date = body.order_date;
  if (body.portions !== undefined) {
    const portions = Math.round(Number(body.portions));
    if (!Number.isFinite(portions)) throw new HttpError(400, "Invalid portions");
    out.portions = portions;
  }
  return out;
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await Preorder.find().sort({ created_at: -1 }).limit(60));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    res.status(201).json(await Preorder.create(pick(req.body)));
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const doc = await Preorder.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    res.json(ensureFound(doc));
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    ensureFound(await Preorder.findByIdAndDelete(req.params.id));
    res.status(204).end();
  }),
);

export default router;
