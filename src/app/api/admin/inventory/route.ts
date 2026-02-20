import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, style, color, fabricType, images, ...rest } = body;

  if (!title || !style || !color || !fabricType) {
    return NextResponse.json({ error: "Title, style, color, and fabric type are required" }, { status: 400 });
  }

  const couch = await prisma.couch.create({
    data: {
      title,
      style,
      color,
      fabricType,
      ...rest,
      images: {
        create: (images || []).map((url: string, i: number) => ({
          url,
          order: i,
        })),
      },
    },
  });

  return NextResponse.json({ couch });
}
