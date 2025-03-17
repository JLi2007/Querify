import mongoose from "mongoose";

const BreakpointSchema = new mongoose.Schema({
  userId: String,
  breakpoints: Object,
}, { timestamps: true });

// ensures schema is only exported once
export default mongoose.models.Breakpoint || mongoose.model("Breakpoint", BreakpointSchema);
