import { Hono } from 'hono';
import type { Env } from '../index';
import { authMiddleware } from '../middleware/auth';
import { requireCredits } from '../middleware/credits';
import { buildSystemPrompt, callGemini } from '../lib/gemini';
import { updateUserCredits, logCreditTransaction } from '../lib/d1';

export const aiRoutes = new Hono<{ Bindings: Env }>();

aiRoutes.use('*', authMiddleware());

aiRoutes.post('/generate', requireCredits(5), async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    prompt: string;
    canvasWidth: number;
    canvasHeight: number;
    palette?: string[];
  }>();

  const systemPrompt = buildSystemPrompt(
    body.canvasWidth,
    body.canvasHeight,
    body.palette,
  );

  const result = await callGemini(c.env, systemPrompt, body.prompt);

  await updateUserCredits(c.env.DB, userId, -5);
  await logCreditTransaction(
    c.env.DB,
    userId,
    -5,
    'debit',
    'generate_sprite',
  );

  return c.json(result);
});

aiRoutes.post('/interpolate', requireCredits(3), async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    startFrame: unknown[];
    endFrame: unknown[];
    frameCount: number;
    canvasWidth: number;
    canvasHeight: number;
  }>();

  const totalCost = 3 * body.frameCount;
  const systemPrompt = buildSystemPrompt(body.canvasWidth, body.canvasHeight);

  const userPrompt = [
    `Generate ${body.frameCount} intermediate animation frames.`,
    `Start frame pixels: ${JSON.stringify(body.startFrame)}`,
    `End frame pixels: ${JSON.stringify(body.endFrame)}`,
    'Smoothly transition positions and colors between start and end.',
  ].join('\n');

  const result = await callGemini(c.env, systemPrompt, userPrompt);

  await updateUserCredits(c.env.DB, userId, -totalCost);
  await logCreditTransaction(
    c.env.DB,
    userId,
    -totalCost,
    'debit',
    'interpolate',
  );

  return c.json(result);
});

aiRoutes.post('/palette', requireCredits(1), async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    existingPixels?: unknown[];
    theme?: string;
    colorCount?: number;
  }>();

  const systemPrompt = buildSystemPrompt(1, 1);
  const colorCount = body.colorCount ?? 16;

  const userPrompt = [
    `Suggest a pixel art color palette with ${colorCount} colors.`,
    body.theme ? `Theme: ${body.theme}` : '',
    body.existingPixels?.length
      ? `Existing pixels for reference: ${JSON.stringify(body.existingPixels.slice(0, 50))}`
      : '',
    'Return colors as hex values with descriptive names.',
  ]
    .filter(Boolean)
    .join('\n');

  const result = await callGemini(c.env, systemPrompt, userPrompt);

  await updateUserCredits(c.env.DB, userId, -1);
  await logCreditTransaction(c.env.DB, userId, -1, 'debit', 'palette');

  return c.json(result);
});

aiRoutes.post('/autocomplete', requireCredits(3), async (c) => {
  const userId = c.get('userId') as string;
  const body = await c.req.json<{
    existingPixels: unknown[];
    canvasWidth: number;
    canvasHeight: number;
    palette?: string[];
  }>();

  const systemPrompt = buildSystemPrompt(
    body.canvasWidth,
    body.canvasHeight,
    body.palette,
  );

  const userPrompt = [
    'Analyze the existing pixel art and suggest additional pixels to complete it.',
    `Existing pixels: ${JSON.stringify(body.existingPixels)}`,
    'Maintain the existing art style. Only add pixels that enhance the design.',
  ].join('\n');

  const result = await callGemini(c.env, systemPrompt, userPrompt);

  await updateUserCredits(c.env.DB, userId, -3);
  await logCreditTransaction(c.env.DB, userId, -3, 'debit', 'autocomplete');

  return c.json(result);
});
