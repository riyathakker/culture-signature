import type { ExhibitionStatus } from "@/types";

const startOfDay = (d: string | Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

export function getExhibitionStatus(
  date: string | Date,
  endDate?: string | Date | null
): ExhibitionStatus {
  const today = startOfDay(new Date());
  const start = startOfDay(date);
  const end = endDate ? startOfDay(endDate) : start;
  if (today < start) return "UPCOMING";
  if (today > end) return "PAST";
  return "ONGOING";
}
