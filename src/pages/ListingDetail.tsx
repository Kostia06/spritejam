import { useState, useEffect } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlowCard } from '@/components/ui/GlowCard';
import { Spinner } from '@/components/ui/Spinner';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/signals/auth';
import type { ListingWithUser, LicenseType } from '@/types/marketplace';

/* ============================================
   Helpers
   ============================================ */

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatRating(sum: number, count: number): string {
  if (count === 0) return 'No ratings yet';
  return `${(sum / count).toFixed(1)} / 5.0`;
}

const LICENSE_LABELS: Record<LicenseType, { label: string; description: string }> = {
  personal: {
    label: 'Personal',
    description: 'Use in personal, non-commercial projects.',
  },
  commercial: {
    label: 'Commercial',
    description: 'Use in commercial projects and products.',
  },
  cc0: {
    label: 'CC0 / Public Domain',
    description: 'Free to use for any purpose, no attribution required.',
  },
};

/* ============================================
   ListingDetail Page
   ============================================ */

interface ListingDetailProps {
  listingId?: string;
}

export function ListingDetail({ listingId }: ListingDetailProps) {
  const [listing, setListing] = useState<ListingWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get<ListingWithUser>(`/api/marketplace/${listingId}`);
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [listingId]);

  async function handlePurchase() {
    if (!listing) return;
    setIsPurchasing(true);
    try {
      const { url } = await api.post<{ url: string }>('/api/marketplace/checkout', {
        listingId: listing.id,
      });
      window.location.href = url;
    } catch {
      setError('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  }

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

  if (error || !listing) {
    return (
      <PageTransition>
        <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-4">
          <h2 class="font-pixel text-2xl text-[var(--error)]">
            {error ?? 'Listing not found'}
          </h2>
          <a href="/marketplace">
            <Button variant="outline">Back to Marketplace</Button>
          </a>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  const licenseInfo = LICENSE_LABELS[listing.license];
  const createdDate = new Date(listing.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <PageTransition>
      <section class="mx-auto max-w-5xl px-6 pt-28 pb-24">
        <div class="grid gap-10 md:grid-cols-2">
          {/* Listing Image */}
          <div
            class="gradient-border glow-accent rounded-2xl overflow-hidden scanlines"
            style={{ animation: 'fade-up 0.5s ease-out both' }}
          >
            <div class="aspect-square bg-[var(--bg-2)] flex items-center justify-center">
              {listing.thumbnailUrl ? (
                <img
                  src={listing.thumbnailUrl}
                  alt={listing.title}
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
              {listing.title}
            </h1>

            {/* Price */}
            <div class="text-gradient font-pixel text-4xl font-bold">
              {formatPrice(listing.priceCents)}
            </div>

            {/* Author */}
            <a href={`/profile/${listing.userId}`} class="flex items-center gap-3 group">
              <div class="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-0.5 flex-shrink-0">
                <div class="h-full w-full rounded-full bg-[var(--bg-1)] flex items-center justify-center overflow-hidden">
                  {listing.userAvatarUrl ? (
                    <img src={listing.userAvatarUrl} alt="" class="h-full w-full object-cover" />
                  ) : (
                    <span class="font-pixel text-xs text-[var(--text-1)]">
                      {listing.userName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span class="text-sm text-[var(--text-1)] group-hover:text-[var(--text-0)] transition-colors">
                {listing.userName}
              </span>
            </a>

            {listing.description && (
              <p class="text-sm text-[var(--text-1)] leading-relaxed">{listing.description}</p>
            )}

            {/* Stats */}
            <GlowCard glow="secondary" class="text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-[var(--text-2)]">Downloads</span>
                  <p class="font-pixel text-[var(--text-0)]">{listing.downloads}</p>
                </div>
                <div>
                  <span class="text-[var(--text-2)]">Rating</span>
                  <p class="font-pixel text-[var(--text-0)]">
                    {formatRating(listing.ratingSum, listing.ratingCount)}
                  </p>
                </div>
              </div>
            </GlowCard>

            {/* License */}
            <GlowCard glow="primary" class="text-sm">
              <h3 class="font-pixel text-[var(--text-0)] font-semibold">
                License: {licenseInfo.label}
              </h3>
              <p class="mt-1 text-[var(--text-1)]">{licenseInfo.description}</p>
            </GlowCard>

            <p class="text-xs text-[var(--text-2)]">Listed {createdDate}</p>

            {/* Purchase */}
            <div class="flex flex-wrap gap-3 mt-auto pt-4">
              {isAuthenticated.value ? (
                <Button
                  variant="gradient"
                  size="lg"
                  isLoading={isPurchasing}
                  onClick={handlePurchase}
                  class="flex-1 sm:flex-none"
                >
                  Purchase
                </Button>
              ) : (
                <a href="/login" class="flex-1 sm:flex-none">
                  <Button variant="gradient" size="lg" class="w-full">
                    Sign In to Purchase
                  </Button>
                </a>
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

export default ListingDetail;
