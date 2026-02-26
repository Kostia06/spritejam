interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const SIZES: Record<string, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
};

export function Spinner({ size = 'md', class: className = '' }: SpinnerProps) {
  return (
    <div
      class={`${SIZES[size]} border-[var(--bg-3)] border-t-[var(--primary)] rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
