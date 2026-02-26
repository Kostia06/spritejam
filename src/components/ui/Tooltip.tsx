import type { JSX } from 'preact';

interface TooltipProps {
  children: JSX.Element;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const POS: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  return (
    <div class="relative group inline-flex">
      {children}
      <div
        class={`absolute ${POS[position]} pointer-events-none opacity-0 group-hover:opacity-100 z-[70] whitespace-nowrap px-2.5 py-1.5 rounded-lg glass text-[var(--text-0)] text-xs shadow-lg transition-opacity duration-150`}
        role="tooltip"
      >
        {text}
      </div>
    </div>
  );
}
