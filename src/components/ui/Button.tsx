import type { JSX } from 'preact';

interface ButtonProps {
  children: JSX.Element | string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  class?: string;
  type?: 'button' | 'submit';
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-[var(--accent)] text-white hover:brightness-110',
  secondary: 'bg-[var(--bg-1)] text-[var(--text-0)] hover:bg-[var(--bg-2)]',
  outline: 'bg-transparent text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)]/10',
  ghost: 'bg-transparent text-[var(--accent)] hover:bg-[var(--accent)]/10',
  danger: 'bg-[var(--error)] text-white hover:brightness-110',
  gradient: 'bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] text-white bg-[length:200%_auto] hover:bg-right transition-[background-position] duration-500',
};

const SIZES: Record<string, string> = {
  sm: 'min-h-[36px] px-5 py-2 text-sm',
  md: 'min-h-[44px] px-7 py-3 text-base',
  lg: 'min-h-[56px] px-10 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  onClick,
  class: className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      class={`inline-flex items-center justify-center gap-2.5 rounded-xl font-pixel font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading && (
        <span class="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
