import type { Context, Next } from 'hono';
import type { Env } from '../index';

export function authMiddleware() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const authorization = c.req.header('Authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const token = authorization.slice(7);
    const parts = token.split('.');

    if (parts.length !== 3) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    try {
      const [header, payload, signature] = parts;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(c.env.JWT_SECRET);

      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
      );

      const signatureData = encoder.encode(`${header}.${payload}`);
      const signatureBytes = Uint8Array.from(atob(signature), (ch) =>
        ch.charCodeAt(0),
      );

      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        signatureData,
      );

      if (!isValid) {
        return c.json({ message: 'Invalid token signature' }, 401);
      }

      const decoded = JSON.parse(atob(payload)) as {
        sub: string;
        exp: number;
      };

      if (decoded.exp < Date.now()) {
        return c.json({ message: 'Token expired' }, 401);
      }

      c.set('userId', decoded.sub);

      await next();
    } catch {
      return c.json({ message: 'Invalid token' }, 401);
    }
  };
}
