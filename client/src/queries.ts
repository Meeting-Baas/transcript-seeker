import { db } from "@/db";
import { apiKeysTable, SelectAPIKey } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAPIKey({ type }: SelectAPIKey) {
    if (!type) return;
    return await db.select().from(apiKeysTable).where(eq(apiKeysTable.type, type));
}