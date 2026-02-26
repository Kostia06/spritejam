import type { JSX } from 'preact';

interface PixelBorderProps {
  children: JSX.Element | JSX.Element[];
  class?: string;
  animated?: boolean;
  glow?: boolean;
}

export function PixelBorder({
  children,
  class: className = '',
  animated = false,
  glow = false,
}: PixelBorderProps) {
  const glowClass = glow ? 'glow-primary' : '';
  const borderClass = animated ? 'gradient-border gradient-border-animated' : '';

  return (
    <div
      class={`relative p-3 rounded-lg ${borderClass} ${glowClass} ${className}`}
      style={
        !animated
          ? {
              boxShadow:
                'inset -2px -2px 0 0 var(--border), inset 2px 2px 0 0 var(--text-1), inset -4px -4px 0 0 var(--bg-2), inset 4px 4px 0 0 var(--bg-1)',
              imageRendering: 'pixelated',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
