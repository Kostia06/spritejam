import { PageTransition } from '@/components/ui/PageTransition';
import { PixelParticles } from '@/components/ui/PixelParticles';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';

/* ============================================
   NotFound (404) Page
   ============================================ */

export function NotFound() {
  return (
    <PageTransition>
      <section class="relative flex min-h-[80dvh] items-center justify-center overflow-hidden">
        <PixelParticles />

        <div
          class="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
          style={{ animation: 'scale-in 0.5s ease-out both' }}
        >
          <h1 class="font-pixel text-8xl font-bold text-gradient md:text-9xl">
            404
          </h1>
          <h2 class="font-pixel text-xl text-[var(--text-0)]">
            Page Not Found
          </h2>
          <p class="max-w-xs text-sm text-[var(--text-1)]">
            This pixel seems to have wandered off the canvas.
          </p>
          <a href="/">
            <Button variant="gradient" size="lg">Back to Home</Button>
          </a>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default NotFound;
