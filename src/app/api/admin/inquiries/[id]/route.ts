import { NextResponse } from "next/server";
import { requireAuth, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildInquiryData, validateInquiryData } from "@/lib/lead-input";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const inquiry = await prisma.customerInquiry.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ inquiry });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const data = buildInquiryData(body, { partial: true });

  const validationError = validateInquiryData(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (typeof data.email === "string" && data.email.length) {
    data.email = normalizeEmail(data.email);
  }

  const inquiry = await prisma.customerInquiry.update({
    where: { id },
    data: data as never,
  });

  return NextResponse.json({ inquiry });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.customerInquiry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
