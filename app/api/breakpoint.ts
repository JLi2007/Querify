import mongoose from "mongoose";

const BreakpointSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  breakpoints: { type: Array, required: true },
  number: { type: Number, required: true },
}, { timestamps: true });

// ensures schema is only exported once
export default mongoose.models.Breakpoint || mongoose.model("Breakpoint", BreakpointSchema);
