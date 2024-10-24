import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { H3Event } from 'h3';

import { db } from '~/db/client';
import { sessionsTable, usersTable } from '~/db/schema';
import { Session, SessionValidationResult } from './types/session';
import { User } from './types/user';

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({
      sessionId: sessionsTable.id,
      sessionUserId: sessionsTable.userId,
      sessionExpiresAt: sessionsTable.expiresAt,
      userId: usersTable.id,
      userGoogleId: usersTable.google_id,
      userEmail: usersTable.email,
      userName: usersTable.name,
      userPicture: usersTable.picture,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.id, sessionId))
    .get();

  if (!result) {
    return { session: null, user: null };
  }

  const sessionData: Session = {
    id: result.sessionId,
    userId: result.sessionUserId,
    expiresAt: new Date(result.sessionExpiresAt * 1000),
  };

  const userData: User = {
    id: result.userId,
    googleId: result.userGoogleId,
    email: result.userEmail,
    name: result.userName,
    picture: result.userPicture,
  };

  if (Date.now() >= sessionData.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionData.id)).execute();
    return { session: null, user: null };
  }

  if (Date.now() >= sessionData.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    sessionData.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionsTable)
      .set({ expiresAt: Math.floor(sessionData.expiresAt.getTime() / 1000) })
      .where(eq(sessionsTable.id, sessionData.id))
      .execute();
  }

  return { session: sessionData, user: userData };
}

export const getCurrentSession = async (event: H3Event): Promise<SessionValidationResult> => {
  const token = getCookie(event, 'session');

  if (token === null) {
    return { session: null, user: null };
  }

  const result = await validateSessionToken(token);
  return result;
};

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId)).execute();
}

export async function invalidateUserSessions(userId: number): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId)).execute();
}

export function setSessionTokenCookie(event: H3Event, token: string, expiresAt: Date): void {
  setCookie(event, 'session', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(event: H3Event): void {
  setCookie(event, 'session', '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db
    .insert(sessionsTable)
    .values({
      id: sessionId,
      userId: userId,
      expiresAt: Math.floor(expiresAt.getTime() / 1000),
    })
    .execute();

  return {
    id: sessionId,
    userId,
    expiresAt,
  };
}
