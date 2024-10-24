export default defineEventHandler(async (event) => {
  const { session } = await getCurrentSession(event);

  if (!session) {
    return {
      message: 'Not authenticated',
    };
  }

  invalidateSession(session.id);
  deleteSessionTokenCookie(event);

  return {
    message: 'Logged out successfully',
  };
});
