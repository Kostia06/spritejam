import { useState, useEffect, useCallback } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Spinner } from '@/components/ui/Spinner';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';

/* ============================================
   Types
   ============================================ */

interface GallerySprite {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  userName: string;
  userAvatarUrl: string | null;
  tags: string[];
  forkCount: number;
  createdAt: string;
}

/* ============================================
   Constants
   ============================================ */

type SortOption = 'recent' | 'popular' | 'trending';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
];

/* ============================================
   Skeleton Card
   ============================================ */

function SkeletonCard() {
  return (
    <div class="rounded-xl overflow-hidden glass">
      <div class="shimmer aspect-square w-full" />
      <div class="p-4 space-y-3">
        <div class="shimmer h-4 w-3/4 rounded" />
        <div class="shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

/* ============================================
   Sprite Card
   ============================================ */

function SpriteCard({ sprite, index }: { sprite: GallerySprite; index: number }) {
  return (
    <a
      href={`/gallery/${sprite.id}`}
      class={`reveal stagger-${(index % 5) + 1} group block rounded-xl overflow-hidden card-3d gradient-border scanlines transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(108,92,231,0.3)]`}
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

      <div class="p-4 bg-[var(--bg-1)]">
        <h3 class="font-pixel text-sm font-semibold text-[var(--text-0)] truncate">
          {sprite.title}
        </h3>
        <div class="mt-2 flex items-center gap-2">
          <div class="h-5 w-5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex-shrink-0" />
          <span class="text-xs text-[var(--text-1)] truncate">{sprite.userName}</span>
        </div>
        {sprite.tags.length > 0 && (
          <div class="mt-2 flex flex-wrap gap-1">
            {sprite.tags.slice(0, 3).map((tag) => (
              <span key={tag} class="glass rounded-full px-2 py-0.5 text-[10px] text-[var(--text-1)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

/* ============================================
   Empty State
   ============================================ */

function EmptyState() {
  return (
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div class="mb-4 text-4xl text-[var(--text-2)]" style={{ fontFamily: 'var(--font-pixel)' }}>
        :-(
      </div>
      <h3 class="font-pixel text-lg text-[var(--text-0)]">No sprites found</h3>
      <p class="mt-2 text-sm text-[var(--text-1)]">Try a different search or filter.</p>
    </div>
  );
}

/* ============================================
   Gallery Page
   ============================================ */

export function Gallery() {
  const [sprites, setSprites] = useState<GallerySprite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('recent');
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchSprites = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (search) params.set('q', search);
      if (tagFilter) params.set('tag', tagFilter);
      const data = await api.get<GallerySprite[]>(`/api/gallery?${params}`);
      setSprites(data);
    } catch {
      setSprites([]);
    } finally {
      setIsLoading(false);
    }
  }, [sort, search, tagFilter]);

  useEffect(() => {
    fetchSprites();
  }, [fetchSprites]);

  return (
    <PageTransition>
      <section class="mx-auto max-w-6xl px-6 pt-28 pb-10">
        <h1 class="text-center font-pixel text-3xl font-bold text-gradient sm:text-4xl md:text-5xl">
          Gallery
        </h1>
        <p class="mx-auto mt-5 max-w-md text-center text-[var(--text-1)] leading-relaxed">
          Explore pixel art from creators around the world.
        </p>
      </section>

      <SectionDivider />

      {/* Filters */}
      <section class="mx-auto max-w-6xl px-6 py-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div class="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search sprites..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              class="w-full min-h-[44px] rounded-lg bg-[var(--bg-1)] px-4 py-2 text-sm text-[var(--text-0)] placeholder-[var(--text-2)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Sort pills */}
          <div class="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value)}
                class={`min-h-[44px] rounded-full px-4 py-2 font-pixel text-sm font-medium transition-all duration-200 cursor-pointer ${
                  sort === opt.value
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white'
                    : 'glass text-[var(--text-1)] hover:text-[var(--text-0)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filter */}
        <div class="mt-4">
          <input
            type="text"
            placeholder="Filter by tag..."
            value={tagFilter}
            onInput={(e) => setTagFilter((e.target as HTMLInputElement).value)}
            class="min-h-[44px] rounded-lg bg-[var(--bg-1)] px-4 py-2 text-sm text-[var(--text-0)] placeholder-[var(--text-2)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors w-full max-w-xs"
            style={{ fontSize: '16px' }}
          />
        </div>
      </section>

      {/* Grid */}
      <section class="mx-auto max-w-6xl px-6 pb-24">
        <ScrollReveal>
          {isLoading ? (
            <div class="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : sprites.length === 0 ? (
            <EmptyState />
          ) : (
            <div class="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sprites.map((sprite, i) => (
                <SpriteCard key={sprite.id} sprite={sprite} index={i} />
              ))}
            </div>
          )}

          {isLoading
            ? <div class="flex justify-center pt-12"><Spinner size="lg" /></div>
            : null}
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Gallery;
