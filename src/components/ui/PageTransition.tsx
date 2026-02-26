import type { JSX } from 'preact';

interface PageTransitionProps {
  children: JSX.Element | JSX.Element[];
  class?: string;
}

export function PageTransition({ children, class: className = '' }: PageTransitionProps) {
  return <div class={`page-enter ${className}`}>{children}</div>;
}
