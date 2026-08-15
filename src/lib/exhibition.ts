import type { ExhibitionStatus } from "@/types";

const startOfDay = (d: string | Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

export function mapsUrl(location: string): string {
  const trimmed = location.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

export function parsePlace(location?: string | null): { name?: string; city?: string } {
  const raw = (location ?? "").trim();
  if (!raw) return {};
  if (!/^https?:\/\//i.test(raw)) return { name: raw };

  let token = "";
  const placeMatch = raw.match(/\/place\/([^/@]+)/);
  if (placeMatch) {
    token = placeMatch[1];
  } else {
    const q = raw.match(/[?&](?:query|q)=([^&]+)/);
    if (q) token = q[1];
  }
  if (!token) return {};

  let decoded = token.replace(/\+/g, " ");
  try { decoded = decodeURIComponent(decoded); } catch { /* keep as-is */ }

  const parts = decoded.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return {};

  const name = parts[0];
  let city: string | undefined;
  if (parts.length >= 3) city = parts[parts.length - 2];
  else if (parts.length === 2) city = parts[1];
  if (city) city = city.replace(/\s*\d{4,}.*$/, "").trim() || undefined; // strip "Gujarat 380015"

  return { name, city };
}

export function exhibitionMapsUrl(location?: string | null): string {
  const loc = (location ?? "").trim();
  if (/^https?:\/\//i.test(loc)) return loc;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
}

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
