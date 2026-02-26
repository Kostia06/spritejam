import type { Context, Next } from 'hono';
import type { Env } from '../index';

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
    const userId = (c.get('userId') as string) ?? ip;
    const key = `${userId}:${c.req.path}`;

    const now = Date.now();
    const entry = requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header('Retry-After', String(retryAfter));
      return c.json({ message: 'Rate limit exceeded' }, 429);
    }

    entry.count += 1;
    await next();
  };
}
