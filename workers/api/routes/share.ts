import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';

export const shareRoutes = new Hono<{ Bindings: Env }>();

shareRoutes.post('/', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    projectId: string;
    permission?: string;
    expiresInHours?: number;
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
  const token = nanoid(32);
  const permission = body.permission ?? 'view';

  let expiresAt: string | null = null;
  if (body.expiresInHours) {
    const date = new Date(Date.now() + body.expiresInHours * 60 * 60 * 1000);
    expiresAt = date.toISOString();
  }

  await c.env.DB.prepare(
    'INSERT INTO shares (id, project_id, token, permission, expires_at) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(id, body.projectId, token, permission, expiresAt)
    .run();

  const shareUrl = `${c.env.APP_URL}/share/${token}`;

  return c.json({ token, shareUrl, permission, expiresAt }, 201);
});

shareRoutes.get('/:token', async (c) => {
  const { token } = c.req.param();

  const share = await c.env.DB.prepare(
    'SELECT * FROM shares WHERE token = ?',
  )
    .bind(token)
    .first();

  if (!share) {
    return c.json({ message: 'Share link not found' }, 404);
  }

  if (share.expires_at) {
    const expiresAt = new Date(share.expires_at as string);
    if (expiresAt < new Date()) {
      return c.json({ message: 'Share link expired' }, 410);
    }
  }

  const project = await c.env.DB.prepare(
    `SELECT
      p.id,
      p.title,
      p.canvas_width as canvasWidth,
      p.canvas_height as canvasHeight,
      p.fps,
      u.display_name as userName
    FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?`,
  )
    .bind(share.project_id)
    .first();

  if (!project) {
    return c.json({ message: 'Project not found' }, 404);
  }

  return c.json({
    project,
    permission: share.permission,
  });
});

shareRoutes.delete('/:token', authMiddleware(), async (c) => {
  const userId = c.get('userId') as string;
  const { token } = c.req.param();

  const share = await c.env.DB.prepare(
    'SELECT s.* FROM shares s JOIN projects p ON s.project_id = p.id WHERE s.token = ? AND p.user_id = ?',
  )
    .bind(token, userId)
    .first();

  if (!share) {
    return c.json({ message: 'Share link not found' }, 404);
  }

  await c.env.DB.prepare('DELETE FROM shares WHERE token = ?')
    .bind(token)
    .run();

  return c.json({ message: 'Share link revoked' });
});
