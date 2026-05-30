/**
 * One-off prod migration: add the nullable `adminNotes` column to the
 * CustomerInquiry and BuyRequest tables in Turso. Additive + idempotent
 * (ignores "duplicate column" if already applied).
 *
 * Usage: DOTENV_CONFIG_PATH=.env.vercel.local npx tsx scripts/add-admin-notes-column.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN not set — refusing to run.");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const tables = ["CustomerInquiry", "BuyRequest"];

  for (const table of tables) {
    try {
      await client.execute(`ALTER TABLE ${table} ADD COLUMN adminNotes TEXT`);
      console.log(`✓ Added adminNotes to ${table}`);
    } catch (err) {
      const msg = String(err);
      if (/duplicate column name/i.test(msg)) {
        console.log(`• ${table}.adminNotes already exists — skipping`);
      } else {
        throw err;
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
