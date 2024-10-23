import { OAuth2Client } from 'google-auth-library';

export default eventHandler((event) => {
  const oAuth2Client = new OAuth2Client(
    useRuntimeConfig(event).googleClientId,
    useRuntimeConfig(event).googleClientSecret,
    useRuntimeConfig(event).googleRedirectUri,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
    prompt: 'consent',
  });

  return sendRedirect(event, authorizeUrl)
});
