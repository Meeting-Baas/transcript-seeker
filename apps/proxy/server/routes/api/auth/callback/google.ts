import { ObjectParser } from '@pilcrowjs/object-parser';
import { decodeIdToken, OAuth2Tokens } from 'arctic';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { code, state } = query;
  const storedState = getCookie(event, 'google_oauth_state');
  const codeVerifier = getCookie(event, 'google_code_verifier');

  if (code === null || state === null || storedState === null || codeVerifier === null) {
    return {
      error: 'Please restart the process',
      status: 400,
    };
  }

  if (state !== storedState) {
    return {
      error: 'Please restart the process',
      status: 400,
    };
  }

  let tokens: OAuth2Tokens;

  try {
    tokens = await google.validateAuthorizationCode(code as string, codeVerifier);
  } catch {
    return {
      error: 'Please restart the process',
      status: 400,
    };
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString('sub');
  const name = claimsParser.getString('name');
  const picture = claimsParser.getString('picture');
  const email = claimsParser.getString('email');

  console.log(claims)

  // todo: split to queries.ts
  const existingUser = await getUserFromGoogleId(googleId);
  if (existingUser !== null) {
    console.log(existingUser)
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  }

  const user = await createUser(googleId, email, name, picture);
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);

  return sendRedirect(event, '/');
});
