import { Router } from "express";
import FarmSupply from "../models/FarmSupply.js";
import Preorder from "../models/Preorder.js";
import Recipe from "../models/Recipe.js";
import { asyncHandler } from "../middleware/errors.js";

const router = Router();

// GET /api/system — one snapshot of supply + demand + recipes, which the client's
// matching engine turns into the production plan shown on /system/*.
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [supply, preorders, recipes] = await Promise.all([
      FarmSupply.find().sort({ created_at: -1 }).limit(60),
      Preorder.find().sort({ created_at: -1 }).limit(60),
      Recipe.find().sort({ code: 1 }),
    ]);
    res.json({ supply, preorders, recipes });
  }),
);

export default router;
