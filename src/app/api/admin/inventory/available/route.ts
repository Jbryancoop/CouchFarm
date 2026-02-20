import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const couches = await prisma.couch.findMany({
    where: { status: "available" },
    select: { id: true, title: true, buyPrice: true, sellPrice: true },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ couches });
}
