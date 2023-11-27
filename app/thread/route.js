import { thread } from "../allFunctions";
import { NextResponse as res } from "next/server";

export async function POST() {
  try {
    const reply = await thread();
    // console.log(reply);
    return res.json(reply);
  } catch (error) {
    // console.error("Error processing question:", error);
    return res.json({ error: "Internal Server Error" });
  }
}
