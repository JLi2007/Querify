import connectDB from "../mongodb";
import breakpoint from "../breakpoint";
import { NextResponse } from "next/server";

export async function GET(req:any) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const userBreakpoints = await breakpoint.findOne({ userId });
  return NextResponse.json(userBreakpoints);
}

export async function POST(req: any) {
  await connectDB();
  const { userId, breakpoints, count } = await req.json();

  if (!userId || !breakpoints) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const savedBreakpoint = await breakpoint.findOneAndUpdate(
    { userId },
    { $set: { breakpoints, count } }, 
    { new: true, upsert: true }
  );

  return NextResponse.json(savedBreakpoint, { status: 201 });
}
