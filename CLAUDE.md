# CLAUDE.md — SpriteJam

> AI-Powered Pixel Art Animation Studio
> Built with Preact + Vite + Cloudflare

---

## 1. What Is SpriteJam?

SpriteJam is a browser-based pixel art animation studio where users draw sprites, animate them frame-by-frame, and use AI to generate sprites, interpolate animation frames, suggest palettes, and auto-complete drawings.

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

SpriteJam uses **Pixelify Sans** from Google Fonts as its signature display font. Every heading, button, nav item, and label uses this font. Body text uses **Inter**.

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
| Logo "SPRITEJAM" | `font-pixel` | 700 (bold) |
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
spritejam/
├── CLAUDE.md
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── wrangler.toml
│
├── src/
│   ├── index.tsx
│   ├── app.tsx
│   ├── pages/
│   ├── components/
│   ├── signals/
│   ├── lib/
│   ├── types/
│   └── styles/
│       └── global.css
│
├── workers/
│   └── api/
│       ├── index.ts
│       ├── routes/
│       ├── middleware/
│       └── lib/
│
├── migrations/
└── public/
    └── palettes/
```

---

## 6. Dev Commands

```bash
pnpm install && pnpm dev              # localhost:5173
pnpm build                            # → dist/
pnpm workers:dev                      # localhost:8787
```

---

## 7. Coding Standards

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
