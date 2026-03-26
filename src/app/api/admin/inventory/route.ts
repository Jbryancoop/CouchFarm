import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { couchStyles, couchColors } from "@/lib/config";

const validStyles = couchStyles.map((s) => s.value);
const validColors: readonly string[] = couchColors;

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

  if (!validStyles.includes(style)) {
    return NextResponse.json({ error: `Invalid style: ${style}` }, { status: 400 });
  }

  if (!validColors.includes(color)) {
    return NextResponse.json({ error: `Invalid color: ${color}` }, { status: 400 });
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
