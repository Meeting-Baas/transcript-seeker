// migrate.ts

import type { MigrationConfig } from "drizzle-orm/migrator";
import { db } from "@/db";
import migrations from "../../drizzle_ts/migrations.json";

export async function migrate() {
    // @ts-ignore
    db.dialect.migrate(migrations, db.session, {
        migrationsTable: "drizzle_migrations",
    } satisfies Omit<MigrationConfig, "migrationsFolder">);
}