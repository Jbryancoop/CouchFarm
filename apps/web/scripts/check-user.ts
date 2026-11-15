/** Read-only debug: confirm a user exists, the stored email casing, and active flag. */
import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.TURSO_DATABASE_URL!;
  const authToken = process.env.TURSO_AUTH_TOKEN!;
  const client = createClient({ url, authToken });
  const res = await client.execute({
    sql: "SELECT id, email, name, role, active, length(password) AS pw_len, updatedAt FROM User ORDER BY email",
    args: [],
  });
  for (const row of res.rows) {
    console.log(JSON.stringify(row));
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
