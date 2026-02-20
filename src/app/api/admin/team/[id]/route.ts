import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { active } = await request.json();

  const user = await prisma.user.update({
    where: { id },
    data: { active },
    select: { id: true, name: true, email: true, role: true, active: true },
  });

  return NextResponse.json({ user });
}
