import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { auth } from "@/auth";

// Simple in-memory cache for upload deduplication
const uploadCache = new Map<string, string>();

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, GIF, or AVIF images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File exceeds the 8MB size limit" }, { status: 400 });
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
          resource_type: "image",
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
