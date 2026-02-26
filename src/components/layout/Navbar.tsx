import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { user, isAuthenticated, creditBalance } from '@/signals/auth';
import { mobileMenuOpen } from '@/signals/ui';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'Editor', href: '/editor' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Pricing', href: '/pricing' },
];

export function Navbar() {
  const { url, route } = useLocation();

  useEffect(() => {
    mobileMenuOpen.value = false;
  }, [url]);

  const isActive = (href: string) => url === href || url.startsWith(href + '/');

  return (
    <>
      <header class="fixed top-0 left-0 right-0 z-30 glass-strong transition-all duration-300">
        <nav class="mx-auto max-w-7xl flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <a
            href="/"
            class="flex items-center gap-2 min-h-[44px] group"
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              route('/');
            }}
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="white">
                <rect x="2" y="2" width="4" height="4" />
                <rect x="10" y="2" width="4" height="4" />
                <rect x="6" y="6" width="4" height="4" />
                <rect x="2" y="10" width="4" height="4" />
                <rect x="10" y="10" width="4" height="4" />
              </svg>
            </div>
            <span class="text-xl font-bold font-pixel text-gradient group-hover:text-shimmer transition-all">
              PixelMotion
            </span>
          </a>

          {/* Desktop Links */}
          <div class="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                class={`relative min-h-[44px] px-3 flex items-center font-pixel text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-1)] hover:text-[var(--text-0)]'
                }`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  route(link.href);
                }}
              >
                {link.label}
                <span
                  class={`absolute bottom-2 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-transform duration-200 origin-left ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div class="hidden md:flex items-center gap-3">
            {isAuthenticated.value ? (
              <>
                <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-2)]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--warning)">
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                  <span class="text-sm font-pixel text-gradient font-semibold">
                    {creditBalance.value}
                  </span>
                </div>
                <button
                  type="button"
                  class="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full p-0.5 bg-gradient-to-br from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)]"
                  onClick={() => route('/profile')}
                  aria-label="Profile"
                >
                  {user.value?.avatarUrl ? (
                    <img
                      src={user.value.avatarUrl}
                      alt={user.value.displayName}
                      class="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div class="w-9 h-9 rounded-full bg-[var(--bg-1)] flex items-center justify-center text-sm font-pixel text-[var(--text-0)]">
                      {user.value?.displayName?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                  )}
                </button>
              </>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={() => route('/login')}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            class="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => {
              mobileMenuOpen.value = !mobileMenuOpen.value;
            }}
            aria-label={mobileMenuOpen.value ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen.value}
          >
            <div class="relative w-5 h-4 flex flex-col justify-between">
              <span
                class={`block h-0.5 w-5 bg-[var(--text-0)] rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen.value ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                class={`block h-0.5 w-5 bg-[var(--text-0)] rounded-full transition-all duration-300 ${
                  mobileMenuOpen.value ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                class={`block h-0.5 w-5 bg-[var(--text-0)] rounded-full transition-all duration-300 origin-center ${
                  mobileMenuOpen.value ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen.value && (
        <div
          class="fixed inset-0 z-20 bg-[var(--bg-0)]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-2 md:hidden"
          style={{ animation: 'fade-in 0.2s ease both' }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              class={`min-h-[56px] px-6 flex items-center text-2xl font-pixel transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-gradient'
                  : 'text-[var(--text-1)] hover:text-[var(--text-0)]'
              }`}
              style={{ animation: `slide-in-left 0.3s ease-out ${100 + i * 80}ms both` }}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                route(link.href);
              }}
            >
              {link.label}
            </a>
          ))}

          <div
            class="mt-6"
            style={{ animation: `fade-up 0.4s ease-out 500ms both` }}
          >
            {isAuthenticated.value ? (
              <div class="flex flex-col items-center gap-3">
                <div class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-2)]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--warning)">
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                  <span class="text-lg font-pixel text-gradient font-semibold">
                    {creditBalance.value} credits
                  </span>
                </div>
                <Button variant="secondary" onClick={() => route('/profile')}>
                  Profile
                </Button>
              </div>
            ) : (
              <Button variant="gradient" size="lg" onClick={() => route('/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
