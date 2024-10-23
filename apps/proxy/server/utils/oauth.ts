import { Google } from 'arctic';

export const google = new Google(
  process.env.NITRO_GOOGLE_CLIENT_ID ?? '',
  process.env.NITRO_GOOGLE_CLIENT_SECRET ?? '',
  process.env.NITRO_GOOGLE_REDIRECT_URI ?? '',
);
