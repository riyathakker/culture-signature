import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

export default function apiHandler(handler: (req: NextRequest & { userEmail?: string; userId?: string }, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    try {
      const session = await auth();
      const extendedReq = req as NextRequest & { userEmail?: string; userId?: string };
      
      if (session?.user?.email) {
        extendedReq.userEmail = session.user.email;
      }
      if ((session?.user as any)?.id) {
        extendedReq.userId = (session?.user as any).id;
      }
      
      return await handler(extendedReq, context);
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
  };
}
