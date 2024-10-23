import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usersTable } from "~/db/schema";

export async function createUser(googleId: string, email: string, name: string, picture: string): Promise<User> {
  const row = await db.insert(usersTable).values({
    google_id: googleId,
    email,
    name,
    picture
  }).returning({
    id: usersTable.id
  });

  if (row === null) {
    throw new Error('Unexpected error');
  }

  const user: User = {
    id: row[0].id,
    googleId,
    email,
    name,
    picture,
  };
  return user;
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
  const result = await db.select().from(usersTable).where(eq(usersTable.google_id, googleId))
  const row = result[0];

  if (row === null) {
    return null;
  }

  const user: User = {
    id: row.id,
    googleId: row.google_id,
    email: row.email,
    name: row.name,
    picture: row.picture,
  };
  return user;
}
