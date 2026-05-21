/**
 * One-off admin password reset.
 *
 * Usage:
 *   npx tsx scripts/reset-password.ts <email> <newPassword>
 *
 * Connects to Turso when TURSO_DATABASE_URL/TURSO_AUTH_TOKEN are set (production),
 * otherwise falls back to the local SQLite dev.db — mirroring src/lib/db.ts.
 * Hashes the password with bcrypt (cost 12) and updates the matching user.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

function makePrisma() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter } as never);
  }
  return new PrismaClient();
}

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error("Usage: npx tsx scripts/reset-password.ts <email> <newPassword>");
    process.exit(1);
  }

  const prisma = makePrisma();
  const target = process.env.TURSO_DATABASE_URL ? "Turso (production)" : "local dev.db";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    console.error(`No user found with email "${email}" in ${target}.`);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { email }, data: { password: hashed } });

  console.log(`✓ Password reset for ${email} (role: ${existing.role}) in ${target}.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
