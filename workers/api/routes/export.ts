import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { getObject } from '../lib/r2';

export const exportRoutes = new Hono<{ Bindings: Env }>();

exportRoutes.use('*', authMiddleware());

exportRoutes.post('/sprite-sheet', async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    projectId: string;
    scale?: number;
    columns?: number;
    backgroundColor?: string;
  }>();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(body.projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  const { results: frames } = await c.env.DB.prepare(
    'SELECT * FROM frames WHERE project_id = ? ORDER BY frame_order',
  )
    .bind(body.projectId)
    .all();

  const frameDataList: unknown[] = [];
  for (const frame of frames) {
    const r2Key = frame.layer_data_r2_key as string;
    const obj = await getObject(c.env.R2, r2Key);
    if (obj) {
      const text = await obj.text();
      frameDataList.push(JSON.parse(text));
    }
  }

  return c.json({
    projectId: body.projectId,
    canvasWidth: project.canvas_width,
    canvasHeight: project.canvas_height,
    scale: body.scale ?? 1,
    columns: body.columns ?? frames.length,
    backgroundColor: body.backgroundColor ?? null,
    frameCount: frames.length,
    frames: frameDataList,
  });
});

exportRoutes.post('/frames', async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    projectId: string;
    frameIds?: string[];
    scale?: number;
  }>();

  const project = await c.env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
  )
    .bind(body.projectId, userId)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  let frames;
  if (body.frameIds?.length) {
    const placeholders = body.frameIds.map(() => '?').join(',');
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM frames WHERE project_id = ? AND id IN (${placeholders}) ORDER BY frame_order`,
    )
      .bind(body.projectId, ...body.frameIds)
      .all();
    frames = results;
  } else {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM frames WHERE project_id = ? ORDER BY frame_order',
    )
      .bind(body.projectId)
      .all();
    frames = results;
  }

  const frameDataList: Array<{ id: string; order: number; data: unknown }> = [];
  for (const frame of frames) {
    const r2Key = frame.layer_data_r2_key as string;
    const obj = await getObject(c.env.R2, r2Key);
    if (obj) {
      const text = await obj.text();
      frameDataList.push({
        id: frame.id as string,
        order: frame.frame_order as number,
        data: JSON.parse(text),
      });
    }
  }

  return c.json({
    projectId: body.projectId,
    canvasWidth: project.canvas_width,
    canvasHeight: project.canvas_height,
    scale: body.scale ?? 1,
    frames: frameDataList,
  });
});
