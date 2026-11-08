import { useEffect, useRef } from "react";

/**
 * Infinite scroll via an IntersectionObserver on a sentinel element.
 * Attach the returned ref to a bottom sentinel; `onLoadMore` fires when it
 * nears the viewport (and re-fires after `itemCount` grows, so a short first
 * page keeps filling until it stops or `hasMore` is false).
 */
export function useInfiniteScroll(
  hasMore: boolean,
  itemCount: number,
  onLoadMore: () => void
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) onLoadMore(); },
      { rootMargin: "400px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, itemCount, onLoadMore]);

  return sentinelRef;
}
