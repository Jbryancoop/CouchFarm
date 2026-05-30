import { NextResponse } from "next/server";
import { requireAuth, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildInquiryData, validateInquiryData } from "@/lib/lead-input";
import { isValidEmail } from "@/lib/form-guard";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data = buildInquiryData(body);

  if (!data.name || !data.email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  if (!isValidEmail(data.email as string)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const validationError = validateInquiryData(data);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  data.email = normalizeEmail(data.email as string);

  const inquiry = await prisma.customerInquiry.create({ data: data as never });

  return NextResponse.json({ inquiry });
}
