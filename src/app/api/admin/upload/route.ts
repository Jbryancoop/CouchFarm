import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getUploadUrl, useLocalStorage } from "@/lib/s3";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If S3 is configured, return a presigned upload URL
  if (!useLocalStorage()) {
    const { fileName, contentType } = await request.json();
    const result = await getUploadUrl(fileName, contentType);
    return NextResponse.json(result);
  }

  // Otherwise, handle local file upload
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${uuid()}.${ext}`;
  const filePath = join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return NextResponse.json({ publicUrl: `/uploads/${fileName}` });
}
