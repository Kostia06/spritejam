import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'overlay-fade 0.2s ease both' }}
      onClick={(e: MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div class="absolute inset-0 bg-black/60" />
      <div
        class="relative glass-strong gradient-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modal-scale-in 0.3s ease both' }}
      >
        <div class="flex items-center justify-between p-4 border-b border-[var(--border)]/50">
          <h2 class="text-lg font-pixel font-semibold text-[var(--text-0)]">
            {title}
          </h2>
          <button
            type="button"
            class="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-1)] hover:text-[var(--text-0)] transition-colors rounded-lg hover:bg-[var(--bg-2)]"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
        </div>
        <div class="p-4">{children}</div>
      </div>
    </div>
  );
}
