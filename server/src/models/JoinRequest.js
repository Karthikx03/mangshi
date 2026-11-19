import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "A valid email is required"],
      trim: true,
      lowercase: true,
      maxlength: 200,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "A valid email is required"],
    },
    role: { type: String, required: [true, "Role is required"], trim: true, maxlength: 40 },
    note: { type: String, default: null, trim: true, maxlength: 1000 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

export default mongoose.model("JoinRequest", joinRequestSchema, "join_requests");
