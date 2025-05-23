import mongoose from "mongoose";

const BreakpointSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  breakpoints: { type: Array, required: true },
  code: {type: String, required: true},
  number: { type: Number, required: true },
}, { timestamps: true });

// ensures schema is only exported once
const Breakpoint =  mongoose.models.Breakpoint || mongoose.model("Breakpoint", BreakpointSchema);
export default Breakpoint;
