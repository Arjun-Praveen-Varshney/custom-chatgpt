import main from "../allFunctions";
import { NextResponse as res } from "next/server";

export async function POST(request) {
  const question = await request.json();
  // console.log(question);
  try {
    const reply = await main(question);
    // console.log(reply);
    return res.json(reply);
  } catch (error) {
    console.error("Error processing question:", error);
    return res.json({ error: "Internal Server Error" });
  }
}
