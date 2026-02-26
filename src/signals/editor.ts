import { signal, computed } from '@preact/signals';
import type { Tool } from '@/types/canvas';

export const activeTool = signal<Tool>('pencil');
export const activeColor = signal('#FFFFFF');
export const canvasWidth = signal(32);
export const canvasHeight = signal(32);
export const zoom = signal(10);
export const panX = signal(0);
export const panY = signal(0);
export const showGrid = signal(true);
export const showOnionSkin = signal(true);
export const mirrorAxis = signal<'none' | 'horizontal' | 'vertical' | 'both'>('none');

export const undoStack = signal<unknown[]>([]);
export const redoStack = signal<unknown[]>([]);
export const canUndo = computed(() => undoStack.value.length > 0);
export const canRedo = computed(() => redoStack.value.length > 0);
