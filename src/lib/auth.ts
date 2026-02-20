import { cookies } from "next/headers";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const SESSION_COOKIE = "session_token";
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = uuid();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  sessions.set(token, { userId: user.id, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    sessions.delete(token);
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  if (!user || !user.active) return null;
  return user;
}

export async function requireAuth(role?: "admin" | "sales") {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  if (role === "admin" && user.role !== "admin") throw new Error("Forbidden");
  return user;
}
