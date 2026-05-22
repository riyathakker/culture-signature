import { NextRequest } from "next/server";
import handler from "./get";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return handler(req, context);
}
