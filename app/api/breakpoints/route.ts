import connectDB from "../connect";
import Breakpoint from "../breakpoint";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const userBreakpoints = await Breakpoint.findOne({ userId });
  return NextResponse.json(userBreakpoints);
}

export async function POST(req: any) {
  await connectDB();
  const { userId, breakpoints, count, code } = await req.json();

  if (!userId || !breakpoints) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const savedBreakpoint = await Breakpoint.findOneAndUpdate(
    { userId },
    { $set: { breakpoints, count, code } },
    { new: true, upsert: true }
  );

  return NextResponse.json(savedBreakpoint, { status: 201 });
}

export async function DELETE(req: any) {
  await connectDB();
  const { userId } = await req.json();

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const deletedBreakpoint = await Breakpoint.findOneAndDelete({ userId });

  if (!deletedBreakpoint) {
    return NextResponse.json(
      { error: "Breakpoint not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Breakpoint deleted successfully" },
    { status: 200 }
  );
}
