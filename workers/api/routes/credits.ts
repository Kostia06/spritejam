import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { getUser } from '../lib/d1';

export const creditRoutes = new Hono<{ Bindings: Env }>();

creditRoutes.use('*', authMiddleware());

creditRoutes.get('/balance', async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  return c.json({ credits: user.credits, plan: user.plan });
});

creditRoutes.get('/history', async (c) => {
  const userId = c.get('userId') as string;
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { results } = await c.env.DB.prepare(
    `SELECT
      id,
      amount,
      type,
      ai_feature as aiFeature,
      description,
      created_at as createdAt
    FROM credit_transactions
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?`,
  )
    .bind(userId, limit, offset)
    .all();

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM credit_transactions WHERE user_id = ?',
  )
    .bind(userId)
    .first<{ total: number }>();

  return c.json({
    transactions: results,
    total: countResult?.total ?? 0,
    page,
    limit,
  });
});
