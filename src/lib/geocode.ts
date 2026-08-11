

export function extractLatLng(url?: string | null): { lat: string; lng: string } | null {
  if (!url) return null;
  const m = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  return { lat: m[1], lng: m[2] };
}

export async function reverseGeocodeCity(location?: string | null): Promise<string | null> {
  const coords = extractLatLng(location);
  if (!coords) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&lat=${coords.lat}&lon=${coords.lng}`,
      {
        headers: {
          "User-Agent": "culture-signature/1.0 (exhibition location resolver)",
        },
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const a = data?.address ?? {};
    return (
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.state_district ||
      a.county ||
      a.state ||
      null
    );
  } catch {
    return null;
  }
}
