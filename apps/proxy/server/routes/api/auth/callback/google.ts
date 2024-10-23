import { OAuth2Client } from 'google-auth-library';

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
    const response = await oAuth2Client.getToken(code.toString());
    oAuth2Client.setCredentials(response.tokens);

    return { data: response.tokens };
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
