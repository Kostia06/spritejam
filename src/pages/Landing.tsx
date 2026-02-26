import { PageTransition } from '@/components/ui/PageTransition';
import { PixelParticles } from '@/components/ui/PixelParticles';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';

/* ============================================
   Animated Pixel Grid (8x8 diamond)
   ============================================ */

const GRID_SIZE = 8;

const DIAMOND_PIXELS = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [1, 2, 3, 3, 3, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 2, 1],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

const PIXEL_COLORS = [
  'transparent',
  'var(--primary)',
  'var(--accent)',
  'var(--secondary)',
];

function HeroPixelGrid() {
  return (
    <div
      class="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: '220px', height: '220px' }}
      aria-hidden="true"
    >
      {DIAMOND_PIXELS.flatMap((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            class="rounded-sm"
            style={{
              backgroundColor: PIXEL_COLORS[cell],
              animation: cell > 0
                ? `hero-pixel-draw 0.4s ease-out ${(y * GRID_SIZE + x) * 40}ms both`
                : undefined,
              aspectRatio: '1',
            }}
          />
        )),
      )}
    </div>
  );
}

/* ============================================
   Data
   ============================================ */

const STEPS = [
  { num: '01', title: 'Draw', description: 'Pick up the pencil and create pixel-perfect sprites on an intuitive canvas with layers, palettes, and tools.' },
  { num: '02', title: 'Animate', description: 'Add frames, set timing, and let AI interpolate smooth animations between your keyframes.' },
  { num: '03', title: 'Share', description: 'Publish to the gallery, sell on the marketplace, or export sprites for your game.' },
];

const FEATURES = [
  { title: 'AI Sprite Generation', description: 'Describe what you want and Gemini AI generates pixel-perfect sprites as structured data.', icon: 'sparkles' },
  { title: 'Frame Interpolation', description: 'Draw key frames and let AI fill in the motion. Smooth animations in seconds.', icon: 'film' },
  { title: 'Smart Palette', description: 'AI-suggested color palettes that match your art style and mood.', icon: 'palette' },
  { title: 'Community Gallery', description: 'Browse, fork, and remix sprites from thousands of creators worldwide.', icon: 'users' },
  { title: 'Creator Marketplace', description: 'Sell your sprites and animation packs. Earn revenue from your pixel art.', icon: 'store' },
  { title: 'Export Anywhere', description: 'PNG sheets, CSS animations, Canvas JS, and more. Use your art everywhere.', icon: 'download' },
];

const STATS = [
  { value: '10K+', label: 'Sprites Created' },
  { value: '5K+', label: 'Creators' },
  { value: '50K+', label: 'Frames Animated' },
];

const FEATURE_ICONS: Record<string, string> = {
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
  film: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5',
  palette: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  store: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z',
  download: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
};

function FeatureIcon({ icon }: { icon: string }) {
  const path = FEATURE_ICONS[icon] ?? FEATURE_ICONS.sparkles;
  return (
    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d={path} />
    </svg>
  );
}

/* ============================================
   Landing Page
   ============================================ */

export function Landing() {
  return (
    <PageTransition>
      {/* Hero */}
      <section class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-dot-grid">
        <PixelParticles />

        <div class="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 text-center lg:flex-row lg:gap-20 lg:text-left">
          <div class="flex-1 max-w-2xl">
            <AnimatedText
              text="AI-Powered Pixel Art Studio"
              as="h1"
              class="font-pixel text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-gradient"
              delayMs={30}
            />

            <p
              class="mt-8 max-w-lg text-base text-[var(--text-1)] leading-relaxed mx-auto lg:mx-0 sm:text-lg"
              style={{ animation: 'fade-up 0.6s ease-out 0.8s both' }}
            >
              Draw pixel sprites, animate frame-by-frame, and let AI bring your creations to life. Share with the community or sell on the marketplace.
            </p>

            <div
              class="mt-10 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
              style={{ animation: 'fade-up 0.6s ease-out 1s both' }}
            >
              <a href="/editor">
                <Button variant="gradient" size="lg">Start Creating</Button>
              </a>
              <a href="/gallery">
                <Button variant="outline" size="lg">Browse Gallery</Button>
              </a>
            </div>
          </div>

          <div
            class="flex-shrink-0 hidden sm:block"
            style={{ animation: 'scale-in 0.8s ease-out 0.6s both' }}
          >
            <div class="glass rounded-2xl p-8 glow-primary">
              <HeroPixelGrid />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-2)]"
          style={{ animation: 'fade-in 1s ease-out 2s both' }}
        >
          <span class="text-xs font-pixel">Scroll</span>
          <div class="flex flex-col gap-1" style={{ animation: 'pixel-bounce 2s ease-in-out infinite' }}>
            <div class="w-1.5 h-1.5 rounded-sm bg-[var(--primary)]" />
            <div class="w-1.5 h-1.5 rounded-sm bg-[var(--accent)]" />
            <div class="w-1.5 h-1.5 rounded-sm bg-[var(--secondary)]" />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How It Works */}
      <section class="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ScrollReveal>
          <h2 class="reveal text-center font-pixel text-2xl font-bold text-gradient sm:text-3xl md:text-4xl">
            How It Works
          </h2>

          <div class="relative mt-14 grid gap-6 sm:gap-8 md:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div
              class="pointer-events-none absolute left-[16.5%] right-[16.5%] top-14 hidden h-px md:block"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, var(--primary) 0, var(--primary) 6px, transparent 6px, transparent 12px)',
                opacity: 0.4,
              }}
              aria-hidden="true"
            />

            {STEPS.map((step, i) => (
              <div key={step.num} class={`reveal stagger-${i + 1}`}>
                <GlowCard glow={(['primary', 'accent', 'secondary'] as const)[i]} class="text-center h-full">
                  <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                    <span class="font-pixel text-base font-bold text-white">{step.num}</span>
                  </div>
                  <h3 class="font-pixel text-xl font-semibold text-[var(--text-0)]">
                    {step.title}
                  </h3>
                  <p class="mt-3 text-sm text-[var(--text-1)] leading-relaxed">
                    {step.description}
                  </p>
                </GlowCard>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* Features */}
      <section class="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ScrollReveal>
          <h2 class="reveal text-center font-pixel text-2xl font-bold text-gradient sm:text-3xl md:text-4xl">
            Everything You Need
          </h2>
          <p class="reveal stagger-1 mx-auto mt-5 max-w-lg text-center text-[var(--text-1)] leading-relaxed">
            A complete toolkit for pixel art creation, animation, and community.
          </p>

          <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat, i) => (
              <div key={feat.title} class={`reveal stagger-${(i % 5) + 1}`}>
                <GlowCard glow={(['primary', 'accent', 'secondary'] as const)[i % 3]} class="h-full">
                  <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-2)] text-[var(--primary)]">
                    <FeatureIcon icon={feat.icon} />
                  </div>
                  <h3 class="font-pixel text-lg font-semibold text-[var(--text-0)]">
                    {feat.title}
                  </h3>
                  <p class="mt-3 text-sm text-[var(--text-1)] leading-relaxed">
                    {feat.description}
                  </p>
                </GlowCard>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* Stats */}
      <section class="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <ScrollReveal>
          <div class="reveal glass gradient-border rounded-2xl p-10 md:p-14">
            <div class="grid grid-cols-3 gap-6 text-center">
              {STATS.map((stat, i) => (
                <div key={stat.label} class={`stagger-${i + 1}`}>
                  <div class="text-gradient font-pixel text-3xl font-bold sm:text-4xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div class="mt-2 text-sm text-[var(--text-1)] sm:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section class="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <ScrollReveal>
          <GlowCard glow="accent" class="reveal text-center py-10 md:py-16">
            <h2 class="font-pixel text-2xl font-bold text-gradient sm:text-3xl md:text-4xl">
              Ready to Create?
            </h2>
            <p class="mx-auto mt-5 max-w-md text-[var(--text-1)] leading-relaxed">
              Join thousands of pixel artists using AI to bring their sprites to life.
            </p>
            <div class="mt-10">
              <a href="/editor">
                <Button variant="gradient" size="lg">Launch Editor</Button>
              </a>
            </div>
          </GlowCard>
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Landing;
