import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { getUser } from '../lib/d1';
import { nanoid } from 'nanoid';

export const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.get('/login', (c) => {
  const provider = c.req.query('provider') ?? 'github';
  const teamDomain = c.env.CF_ACCESS_TEAM_DOMAIN;
  const redirectUri = `${c.env.APP_URL}/api/auth/callback`;

  const loginUrl = `https://${teamDomain}/cdn-cgi/access/login?redirect_url=${encodeURIComponent(redirectUri)}&provider=${provider}`;

  return c.redirect(loginUrl);
});

authRoutes.get('/:provider', (c) => {
  const provider = c.req.param('provider');
  const teamDomain = c.env.CF_ACCESS_TEAM_DOMAIN;
  const redirectUri = `${c.env.APP_URL}/api/auth/callback`;

  const loginUrl = `https://${teamDomain}/cdn-cgi/access/login?redirect_url=${encodeURIComponent(redirectUri)}&provider=${provider}`;

  return c.redirect(loginUrl);
});

authRoutes.post('/callback', async (c) => {
  const body = await c.req.json<{ code: string; state?: string }>();
  const { code } = body;

  if (!code) {
    return c.json({ message: 'Missing authorization code' }, 400);
  }

  const teamDomain = c.env.CF_ACCESS_TEAM_DOMAIN;
  const tokenResponse = await fetch(
    `https://${teamDomain}/cdn-cgi/access/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    },
  );

  if (!tokenResponse.ok) {
    return c.json({ message: 'Token exchange failed' }, 401);
  }

  const tokenData = await tokenResponse.json<{
    email: string;
    sub: string;
    name?: string;
  }>();

  const existingUser = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?',
  )
    .bind(tokenData.email)
    .first();

  let userId: string;

  if (existingUser) {
    userId = existingUser.id as string;
  } else {
    userId = nanoid();
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)',
    )
      .bind(userId, tokenData.email, tokenData.name ?? tokenData.email)
      .run();
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(c.env.JWT_SECRET);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload = btoa(
    JSON.stringify({ sub: userId, exp: expiresAt.getTime() }),
  );
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const signatureData = encoder.encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign('HMAC', key, signatureData);
  const token = `${header}.${payload}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;

  const user = await getUser(c.env.DB, userId);

  return c.json({
    user,
    session: { token, userId, expiresAt: expiresAt.toISOString() },
  });
});

authRoutes.get('/me', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  return c.json({ user, session: { token: '', userId, expiresAt: '' } });
});

authRoutes.post('/logout', authMiddleware(), (c) => {
  return c.json({ message: 'Logged out' });
});
