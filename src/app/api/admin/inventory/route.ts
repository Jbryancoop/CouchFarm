import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildCouchData, validateCouchData } from "@/lib/couch-input";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { images } = body;
  const data = buildCouchData(body);

  if (!data.title || !data.style || !data.color || !data.fabricType) {
    return NextResponse.json({ error: "Title, style, color, and fabric type are required" }, { status: 400 });
  }

  const validationError = validateCouchData(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const couch = await prisma.couch.create({
    data: {
      ...data,
      images: {
        create: (Array.isArray(images) ? images : []).map((url: string, i: number) => ({
          url,
          order: i,
        })),
      },
    } as never,
  });

  return NextResponse.json({ couch });
}
