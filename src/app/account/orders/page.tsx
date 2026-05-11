import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
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
                <TableRow key={order.id} className="hover:bg-secondary/5 transition-colors">
                  <TableCell className="font-medium text-sm py-6">
                    #{order.id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        order.status === "DELIVERED" 
                          ? "border-green-500 text-green-500" 
                          : order.status === "PENDING"
                          ? "border-amber-500 text-amber-500"
                          : "border-primary text-primary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{order.totalPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
