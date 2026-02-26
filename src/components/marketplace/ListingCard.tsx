import type { ListingWithUser } from '@/types/marketplace';

interface ListingCardProps {
  listing: ListingWithUser;
  onClick?: () => void;
  class?: string;
}

function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

export function ListingCard({ listing, onClick, class: className = '' }: ListingCardProps) {
  const isFree = listing.priceCents === 0;
  const rating =
    listing.ratingCount > 0
      ? (listing.ratingSum / listing.ratingCount).toFixed(1)
      : null;

  return (
    <button
      type="button"
      class={`group relative w-full text-left glass gradient-border card-3d scanlines rounded-xl overflow-hidden transition-all duration-300 hover:glow-accent cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div class="relative aspect-square bg-[var(--canvas-bg)] flex items-center justify-center overflow-hidden">
        {listing.thumbnailUrl ? (
          <img
            src={listing.thumbnailUrl}
            alt={listing.title}
            class="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
          />
        ) : (
          <div class="flex flex-col items-center justify-center gap-2 text-[var(--text-2)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span class="text-xs font-pixel">Sprite</span>
          </div>
        )}

        {/* License badge */}
        <div class="absolute top-2 left-2 px-2 py-0.5 rounded-md glass text-[10px] font-pixel text-[var(--text-0)] uppercase tracking-wider">
          {listing.license}
        </div>
      </div>

      {/* Info */}
      <div class="p-3 space-y-2">
        <h3 class="text-sm font-pixel font-semibold text-[var(--text-0)] truncate">
          {listing.title}
        </h3>

        {/* Author */}
        <div class="flex items-center gap-2">
          {listing.userAvatarUrl ? (
            <img
              src={listing.userAvatarUrl}
              alt={listing.userName}
              class="w-5 h-5 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div class="w-5 h-5 rounded-full bg-[var(--bg-3)] flex items-center justify-center text-[10px] font-pixel text-[var(--text-1)]">
              {listing.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span class="text-xs text-[var(--text-1)] font-body truncate">
            {listing.userName}
          </span>
        </div>

        {/* Price + Stats */}
        <div class="flex items-center justify-between">
          <span
            class={`text-base font-pixel font-bold ${
              isFree ? 'text-[var(--success)]' : 'text-gradient'
            }`}
          >
            {formatPrice(listing.priceCents)}
          </span>

          <div class="flex items-center gap-3 text-xs text-[var(--text-2)]">
            {/* Downloads */}
            <span class="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {listing.downloads}
            </span>

            {/* Rating */}
            {rating && (
              <span class="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--warning)" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
