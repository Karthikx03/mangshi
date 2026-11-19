import mongoose from "mongoose";

const preorderSchema = new mongoose.Schema(
  {
    campus: { type: String, default: "中央大學", trim: true, maxlength: 60 },
    portions: { type: Number, required: true, min: 1, max: 5000 },
    order_date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export default mongoose.model("Preorder", preorderSchema);
