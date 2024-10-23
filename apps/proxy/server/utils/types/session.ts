export interface Session {
  id: string;
  expiresAt: Date;
  userId: number;
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
