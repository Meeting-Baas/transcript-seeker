import { eq } from 'drizzle-orm';

import { db } from '~/db/client';
import { usersTable } from '~/db/schema';

export async function createUser(
  googleId: string,
  email: string,
  name: string,
  picture: string,
): Promise<User> {
  const row = await db
    .insert(usersTable)
    .values({
      googleId: googleId,
      email,
      name,
      picture,
    })
    .returning({
      id: usersTable.id,
    });

  if (!row) {
    throw new Error('Unexpected error');
  }

  const user: User = {
    id: row[0].id,
    googleId,
    email,
    name,
    picture,
    // refreshToken,
  };
  return user;
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
  const result = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId));
  const row = result[0];

  if (!row) {
    return null;
  }

  const user: User = {
    id: row.id,
    googleId: row.googleId,
    email: row.email,
    name: row.name,
    picture: row.picture,
  };
  return user;
}
