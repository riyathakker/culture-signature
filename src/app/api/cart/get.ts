import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { resolveVariant } from "@/lib/colorVariant";

export default async function handler(req: NextRequest & { userEmail?: string }) {
  const userEmail = req.userEmail;
  if (!userEmail) {
    return NextResponse.json([]);
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      cart: {
        include: {
          product: true
        }
      }
    }
  });

  const items = user?.cart.map(item => {
    const v = resolveVariant(item.product as any, item.color);
    return {
      id: item.product.id,
      name: item.product.name,
      price: v.price,
      quantity: item.quantity,
      image: v.image,
      stock: v.stock,
      color: item.color || "",
      colorHex: v.colorHex,
    };
  }) || [];

  return NextResponse.json(items);
}
