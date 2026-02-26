import { PageTransition } from '@/components/ui/PageTransition';
import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { PLANS, CREDIT_PACKS, AI_COSTS } from '@/lib/payments/plans';
import { isAuthenticated, user } from '@/signals/auth';
import type { PlanId } from '@/types/user';

/* ============================================
   Helpers
   ============================================ */

function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(0)}`;
}

function formatCreditPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ============================================
   Plan features
   ============================================ */

interface PlanFeature {
  text: string;
  included: boolean;
}

function buildPlanFeatures(planId: PlanId): PlanFeature[] {
  const plan = PLANS[planId];
  return [
    { text: `${plan.monthlyCredits} AI credits/month`, included: true },
    { text: plan.maxProjects === Infinity ? 'Unlimited projects' : `${plan.maxProjects} projects`, included: true },
    { text: plan.maxLibrary === Infinity ? 'Unlimited library' : `${plan.maxLibrary} library assets`, included: true },
    { text: `PNG export`, included: true },
    { text: 'Sprite sheet export', included: plan.exports.includes('sprite_sheet') },
    { text: 'CSS & Canvas JS export', included: plan.exports.includes('css') },
    { text: 'Marketplace selling', included: plan.marketplace },
    { text: 'Private share links', included: plan.privateLinks },
    { text: 'Priority AI queue', included: plan.priorityAi },
  ];
}

const PLAN_IDS: PlanId[] = ['free', 'pro', 'studio'];

const PLAN_GLOW: Record<PlanId, 'primary' | 'accent' | 'secondary'> = {
  free: 'primary',
  pro: 'accent',
  studio: 'secondary',
};

/* ============================================
   Check Icon
   ============================================ */

function CheckIcon({ included }: { included: boolean }) {
  if (!included) {
    return (
      <svg class="w-4 h-4 text-[var(--text-2)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
      </svg>
    );
  }
  return (
    <svg class="w-4 h-4 text-[var(--success)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

/* ============================================
   Pricing Page
   ============================================ */

export function Pricing() {
  const currentPlan = user.value?.plan ?? 'free';

  return (
    <PageTransition>
      {/* Plans Section */}
      <section class="relative mx-auto max-w-6xl px-6 pt-28 pb-16 bg-dot-grid">
        <ScrollReveal>
          <h1 class="reveal text-center font-pixel text-3xl font-bold text-gradient sm:text-4xl md:text-5xl">
            Simple Pricing
          </h1>
          <p class="reveal stagger-1 mx-auto mt-5 max-w-md text-center text-[var(--text-1)] leading-relaxed">
            Start free. Upgrade when you need more power.
          </p>

          {/* Plan Cards */}
          <div class="mt-16 grid gap-8 md:grid-cols-3">
            {PLAN_IDS.map((planId, i) => {
              const plan = PLANS[planId];
              const features = buildPlanFeatures(planId);
              const isPopular = planId === 'pro';
              const isCurrent = isAuthenticated.value && currentPlan === planId;

              return (
                <div
                  key={planId}
                  class={`reveal stagger-${i + 1} relative ${isPopular ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span class="bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] text-white font-pixel text-xs font-bold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <GlowCard
                    glow={PLAN_GLOW[planId]}
                    class={`h-full flex flex-col ${isPopular ? 'gradient-border-animated glow-accent' : ''}`}
                  >
                    <h2 class="font-pixel text-xl font-bold text-[var(--text-0)]">
                      {plan.name}
                    </h2>

                    <div class="mt-4 flex items-baseline gap-1">
                      <span class="text-gradient font-pixel text-4xl font-bold">
                        {formatPrice(plan.priceCents)}
                      </span>
                      {plan.priceCents > 0 && (
                        <span class="text-sm text-[var(--text-2)]">/month</span>
                      )}
                    </div>

                    <ul class="mt-6 space-y-3 flex-1">
                      {features.map((feat) => (
                        <li
                          key={feat.text}
                          class={`flex items-center gap-2 text-sm ${feat.included ? 'text-[var(--text-0)]' : 'text-[var(--text-2)]'}`}
                        >
                          <CheckIcon included={feat.included} />
                          <span>{feat.text}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.revShare ? (
                      <p class="mt-4 text-xs text-[var(--text-1)]">
                        {Math.round(plan.revShare * 100)}% marketplace revenue share
                      </p>
                    ) : null}

                    <div class="mt-6">
                      {isCurrent ? (
                        <Button variant="secondary" class="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <a href={isAuthenticated.value ? '/settings' : '/login'}>
                          <Button
                            variant={isPopular ? 'gradient' : 'outline'}
                            class="w-full"
                          >
                            {plan.priceCents === 0 ? 'Get Started' : 'Upgrade'}
                          </Button>
                        </a>
                      )}
                    </div>
                  </GlowCard>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* Credit Packs */}
      <section class="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal>
          <h2 class="reveal text-center font-pixel text-2xl font-bold text-gradient sm:text-3xl">
            Credit Packs
          </h2>
          <p class="reveal stagger-1 mx-auto mt-5 max-w-md text-center text-[var(--text-1)] leading-relaxed">
            Need more AI credits? Top up anytime.
          </p>

          <div class="mt-12 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {CREDIT_PACKS.map((pack, i) => (
              <div key={pack.id} class={`reveal stagger-${i + 1}`}>
                <GlowCard
                  glow={(['primary', 'accent', 'secondary', 'primary'] as const)[i]}
                  class="text-center hover:scale-[1.02] transition-transform duration-200"
                >
                  <div class="text-gradient font-pixel text-3xl font-bold">
                    {pack.credits}
                  </div>
                  <div class="mt-1 text-sm text-[var(--text-1)]">credits</div>
                  <div class="mt-4 font-pixel text-lg text-[var(--text-0)] font-semibold">
                    {formatCreditPrice(pack.priceCents)}
                  </div>
                  <div class="mt-1 text-xs text-[var(--text-2)]">
                    {formatCreditPrice(Math.round(pack.priceCents / pack.credits * 100) / 100 * 100)}/credit
                  </div>
                  <div class="mt-4">
                    <Button variant="outline" size="sm" class="w-full">
                      Buy
                    </Button>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <SectionDivider />

      {/* AI Cost Reference */}
      <section class="mx-auto max-w-3xl px-6 py-20">
        <ScrollReveal>
          <h2 class="reveal text-center font-pixel text-2xl font-bold text-gradient">
            AI Credit Costs
          </h2>

          <div class="reveal stagger-1 mt-8">
            <GlowCard glow="primary">
              <div class="space-y-4">
                {Object.entries(AI_COSTS).map(([key, cost]) => {
                  const labels: Record<string, string> = {
                    generate_sprite: 'Generate Full Sprite',
                    interpolate_frame: 'Auto-Generate Frame',
                    suggest_palette: 'Suggest Palette',
                    autocomplete: 'Auto-Complete Drawing',
                  };
                  return (
                    <div key={key} class="flex items-center justify-between">
                      <span class="text-sm text-[var(--text-0)]">{labels[key] ?? key}</span>
                      <span class="font-pixel text-sm text-gradient font-bold">
                        {cost} credit{cost > 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Pricing;
