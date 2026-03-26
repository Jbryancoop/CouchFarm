import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { couchStyles, couchColors } from "@/lib/config";

const validStyles = couchStyles.map((s) => s.value);
const validColors: readonly string[] = couchColors;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { images, ...data } = body;

  if (data.style && !validStyles.includes(data.style)) {
    return NextResponse.json({ error: `Invalid style: ${data.style}` }, { status: 400 });
  }

  if (data.color && !validColors.includes(data.color)) {
    return NextResponse.json({ error: `Invalid color: ${data.color}` }, { status: 400 });
  }

  // Delete old images and re-create
  await prisma.couchImage.deleteMany({ where: { couchId: id } });

  const couch = await prisma.couch.update({
    where: { id },
    data: {
      ...data,
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.couch.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
