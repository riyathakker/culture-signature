import { useState, useMemo, useEffect } from "react";

interface UsePaginationOptions<T> {
  data: T[];
  totalItems?: number;
  isServerSide?: boolean;
  dependencies?: any[];
  initialPageSize?: number;
}

export function usePagination<T>({
  data,
  totalItems,
  isServerSide = false,
  dependencies = [],
  initialPageSize = 10,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset page to 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return data;
    }
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize, isServerSide]);

  const activeTotalItems = isServerSide ? (totalItems ?? data.length) : data.length;

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    paginatedData,
    totalItems: activeTotalItems,
  };
}
