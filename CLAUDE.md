# CLAUDE.md — PixelMotion

> AI-Powered Pixel Art Animation Studio
> Built with Preact + Vite + Cloudflare

---

## 1. What Is PixelMotion?

PixelMotion is a browser-based pixel art animation studio where users draw sprites, animate them frame-by-frame, and use AI to generate sprites, interpolate animation frames, suggest palettes, and auto-complete drawings.

**The AI twist:** Google Gemini outputs structured JSON (pixel coordinates + hex colors), NOT images. The frontend renders these deterministically onto the HTML5 Canvas. This means full editability, consistency, and low cost.

**Community-first:** Public gallery, fork & remix, shareable/embeddable links, personal asset libraries, and a creator marketplace.

**Business model:** Freemium. Free editor + paid AI credits via Stripe.

---

## 2. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **UI Framework** | Preact 10.x | 3KB alternative to React, same API, perfect for canvas-heavy apps |
| **Build Tool** | Vite 6.x + `@preact/preset-vite` | Fast HMR, tiny bundles, native Preact support |
| **Routing** | `preact-iso` | Lightweight isomorphic router with lazy loading + Suspense |
| **State** | `@preact/signals` | Reactive state without re-renders, ideal for real-time canvas tools |
| **Styling** | Tailwind CSS 4.x | Utility-first, works great with Vite |
| **Canvas** | HTML5 Canvas API (vanilla) | Direct pixel manipulation, no abstraction overhead |
| **Hosting** | Cloudflare Pages | Global CDN, free tier, deploys from Git |
| **API** | Cloudflare Workers + Hono | Edge API routing, lightweight, TypeScript |
| **Database** | Cloudflare D1 (SQLite) | Serverless SQL at the edge |
| **Storage** | Cloudflare R2 | S3-compatible object storage, zero egress fees |
| **Auth** | Cloudflare Access + custom JWT | OAuth via Access (GitHub/Google), JWT sessions |
| **AI** | Google Gemini API | Structured JSON pixel output |
| **Payments** | Stripe | Checkout Sessions, Subscriptions, Connect for marketplace |
| **Fonts** | Pixelify Sans + Inter (Google Fonts) | Pixel-art headings + clean body text |

---

## 3. Font System

### CRITICAL: Pixel Font Is Core to the Brand

PixelMotion uses **Pixelify Sans** from Google Fonts as its signature display font. Every heading, button, nav item, and label uses this font. Body text uses **Inter**.

### Loading Fonts

```html
<!-- index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Pixelify+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### CSS Variables

```css
/* src/styles/global.css */
:root {
  --font-pixel: 'Pixelify Sans', 'Courier New', monospace;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-code: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Tailwind Config

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{tsx,ts,jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)'],
        body: ['var(--font-body)'],
        code: ['var(--font-code)'],
      },
    },
  },
};
```

### Font Usage Rules

| Element | Font Class | Weight |
|---------|-----------|--------|
| Logo "PIXELMOTION" | `font-pixel` | 700 (bold) |
| Page headings (h1, h2) | `font-pixel` | 600 (semibold) |
| Subheadings (h3, h4) | `font-pixel` | 500 (medium) |
| Navigation links | `font-pixel` | 500 |
| Tool labels in editor | `font-pixel` | 400 |
| Primary buttons | `font-pixel` | 600 |
| Secondary buttons | `font-body` | 500 |
| Body / paragraphs | `font-body` | 400 |
| Input fields / forms | `font-body` | 400 |
| Code preview (exports) | `font-code` | 400 |
| Metadata / timestamps | `font-body` | 300 |
| Credit count / pricing | `font-pixel` | 600 |
| Toast notifications | `font-body` | 400 |
| Modal titles | `font-pixel` | 600 |

**NEVER use font-body for headings, buttons, or navigation. ALWAYS use font-pixel for these.**

---

## 4. Design System

### Color Palette

```css
:root {
  /* Brand */
  --primary: #6C5CE7;
  --primary-light: #A29BFE;
  --primary-dark: #4834D4;
  --secondary: #00CEC9;
  --secondary-light: #81ECEC;
  --accent: #FD79A8;
  --accent-light: #FAB1D0;

  /* Dark Theme (default) */
  --bg-0: #0D1117;
  --bg-1: #161B22;
  --bg-2: #21262D;
  --bg-3: #30363D;
  --border: #30363D;
  --border-light: #484F58;
  --text-0: #E6EDF3;
  --text-1: #8B949E;
  --text-2: #484F58;

  /* Semantic */
  --success: #2EA043;
  --warning: #D29922;
  --error: #F85149;
  --info: #58A6FF;

  /* Canvas */
  --canvas-bg: #1A1A2E;
  --canvas-grid: #2A2A4A;
  --canvas-checker-a: #2A2A2A;
  --canvas-checker-b: #3A3A3A;

  /* Onion skin */
  --onion-prev: rgba(255, 80, 80, 0.3);
  --onion-next: rgba(80, 140, 255, 0.3);
}
```

### UI Principles

1. **Dark-first** — pixel art pops on dark backgrounds; light theme is secondary
2. **Pixel aesthetic** — font-pixel everywhere interactive; pixelated icons; 1px borders
3. **Canvas is king** — maximize drawing area; all panels collapsible; minimal chrome
4. **Keyboard-first** — every tool = single key; power users never touch the toolbar
5. **Non-destructive AI** — AI output always arrives as a NEW LAYER; user accepts, edits, or discards
6. **image-rendering: pixelated** — on EVERY canvas element, always

---

## 5. Project Structure

```
pixelmotion/
├── CLAUDE.md
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── wrangler.toml
│
├── src/
│   ├── index.tsx                      # Preact render entry
│   ├── app.tsx                        # Root: LocationProvider + Router
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Editor.tsx
│   │   ├── Gallery.tsx
│   │   ├── SpriteDetail.tsx
│   │   ├── Marketplace.tsx
│   │   ├── ListingDetail.tsx
│   │   ├── Library.tsx
│   │   ├── Profile.tsx
│   │   ├── Pricing.tsx
│   │   ├── Settings.tsx
│   │   ├── Login.tsx
│   │   ├── AuthCallback.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/
│   │   ├── editor/
│   │   │   ├── PixelCanvas.tsx
│   │   │   ├── CanvasContainer.tsx
│   │   │   ├── ToolBar.tsx
│   │   │   ├── ToolButton.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── PalettePanel.tsx
│   │   │   ├── LayerPanel.tsx
│   │   │   ├── LayerItem.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── FrameThumbnail.tsx
│   │   │   ├── OnionSkinOverlay.tsx
│   │   │   ├── AnimationPreview.tsx
│   │   │   ├── ExportDialog.tsx
│   │   │   ├── CanvasSettingsBar.tsx
│   │   │   └── EditorLayout.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── AiPanel.tsx
│   │   │   ├── GenerateSprite.tsx
│   │   │   ├── InterpolateFrames.tsx
│   │   │   ├── SuggestPalette.tsx
│   │   │   ├── AutoComplete.tsx
│   │   │   └── AiPreviewLayer.tsx
│   │   │
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── SpriteCard.tsx
│   │   │   ├── GalleryFilters.tsx
│   │   │   ├── ForkButton.tsx
│   │   │   └── ShareDialog.tsx
│   │   │
│   │   ├── marketplace/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── PurchaseButton.tsx
│   │   │   ├── ListingForm.tsx
│   │   │   └── SellerDashboard.tsx
│   │   │
│   │   ├── payments/
│   │   │   ├── CreditBalance.tsx
│   │   │   ├── BuyCreditsButton.tsx
│   │   │   ├── PlanCard.tsx
│   │   │   ├── PricingTable.tsx
│   │   │   └── CreditsHistory.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── PixelBorder.tsx
│   │   │   └── PixelIcon.tsx
│   │   │
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── AuthGuard.tsx
│   │
│   ├── signals/                       # @preact/signals global state
│   │   ├── editor.ts
│   │   ├── animation.ts
│   │   ├── layers.ts
│   │   ├── palette.ts
│   │   ├── ai.ts
│   │   ├── auth.ts
│   │   ├── credits.ts
│   │   ├── projects.ts
│   │   └── ui.ts
│   │
│   ├── lib/
│   │   ├── canvas/
│   │   │   ├── renderer.ts
│   │   │   ├── tools/
│   │   │   │   ├── pencil.ts
│   │   │   │   ├── eraser.ts
│   │   │   │   ├── bucket.ts
│   │   │   │   ├── line.ts
│   │   │   │   ├── rectangle.ts
│   │   │   │   ├── ellipse.ts
│   │   │   │   ├── selection.ts
│   │   │   │   ├── eyedropper.ts
│   │   │   │   └── mirror.ts
│   │   │   ├── grid.ts
│   │   │   ├── checkerboard.ts
│   │   │   ├── zoom-pan.ts
│   │   │   └── history.ts
│   │   │
│   │   ├── animation/
│   │   │   ├── playback.ts
│   │   │   ├── timeline.ts
│   │   │   └── onion-skin.ts
│   │   │
│   │   ├── export/
│   │   │   ├── sprite-sheet.ts
│   │   │   ├── individual-frames.ts
│   │   │   ├── css-export.ts
│   │   │   ├── canvas-export.ts
│   │   │   └── pxm-format.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   ├── schema.ts
│   │   │   └── apply.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── stripe.ts
│   │   │   └── plans.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   └── cf-access.ts
│   │   │
│   │   ├── api.ts
│   │   │
│   │   └── utils/
│   │       ├── colors.ts
│   │       ├── pixel-data.ts
│   │       ├── keyboard.ts
│   │       ├── debounce.ts
│   │       └── nanoid.ts
│   │
│   ├── types/
│   │   ├── canvas.ts
│   │   ├── ai.ts
│   │   ├── user.ts
│   │   ├── marketplace.ts
│   │   └── export.ts
│   │
│   └── styles/
│       └── global.css
│
├── workers/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── projects.ts
│   │   │   ├── frames.ts
│   │   │   ├── ai.ts
│   │   │   ├── gallery.ts
│   │   │   ├── marketplace.ts
│   │   │   ├── share.ts
│   │   │   ├── credits.ts
│   │   │   └── payments.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── credits.ts
│   │   └── lib/
│   │       ├── gemini.ts
│   │       ├── stripe.ts
│   │       ├── d1.ts
│   │       ├── r2.ts
│   │       └── validation.ts
│   ├── wrangler.toml
│   └── package.json
│
├── migrations/
│   ├── 0001_users.sql
│   ├── 0002_projects.sql
│   ├── 0003_frames.sql
│   ├── 0004_palettes.sql
│   ├── 0005_marketplace_listings.sql
│   ├── 0006_marketplace_purchases.sql
│   ├── 0007_credit_transactions.sql
│   ├── 0008_forks.sql
│   └── 0009_shares.sql
│
└── public/
    ├── favicon.svg
    ├── og-image.png
    └── palettes/
        ├── nes.json
        ├── gameboy.json
        ├── pico8.json
        ├── db16.json
        ├── db32.json
        └── endesga32.json
```

---

## 6. Vite + Preact Configuration

### vite.config.ts

```ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: false,
  },
  resolve: {
    alias: { '@': '/src' },
  },
});
```

### src/index.tsx

```tsx
import { render } from 'preact';
import { App } from './app';
import './styles/global.css';

render(<App />, document.getElementById('app')!);
```

### src/app.tsx

```tsx
import { LocationProvider, ErrorBoundary, Router, lazy } from 'preact-iso';
import { Navbar } from './components/layout/Navbar';
import { AuthGuard } from './components/layout/AuthGuard';

const Landing = lazy(() => import('./pages/Landing'));
const Editor = lazy(() => import('./pages/Editor'));
const Gallery = lazy(() => import('./pages/Gallery'));
const SpriteDetail = lazy(() => import('./pages/SpriteDetail'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ListingDetail = lazy(() => import('./pages/ListingDetail'));
const Library = lazy(() => import('./pages/Library'));
const Profile = lazy(() => import('./pages/Profile'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Navbar />
        <main>
          <Router>
            <Landing path="/" />
            <Login path="/login" />
            <AuthCallback path="/auth/callback" />
            <Gallery path="/gallery" />
            <SpriteDetail path="/gallery/:spriteId" />
            <Marketplace path="/marketplace" />
            <ListingDetail path="/marketplace/:listingId" />
            <Pricing path="/pricing" />
            <Profile path="/u/:userId" />
            <AuthGuard path="/editor/:projectId?" component={Editor} />
            <AuthGuard path="/library" component={Library} />
            <AuthGuard path="/settings" component={Settings} />
            <NotFound default />
          </Router>
        </main>
      </ErrorBoundary>
    </LocationProvider>
  );
}
```

---

## 7. Signals (State Management)

Use @preact/signals for ALL global state. No Zustand, no Redux, no Context for state.

### Rules

- One signal file per domain (editor, animation, layers, palette, ai, auth, credits, projects, ui)
- Read with .value in components — Preact auto-tracks and re-renders only what changed
- Write with .value = — direct assignment, no dispatching
- Use computed() for derived state
- Use effect() sparingly — only for side effects (localStorage, API sync)
- Never use useState for shared state — signals only. useState only for local component state

---

## 8. Database Schema (D1)

### users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  credits INTEGER DEFAULT 20,
  plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'studio')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_connect_account_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### projects
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  canvas_width INTEGER NOT NULL,
  canvas_height INTEGER NOT NULL,
  fps INTEGER DEFAULT 12,
  is_public INTEGER DEFAULT 0,
  forked_from TEXT REFERENCES projects(id) ON DELETE SET NULL,
  tags TEXT,
  thumbnail_r2_key TEXT,
  frame_count INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_public ON projects(is_public, updated_at DESC);
```

### frames
```sql
CREATE TABLE frames (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  frame_order INTEGER NOT NULL,
  duration_ms INTEGER DEFAULT 83,
  layer_data_r2_key TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_frames_project ON frames(project_id, frame_order);
```

### palettes
```sql
CREATE TABLE palettes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors TEXT NOT NULL,
  is_public INTEGER DEFAULT 0,
  is_preset INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### credit_transactions
```sql
CREATE TABLE credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('subscription','purchase','ai_usage','refund','signup')),
  ai_feature TEXT,
  stripe_payment_id TEXT,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_credits_user ON credit_transactions(user_id, created_at DESC);
```

### marketplace_listings
```sql
CREATE TABLE marketplace_listings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  license TEXT DEFAULT 'personal' CHECK(license IN ('personal','commercial','cc0')),
  downloads INTEGER DEFAULT 0,
  rating_sum INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  stripe_price_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_marketplace_active ON marketplace_listings(is_active, downloads DESC);
```

### marketplace_purchases
```sql
CREATE TABLE marketplace_purchases (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES marketplace_listings(id),
  buyer_id TEXT NOT NULL REFERENCES users(id),
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  seller_payout_cents INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### forks
```sql
CREATE TABLE forks (
  id TEXT PRIMARY KEY,
  source_project_id TEXT NOT NULL REFERENCES projects(id),
  forked_project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_forks_source ON forks(source_project_id);
```

### shares
```sql
CREATE TABLE shares (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  permission TEXT DEFAULT 'view' CHECK(permission IN ('view','edit')),
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_shares_token ON shares(token);
```

---

## 9. Stripe Plans & Credit Packs

```ts
export const PLANS = {
  free:   { name: 'Free',   priceCents: 0,    monthlyCredits: 20,   maxProjects: 5,        maxLibrary: 50,       exports: ['png_frames'],                                          marketplace: false, privateLinks: false, priorityAi: false },
  pro:    { name: 'Pro',    priceCents: 800,  monthlyCredits: 200,  maxProjects: Infinity,  maxLibrary: 500,      exports: ['png_frames','sprite_sheet','css','canvas_js'],          marketplace: true,  privateLinks: true,  priorityAi: false, revShare: 0.85 },
  studio: { name: 'Studio', priceCents: 2000, monthlyCredits: 1000, maxProjects: Infinity,  maxLibrary: Infinity, exports: ['png_frames','sprite_sheet','css','canvas_js','batch'],  marketplace: true,  privateLinks: true,  priorityAi: true,  revShare: 0.90 },
} as const;

export const CREDIT_PACKS = [
  { id: 'starter',    credits: 50,   priceCents: 299  },
  { id: 'creator',    credits: 200,  priceCents: 999  },
  { id: 'studio',     credits: 500,  priceCents: 1999 },
  { id: 'enterprise', credits: 2000, priceCents: 5999 },
] as const;

export const AI_COSTS = {
  generate_sprite: 5,
  interpolate_frame: 3,
  suggest_palette: 1,
  autocomplete: 3,
} as const;
```

---

## 10. Canvas Types & Shortcuts

```ts
export type Tool = 'pencil' | 'eraser' | 'bucket' | 'line' | 'rectangle' | 'ellipse' | 'selection' | 'eyedropper' | 'mirror';

export interface Pixel { x: number; y: number; color: string; }

export interface Layer {
  id: string; name: string;
  pixels: Map<string, string>;  // "x,y" → "#RRGGBB"
  opacity: number; visible: boolean; locked: boolean;
}

export interface Frame { id: string; order: number; layers: Layer[]; durationMs: number; }

export interface Project {
  id: string; title: string;
  canvasWidth: number; canvasHeight: number;
  fps: number; frames: Frame[]; palette: string[];
}
```

| Key | Action | Key | Action |
|-----|--------|-----|--------|
| B | Pencil | M | Selection |
| E | Eraser | I | Eyedropper |
| G | Flood fill | X | Mirror toggle |
| L | Line | [ / ] | Prev/next frame |
| R | Rectangle | Enter | Play/pause |
| O | Ellipse | Ctrl+S | Save |
| Space+drag | Pan | Ctrl+E | Export dialog |
| Scroll | Zoom | Ctrl+Z | Undo |
| +/- | Zoom in/out | Ctrl+Shift+Z | Redo |

---

## 11. Environment Variables

Frontend (.env): VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY, VITE_CF_ACCESS_LOGIN_URL

Workers secrets: GEMINI_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET

---

## 12. Dev Commands

```bash
pnpm install && pnpm dev              # localhost:5173
pnpm build                            # → dist/
cd workers && pnpm install && npx wrangler dev  # localhost:8787
```

---

## 13. Coding Standards

- TypeScript strict — no any
- Preact functional components only
- Signals for global state; useState only for local
- Hono for Workers routing
- image-rendering: pixelated on ALL canvas/image elements
- font-pixel on ALL headings/buttons/nav/labels
- font-body on ALL body text/inputs/descriptions
- Components: PascalCase.tsx
- Signals/lib: camelCase.ts
- Named exports only (no default exports)
- pnpm over npm
