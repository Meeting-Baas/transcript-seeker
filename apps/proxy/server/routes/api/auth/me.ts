import { H3Event, use } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const sessionToken = getCookie(event, 'session')

  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No session token found'
    })
  }

  try {
    const usersStorage = useStorage('users');
    const userData = await usersStorage.getItem(sessionToken);

    if (!userData) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized: Invalid session token'
      })
    }

    return {
      user: {
        ...userData as object
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})