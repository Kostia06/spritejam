import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { frameRoutes } from './routes/frames';
import { aiRoutes } from './routes/ai';
import { galleryRoutes } from './routes/gallery';
import { marketplaceRoutes } from './routes/marketplace';
import { shareRoutes } from './routes/share';
import { exportRoutes } from './routes/export';
import { creditRoutes } from './routes/credits';
import { paymentRoutes } from './routes/payments';

export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  APP_URL: string;
  GEMINI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PUBLISHABLE_KEY: string;
  JWT_SECRET: string;
  CF_ACCESS_TEAM_DOMAIN: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  '*',
  cors({
    origin: (origin) => origin,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
);

const api = new Hono<{ Bindings: Env }>();

api.route('/auth', authRoutes);
api.route('/projects', projectRoutes);
api.route('/frames', frameRoutes);
api.route('/ai', aiRoutes);
api.route('/gallery', galleryRoutes);
api.route('/marketplace', marketplaceRoutes);
api.route('/share', shareRoutes);
api.route('/export', exportRoutes);
api.route('/credits', creditRoutes);
api.route('/payments', paymentRoutes);
api.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/api', api);

export default app;
