import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial orders immediately
      const initial = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
      send({ type: "init", orders: initial });

      // Poll every 8 seconds for status changes
      let lastChecked = new Date();
      const interval = setInterval(async () => {
        if (closed) { clearInterval(interval); return; }
        try {
          const updated = await prisma.order.findMany({
            where: { userId, updatedAt: { gt: lastChecked } },
            include: { items: { include: { product: true } } },
          });
          lastChecked = new Date();
          if (updated.length > 0) send({ type: "update", orders: updated });
        } catch {
          clearInterval(interval);
        }
      }, 8000);
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
