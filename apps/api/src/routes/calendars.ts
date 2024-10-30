import type { Bindings } from '@/types';
import { eq } from '@/db';
import { db } from '@/db/client';
import { account } from '@/db/schema';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { StatusCode } from 'hono/utils/http-status';

const calendars = new Hono<Bindings>();
calendars.use(
  '/*',
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGINS!,
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

calendars.get('/', async (c) => {
  const baasApiKey = c.req.header('x-meeting-baas-api-key');
  if (!baasApiKey) return c.body(null, 401);

  const user = c.get('user');
  if (!user) return c.body(null, 401);

  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendars`, {
    method: 'GET',
    headers: {
      'x-meeting-baas-api-key': baasApiKey,
    },
  });

  if (response.status != 200) {
    console.log('error, failed to get calendars:', await response.text());
    return c.body(null, 500);
  }

  const calendars = (await response.json()) as JSON;
  return c.json(calendars);
});

// todo: do only pass the parsed data do not pass everything
// todo: this is bcs that we have client_id and secret in baas apis
calendars.post('/', async (c) => {
  const baasApiKey = c.req.header('x-meeting-baas-api-key');
  if (!baasApiKey) return c.body(null, 401);

  const user = c.get('user');
  if (!user) return c.body(null, 401);

  const userAccount = await db.query.account.findFirst({
    where: eq(account.userId, user.id),
  });
  if (!userAccount) return c.body(null, 401);

  const body = await c.req.json();
  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendars`, {
    method: 'POST',
    headers: {
      'x-meeting-baas-api-key': baasApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      platform: body.platform,
      raw_calendar_id: body.calendarId,
      oauth_client_id: process.env.GOOGLE_CLIENT_ID!,
      oauth_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      oauth_refresh_token: userAccount.refreshToken,
    }),
  });

  if (response.status != 200) {
    console.log('error, failed to create calendar:', await response.text());
    return c.body(null, 500);
  }

  const calendars = (await response.json()) as JSON;
  return c.json(calendars);
});

calendars.delete('/', async (c) => {
  const baasApiKey = c.req.header('x-meeting-baas-api-key');
  if (!baasApiKey) return c.body(null, 401);

  const calendarId = c.req.query('calendarId');
  if (!calendarId) return c.body(null, 400);

  const user = c.get('user');
  if (!user) return c.body(null, 401);

  console.log(baasApiKey, `${process.env.MEETINGBAAS_API_URL}/calendars/${calendarId}`);
  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendars/${calendarId}`, {
    method: 'DELETE',
    headers: {
      'x-meeting-baas-api-key': baasApiKey,
      'Content-Type': 'application/json',
    },
  });

  if (response.status != 200) {
    console.log('error, failed to delete calendar:', await response.text());
    return c.body(null, response.status as StatusCode);
  }

  return c.body(null, 200);
});

calendars.get('/calendar_events', async (c) => {
  const baasApiKey = c.req.header('x-meeting-baas-api-key');
  if (!baasApiKey) return c.body(null, 401);

  const calendarId = c.req.query('calendarId');
  const limit = c.req.query('limit');
  const offset = c.req.query('offset');

  if (!calendarId || !limit || !offset) return c.body(null, 400);

  const user = c.get('user');
  if (!user) return c.body(null, 401);

  const params = new URLSearchParams({
    calendar_id: calendarId,
    limit,
    offset,
  });

  const response = await fetch(`${process.env.MEETINGBAAS_API_URL}/calendar_events?${params}`, {
    method: 'GET',
    headers: {
      'x-meeting-baas-api-key': baasApiKey,
    },
  });

  if (response.status != 200) {
    console.log('error, failed to get calendars:', await response.text());
    return c.body(null, 500);
  }

  const calendar_events = (await response.json()) as JSON;
  return c.json(calendar_events);
});

calendars.post('/calendar_events/:eventId/bot', async (c) => {
  const baasApiKey = c.req.header('x-meeting-baas-api-key');
  const eventId = c.req.param('eventId');
  if (!baasApiKey || !eventId) return c.body(null, 401);

  const user = c.get('user');
  if (!user) return c.body(null, 401);

  const userAccount = await db.query.account.findFirst({
    where: eq(account.userId, user.id),
  });
  if (!userAccount) return c.body(null, 401);

  const body = await c.req.json();
  const response = await fetch(
    `${process.env.MEETINGBAAS_API_URL}/calendar_events/${eventId}/bot`,
    {
      method: 'POST',
      headers: {
        'x-meeting-baas-api-key': baasApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_name: body.botName,
        bot_image: body.botImageUrl,
        speech_to_text: {
          provider: 'Default',
        },
        enter_message: body.enterMessage,
        recording_mode: 'speaker_view',
      }),
    },
  );

  if (response.status != 200) {
    console.log('error, failed to create calendar:', await response.text());
    return c.body(null, 500);
  }

  const calendars = (await response.json()) as JSON;
  return c.json(calendars);
});

export default calendars;
