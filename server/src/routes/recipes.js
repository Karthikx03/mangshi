import { Router } from "express";
import Recipe from "../models/Recipe.js";
import { asyncHandler, ensureFound } from "../middleware/errors.js";

const router = Router();

// The recipe library is read-only through the API; it is managed via `npm run seed`.
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await Recipe.find().sort({ code: 1 }));
  }),
);

router.get(
  "/:code",
  asyncHandler(async (req, res) => {
    res.json(ensureFound(await Recipe.findOne({ code: req.params.code })));
  }),
);

export default router;
