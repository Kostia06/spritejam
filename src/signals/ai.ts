import { signal } from '@preact/signals';
import type { AiFeature } from '@/types/ai';

export const aiLoading = signal(false);
export const aiError = signal<string | null>(null);
export const aiActiveFeature = signal<AiFeature | null>(null);
export const aiPrompt = signal('');
