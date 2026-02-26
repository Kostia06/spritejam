import { signal } from '@preact/signals';

export const layerPanelOpen = signal(true);
export const aiPanelOpen = signal(false);
export const timelineOpen = signal(true);
export const mobileMenuOpen = signal(false);
export const modalOpen = signal<string | null>(null);

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const toasts = signal<Toast[]>([]);

export function addToast(message: string, type: Toast['type'] = 'info'): void {
  const id = crypto.randomUUID();
  toasts.value = [...toasts.value, { id, message, type }];
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 4000);
}
