import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readMigrationFiles } from 'drizzle-orm/migrator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const migrations = readMigrationFiles({ migrationsFolder: './drizzle/' });

await fs.writeFile(
  join(__dirname, './migrations.json'),
  JSON.stringify(migrations, null, 2), // null, 2 adds indentation for better readability
);

console.log('Migrations compiled!');
