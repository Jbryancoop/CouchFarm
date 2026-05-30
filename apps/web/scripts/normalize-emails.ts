/**
 * One-off: lowercase all stored user emails so they match the case-insensitive
 * login logic. Aborts safely if lowercasing would collide two distinct users.
 *
 * Usage: DOTENV_CONFIG_PATH=.env.vercel.local npx tsx scripts/normalize-emails.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

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
  const prisma = makePrisma();
  const target = process.env.TURSO_DATABASE_URL ? "Turso (production)" : "local dev.db";
  const users = await prisma.user.findMany({ select: { id: true, email: true } });

  const lowered = new Map<string, string[]>();
  for (const u of users) {
    const key = u.email.trim().toLowerCase();
    lowered.set(key, [...(lowered.get(key) || []), u.email]);
  }

  const collisions = [...lowered.entries()].filter(([, originals]) => originals.length > 1);
  if (collisions.length) {
    console.error("Aborting — these emails would collide once lowercased:");
    for (const [key, originals] of collisions) console.error(`  ${key}: ${originals.join(", ")}`);
    process.exit(1);
  }

  let changed = 0;
  for (const u of users) {
    const normalized = u.email.trim().toLowerCase();
    if (normalized !== u.email) {
      await prisma.user.update({ where: { id: u.id }, data: { email: normalized } });
      console.log(`  ${u.email} -> ${normalized}`);
      changed++;
    }
  }

  console.log(`✓ Normalized ${changed} of ${users.length} user email(s) in ${target}.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
