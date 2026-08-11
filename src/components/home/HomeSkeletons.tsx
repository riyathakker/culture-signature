import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/Container";

/** Centered eyebrow + heading, mirrors <SectionTitle align="center" />. */
function SectionTitleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-56" />
    </div>
  );
}

/** A horizontal row of product-card placeholders (matches the scroll rows). */
export function ProductRowSkeleton({ width = 220, count = 5 }: { width?: number; count?: number }) {
  return (
    <div className="flex gap-6 overflow-hidden pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ minWidth: width, maxWidth: width }} className="flex-shrink-0 space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-sm" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <div className="py-10 bg-secondary/50 border-y border-border/40">
      <SectionTitleSkeleton />
      <div className="max-w-[100vw] overflow-hidden">
        <div className="flex gap-4 pb-4 px-4 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-shrink-0 w-[42vw] max-w-[200px] min-w-[140px] md:w-[200px] h-44 rounded-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LimitedDropsSkeleton() {
  return (
    <section className="py-10 border-y border-border/40">
      <Container>
        <SectionTitleSkeleton />
        <ProductRowSkeleton width={220} count={5} />
      </Container>
    </section>
  );
}

export function ExhibitionsSkeleton() {
  return (
    <section className="py-10 md:py-16 bg-secondary/40 border-y border-border/40">
      <Container>
        {/* Header */}
        <div className="mb-10 space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-px w-full" />
        </div>

        <div className="flex items-start gap-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] h-[500px] rounded-xl overflow-hidden border border-border/60 bg-card"
            >
              <Skeleton className="w-full aspect-square rounded-none" />
              <div className="p-4 space-y-2.5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
