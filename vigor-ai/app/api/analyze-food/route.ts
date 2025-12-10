import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Simulate AI Thinking
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Always return a successful result for the demo
  // In a real demo, you usually upload a picture of a healthy meal anyway.
  return NextResponse.json({
    food: "Grilled Chicken Salad",
    calories: 450,
    macros: "40g Protein, 15g Fat, 20g Carbs"
  });
}