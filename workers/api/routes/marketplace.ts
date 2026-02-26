import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { getUser } from '../lib/d1';

export const marketplaceRoutes = new Hono<{ Bindings: Env }>();

marketplaceRoutes.get('/', async (c) => {
  const sort = c.req.query('sort') ?? 'recent';
  const query = c.req.query('q');
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  let orderClause: string;
  switch (sort) {
    case 'popular':
      orderClause = 'ORDER BY ml.downloads DESC';
      break;
    case 'price_low':
      orderClause = 'ORDER BY ml.price_cents ASC';
      break;
    case 'price_high':
      orderClause = 'ORDER BY ml.price_cents DESC';
      break;
    default:
      orderClause = 'ORDER BY ml.created_at DESC';
  }

  let whereConditions = 'WHERE ml.is_active = 1';
  const bindValues: unknown[] = [];

  if (query) {
    whereConditions += ' AND (ml.title LIKE ? OR ml.description LIKE ?)';
    bindValues.push(`%${query}%`, `%${query}%`);
  }

  bindValues.push(limit, offset);

  const sql = `
    SELECT
      ml.id,
      ml.title,
      ml.description,
      ml.price_cents as priceCents,
      ml.license,
      ml.downloads,
      ml.rating_sum as ratingSum,
      ml.rating_count as ratingCount,
      ml.created_at as createdAt,
      u.display_name as userName,
      u.avatar_url as userAvatarUrl,
      p.thumbnail_r2_key as thumbnailUrl
    FROM marketplace_listings ml
    JOIN users u ON ml.user_id = u.id
    JOIN projects p ON ml.project_id = p.id
    ${whereConditions}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;

  const { results } = await c.env.DB.prepare(sql).bind(...bindValues).all();

  return c.json(results);
});

marketplaceRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();

  const listing = await c.env.DB.prepare(
    `SELECT
      ml.id,
      ml.title,
      ml.description,
      ml.price_cents as priceCents,
      ml.license,
      ml.downloads,
      ml.rating_sum as ratingSum,
      ml.rating_count as ratingCount,
      ml.is_active as isActive,
      ml.created_at as createdAt,
      u.display_name as userName,
      u.avatar_url as userAvatarUrl,
      p.thumbnail_r2_key as thumbnailUrl
    FROM marketplace_listings ml
    JOIN users u ON ml.user_id = u.id
    JOIN projects p ON ml.project_id = p.id
    WHERE ml.id = ?`,
  )
    .bind(id)
    .first();

  if (!listing) {
    return c.json({ message: 'Listing not found' }, 404);
  }

  return c.json(listing);
});

marketplaceRoutes.post('/', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const user = await getUser(c.env.DB, userId);

  if (!user || (user.plan !== 'pro' && user.plan !== 'studio')) {
    return c.json({ message: 'Pro or Studio plan required' }, 403);
  }

  const body = await c.req.json<{
    projectId: string;
    title: string;
    description?: string;
    priceCents: number;
    license?: string;
  }>();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(body.projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const id = nanoid();

  await c.env.DB.prepare(
    'INSERT INTO marketplace_listings (id, user_id, project_id, title, description, price_cents, license) VALUES (?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(
      id,
      userId,
      body.projectId,
      body.title,
      body.description ?? null,
      body.priceCents,
      body.license ?? 'personal',
    )
    .run();

  const listing = await c.env.DB.prepare(
    'SELECT * FROM marketplace_listings WHERE id = ?',
  )
    .bind(id)
    .first();

  return c.json(listing, 201);
});

marketplaceRoutes.post('/:id/purchase', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const { id } = c.req.param();

  const listing = await c.env.DB.prepare(
    'SELECT * FROM marketplace_listings WHERE id = ? AND is_active = 1',
  )
    .bind(id)
    .first();

  if (!listing) {
    return c.json({ message: 'Listing not found' }, 404);
  }

  if (listing.user_id === userId) {
    return c.json({ message: 'Cannot purchase your own listing' }, 400);
  }

  const { createStripeClient, createCheckoutSession } = await import(
    '../lib/stripe'
  );
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY);

  const checkoutUrl = await createCheckoutSession(stripe, {
    lineItems: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: listing.title as string },
          unit_amount: listing.price_cents as number,
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: 'marketplace_purchase',
      listingId: id,
      buyerId: userId,
      sellerId: listing.user_id as string,
    },
    successUrl: `${c.env.APP_URL}/marketplace/${id}?purchased=true`,
    cancelUrl: `${c.env.APP_URL}/marketplace/${id}`,
  });

  return c.json({ checkoutUrl });
});
