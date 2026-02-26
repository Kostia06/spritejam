import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';

export const projectRoutes = new Hono<{ Bindings: Env }>();

projectRoutes.use('*', authMiddleware());

projectRoutes.get('/', async (c) => {
  const userId = c.get('userId') as string;

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC',
  )
    .bind(userId)
    .all();

  return c.json(results);
});

projectRoutes.post('/', async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    title?: string;
    canvasWidth: number;
    canvasHeight: number;
    fps?: number;
  }>();

  const id = nanoid();
  const title = body.title ?? 'Untitled';
  const canvasWidth = body.canvasWidth ?? 32;
  const canvasHeight = body.canvasHeight ?? 32;
  const fps = body.fps ?? 12;

  await c.env.DB.prepare(
    'INSERT INTO projects (id, user_id, title, canvas_width, canvas_height, fps) VALUES (?, ?, ?, ?, ?, ?)',
  )
    .bind(id, userId, title, canvasWidth, canvasHeight, fps)
    .run();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ?',
  )
    .bind(id)
    .first();

  return c.json(project, 201);
});

projectRoutes.get('/:id', async (c) => {
  const userId = c.get('userId') as string;
  const { id } = c.req.param();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(id, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  return c.json(project);
});

projectRoutes.put('/:id', async (c) => {
  const userId = c.get('userId') as string;
  const { id } = c.req.param();
  const body = await c.req.json<{
    title?: string;
    canvasWidth?: number;
    canvasHeight?: number;
    fps?: number;
    isPublic?: boolean;
    tags?: string;
  }>();

  const existing = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(id, userId)
    .first();

  if (!existing) {
    return c.json({ message: 'Project not found' }, 404);
  }

  await c.env.DB.prepare(
    `UPDATE projects SET
      title = COALESCE(?, title),
      canvas_width = COALESCE(?, canvas_width),
      canvas_height = COALESCE(?, canvas_height),
      fps = COALESCE(?, fps),
      is_public = COALESCE(?, is_public),
      tags = COALESCE(?, tags),
      updated_at = datetime('now')
    WHERE id = ?`,
  )
    .bind(
      body.title ?? null,
      body.canvasWidth ?? null,
      body.canvasHeight ?? null,
      body.fps ?? null,
      body.isPublic !== undefined ? (body.isPublic ? 1 : 0) : null,
      body.tags ?? null,
      id,
    )
    .run();

  const updated = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ?',
  )
    .bind(id)
    .first();

  return c.json(updated);
});

projectRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId') as string;
  const { id } = c.req.param();

  const existing = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(id, userId)
    .first();

  if (!existing) {
    return c.json({ message: 'Project not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

  return c.json({ message: 'Deleted' });
});

projectRoutes.post('/:id/fork', async (c) => {
  const userId = c.get('userId') as string;
  const { id } = c.req.param();

  const source = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ?',
  )
    .bind(id)
    .first();

  if (!source) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const newId = nanoid();

  await c.env.DB.prepare(
    'INSERT INTO projects (id, user_id, title, canvas_width, canvas_height, fps, forked_from, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(
      newId,
      userId,
      `${source.title} (fork)`,
      source.canvas_width,
      source.canvas_height,
      source.fps,
      id,
      source.tags,
    )
    .run();

  const forkId = nanoid();
  await c.env.DB.prepare(
    'INSERT INTO forks (id, source_project_id, forked_project_id, user_id) VALUES (?, ?, ?, ?)',
  )
    .bind(forkId, id, newId, userId)
    .run();

  const frames = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE project_id = ? ORDER BY frame_order',
  )
    .bind(id)
    .all();

  for (const frame of frames.results) {
    const frameId = nanoid();
    await c.env.DB.prepare(
      'INSERT INTO frames (id, project_id, frame_order, duration_ms, layer_data_r2_key) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(frameId, newId, frame.frame_order, frame.duration_ms, frame.layer_data_r2_key)
      .run();
  }

  const forked = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ?',
  )
    .bind(newId)
    .first();

  return c.json(forked, 201);
});
