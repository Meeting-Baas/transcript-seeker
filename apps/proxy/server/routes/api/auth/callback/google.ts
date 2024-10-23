import { OAuth2Client } from 'google-auth-library';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const oAuth2Client = new OAuth2Client(
    useRuntimeConfig(event).googleClientId,
    useRuntimeConfig(event).googleClientSecret,
    useRuntimeConfig(event).googleRedirectUri,
  );

  if (!query.code) return { error: "Failed to authorize" }

  const { code } = query;
  console.log(code)
  const response = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(response.tokens);

  return { tokens: r.tokens }
});
