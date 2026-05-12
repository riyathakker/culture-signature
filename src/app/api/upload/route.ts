import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";

// Simple in-memory cache for upload deduplication
const uploadCache = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Calculate hash to check for duplicates
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    if (uploadCache.has(hash)) {
      return NextResponse.json({ url: uploadCache.get(hash), cached: true });
    }

    // Upload to Cloudinary using a promise to handle the stream
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "culture-signature/products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const url = (uploadResponse as any).secure_url;
    uploadCache.set(hash, url);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
  }
}
