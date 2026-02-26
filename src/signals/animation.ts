import { signal, computed } from '@preact/signals';
import type { Frame } from '@/types/canvas';

export const frames = signal<Frame[]>([]);
export const currentFrameIndex = signal(0);
export const fps = signal(12);
export const isPlaying = signal(false);
export const isLooping = signal(true);
export const onionSkinRange = signal(1);

export const currentFrame = computed(() => frames.value[currentFrameIndex.value]);
export const frameCount = computed(() => frames.value.length);
