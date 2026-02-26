interface SpriteCardProps {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  authorName: string;
  authorAvatarUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
  frameCount: number;
  isPublic?: boolean;
  onClick?: () => void;
  class?: string;
}

export function SpriteCard({
  title,
  thumbnailUrl,
  authorName,
  authorAvatarUrl,
  canvasWidth,
  canvasHeight,
  frameCount,
  onClick,
  class: className = '',
}: SpriteCardProps) {
  return (
    <button
      type="button"
      class={`group relative w-full text-left glass gradient-border card-3d scanlines rounded-xl overflow-hidden transition-all duration-300 hover:glow-primary cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div class="relative aspect-square bg-[var(--canvas-bg)] flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            class="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
          />
        ) : (
          <div class="flex flex-col items-center justify-center gap-2 text-[var(--text-2)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 16l5-5 4 4 4-6 5 7" />
            </svg>
            <span class="text-xs font-pixel">
              {canvasWidth}x{canvasHeight}
            </span>
          </div>
        )}

        {/* Frame count badge */}
        {frameCount > 1 && (
          <div class="absolute top-2 right-2 px-2 py-0.5 rounded-md glass text-xs font-pixel text-[var(--text-0)]">
            {frameCount}f
          </div>
        )}
      </div>

      {/* Info */}
      <div class="p-3">
        <h3 class="text-sm font-pixel font-semibold text-[var(--text-0)] truncate mb-2">
          {title}
        </h3>
        <div class="flex items-center gap-2">
          {authorAvatarUrl ? (
            <img
              src={authorAvatarUrl}
              alt={authorName}
              class="w-5 h-5 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div class="w-5 h-5 rounded-full bg-[var(--bg-3)] flex items-center justify-center text-[10px] font-pixel text-[var(--text-1)]">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span class="text-xs text-[var(--text-1)] font-body truncate">
            {authorName}
          </span>
        </div>
      </div>
    </button>
  );
}
