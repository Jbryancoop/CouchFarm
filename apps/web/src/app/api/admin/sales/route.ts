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
  const { couchId, couchTitle, sellPrice, buyPrice, paymentMethod, soldBy, customerName, notes } = body;

  if (!couchTitle || !sellPrice || !paymentMethod) {
    return NextResponse.json({ error: "Title, sell price, and payment method are required" }, { status: 400 });
  }

  const sale = await prisma.sale.create({
    data: {
      couchId,
      couchTitle,
      sellPrice,
      buyPrice,
      paymentMethod,
      soldBy,
      customerName,
      notes,
    },
  });

  // Mark couch as sold if linked
  if (couchId) {
    await prisma.couch.update({
      where: { id: couchId },
      data: { status: "sold" },
    });
  }

  return NextResponse.json({ sale });
}
