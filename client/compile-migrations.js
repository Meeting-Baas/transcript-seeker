import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = join(__filename, '..');
var migrations = readMigrationFiles({ migrationsFolder: "./drizzle/" });
await fs.writeFile(join(__dirname, "./drizzle_ts/migrations.json"), JSON.stringify(migrations, null, 2));
console.log("Migrations compiled!");
