import { useState, useEffect } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GlowCard } from '@/components/ui/GlowCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';

/* ============================================
   Types
   ============================================ */

interface ProfileData {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  plan: string;
  createdAt: string;
  spriteCount: number;
  forkCount: number;
}

interface ProfileSprite {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  createdAt: string;
}

/* ============================================
   Profile Page
   ============================================ */

interface ProfileProps {
  userId?: string;
}

export function Profile({ userId }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [sprites, setSprites] = useState<ProfileSprite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [profileData, spriteData] = await Promise.all([
          api.get<ProfileData>(`/api/users/${userId}`),
          api.get<ProfileSprite[]>(`/api/users/${userId}/sprites`),
        ]);
        setProfile(profileData);
        setSprites(spriteData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [userId]);

  if (isLoading) {
    return (
      <PageTransition>
        <div class="flex min-h-[60dvh] items-center justify-center">
          <Spinner size="lg" />
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (error || !profile) {
    return (
      <PageTransition>
        <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4">
          <h2 class="font-pixel text-2xl text-[var(--error)]">
            {error ?? 'Profile not found'}
          </h2>
          <a href="/gallery">
            <Button variant="outline">Browse Gallery</Button>
          </a>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <PageTransition>
      <section class="mx-auto max-w-5xl px-6 pt-28 pb-16">
        {/* Profile Header */}
        <div
          class="flex flex-col items-center gap-6 text-center"
          style={{ animation: 'fade-up 0.5s ease-out both' }}
        >
          {/* Avatar with gradient ring */}
          <div class="h-24 w-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-1">
            <div class="h-full w-full rounded-full bg-[var(--bg-1)] flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" class="h-full w-full object-cover" />
              ) : (
                <span class="font-pixel text-2xl text-[var(--text-1)]">
                  {profile.displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div>
            <h1 class="font-pixel text-3xl font-bold text-[var(--text-0)]">
              {profile.displayName}
            </h1>
            <p class="mt-1 text-sm text-[var(--text-2)]">Joined {joinedDate}</p>
          </div>

          {/* Stats */}
          <div class="flex gap-8">
            <div class="text-center">
              <div class="text-gradient font-pixel text-2xl font-bold">
                {profile.spriteCount}
              </div>
              <div class="text-xs text-[var(--text-1)]">Sprites</div>
            </div>
            <div class="text-center">
              <div class="text-gradient font-pixel text-2xl font-bold">
                {profile.forkCount}
              </div>
              <div class="text-xs text-[var(--text-1)]">Forks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Sprites */}
      <section class="mx-auto max-w-6xl px-6 pb-24">
        <ScrollReveal>
          <h2 class="reveal font-pixel text-xl font-semibold text-[var(--text-0)] mb-6">
            Public Sprites
          </h2>

          {sprites.length === 0 ? (
            <GlowCard glow="primary" class="text-center py-12">
              <p class="text-[var(--text-1)]">No public sprites yet.</p>
            </GlowCard>
          ) : (
            <div class="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sprites.map((sprite, i) => (
                <a
                  key={sprite.id}
                  href={`/gallery/${sprite.id}`}
                  class={`reveal stagger-${(i % 5) + 1} block rounded-xl overflow-hidden card-3d gradient-border transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(108,92,231,0.3)]`}
                >
                  <div class="aspect-square bg-[var(--bg-2)] flex items-center justify-center overflow-hidden">
                    {sprite.thumbnailUrl ? (
                      <img
                        src={sprite.thumbnailUrl}
                        alt={sprite.title}
                        class="h-full w-full object-cover"
                        loading="lazy"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div class="text-[var(--text-2)] font-pixel text-sm">
                        No Preview
                      </div>
                    )}
                  </div>
                  <div class="p-3 bg-[var(--bg-1)]">
                    <h3 class="font-pixel text-sm font-semibold text-[var(--text-0)] truncate">
                      {sprite.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Profile;
