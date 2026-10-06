import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendOrderStatusUpdate } from "@/lib/email";

export default async function handler(req: NextRequest & { userEmail?: string; userId?: string }, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const include = { user: true, items: { include: { product: true } } } as const;

    // Confirming payment is the moment an order becomes "real": record paidAt,
    // reduce stock, and count any promo usage. Guarded by `!existing.paidAt` so
    // re-confirming (or a later status change) never decrements stock twice.
    const isConfirmingPayment = status === "PAID" && !existing.paidAt;

    let order;
    if (isConfirmingPayment) {
      const productIds = existing.items.map((it) => it.productId);
      const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Build stock writes up front. Every decrement is clamped at 0 so a stale
      // or oversold line can never push stock negative. Per-color stock (when a
      // colour variant carries its own `stock`) is rewritten inside the colors
      // JSON; otherwise the base product stock is reduced.
      const stockOps = existing.items
        .map((line) => {
          const p = productMap.get(line.productId);
          if (!p) return null;
          if (line.color) {
            const colors = Array.isArray(p.colors) ? [...(p.colors as any[])] : [];
            const ci = colors.findIndex((c: any) => c?.name === line.color);
            if (ci >= 0 && colors[ci]?.stock != null) {
              colors[ci] = { ...colors[ci], stock: Math.max(0, Number(colors[ci].stock) - line.quantity) };
              return { productId: line.productId, data: { colors } as any };
            }
          }
          return { productId: line.productId, data: { stock: Math.max(0, Number(p.stock) - line.quantity) } as any };
        })
        .filter(Boolean) as { productId: string; data: any }[];

      const discount = existing.promoCode
        ? await prisma.discount.findFirst({ where: { code: existing.promoCode, isDeleted: false } })
        : null;

      order = await prisma.$transaction(async (tx) => {
        for (const op of stockOps) {
          await tx.product.update({ where: { id: op.productId }, data: op.data });
        }

        if (discount) {
          const newUsedCount = discount.usedCount + 1;
          const nowLimitReached = discount.usageLimit && newUsedCount >= discount.usageLimit;
          await tx.discount.update({
            where: { id: discount.id },
            data: { usedCount: newUsedCount, status: nowLimitReached ? "EXPIRED" : discount.status },
          });
        }

        return tx.order.update({
          where: { id },
          data: { status: "PAID", paidAt: new Date() },
          include,
        });
      });
    } else {
      const updateData: any = { status };
      if (status === "SHIPPED") {
        updateData.shippedAt = new Date();
      } else if (status === "DELIVERED") {
        updateData.deliveredAt = new Date();
      }

      order = await prisma.order.update({
        where: { id },
        data: updateData,
        include,
      });
    }

    await sendOrderStatusUpdate(order, order.user?.email);

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
