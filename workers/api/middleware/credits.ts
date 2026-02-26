import type { Context, Next } from 'hono';
import type { Env } from '../index';
import { getUser } from '../lib/d1';

export function requireCredits(cost: number) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const userId = c.get('userId') as string;

    if (!userId) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const user = await getUser(c.env.DB, userId);

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    if (user.credits < cost) {
      return c.json(
        {
          message: 'Insufficient credits',
          required: cost,
          available: user.credits,
        },
        402,
      );
    }

    await next();
  };
}
