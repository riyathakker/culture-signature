import { Skeleton } from "@/components/ui/skeleton";

export function OrdersSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="border rounded-sm overflow-hidden">
        <Skeleton className="h-14 w-full rounded-none" />
        <div className="divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20 hidden sm:block" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AccountOverviewSkeleton() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-28 w-full rounded-sm" />
        <Skeleton className="h-28 w-full rounded-sm" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-28 w-full rounded-sm" />
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b pb-6">
            <Skeleton className="w-24 h-32 flex-shrink-0 rounded-sm" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-sm" />
    </div>
  );
}
