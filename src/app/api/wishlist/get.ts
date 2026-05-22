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
      wishlist: {
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });

  const items = user?.wishlist.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    discount: item.product.discount,
    stock: item.product.stock,
    images: item.product.images,
    categoryId: item.product.categoryId,
    category: item.product.category,
    isFeatured: item.product.isFeatured,
    isDeleted: item.product.isDeleted,
    createdAt: item.product.createdAt,
    updatedAt: item.product.updatedAt,
    description: item.product.description || "",
  })) || [];

  return NextResponse.json(items);
}
