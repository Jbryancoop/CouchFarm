import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    await requireAuth("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, destination, platform, campaign } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.marketingLink.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "This slug is already in use" }, { status: 400 });
  }

  const link = await prisma.marketingLink.create({
    data: { name, slug, destination: destination || "/inventory", platform, campaign },
  });

  return NextResponse.json({ link });
}
