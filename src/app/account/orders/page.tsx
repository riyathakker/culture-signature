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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default async function OrdersPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect(ROUTES.HOME);
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
        <p className="muted-italic">Your journey with Culture Signature.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-sm space-y-4">
          <p className="muted-italic">Your collection is waiting for its first masterpiece.</p>
          <Link href={ROUTES.COLLECTIONS}>
            <Button className="uppercase tracking-[0.2em] text-[10px] font-bold h-12 px-8">Discover Collection</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block border rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="text-spaced-bold h-14">Order ID</TableHead>
                  <TableHead className="text-spaced-bold h-14">Date</TableHead>
                  <TableHead className="text-spaced-bold h-14">Status</TableHead>
                  <TableHead className="text-spaced-bold h-14 text-right">Total</TableHead>
                  <TableHead className="h-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} variant="table" />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} variant="card" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
