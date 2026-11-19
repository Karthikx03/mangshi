import { Router } from "express";
import JoinRequest from "../models/JoinRequest.js";
import { asyncHandler } from "../middleware/errors.js";
import { requireAdminKey } from "../middleware/adminKey.js";

const router = Router();

// POST /api/join — public sign-up form. Only the known fields are stored.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, role, note } = req.body ?? {};
    const doc = await JoinRequest.create({ name, email, role, note: note || null });
    res.status(201).json({ ok: true, id: doc.id });
  }),
);

// GET /api/join — submissions contain personal contact details, so listing them
// requires the admin key (x-admin-key header).
router.get(
  "/",
  requireAdminKey,
  asyncHandler(async (_req, res) => {
    res.json(await JoinRequest.find().sort({ created_at: -1 }));
  }),
);

export default router;
