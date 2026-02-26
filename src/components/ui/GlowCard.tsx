import type { ComponentChildren } from 'preact';

interface GlowCardProps {
  children: ComponentChildren;
  class?: string;
  glow?: 'primary' | 'accent' | 'secondary';
}

const GLOW: Record<string, string> = {
  primary: 'hover:shadow-[0_0_30px_rgba(108,92,231,0.4)]',
  accent: 'hover:shadow-[0_0_30px_rgba(253,121,168,0.4)]',
  secondary: 'hover:shadow-[0_0_30px_rgba(0,206,201,0.4)]',
};

export function GlowCard({
  children,
  class: className = '',
  glow = 'primary',
}: GlowCardProps) {
  return (
    <div
      class={`glass gradient-border card-3d rounded-xl p-8 transition-shadow duration-300 ${GLOW[glow]} ${className}`}
    >
      {children}
    </div>
  );
}
