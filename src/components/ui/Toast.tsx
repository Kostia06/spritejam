import { toasts } from '@/signals/ui';

const TYPE_CLASSES: Record<string, string> = {
  success: 'border-l-[var(--success)]',
  error: 'border-l-[var(--error)]',
  warning: 'border-l-[var(--warning)]',
  info: 'border-l-[var(--primary)]',
};

export function ToastContainer() {
  if (toasts.value.length === 0) return null;

  return (
    <div class="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.value.map((t) => (
        <div
          key={t.id}
          class={`pointer-events-auto glass rounded-lg px-4 py-3 text-sm text-[var(--text-0)] border-l-4 ${TYPE_CLASSES[t.type]} shadow-lg`}
          style={{ animation: 'fade-up 0.3s ease-out both' }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
