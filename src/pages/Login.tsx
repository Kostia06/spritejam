import { PageTransition } from '@/components/ui/PageTransition';
import { PixelParticles } from '@/components/ui/PixelParticles';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { Footer } from '@/components/layout/Footer';

/* ============================================
   OAuth Provider Button
   ============================================ */

interface OAuthButtonProps {
  provider: 'github' | 'google';
  label: string;
  icon: string;
}

function OAuthButton({ provider, label, icon }: OAuthButtonProps) {
  const loginUrl = `${import.meta.env.VITE_CF_ACCESS_LOGIN_URL ?? '/api/auth'}/${provider}`;

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    window.location.href = loginUrl;
  }

  return (
    <a
      href={loginUrl}
      onClick={handleClick}
      class="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl glass gradient-border px-6 py-3 font-pixel text-base font-semibold text-[var(--text-0)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(108,92,231,0.3)] active:scale-[0.98]"
    >
      <OAuthIcon name={icon} />
      <span>{label}</span>
    </a>
  );
}

function OAuthIcon({ name }: { name: string }) {
  if (name === 'github') {
    return (
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  if (name === 'google') {
    return (
      <svg class="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    );
  }

  return null;
}

/* ============================================
   Login Page
   ============================================ */

export function Login() {
  return (
    <PageTransition>
      <section class="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        <PixelParticles />

        <div
          class="relative z-10 mx-auto w-full max-w-sm px-6"
          style={{ animation: 'scale-in 0.5s ease-out both' }}
        >
          <div class="text-center mb-8">
            <a href="/" class="inline-block mb-6">
              <span class="font-pixel text-2xl font-bold text-gradient">
                PixelMotion
              </span>
            </a>
            <AnimatedText
              text="Welcome Back"
              as="h1"
              class="font-pixel text-3xl font-bold text-[var(--text-0)]"
              delayMs={40}
            />
            <p
              class="mt-3 text-sm text-[var(--text-1)]"
              style={{ animation: 'fade-up 0.5s ease-out 0.6s both' }}
            >
              Sign in to access your projects and AI credits.
            </p>
          </div>

          <div
            class="space-y-4"
            style={{ animation: 'fade-up 0.5s ease-out 0.8s both' }}
          >
            <OAuthButton provider="github" label="Continue with GitHub" icon="github" />
            <OAuthButton provider="google" label="Continue with Google" icon="google" />
          </div>

          <p
            class="mt-8 text-center text-xs text-[var(--text-2)] leading-relaxed"
            style={{ animation: 'fade-up 0.5s ease-out 1s both' }}
          >
            By signing in, you agree to our{' '}
            <a href="#" class="text-[var(--primary)] hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" class="text-[var(--primary)] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}

export default Login;
