import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, mobileNo } = body;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: {
        name,
        mobileNo,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        mobileNo: updatedUser.mobileNo,
      },
    });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
