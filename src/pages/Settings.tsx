import { useState } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlowCard } from '@/components/ui/GlowCard';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { user, isAuthenticated } from '@/signals/auth';
import { PLANS } from '@/lib/payments/plans';

/* ============================================
   Sign-In Prompt
   ============================================ */

function SignInPrompt() {
  return (
    <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 class="font-pixel text-2xl text-gradient">Sign in to access settings</h2>
      <a href="/login">
        <Button variant="gradient" size="lg">Sign In</Button>
      </a>
    </div>
  );
}

/* ============================================
   Settings Page
   ============================================ */

export function Settings() {
  const [displayName, setDisplayName] = useState(user.value?.displayName ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isAuthenticated.value) {
    return (
      <PageTransition>
        <SignInPrompt />
        <Footer />
      </PageTransition>
    );
  }

  const currentUser = user.value!;
  const plan = PLANS[currentUser.plan];

  async function handleSaveProfile() {
    setIsSaving(true);
    try {
      await api.put('/api/users/me', { displayName });
      user.value = { ...currentUser, displayName };
    } catch {
      // could show toast
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      await api.del('/api/users/me');
      user.value = null;
      window.location.href = '/';
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <PageTransition>
      <section class="mx-auto max-w-2xl px-6 pt-28 pb-24">
        <h1
          class="font-pixel text-2xl font-bold text-gradient sm:text-3xl md:text-4xl mb-12"
          style={{ animation: 'fade-up 0.4s ease-out both' }}
        >
          Settings
        </h1>

        <div class="space-y-8">
          {/* Profile Section */}
          <div style={{ animation: 'fade-up 0.4s ease-out 0.1s both' }}>
            <GlowCard glow="primary">
              <h2 class="font-pixel text-lg font-semibold text-[var(--text-0)] mb-6">
                Profile
              </h2>

              <div class="space-y-5">
                <div>
                  <label class="block text-sm text-[var(--text-1)] mb-2" htmlFor="displayName">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onInput={(e) => setDisplayName((e.target as HTMLInputElement).value)}
                    class="w-full min-h-[44px] rounded-lg bg-[var(--bg-0)] px-4 py-2 text-sm text-[var(--text-0)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label class="block text-sm text-[var(--text-1)] mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={currentUser.email}
                    disabled
                    class="w-full min-h-[44px] rounded-lg bg-[var(--bg-2)] px-4 py-2 text-sm text-[var(--text-2)] border border-[var(--border)] cursor-not-allowed opacity-60"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <Button
                  variant="gradient"
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              </div>
            </GlowCard>
          </div>

          {/* Plan Section */}
          <div style={{ animation: 'fade-up 0.4s ease-out 0.2s both' }}>
            <GlowCard glow="accent">
              <h2 class="font-pixel text-lg font-semibold text-[var(--text-0)] mb-6">
                Subscription
              </h2>

              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-sm text-[var(--text-1)]">Current Plan</span>
                  <p class="font-pixel text-xl font-bold text-gradient">
                    {plan.name}
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-sm text-[var(--text-1)]">Credits</span>
                  <p class="font-pixel text-xl font-bold text-gradient">
                    {currentUser.credits}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-3">
                <a href="/pricing">
                  <Button variant="outline">
                    {currentUser.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                  </Button>
                </a>
                {currentUser.plan !== 'free' && (
                  <Button variant="ghost" onClick={() => { window.location.href = '/api/billing/portal'; }}>
                    Manage Billing
                  </Button>
                )}
              </div>
            </GlowCard>
          </div>

          {/* Danger Zone */}
          <div style={{ animation: 'fade-up 0.4s ease-out 0.3s both' }}>
            <div
              class="rounded-xl p-6 border border-[var(--error)]/50 bg-[var(--bg-1)]"
              style={{ animation: 'glow-pulse 3s ease-in-out infinite', boxShadow: '0 0 20px rgba(248,81,73,0.1)' }}
            >
              <h2 class="font-pixel text-lg font-semibold text-[var(--error)] mb-2">
                Danger Zone
              </h2>
              <p class="text-sm text-[var(--text-1)] mb-6">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {showDeleteConfirm ? (
                <div class="space-y-3">
                  <p class="text-sm text-[var(--error)] font-semibold">
                    Are you sure? This will delete all your projects, purchases, and data.
                  </p>
                  <div class="flex gap-3">
                    <Button
                      variant="danger"
                      isLoading={isDeleting}
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Settings;
