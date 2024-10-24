export default defineEventHandler(async (event) => {
  const { user } = await getCurrentSession(event);

  return { user };
});
