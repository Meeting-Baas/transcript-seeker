import type { Bindings } from '@/types';
import { auth } from '@/lib/auth';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const authRouter = new Hono<Bindings>();

authRouter.use(
  '/**',
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGINS!,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

authRouter.on(['POST', 'GET'], '/**', (c) => {
  return auth.handler(c.req.raw);
});

export default authRouter;
