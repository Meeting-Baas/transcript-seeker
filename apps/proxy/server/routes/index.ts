export default defineEventHandler(async (event) => {
  const { user } = await getCurrentSession(event);

  if (!user) return "Hello World!";
  return `Hello, ${user.name}!`;
});
