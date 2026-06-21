import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city) return NextResponse.json({ pinCode: null });

  try {
    const res = await fetch(
      `https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
      return NextResponse.json({ pinCode: data[0].PostOffice[0].Pincode });
    }
    return NextResponse.json({ pinCode: null });
  } catch {
    return NextResponse.json({ pinCode: null });
  }
}
