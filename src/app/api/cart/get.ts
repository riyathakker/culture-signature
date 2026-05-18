import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";

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

  const items = user?.cart.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price - (item.product.discount || 0),
    quantity: item.quantity,
    image: item.product.images?.[0] || "",
    stock: item.product.stock,
  })) || [];

  return NextResponse.json(items);
}
