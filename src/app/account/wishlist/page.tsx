import { ProductCard } from "@/components/common/ProductCard";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Debug check
  if (!(prisma as any).wishlistItem) {
    console.error("Prisma wishlistItem model is missing! Available keys:", Object.keys(prisma));
    return (
      <div className="py-20 text-center border-2 border-dashed rounded-sm">
        <p className="text-destructive font-serif italic">Database configuration error. Please try again later.</p>
      </div>
    );
  }

  const wishlist = await (prisma as any).wishlistItem.findMany({
    where: { userId: (session.user as any).id },
    include: {
      product: {
        include: {
          category: true,
        }
      },
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-heading">My Wishlist</h2>
        <p className="muted-italic">Pieces you've curated for your future collection.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-sm">
          <p className="muted-italic">Your wishlist is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
          {wishlist.map((item: any) => (
            <ProductCard
              key={item.id}
              product={item.product}
              variant="wishlist"
            />
          ))}
        </div>
      )}
    </div>
  );
}
