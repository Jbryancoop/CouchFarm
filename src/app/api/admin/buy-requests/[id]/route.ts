import { NextResponse } from "next/server";
import { requireAuth, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildBuyRequestData, validateBuyRequestData } from "@/lib/lead-input";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const validationError = validateBuyRequestData({ status });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const buyRequest = await prisma.buyRequest.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ buyRequest });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const data = buildBuyRequestData(body, { partial: true });

  const validationError = validateBuyRequestData(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (typeof data.email === "string" && data.email.length) {
    data.email = normalizeEmail(data.email);
  }

  const buyRequest = await prisma.buyRequest.update({
    where: { id },
    data: data as never,
  });

  return NextResponse.json({ buyRequest });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.buyRequest.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
