import { Hono } from 'hono';
import type { Env } from '../index';

export const galleryRoutes = new Hono<{ Bindings: Env }>();

galleryRoutes.get('/', async (c) => {
  const sort = c.req.query('sort') ?? 'recent';
  const tag = c.req.query('tag');
  const query = c.req.query('q');
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const limit = 24;
  const offset = (page - 1) * limit;

  let orderClause: string;
  switch (sort) {
    case 'popular':
      orderClause = 'ORDER BY fork_count DESC, p.updated_at DESC';
      break;
    case 'trending':
      orderClause = "ORDER BY p.updated_at DESC, p.created_at DESC";
      break;
    default:
      orderClause = 'ORDER BY p.updated_at DESC';
  }

  let whereConditions = 'WHERE p.is_public = 1';
  const bindValues: unknown[] = [];

  if (tag) {
    whereConditions += ' AND p.tags LIKE ?';
    bindValues.push(`%${tag}%`);
  }

  if (query) {
    whereConditions += ' AND p.title LIKE ?';
    bindValues.push(`%${query}%`);
  }

  bindValues.push(limit, offset);

  const sql = `
    SELECT
      p.id,
      p.title,
      p.thumbnail_r2_key as thumbnailUrl,
      u.display_name as userName,
      p.tags,
      p.canvas_width as canvasWidth,
      p.canvas_height as canvasHeight,
      (SELECT COUNT(*) FROM forks f WHERE f.source_project_id = p.id) as fork_count
    FROM projects p
    JOIN users u ON p.user_id = u.id
    ${whereConditions}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;

  const stmt = c.env.DB.prepare(sql);
  const { results } = await stmt.bind(...bindValues).all();

  const sprites = results.map((row) => ({
    ...row,
    tags: row.tags ? (row.tags as string).split(',').map((t: string) => t.trim()) : [],
  }));

  return c.json(sprites);
});

galleryRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();

  const project = await c.env.DB.prepare(
    `SELECT
      p.id,
      p.title,
      p.thumbnail_r2_key as thumbnailUrl,
      u.display_name as userName,
      u.avatar_url as userAvatarUrl,
      p.tags,
      p.canvas_width as canvasWidth,
      p.canvas_height as canvasHeight,
      p.fps,
      p.forked_from as forkedFrom,
      p.created_at as createdAt,
      (SELECT COUNT(*) FROM frames f WHERE f.project_id = p.id) as frameCount
    FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ? AND p.is_public = 1`,
  )
    .bind(id)
    .first();

  if (!project) {
    return c.json({ message: 'Sprite not found' }, 404);
  }

  const result = {
    ...project,
    tags: project.tags
      ? (project.tags as string).split(',').map((t: string) => t.trim())
      : [],
  };

  return c.json(result);
});
