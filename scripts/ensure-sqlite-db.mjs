import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const envText = existsSync(".env") ? readFileSync(".env", "utf8") : "";
const match = envText.match(/^DATABASE_URL\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\r\n#]+))/m);
const databaseUrl = process.env.DATABASE_URL ?? match?.[1] ?? match?.[2] ?? match?.[3]?.trim();

if (databaseUrl?.startsWith("file:")) {
  const sqlitePath = databaseUrl.slice("file:".length).split(/[?#]/, 1)[0];
  const databasePath = resolve(sqlitePath);

  mkdirSync(dirname(databasePath), { recursive: true });
  closeSync(openSync(databasePath, "a"));
}
