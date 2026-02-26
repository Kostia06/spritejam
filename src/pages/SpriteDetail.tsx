import { useState, useEffect } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlowCard } from '@/components/ui/GlowCard';
import { Spinner } from '@/components/ui/Spinner';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/signals/auth';

/* ============================================
   Types
   ============================================ */

interface SpriteData {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
  fps: number;
  frameCount: number;
  tags: string[];
  isPublic: boolean;
  forkCount: number;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  forkedFrom: string | null;
  createdAt: string;
}

/* ============================================
   SpriteDetail Page
   ============================================ */

interface SpriteDetailProps {
  spriteId?: string;
}

export function SpriteDetail({ spriteId }: SpriteDetailProps) {
  const [sprite, setSprite] = useState<SpriteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spriteId) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get<SpriteData>(`/api/gallery/${spriteId}`);
        setSprite(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sprite');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [spriteId]);

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

  if (error || !sprite) {
    return (
      <PageTransition>
        <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4">
          <h2 class="font-pixel text-2xl text-[var(--error)]">
            {error ?? 'Sprite not found'}
          </h2>
          <a href="/gallery">
            <Button variant="outline">Back to Gallery</Button>
          </a>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const createdDate = new Date(sprite.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <PageTransition>
      <section class="mx-auto max-w-5xl px-6 pt-28 pb-24">
        <div class="grid gap-10 md:grid-cols-2">
          {/* Sprite Image */}
          <div
            class="gradient-border glow-primary rounded-2xl overflow-hidden scanlines"
            style={{ animation: 'fade-up 0.5s ease-out both' }}
          >
            <div class="aspect-square bg-[var(--bg-2)] flex items-center justify-center">
              {sprite.thumbnailUrl ? (
                <img
                  src={sprite.thumbnailUrl}
                  alt={sprite.title}
                  class="h-full w-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div class="text-[var(--text-2)] font-pixel text-lg">
                  No Preview
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div
            class="flex flex-col gap-6"
            style={{ animation: 'fade-up 0.5s ease-out 0.15s both' }}
          >
            <h1 class="font-pixel text-3xl font-bold text-gradient md:text-4xl">
              {sprite.title}
            </h1>

            {/* Author */}
            <a href={`/profile/${sprite.userId}`} class="flex items-center gap-3 group">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-0.5 flex-shrink-0">
                <div class="h-full w-full rounded-full bg-[var(--bg-1)] flex items-center justify-center overflow-hidden">
                  {sprite.userAvatarUrl ? (
                    <img src={sprite.userAvatarUrl} alt="" class="h-full w-full object-cover" />
                  ) : (
                    <span class="font-pixel text-xs text-[var(--text-1)]">
                      {sprite.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span class="text-sm text-[var(--text-1)] group-hover:text-[var(--text-0)] transition-colors">
                {sprite.userName}
              </span>
            </a>

            {/* Tags */}
            {sprite.tags.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {sprite.tags.map((tag) => (
                  <span
                    key={tag}
                    class="glass rounded-full px-3 py-1 text-xs text-[var(--text-1)] font-pixel"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <GlowCard glow="secondary" class="text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[var(--text-2)]">Canvas</span>
                  <p class="font-pixel text-[var(--text-0)]">
                    {sprite.canvasWidth}x{sprite.canvasHeight}
                  </p>
                </div>
                <div>
                  <span class="text-[var(--text-2)]">Frames</span>
                  <p class="font-pixel text-[var(--text-0)]">{sprite.frameCount}</p>
                </div>
                <div>
                  <span class="text-[var(--text-2)]">FPS</span>
                  <p class="font-pixel text-[var(--text-0)]">{sprite.fps}</p>
                </div>
                <div>
                  <span class="text-[var(--text-2)]">Forks</span>
                  <p class="font-pixel text-[var(--text-0)]">{sprite.forkCount}</p>
                </div>
              </div>
            </GlowCard>

            <p class="text-xs text-[var(--text-2)]">Created {createdDate}</p>

            {sprite.forkedFrom && (
              <p class="text-xs text-[var(--text-2)]">
                Forked from{' '}
                <a href={`/gallery/${sprite.forkedFrom}`} class="text-[var(--primary)] hover:underline">
                  original
                </a>
              </p>
            )}

            {/* Actions */}
            <div class="flex flex-wrap gap-3 mt-auto pt-4">
              {isAuthenticated.value && (
                <Button variant="gradient">Fork Sprite</Button>
              )}
              <Button variant="outline">Share</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default SpriteDetail;
