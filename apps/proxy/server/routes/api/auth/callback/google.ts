import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const oAuth2Client = new OAuth2Client(
    useRuntimeConfig(event).googleClientId,
    useRuntimeConfig(event).googleClientSecret,
    useRuntimeConfig(event).googleRedirectUri,
  );

  if (!query.code) return { error: 'Authorization failed: No authorization code received from Google' };

  const { code } = query;

  try {
    const response = await oAuth2Client.getToken(code as string);
    oAuth2Client.setCredentials(response.tokens);

    const sessionToken = uuidv4();
    const usersStorage = useStorage('users');
    await usersStorage.setItem(sessionToken, response.tokens)

    setCookie(event, 'session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
      path: '/',
    }); 

    return { success: true, message: 'Authentication successful' };
  } catch (err) {
    if (err instanceof Error) {
      // todo: check if it is safe to expose this data (it is but just in case)
      console.error('Authorization error:', err.message);
      return { error: `Failed to authorize: ${err.message}` };
    } else {
      console.error('Unknown authorization error:', err);
      return { error: 'Failed to authorize due to an unknown error.' };
    }
  }
});
