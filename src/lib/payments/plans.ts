import type { PlanId } from '@/types/user';
import type { ExportFormat } from '@/types/export';

export interface PlanConfig {
  name: string;
  priceCents: number;
  monthlyCredits: number;
  maxProjects: number;
  maxLibrary: number;
  exports: ExportFormat[];
  marketplace: boolean;
  privateLinks: boolean;
  priorityAi: boolean;
  revShare?: number;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    name: 'Free',
    priceCents: 0,
    monthlyCredits: 20,
    maxProjects: 5,
    maxLibrary: 50,
    exports: ['png_frames'],
    marketplace: false,
    privateLinks: false,
    priorityAi: false,
  },
  pro: {
    name: 'Pro',
    priceCents: 800,
    monthlyCredits: 200,
    maxProjects: Infinity,
    maxLibrary: 500,
    exports: ['png_frames', 'sprite_sheet', 'css', 'canvas_js'],
    marketplace: true,
    privateLinks: true,
    priorityAi: false,
    revShare: 0.85,
  },
  studio: {
    name: 'Studio',
    priceCents: 2000,
    monthlyCredits: 1000,
    maxProjects: Infinity,
    maxLibrary: Infinity,
    exports: ['png_frames', 'sprite_sheet', 'css', 'canvas_js', 'batch'],
    marketplace: true,
    privateLinks: true,
    priorityAi: true,
    revShare: 0.90,
  },
};

export const CREDIT_PACKS = [
  { id: 'starter', credits: 50, priceCents: 299 },
  { id: 'creator', credits: 200, priceCents: 999 },
  { id: 'studio', credits: 500, priceCents: 1999 },
  { id: 'enterprise', credits: 2000, priceCents: 5999 },
] as const;

export const AI_COSTS = {
  generate_sprite: 5,
  interpolate_frame: 3,
  suggest_palette: 1,
  autocomplete: 3,
} as const;
