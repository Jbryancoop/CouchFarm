import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { images, ...data } = body;

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
