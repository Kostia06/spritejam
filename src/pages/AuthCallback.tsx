import { useEffect, useState } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { user, jwt } from '@/signals/auth';
import type { User } from '@/types/user';

/* ============================================
   AuthCallback Page
   ============================================ */

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticate() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code') ?? params.get('token');

        if (!code) {
          setError('No authorization code found.');
          return;
        }

        const data = await api.post<{ user: User; token: string }>('/api/auth/callback', { code });

        jwt.value = data.token;
        user.value = data.user;

        window.location.href = '/library';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    }

    authenticate();
  }, []);

  if (error) {
    return (
      <PageTransition>
        <div class="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 text-center">
          <h2 class="font-pixel text-2xl text-[var(--error)]">
            Authentication Failed
          </h2>
          <p class="text-sm text-[var(--text-1)] max-w-xs">{error}</p>
          <a href="/login">
            <Button variant="outline">Try Again</Button>
          </a>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div class="flex min-h-[100dvh] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p class="font-pixel text-sm text-[var(--text-1)]">
          Authenticating...
        </p>
      </div>
    </PageTransition>
  );
}

export default AuthCallback;
