import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "General";
    const altText = (formData.get("altText") as string) || "";
    const title = (formData.get("title") as string) || (file?.name || "Uploaded media");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPG, PNG, WEBP (under 10MB) and MP4, WEBM (under 50MB) are allowed.",
        },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds 10MB limit" },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: "Video exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let fileUrl = "";
    let publicId: string | null = null;
    const resourceType = isImage ? "image" : "video";

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Cloudinary upload via standard REST API
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signaturePayload = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

      const uploadForm = new FormData();
      uploadForm.append("file", new Blob([buffer], { type: mimeType }));
      uploadForm.append("api_key", apiKey);
      uploadForm.append("timestamp", timestamp.toString());
      uploadForm.append("signature", signature);
      uploadForm.append("folder", "neelam_salon");

      const cldRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: uploadForm }
      );

      const cldData = await cldRes.json();
      if (!cldRes.ok) {
        throw new Error(cldData.error?.message || "Cloudinary upload failed");
      }

      fileUrl = cldData.secure_url;
      publicId = cldData.public_id;
    } else {
      // Local fallback to public/uploads directory
      const ext = path.extname(file.name) || (isImage ? ".jpg" : ".mp4");
      const safeHash = crypto.randomBytes(12).toString("hex");
      const filename = `media_${Date.now()}_${safeHash}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      fileUrl = `/uploads/${filename}`;
      publicId = filename;
    }

    // Save metadata in database
    const asset = await withDbRetry(async () => {
      return await prisma.mediaAsset.create({
        data: {
          url: fileUrl,
          publicId,
          resourceType,
          bytes: file.size,
          altText,
          title,
          category,
        },
      });
    });

    return NextResponse.json({
      success: true,
      asset,
      url: fileUrl,
    });
  } catch (err: unknown) {
    console.error("Media upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Media upload failed" },
      { status: 500 }
    );
  }
}
