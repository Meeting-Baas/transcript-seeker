import { VITE_API_URL } from '@/lib/constants';
import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: VITE_API_URL,
});
