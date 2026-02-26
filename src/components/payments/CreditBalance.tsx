import { creditBalance } from '@/signals/auth';

interface CreditBalanceProps {
  class?: string;
  showLabel?: boolean;
}

export function CreditBalance({ class: className = '', showLabel = true }: CreditBalanceProps) {
  return (
    <div class={`inline-flex items-center gap-2 ${className}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--warning)" aria-hidden="true">
        <circle cx="8" cy="8" r="6" />
        <text
          x="8"
          y="11"
          text-anchor="middle"
          fill="var(--bg-0)"
          font-size="8"
          font-weight="bold"
        >
          C
        </text>
      </svg>
      <span class="font-pixel font-semibold text-gradient text-lg leading-none">
        {creditBalance.value}
      </span>
      {showLabel && (
        <span class="text-xs text-[var(--text-1)] font-body">credits</span>
      )}
    </div>
  );
}
