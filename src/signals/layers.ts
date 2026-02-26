import { signal, computed } from '@preact/signals';
import type { Layer } from '@/types/canvas';

export const layers = signal<Layer[]>([]);
export const activeLayerId = signal<string | null>(null);

export const activeLayer = computed(() =>
  layers.value.find((l) => l.id === activeLayerId.value) ?? null
);

export const visibleLayers = computed(() =>
  layers.value.filter((l) => l.visible)
);
