import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await requireAuth("admin");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, password, role } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || "sales" },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json({ user });
}
