/**
 * Read-only: report recent activity in prod across all main tables, grouped
 * by what happened since a given cutoff (defaults to 7 days ago).
 *
 * Usage:
 *   DOTENV_CONFIG_PATH=.env.vercel.local npx tsx scripts/activity-since.ts
 *   DOTENV_CONFIG_PATH=.env.vercel.local npx tsx scripts/activity-since.ts '2026-05-30T18:02:24Z'
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const cutoffArg = process.argv[2];
  const cutoff = cutoffArg
    ? new Date(cutoffArg).toISOString()
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const url = process.env.TURSO_DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN!;
  const client = createClient({ url, authToken });

  console.log(`Activity since ${cutoff} (UTC)\n`);

  const queries = [
    {
      label: "Sessions (logins)",
      sql: `SELECT COUNT(*) AS n, MAX(createdAt) AS latest FROM Session WHERE createdAt > ?`,
    },
    {
      label: "Couches added",
      sql: `SELECT COUNT(*) AS n, MAX(createdAt) AS latest FROM Couch WHERE createdAt > ?`,
    },
    {
      label: "Couches updated (edited/sold/etc.)",
      sql: `SELECT COUNT(*) AS n, MAX(updatedAt) AS latest FROM Couch WHERE updatedAt > ? AND updatedAt <> createdAt`,
    },
    {
      label: "Customer inquiries",
      sql: `SELECT COUNT(*) AS n, MAX(createdAt) AS latest FROM CustomerInquiry WHERE createdAt > ?`,
    },
    {
      label: "Buy requests",
      sql: `SELECT COUNT(*) AS n, MAX(createdAt) AS latest FROM BuyRequest WHERE createdAt > ?`,
    },
    {
      label: "Sales",
      sql: `SELECT COUNT(*) AS n, MAX(createdAt) AS latest FROM Sale WHERE createdAt > ?`,
    },
    {
      label: "Marketing link clicks (total clicks on links updated since)",
      sql: `SELECT COALESCE(SUM(clicks),0) AS n, MAX(updatedAt) AS latest FROM MarketingLink WHERE updatedAt > ?`,
    },
    {
      label: "User rows (created or updated)",
      sql: `SELECT COUNT(*) AS n, MAX(updatedAt) AS latest FROM User WHERE updatedAt > ?`,
    },
  ];

  for (const q of queries) {
    const res = await client.execute({ sql: q.sql, args: [cutoff] });
    const row = res.rows[0] as { n: number; latest: string | null };
    const n = Number(row.n ?? 0);
    const latest = row.latest ?? "-";
    console.log(`  ${q.label.padEnd(50)} ${String(n).padStart(4)}    latest: ${latest}`);
  }

  console.log();
  console.log("Most recent records (top 5):");
  for (const table of ["CustomerInquiry", "BuyRequest", "Sale", "Couch"]) {
    const tsCol = table === "Sale" || table === "BuyRequest" || table === "CustomerInquiry" ? "createdAt" : "updatedAt";
    const res = await client.execute(
      `SELECT id, ${tsCol} AS ts FROM ${table} ORDER BY ${tsCol} DESC LIMIT 5`
    );
    if (res.rows.length === 0) {
      console.log(`  ${table}: (empty)`);
      continue;
    }
    console.log(`  ${table}:`);
    for (const r of res.rows) console.log(`    ${(r as any).ts}  ${(r as any).id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
