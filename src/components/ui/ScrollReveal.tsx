import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface ScrollRevealProps {
  children: ComponentChildren;
  class?: string;
}

export function ScrollReveal({ children, class: className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(
      (target) => observer.observe(target),
    );

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} class={className}>
      {children}
    </div>
  );
}
