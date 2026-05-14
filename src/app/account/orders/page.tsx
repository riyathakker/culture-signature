import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrderRow } from "@/components/account/OrderRow";

export default async function OrdersPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-heading">Order History</h2>
        <p className="text-muted-foreground font-serif italic">Your journey with Culture Signature.</p>
      </div>

      <div className="border rounded-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-sm">
            <p className="text-muted-foreground font-serif italic">Your collection is waiting for its first masterpiece.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold h-14">Order ID</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold h-14">Date</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold h-14">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold h-14 text-right">Total</TableHead>
                <TableHead className="h-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
