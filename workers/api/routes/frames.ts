import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { uploadObject, getObject } from '../lib/r2';

export const frameRoutes = new Hono<{ Bindings: Env }>();

frameRoutes.use('*', authMiddleware());

frameRoutes.get('/:projectId/frames', async (c) => {
  const userId = c.get('userId') as string;
  const { projectId } = c.req.param();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE project_id = ? ORDER BY frame_order',
  )
    .bind(projectId)
    .all();

  return c.json(results);
});

frameRoutes.post('/:projectId/frames', async (c) => {
  const userId = c.get('userId') as string;
  const { projectId } = c.req.param();
  const body = await c.req.json<{
    durationMs?: number;
    layerData: unknown;
  }>();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM frames WHERE project_id = ?',
  )
    .bind(projectId)
    .first<{ count: number }>();

  const frameOrder = countResult?.count ?? 0;
  const frameId = nanoid();
  const r2Key = `projects/${projectId}/frames/${frameId}.json`;

  const layerDataBuffer = new TextEncoder().encode(
    JSON.stringify(body.layerData),
  );
  await uploadObject(c.env.R2, r2Key, layerDataBuffer.buffer, 'application/json');

  await c.env.DB.prepare(
    'INSERT INTO frames (id, project_id, frame_order, duration_ms, layer_data_r2_key) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(frameId, projectId, frameOrder, body.durationMs ?? 83, r2Key)
    .run();

  const frame = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE id = ?',
  )
    .bind(frameId)
    .first();

  return c.json(frame, 201);
});

frameRoutes.put('/:projectId/frames/:frameId', async (c) => {
  const userId = c.get('userId') as string;
  const { projectId, frameId } = c.req.param();
  const body = await c.req.json<{
    durationMs?: number;
    layerData?: unknown;
    frameOrder?: number;
  }>();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const frame = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE id = ? AND project_id = ?',
  )
    .bind(frameId, projectId)
    .first();

  if (!frame) {
    return c.json({ message: 'Frame not found' }, 404);
  }

  if (body.layerData !== undefined) {
    const r2Key = frame.layer_data_r2_key as string;
    const layerDataBuffer = new TextEncoder().encode(
      JSON.stringify(body.layerData),
    );
    await uploadObject(c.env.R2, r2Key, layerDataBuffer.buffer, 'application/json');
  }

  await c.env.DB.prepare(
    `UPDATE frames SET
      duration_ms = COALESCE(?, duration_ms),
      frame_order = COALESCE(?, frame_order)
    WHERE id = ?`,
  )
    .bind(body.durationMs ?? null, body.frameOrder ?? null, frameId)
    .run();

  const updated = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE id = ?',
  )
    .bind(frameId)
    .first();

  return c.json(updated);
});

frameRoutes.delete('/:projectId/frames/:frameId', async (c) => {
  const userId = c.get('userId') as string;
  const { projectId, frameId } = c.req.param();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const frame = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE id = ? AND project_id = ?',
  )
    .bind(frameId, projectId)
    .first();

  if (!frame) {
    return c.json({ message: 'Frame not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM frames WHERE id = ?').bind(frameId).run();

  return c.json({ message: 'Deleted' });
});
