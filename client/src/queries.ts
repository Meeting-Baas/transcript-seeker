import { db } from "@/db";
import { apiKeysTable, InsertAPIKey, SelectAPIKey } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAPIKey({ type }: { type: SelectAPIKey['type'] }) {
    if (!type) return;
    return await db.query.apiKeysTable.findFirst({
        where: (apiKeys, { eq }) => (eq(apiKeys.type, type)),
    });
}

export async function setAPIKey({ type, content }: InsertAPIKey) {
    if (!type) return;
    const apiKey = await db.query.apiKeysTable.findFirst({
        where: (apiKeys, { eq }) => (eq(apiKeys.type, type)),
    });
    if (apiKey) {
        return await db.update(apiKeysTable)
            .set({ type: type, content: content })
            .where(eq(apiKeysTable.type, type)).returning({
                type: apiKeysTable.type,
                content: apiKeysTable.content
            })
    } else {
        return await db.insert(apiKeysTable)
            .values({ type: type, content: content }).returning({
                type: apiKeysTable.type,
                content: apiKeysTable.content
            })
    }
}