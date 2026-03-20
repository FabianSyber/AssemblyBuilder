# LCA Assembly Builder Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual LCA assembly builder with Boverket materials, GWP calculation via LCAx, and a public leaderboard.

**Architecture:** Vue 3 SPA with a portable UI component library (`src/ui/`) using SVG hatch patterns. Supabase for persistence and anonymous auth. LCAx WASM for GWP calculations. Static Boverket material dataset. GitHub Pages deployment.

**Tech Stack:** Vue 3, TypeScript, Tailwind CSS, Vite, Storybook, LCAx (WASM), Supabase, Vitest, Vue Test Utils

**Spec:** `docs/superpowers/specs/2026-03-20-lca-assembly-builder-design.md`

---

## Chunk 1: Project Scaffolding

### Task 1: Initialize Vite + Vue 3 + TypeScript project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `.gitignore`

- [ ] **Step 1: Scaffold with Vite**

Run:
```bash
npm create vite@latest . -- --template vue-ts
```
Select Vue + TypeScript when prompted. This overwrites `README.md` — that's fine.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
```

- [ ] **Step 3: Verify dev server starts**

Run:
```bash
npm run dev
```
Expected: Vite dev server starts on localhost, default Vue page loads.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + Vue 3 + TypeScript project"
```

### Task 2: Add Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/styles/main.css`

- [ ] **Step 1: Install Tailwind + PostCSS**

Run:
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        pastel: {
          pink: '#fce4ec',
          lavender: '#ede7f6',
          mint: '#e0f2f1',
          blue: '#e3f2fd',
          peach: '#fff3e0',
          rose: '#ec70a0',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(200, 180, 230, 0.4)',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create src/styles/main.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Import in src/main.ts**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

createApp(App).mount('#app')
```

- [ ] **Step 5: Add Google Fonts to index.html**

Add to `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 6: Verify Tailwind works**

Add a test class to `App.vue`:
```vue
<template>
  <h1 class="font-heading text-2xl text-pastel-rose">Assembly Builder</h1>
</template>
```

Run `npm run dev`, confirm styled heading appears.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind CSS with pastel theme config"
```

### Task 3: Add Vitest + Vue Test Utils

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install test dependencies**

Run:
```bash
npm install -D vitest @vue/test-utils happy-dom
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write smoke test**

Create `src/__tests__/App.test.ts`:
```ts
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts without error', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })
})
```

- [ ] **Step 5: Run test**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Vitest + Vue Test Utils"
```

### Task 4: Add Storybook

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`

- [ ] **Step 1: Install Storybook**

Run:
```bash
npx storybook@latest init --type vue3
```

- [ ] **Step 2: Configure preview.ts to import UI styles**

Modify `.storybook/preview.ts`:
```ts
import '../src/ui/styles/index.css'
import '../src/styles/main.css'

const preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
}
export default preview
```

- [ ] **Step 3: Verify Storybook runs**

Run: `npm run storybook`
Expected: Storybook opens in browser.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Storybook with UI styles import"
```

### Task 5: Add Vue Router

**Files:**
- Create: `src/app/router.ts`
- Modify: `src/main.ts`

- [ ] **Step 1: Install Vue Router**

Run:
```bash
npm install vue-router@4
```

- [ ] **Step 2: Create router.ts**

```ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/build', name: 'builder', component: () => import('./pages/BuilderPage.vue') },
  { path: '/my-assemblies', name: 'my-assemblies', component: () => import('./pages/MyAssembliesPage.vue') },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('./pages/LeaderboardPage.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

- [ ] **Step 3: Create placeholder pages**

Create each as a minimal Vue SFC:

`src/app/pages/HomePage.vue`:
```vue
<template><div class="p-8"><h1 class="font-heading text-3xl">Home</h1></div></template>
```

`src/app/pages/BuilderPage.vue`:
```vue
<template><div class="p-8"><h1 class="font-heading text-3xl">Builder</h1></div></template>
```

`src/app/pages/MyAssembliesPage.vue`:
```vue
<template><div class="p-8"><h1 class="font-heading text-3xl">My Assemblies</h1></div></template>
```

`src/app/pages/LeaderboardPage.vue`:
```vue
<template><div class="p-8"><h1 class="font-heading text-3xl">Leaderboard</h1></div></template>
```

- [ ] **Step 4: Wire router into main.ts and App.vue**

`src/main.ts`:
```ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './app/router'
import './styles/main.css'

createApp(App).use(router).mount('#app')
```

`src/App.vue`:
```vue
<template>
  <RouterView />
</template>
```

- [ ] **Step 5: Verify routes**

Run `npm run dev`, navigate to `/`, `/build`, `/my-assemblies`, `/leaderboard`. Each shows its heading.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Vue Router with 4 page stubs"
```

### Task 6: Install core dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install LCAx + Supabase**

Run:
```bash
npm install lcax @supabase/supabase-js
npm install -D vite-plugin-wasm vite-plugin-top-level-await
```

- [ ] **Step 2: Update vite.config.ts for WASM support**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [vue(), wasm(), topLevelAwait()],
})
```

- [ ] **Step 3: Verify LCAx imports**

Create `src/__tests__/lcax-smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('LCAx', () => {
  it('can be imported', async () => {
    const lcax = await import('lcax')
    expect(lcax).toBeDefined()
    // Log available exports to verify API surface
    console.log('LCAx exports:', Object.keys(lcax))
  })
})
```

Run: `npm test`
Note: Record the actual exported function names for use in later tasks.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: install LCAx, Supabase, WASM plugins"
```

---

## Chunk 2: UI Component Library — Styles & Common Components

### Task 7: Create UI style tokens

**Files:**
- Create: `src/ui/styles/tokens.css`
- Create: `src/ui/styles/glass.css`
- Create: `src/ui/styles/hatches.css`
- Create: `src/ui/styles/index.css`

- [ ] **Step 1: Create tokens.css**

```css
:root {
  /* Pastel palette */
  --color-pink: #fce4ec;
  --color-lavender: #ede7f6;
  --color-mint: #e0f2f1;
  --color-blue: #e3f2fd;
  --color-peach: #fff3e0;
  --color-rose: #ec70a0;
  --color-purple: #6b4c7a;
  --color-purple-light: #b8a0c8;

  /* Layer tints */
  --layer-concrete: rgba(216, 200, 240, 0.4);
  --layer-insulation: rgba(255, 220, 235, 0.3);
  --layer-wood: rgba(220, 200, 170, 0.35);
  --layer-membrane: rgba(255, 210, 230, 0.5);
  --layer-steel: rgba(200, 210, 230, 0.4);
  --layer-air: rgba(240, 248, 255, 0.2);
  --layer-brick: rgba(230, 200, 180, 0.4);
  --layer-gypsum: rgba(240, 235, 245, 0.4);
  --layer-earth: rgba(210, 195, 170, 0.4);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

- [ ] **Step 2: Create glass.css**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(200, 180, 230, 0.4);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-card-solid {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(200, 180, 230, 0.3);
  border-radius: 8px;
}
```

- [ ] **Step 3: Create hatches.css** (empty for now, SVG patterns are in TS)

```css
/* Hatch-specific styles — SVG patterns defined in src/ui/hatches/patterns.ts */
```

- [ ] **Step 4: Create index.css barrel**

```css
@import './tokens.css';
@import './glass.css';
@import './hatches.css';
```

- [ ] **Step 5: Import in src/styles/main.css**

```css
@import '../ui/styles/index.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Verify styles load**

Run `npm run dev`, inspect with devtools that CSS variables are present on `:root`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add UI style tokens, glass-morphism, and barrel imports"
```

### Task 8: GlassCard component

**Files:**
- Create: `src/ui/common/GlassCard.vue`
- Create: `src/ui/common/__tests__/GlassCard.test.ts`
- Create: `stories/common/GlassCard.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import GlassCard from '../GlassCard.vue'

describe('GlassCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(GlassCard, {
      slots: { default: '<p>Hello</p>' },
    })
    expect(wrapper.text()).toContain('Hello')
  })

  it('applies glass-card class', () => {
    const wrapper = mount(GlassCard)
    expect(wrapper.classes()).toContain('glass-card')
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npx vitest run src/ui/common/__tests__/GlassCard.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement GlassCard.vue**

```vue
<template>
  <div class="glass-card p-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GlassCard' })
</script>
```

- [ ] **Step 4: Run test — should pass**

Run: `npx vitest run src/ui/common/__tests__/GlassCard.test.ts`
Expected: PASS.

- [ ] **Step 5: Write Storybook story**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import GlassCard from '../../src/ui/common/GlassCard.vue'

const meta: Meta<typeof GlassCard> = {
  title: 'Common/GlassCard',
  component: GlassCard,
}
export default meta

type Story = StoryObj<typeof GlassCard>

export const Default: Story = {
  render: () => ({
    components: { GlassCard },
    template: `
      <div style="background: #ede7f6; padding: 32px;">
        <GlassCard>
          <h3 style="font-family: var(--font-heading); font-weight: 700;">Card Title</h3>
          <p style="font-family: var(--font-body); color: #666;">Some content here</p>
        </GlassCard>
      </div>
    `,
  }),
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add GlassCard component with tests and story"
```

### Task 9: BaseButton component

**Files:**
- Create: `src/ui/common/BaseButton.vue`
- Create: `src/ui/common/__tests__/BaseButton.test.ts`
- Create: `stories/common/BaseButton.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Go' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies variant class', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Go', variant: 'primary' } })
    expect(wrapper.classes()).toContain('btn-primary')
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npx vitest run src/ui/common/__tests__/BaseButton.test.ts`

- [ ] **Step 3: Implement BaseButton.vue**

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`]"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseButton' })

withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
}>(), {
  variant: 'primary',
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<style scoped>
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-purple);
  border-color: rgba(200, 180, 230, 0.4);
}

.btn-ghost {
  background: transparent;
  color: var(--color-purple);
}
</style>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Write story**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from '../../src/ui/common/BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Common/BaseButton',
  component: BaseButton,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
  },
}
export default meta

type Story = StoryObj<typeof BaseButton>

export const Primary: Story = { args: { label: 'Start Building', variant: 'primary' } }
export const Secondary: Story = { args: { label: 'Compare', variant: 'secondary' } }
export const Ghost: Story = { args: { label: 'Cancel', variant: 'ghost' } }
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add BaseButton component with tests and stories"
```

### Task 10: Badge component

**Files:**
- Create: `src/ui/common/Badge.vue`
- Create: `src/ui/common/__tests__/Badge.test.ts`
- Create: `stories/common/Badge.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import Badge from '../Badge.vue'

describe('Badge', () => {
  it('renders label text', () => {
    const wrapper = mount(Badge, { props: { label: 'Wall' } })
    expect(wrapper.text()).toContain('Wall')
  })

  it('applies color variant', () => {
    const wrapper = mount(Badge, { props: { label: 'Wood', color: 'mint' } })
    expect(wrapper.classes()).toContain('badge-mint')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement Badge.vue**

```vue
<template>
  <span :class="['badge', `badge-${color}`]">{{ label }}</span>
</template>

<script setup lang="ts">
defineOptions({ name: 'Badge' })

withDefaults(defineProps<{
  label: string
  color?: 'pink' | 'lavender' | 'mint' | 'blue' | 'peach'
}>(), {
  color: 'lavender',
})
</script>

<style scoped>
.badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
}

.badge-pink { background: var(--color-pink); color: var(--color-purple); }
.badge-lavender { background: var(--color-lavender); color: var(--color-purple); }
.badge-mint { background: var(--color-mint); color: #2d6a5e; }
.badge-blue { background: var(--color-blue); color: #1565c0; }
.badge-peach { background: var(--color-peach); color: #bf360c; }
</style>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Write story**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '../../src/ui/common/Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'Common/Badge',
  component: Badge,
  argTypes: {
    color: { control: 'select', options: ['pink', 'lavender', 'mint', 'blue', 'peach'] },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Wall: Story = { args: { label: 'Wall', color: 'lavender' } }
export const Wood: Story = { args: { label: 'Wood', color: 'mint' } }
export const Concrete: Story = { args: { label: 'Concrete', color: 'blue' } }
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Badge component with tests and stories"
```

### Task 11: UI barrel export

**Files:**
- Create: `src/ui/index.ts`

- [ ] **Step 1: Create barrel export**

```ts
// Common
export { default as GlassCard } from './common/GlassCard.vue'
export { default as BaseButton } from './common/BaseButton.vue'
export { default as Badge } from './common/Badge.vue'
```

- [ ] **Step 2: Verify import works**

In `App.vue` temporarily:
```vue
<script setup lang="ts">
import { GlassCard } from './ui'
</script>
```
Run `npm run dev` — no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add UI barrel export"
```

---

## Chunk 3: SVG Hatch Patterns & Assembly Components

### Task 12: SVG hatch pattern definitions

**Files:**
- Create: `src/ui/hatches/patterns.ts`
- Create: `src/ui/hatches/__tests__/patterns.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { HATCH_PATTERNS, getPattern } from '../patterns'

describe('HATCH_PATTERNS', () => {
  it('defines all 9 material hatch types', () => {
    const types = ['concrete', 'insulation', 'wood', 'membrane', 'steel', 'air', 'brick', 'gypsum', 'earth']
    for (const type of types) {
      expect(HATCH_PATTERNS[type]).toBeDefined()
      expect(HATCH_PATTERNS[type].id).toBe(`hatch-${type}`)
      expect(HATCH_PATTERNS[type].fill).toBeDefined()
    }
  })

  it('getPattern returns correct pattern by type', () => {
    const p = getPattern('concrete')
    expect(p.id).toBe('hatch-concrete')
  })

  it('getPattern returns fallback for unknown type', () => {
    const p = getPattern('unknown')
    expect(p.id).toBe('hatch-concrete')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement patterns.ts**

```ts
export interface HatchPattern {
  id: string
  type: string
  width: number
  height: number
  fill: string           // CSS var for layer tint
  strokeColor: string    // Hatch stroke color (semi-transparent)
  svgContent: string     // Inner SVG markup for <pattern>
}

export const HATCH_PATTERNS: Record<string, HatchPattern> = {
  concrete: {
    id: 'hatch-concrete',
    type: 'concrete',
    width: 10,
    height: 10,
    fill: 'var(--layer-concrete)',
    strokeColor: 'rgba(180,160,200,0.4)',
    svgContent: `<circle cx="3" cy="3" r="1.2" fill="rgba(180,160,200,0.4)"/><circle cx="8" cy="8" r="0.8" fill="rgba(180,160,200,0.3)"/><circle cx="6" cy="2" r="0.6" fill="rgba(180,160,200,0.25)"/>`,
  },
  insulation: {
    id: 'hatch-insulation',
    type: 'insulation',
    width: 24,
    height: 12,
    fill: 'var(--layer-insulation)',
    strokeColor: 'rgba(236,112,160,0.35)',
    svgContent: `<path d="M0,6 Q6,0 12,6 Q18,12 24,6" fill="none" stroke="rgba(236,112,160,0.35)" stroke-width="1"/>`,
  },
  wood: {
    id: 'hatch-wood',
    type: 'wood',
    width: 30,
    height: 6,
    fill: 'var(--layer-wood)',
    strokeColor: 'rgba(180,140,100,0.3)',
    svgContent: `<path d="M0,3 Q15,1 30,3" fill="none" stroke="rgba(180,140,100,0.3)" stroke-width="0.7"/><path d="M0,5 Q10,4 30,6" fill="none" stroke="rgba(180,140,100,0.2)" stroke-width="0.4"/>`,
  },
  membrane: {
    id: 'hatch-membrane',
    type: 'membrane',
    width: 8,
    height: 8,
    fill: 'var(--layer-membrane)',
    strokeColor: 'rgba(130,180,220,0.3)',
    svgContent: `<path d="M0,8 L8,0" fill="none" stroke="rgba(130,180,220,0.3)" stroke-width="0.6"/>`,
  },
  steel: {
    id: 'hatch-steel',
    type: 'steel',
    width: 8,
    height: 8,
    fill: 'var(--layer-steel)',
    strokeColor: 'rgba(100,120,160,0.35)',
    svgContent: `<path d="M0,8 L8,0" fill="none" stroke="rgba(100,120,160,0.35)" stroke-width="0.5"/><path d="M0,0 L8,8" fill="none" stroke="rgba(100,120,160,0.25)" stroke-width="0.5"/>`,
  },
  air: {
    id: 'hatch-air',
    type: 'air',
    width: 12,
    height: 12,
    fill: 'var(--layer-air)',
    strokeColor: 'rgba(180,200,230,0.3)',
    svgContent: `<rect x="0.5" y="0.5" width="11" height="11" fill="none" stroke="rgba(180,200,230,0.3)" stroke-width="0.5" stroke-dasharray="2,2"/>`,
  },
  brick: {
    id: 'hatch-brick',
    type: 'brick',
    width: 20,
    height: 10,
    fill: 'var(--layer-brick)',
    strokeColor: 'rgba(180,140,120,0.35)',
    svgContent: `<rect x="0" y="0" width="20" height="5" fill="none" stroke="rgba(180,140,120,0.35)" stroke-width="0.5"/><rect x="10" y="5" width="20" height="5" fill="none" stroke="rgba(180,140,120,0.35)" stroke-width="0.5"/>`,
  },
  gypsum: {
    id: 'hatch-gypsum',
    type: 'gypsum',
    width: 6,
    height: 6,
    fill: 'var(--layer-gypsum)',
    strokeColor: 'rgba(180,170,200,0.25)',
    svgContent: `<circle cx="3" cy="3" r="0.5" fill="rgba(180,170,200,0.25)"/>`,
  },
  earth: {
    id: 'hatch-earth',
    type: 'earth',
    width: 12,
    height: 12,
    fill: 'var(--layer-earth)',
    strokeColor: 'rgba(160,140,110,0.35)',
    svgContent: `<circle cx="3" cy="3" r="1" fill="rgba(160,140,110,0.35)"/><circle cx="9" cy="9" r="0.7" fill="rgba(160,140,110,0.25)"/><path d="M6,6 L8,6" fill="none" stroke="rgba(160,140,110,0.3)" stroke-width="0.5"/>`,
  },
}

export function getPattern(type: string): HatchPattern {
  return HATCH_PATTERNS[type] ?? HATCH_PATTERNS.concrete
}
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SVG hatch pattern definitions for 9 material types"
```

### Task 13: HatchPattern Vue component

**Files:**
- Create: `src/ui/hatches/HatchPattern.vue`
- Create: `src/ui/hatches/__tests__/HatchPattern.test.ts`
- Create: `stories/hatches/HatchPattern.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import HatchPattern from '../HatchPattern.vue'

describe('HatchPattern', () => {
  it('renders an SVG pattern element with correct id', () => {
    const wrapper = mount(HatchPattern, {
      props: { type: 'concrete' },
    })
    const pattern = wrapper.find('pattern')
    expect(pattern.exists()).toBe(true)
    expect(pattern.attributes('id')).toBe('hatch-concrete')
  })

  it('renders SVG content inside pattern', () => {
    const wrapper = mount(HatchPattern, {
      props: { type: 'insulation' },
    })
    const pattern = wrapper.find('pattern')
    expect(pattern.html()).toContain('path')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement HatchPattern.vue**

```vue
<template>
  <pattern
    :id="pattern.id"
    :width="pattern.width"
    :height="pattern.height"
    patternUnits="userSpaceOnUse"
    v-html="pattern.svgContent"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPattern } from './patterns'

defineOptions({ name: 'HatchPattern' })

const props = defineProps<{ type: string }>()

const pattern = computed(() => getPattern(props.type))
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Write story showing all hatch types**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import HatchPattern from '../../src/ui/hatches/HatchPattern.vue'
import { HATCH_PATTERNS } from '../../src/ui/hatches/patterns'

const meta: Meta<typeof HatchPattern> = {
  title: 'Hatches/HatchPattern',
  component: HatchPattern,
}
export default meta

type Story = StoryObj<typeof HatchPattern>

export const AllPatterns: Story = {
  render: () => ({
    components: { HatchPattern },
    setup() {
      return { types: Object.keys(HATCH_PATTERNS), patterns: HATCH_PATTERNS }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; background: #ede7f6;">
        <div v-for="type in types" :key="type" style="text-align: center;">
          <svg width="120" height="80" style="border-radius: 8px; overflow: hidden;">
            <defs>
              <HatchPattern :type="type" />
            </defs>
            <rect width="120" height="80" :fill="patterns[type].fill" stroke="rgba(200,180,230,0.4)" stroke-width="1.5" rx="4"/>
            <rect width="120" height="80" :fill="'url(#hatch-' + type + ')'" rx="4"/>
          </svg>
          <p style="font-family: var(--font-mono); font-size: 12px; margin-top: 4px; color: #6b4c7a;">{{ type }}</p>
        </div>
      </div>
    `,
  }),
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add HatchPattern component with all-types story"
```

### Task 14: AssemblyLayer component

**Files:**
- Create: `src/ui/assembly/AssemblyLayer.vue`
- Create: `src/ui/assembly/__tests__/AssemblyLayer.test.ts`
- Create: `stories/assembly/AssemblyLayer.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import AssemblyLayer from '../AssemblyLayer.vue'

describe('AssemblyLayer', () => {
  const baseProps = {
    hatchType: 'concrete',
    thicknessMm: 150,
    y: 0,
    width: 300,
    scalePixelsPerMm: 0.5,
  }

  it('renders a rect with correct height based on thickness', () => {
    const wrapper = mount(AssemblyLayer, { props: baseProps })
    const rect = wrapper.find('rect')
    expect(rect.exists()).toBe(true)
    expect(rect.attributes('height')).toBe('75') // 150 * 0.5
  })

  it('renders a hatch pattern overlay', () => {
    const wrapper = mount(AssemblyLayer, { props: baseProps })
    const rects = wrapper.findAll('rect')
    // Should have fill rect + hatch overlay rect
    expect(rects.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement AssemblyLayer.vue**

```vue
<template>
  <g>
    <!-- Fill background -->
    <rect
      :x="0"
      :y="y"
      :width="width"
      :height="heightPx"
      :fill="pattern.fill"
      :stroke="pattern.strokeColor"
      stroke-width="1.5"
    />
    <!-- Hatch overlay -->
    <rect
      :x="0"
      :y="y"
      :width="width"
      :height="heightPx"
      :fill="`url(#${pattern.id})`"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPattern } from '../hatches/patterns'

defineOptions({ name: 'AssemblyLayer' })

const props = defineProps<{
  hatchType: string
  thicknessMm: number
  y: number
  width: number
  scalePixelsPerMm: number
}>()

const heightPx = computed(() => props.thicknessMm * props.scalePixelsPerMm)
const pattern = computed(() => getPattern(props.hatchType))
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Write story**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import AssemblyLayer from '../../src/ui/assembly/AssemblyLayer.vue'
import HatchPattern from '../../src/ui/hatches/HatchPattern.vue'

const meta: Meta<typeof AssemblyLayer> = {
  title: 'Assembly/AssemblyLayer',
  component: AssemblyLayer,
}
export default meta

type Story = StoryObj<typeof AssemblyLayer>

export const ConcreteLayer: Story = {
  render: () => ({
    components: { AssemblyLayer, HatchPattern },
    template: `
      <svg width="300" height="100" style="background: white;">
        <defs><HatchPattern type="concrete" /></defs>
        <AssemblyLayer hatchType="concrete" :thicknessMm="150" :y="10" :width="280" :scalePixelsPerMm="0.5" />
      </svg>
    `,
  }),
}

export const InsulationLayer: Story = {
  render: () => ({
    components: { AssemblyLayer, HatchPattern },
    template: `
      <svg width="300" height="120" style="background: white;">
        <defs><HatchPattern type="insulation" /></defs>
        <AssemblyLayer hatchType="insulation" :thicknessMm="200" :y="10" :width="280" :scalePixelsPerMm="0.5" />
      </svg>
    `,
  }),
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add AssemblyLayer component with thickness scaling"
```

### Task 15: DimensionLine component

**Files:**
- Create: `src/ui/assembly/DimensionLine.vue`
- Create: `src/ui/assembly/__tests__/DimensionLine.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import DimensionLine from '../DimensionLine.vue'

describe('DimensionLine', () => {
  it('renders label text with mm value', () => {
    const wrapper = mount(DimensionLine, {
      props: { y1: 10, y2: 100, x: 20, label: '385 mm' },
    })
    expect(wrapper.text()).toContain('385 mm')
  })

  it('renders vertical line and tick marks', () => {
    const wrapper = mount(DimensionLine, {
      props: { y1: 10, y2: 100, x: 20, label: '100 mm' },
    })
    const lines = wrapper.findAll('line')
    expect(lines.length).toBe(3) // vertical + 2 ticks
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement DimensionLine.vue**

```vue
<template>
  <g>
    <!-- Vertical line -->
    <line :x1="x" :y1="y1" :x2="x" :y2="y2" stroke="rgba(160,130,200,0.5)" stroke-width="0.8" stroke-dasharray="2,2" />
    <!-- Top tick -->
    <line :x1="x - 5" :y1="y1" :x2="x + 5" :y2="y1" stroke="rgba(160,130,200,0.5)" stroke-width="0.8" />
    <!-- Bottom tick -->
    <line :x1="x - 5" :y1="y2" :x2="x + 5" :y2="y2" stroke="rgba(160,130,200,0.5)" stroke-width="0.8" />
    <!-- Label -->
    <text
      :x="x - 2"
      :y="(y1 + y2) / 2"
      text-anchor="middle"
      font-family="var(--font-mono)"
      font-size="8"
      fill="rgba(160,130,200,0.7)"
      :transform="`rotate(-90, ${x - 2}, ${(y1 + y2) / 2})`"
    >{{ label }}</text>
  </g>
</template>

<script setup lang="ts">
defineOptions({ name: 'DimensionLine' })

defineProps<{
  y1: number
  y2: number
  x: number
  label: string
}>()
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add DimensionLine component"
```

### Task 16: LayerLabel component

**Files:**
- Create: `src/ui/assembly/LayerLabel.vue`
- Create: `src/ui/assembly/__tests__/LayerLabel.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import LayerLabel from '../LayerLabel.vue'

describe('LayerLabel', () => {
  it('renders material name and thickness', () => {
    const wrapper = mount(LayerLabel, {
      props: { name: 'Concrete', thicknessMm: 150, gwp: 18.2, y: 60, x: 300 },
    })
    expect(wrapper.text()).toContain('Concrete')
    expect(wrapper.text()).toContain('150mm')
  })

  it('renders GWP value', () => {
    const wrapper = mount(LayerLabel, {
      props: { name: 'Concrete', thicknessMm: 150, gwp: 18.2, y: 60, x: 300 },
    })
    expect(wrapper.text()).toContain('18.2')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement LayerLabel.vue**

```vue
<template>
  <g>
    <!-- Connector line -->
    <line
      :x1="x - 20"
      :y1="y + 14"
      :x2="x"
      :y2="y + 14"
      stroke="rgba(200,180,230,0.3)"
      stroke-width="0.8"
      stroke-dasharray="3,2"
    />
    <!-- Glass card background -->
    <rect :x="x" :y="y" width="160" height="28" rx="8" fill="rgba(255,255,255,0.6)" stroke="rgba(200,180,230,0.4)" stroke-width="1" />
    <!-- Material name -->
    <text :x="x + 10" :y="y + 13" font-family="var(--font-body)" font-size="10" fill="#6b4c7a" font-weight="600">{{ name }}</text>
    <!-- Thickness -->
    <text :x="x + 10" :y="y + 23" font-family="var(--font-mono)" font-size="8" fill="#b8a0c8">{{ thicknessMm }}mm</text>
    <!-- GWP value -->
    <text :x="x + 148" :y="y + 13" text-anchor="end" font-family="var(--font-mono)" font-size="9" fill="#ec70a0" font-weight="600">{{ gwp.toFixed(1) }}</text>
    <text :x="x + 148" :y="y + 23" text-anchor="end" font-family="var(--font-mono)" font-size="7" fill="#d4a0b8">kg CO₂e</text>
  </g>
</template>

<script setup lang="ts">
defineOptions({ name: 'LayerLabel' })

defineProps<{
  name: string
  thicknessMm: number
  gwp: number
  y: number
  x: number
}>()
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add LayerLabel glass-morphism component"
```

### Task 17: GwpBar component

**Files:**
- Create: `src/ui/assembly/GwpBar.vue`
- Create: `src/ui/assembly/__tests__/GwpBar.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import GwpBar from '../GwpBar.vue'

describe('GwpBar', () => {
  it('renders total GWP value', () => {
    const wrapper = mount(GwpBar, {
      props: { totalGwp: 31.4, y: 300, width: 400 },
    })
    expect(wrapper.text()).toContain('31.4')
  })

  it('renders unit label', () => {
    const wrapper = mount(GwpBar, {
      props: { totalGwp: 31.4, y: 300, width: 400 },
    })
    expect(wrapper.text()).toContain('kg CO₂e / m²')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement GwpBar.vue**

```vue
<template>
  <g>
    <!-- Glass bar background -->
    <rect :x="0" :y="y" :width="width" height="44" rx="10" fill="rgba(255,255,255,0.65)" stroke="rgba(200,180,230,0.4)" stroke-width="1" />
    <!-- Accent line -->
    <rect :x="0" :y="y + 41" :width="width" height="3" rx="1.5" fill="#ec70a0" opacity="0.5" />
    <!-- GWP number -->
    <text :x="16" :y="y + 28" font-family="var(--font-heading)" font-size="20" fill="#6b4c7a" font-weight="800">{{ totalGwp.toFixed(1) }}</text>
    <!-- Unit -->
    <text :x="64" :y="y + 28" font-family="var(--font-body)" font-size="11" fill="#b8a0c8">kg CO₂e / m²</text>
    <!-- Module label -->
    <text :x="width - 12" :y="y + 28" text-anchor="end" font-family="var(--font-mono)" font-size="8" fill="#b8a0c8">A1–A3</text>
  </g>
</template>

<script setup lang="ts">
defineOptions({ name: 'GwpBar' })

defineProps<{
  totalGwp: number
  y: number
  width: number
}>()
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add GwpBar total summary component"
```

### Task 18: AssemblyCrossSection composite component

**Files:**
- Create: `src/ui/assembly/AssemblyCrossSection.vue`
- Create: `src/ui/assembly/__tests__/AssemblyCrossSection.test.ts`
- Create: `stories/assembly/AssemblyCrossSection.stories.ts`

- [ ] **Step 1: Write failing test**

```ts
import { mount } from '@vue/test-utils'
import AssemblyCrossSection from '../AssemblyCrossSection.vue'

describe('AssemblyCrossSection', () => {
  const layers = [
    { id: '1', name: 'Concrete', hatchType: 'concrete', thicknessMm: 150, gwp: 18.2 },
    { id: '2', name: 'Mineral wool', hatchType: 'insulation', thicknessMm: 200, gwp: 8.6 },
    { id: '3', name: 'Timber cladding', hatchType: 'wood', thicknessMm: 22, gwp: 1.4 },
  ]

  it('renders an SVG element', () => {
    const wrapper = mount(AssemblyCrossSection, { props: { layers, title: 'Wall' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders correct number of layers', () => {
    const wrapper = mount(AssemblyCrossSection, { props: { layers, title: 'Wall' } })
    // Each layer has a <g> group
    const layerGroups = wrapper.findAll('[data-layer-id]')
    expect(layerGroups.length).toBe(3)
  })

  it('renders title text', () => {
    const wrapper = mount(AssemblyCrossSection, { props: { layers, title: 'Wall Assembly' } })
    expect(wrapper.text()).toContain('Wall Assembly')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement AssemblyCrossSection.vue**

```vue
<template>
  <svg :width="svgWidth" :height="svgHeight" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
    <defs>
      <HatchPattern v-for="type in uniqueHatchTypes" :key="type" :type="type" />
    </defs>

    <!-- Title -->
    <text :x="layerX" y="20" font-family="var(--font-heading)" font-size="14" fill="#6b4c7a" font-weight="700">{{ title }}</text>
    <text :x="layerX" y="34" font-family="var(--font-body)" font-size="9" fill="#b8a0c8">{{ subtitle }}</text>

    <!-- Dimension line -->
    <DimensionLine
      v-if="layers.length > 0"
      :x="layerX - 16"
      :y1="layerStartY"
      :y2="layerStartY + totalHeightPx"
      :label="`${totalThicknessMm} mm`"
    />

    <!-- Layers -->
    <g v-for="(layer, index) in layers" :key="layer.id" :data-layer-id="layer.id">
      <AssemblyLayer
        :hatchType="layer.hatchType"
        :thicknessMm="layer.thicknessMm"
        :y="layerY(index)"
        :width="layerWidth"
        :scalePixelsPerMm="scale"
      />
      <LayerLabel
        :name="layer.name"
        :thicknessMm="layer.thicknessMm"
        :gwp="layer.gwp"
        :y="layerY(index) + (layer.thicknessMm * scale) / 2 - 14"
        :x="layerX + layerWidth + 20"
      />
    </g>

    <!-- GWP total bar -->
    <GwpBar
      :totalGwp="totalGwp"
      :y="layerStartY + totalHeightPx + 16"
      :width="svgWidth - 20"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HatchPattern from '../hatches/HatchPattern.vue'
import AssemblyLayer from './AssemblyLayer.vue'
import DimensionLine from './DimensionLine.vue'
import LayerLabel from './LayerLabel.vue'
import GwpBar from './GwpBar.vue'

defineOptions({ name: 'AssemblyCrossSection' })

export interface LayerData {
  id: string
  name: string
  hatchType: string
  thicknessMm: number
  gwp: number
}

const props = withDefaults(defineProps<{
  layers: LayerData[]
  title?: string
  subtitle?: string
}>(), {
  title: 'Assembly',
  subtitle: '',
})

const layerX = 40
const layerStartY = 48
const layerWidth = 240
const scale = 0.4 // pixels per mm

const totalThicknessMm = computed(() =>
  props.layers.reduce((sum, l) => sum + l.thicknessMm, 0)
)

const totalHeightPx = computed(() => totalThicknessMm.value * scale)

const totalGwp = computed(() =>
  props.layers.reduce((sum, l) => sum + l.gwp, 0)
)

const uniqueHatchTypes = computed(() =>
  [...new Set(props.layers.map(l => l.hatchType))]
)

const svgWidth = 500
const svgHeight = computed(() => layerStartY + totalHeightPx.value + 80)

function layerY(index: number): number {
  let y = layerStartY
  for (let i = 0; i < index; i++) {
    y += props.layers[i].thicknessMm * scale
  }
  return y
}
</script>
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Write story with sample wall assembly**

```ts
import type { Meta, StoryObj } from '@storybook/vue3'
import AssemblyCrossSection from '../../src/ui/assembly/AssemblyCrossSection.vue'

const meta: Meta<typeof AssemblyCrossSection> = {
  title: 'Assembly/AssemblyCrossSection',
  component: AssemblyCrossSection,
}
export default meta

type Story = StoryObj<typeof AssemblyCrossSection>

export const ConcreteWall: Story = {
  args: {
    title: 'Wall Assembly',
    subtitle: 'External wall — Concrete structure',
    layers: [
      { id: '1', name: 'Concrete', hatchType: 'concrete', thicknessMm: 150, gwp: 18.2 },
      { id: '2', name: 'Vapor barrier', hatchType: 'membrane', thicknessMm: 2, gwp: 0.3 },
      { id: '3', name: 'Mineral wool', hatchType: 'insulation', thicknessMm: 200, gwp: 8.6 },
      { id: '4', name: 'Wood battens', hatchType: 'wood', thicknessMm: 45, gwp: 2.1 },
      { id: '5', name: 'Wind barrier', hatchType: 'membrane', thicknessMm: 12, gwp: 0.8 },
      { id: '6', name: 'Timber cladding', hatchType: 'wood', thicknessMm: 22, gwp: 1.4 },
    ],
  },
}

export const TimberRoof: Story = {
  args: {
    title: 'Roof Assembly',
    subtitle: 'Pitched roof — Timber structure',
    layers: [
      { id: '1', name: 'Steel roofing', hatchType: 'steel', thicknessMm: 1, gwp: 3.2 },
      { id: '2', name: 'Battens', hatchType: 'wood', thicknessMm: 25, gwp: 0.9 },
      { id: '3', name: 'Wind barrier', hatchType: 'membrane', thicknessMm: 3, gwp: 0.4 },
      { id: '4', name: 'Mineral wool', hatchType: 'insulation', thicknessMm: 300, gwp: 12.8 },
      { id: '5', name: 'Vapor barrier', hatchType: 'membrane', thicknessMm: 2, gwp: 0.3 },
      { id: '6', name: 'Gypsum board', hatchType: 'gypsum', thicknessMm: 13, gwp: 1.1 },
    ],
  },
}

export const Empty: Story = {
  args: {
    title: 'New Assembly',
    subtitle: 'Add layers to start building',
    layers: [],
  },
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add AssemblyCrossSection composite component with stories"
```

---

## Chunk 4: Types, Boverket Data & GWP Calculation

### Task 19: Define app types

**Files:**
- Create: `src/types/assembly.ts`
- Create: `src/types/material.ts`
- Create: `src/types/leaderboard.ts`

- [ ] **Step 1: Create assembly.ts**

```ts
export type AssemblyType = 'wall' | 'roof' | 'floor'
export type StructuralCategory = 'concrete' | 'wood' | 'hybrid' | 'steel' | 'masonry' | 'other'

export interface AssemblyLayer {
  id: string
  materialId: string
  materialName: string
  hatchType: string
  thicknessMm: number
  gwpPerM2: number
}

export interface Assembly {
  id: string
  userId: string
  name: string
  assemblyType: AssemblyType
  structuralCategory: StructuralCategory
  layers: AssemblyLayer[]
  totalGwp: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 2: Create material.ts**

```ts
export interface BoverketMaterial {
  id: string
  name: string
  nameEn: string
  category: string
  declaredUnit: string
  gwpA1A3: number          // kg CO₂-eq per declared unit
  densityKgM3?: number     // if available, for volume-based conversion
  hatchType: string        // mapped to our hatch pattern types
}
```

- [ ] **Step 3: Create leaderboard.ts**

```ts
import type { AssemblyType, StructuralCategory } from './assembly'

export interface LeaderboardEntry {
  id: string
  name: string
  assemblyType: AssemblyType
  structuralCategory: StructuralCategory
  totalGwp: number
  displayName: string
  rank: number
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add TypeScript type definitions"
```

### Task 20: Boverket static material dataset

**Files:**
- Create: `src/data/boverket-materials.json`
- Create: `src/composables/useBoverket.ts`
- Create: `src/composables/__tests__/useBoverket.test.ts`

- [ ] **Step 1: Create placeholder material dataset**

Create `src/data/boverket-materials.json` with a representative subset (the user will help populate the full dataset from the actual API later):

```json
[
  {
    "id": "bvk-concrete-c30",
    "name": "Betong C30/37",
    "nameEn": "Concrete C30/37",
    "category": "Concrete",
    "declaredUnit": "m3",
    "gwpA1A3": 280,
    "densityKgM3": 2400,
    "hatchType": "concrete"
  },
  {
    "id": "bvk-mineral-wool",
    "name": "Mineralull",
    "nameEn": "Mineral wool",
    "category": "Insulation",
    "declaredUnit": "m3",
    "gwpA1A3": 43,
    "densityKgM3": 30,
    "hatchType": "insulation"
  },
  {
    "id": "bvk-timber-structural",
    "name": "Konstruktionsvirke",
    "nameEn": "Structural timber",
    "category": "Wood",
    "declaredUnit": "m3",
    "gwpA1A3": -780,
    "densityKgM3": 470,
    "hatchType": "wood"
  },
  {
    "id": "bvk-gypsum-board",
    "name": "Gipsskiva",
    "nameEn": "Gypsum board",
    "category": "Board",
    "declaredUnit": "m2",
    "gwpA1A3": 3.5,
    "densityKgM3": null,
    "hatchType": "gypsum"
  },
  {
    "id": "bvk-steel-sheet",
    "name": "Stålplåt",
    "nameEn": "Steel sheet",
    "category": "Metal",
    "declaredUnit": "kg",
    "gwpA1A3": 2.8,
    "densityKgM3": 7850,
    "hatchType": "steel"
  },
  {
    "id": "bvk-vapor-barrier",
    "name": "Ångspärr PE-folie",
    "nameEn": "Vapor barrier PE film",
    "category": "Membrane",
    "declaredUnit": "m2",
    "gwpA1A3": 1.5,
    "densityKgM3": null,
    "hatchType": "membrane"
  },
  {
    "id": "bvk-eps",
    "name": "EPS cellplast",
    "nameEn": "EPS expanded polystyrene",
    "category": "Insulation",
    "declaredUnit": "m3",
    "gwpA1A3": 88,
    "densityKgM3": 20,
    "hatchType": "insulation"
  },
  {
    "id": "bvk-brick",
    "name": "Tegel",
    "nameEn": "Brick",
    "category": "Masonry",
    "declaredUnit": "kg",
    "gwpA1A3": 0.24,
    "densityKgM3": 1800,
    "hatchType": "brick"
  }
]
```

- [ ] **Step 2: Write failing test for useBoverket**

```ts
import { describe, it, expect } from 'vitest'
import { useBoverket } from '../useBoverket'

describe('useBoverket', () => {
  it('returns materials list', () => {
    const { materials } = useBoverket()
    expect(materials.value.length).toBeGreaterThan(0)
  })

  it('can search materials by name', () => {
    const { searchMaterials } = useBoverket()
    const results = searchMaterials('concrete')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].nameEn.toLowerCase()).toContain('concrete')
  })

  it('calculates GWP per m2 for volume-based material', () => {
    const { calcGwpPerM2 } = useBoverket()
    // Concrete: 280 kgCO2e/m3, thickness 150mm = 0.15m
    // GWP = 280 * 0.15 = 42
    const gwp = calcGwpPerM2('bvk-concrete-c30', 150)
    expect(gwp).toBeCloseTo(42, 0)
  })

  it('calculates GWP per m2 for area-based material', () => {
    const { calcGwpPerM2 } = useBoverket()
    // Gypsum: 3.5 kgCO2e/m2, thickness doesn't affect area-based
    const gwp = calcGwpPerM2('bvk-gypsum-board', 13)
    expect(gwp).toBeCloseTo(3.5, 1)
  })

  it('calculates GWP per m2 for mass-based material', () => {
    const { calcGwpPerM2 } = useBoverket()
    // Steel: 2.8 kgCO2e/kg, density 7850, thickness 1mm = 0.001m
    // quantity = 0.001 * 7850 = 7.85 kg/m2
    // GWP = 2.8 * 7.85 = 21.98
    const gwp = calcGwpPerM2('bvk-steel-sheet', 1)
    expect(gwp).toBeCloseTo(21.98, 0)
  })
})
```

- [ ] **Step 3: Run test — should fail**

- [ ] **Step 4: Implement useBoverket.ts**

```ts
import { ref } from 'vue'
import type { BoverketMaterial } from '../types/material'
import materialsData from '../data/boverket-materials.json'

const materials = ref<BoverketMaterial[]>(materialsData as BoverketMaterial[])

export function useBoverket() {
  function searchMaterials(query: string): BoverketMaterial[] {
    const q = query.toLowerCase()
    return materials.value.filter(
      m => m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    )
  }

  function getMaterial(id: string): BoverketMaterial | undefined {
    return materials.value.find(m => m.id === id)
  }

  function calcGwpPerM2(materialId: string, thicknessMm: number): number {
    const mat = getMaterial(materialId)
    if (!mat) return 0

    const thicknessM = thicknessMm / 1000

    switch (mat.declaredUnit) {
      case 'm3':
        // GWP per m3 × thickness in m × 1m² reference area
        return mat.gwpA1A3 * thicknessM
      case 'm2':
        // GWP per m2 — thickness doesn't scale (already per area)
        return mat.gwpA1A3
      case 'kg':
        // GWP per kg × (thickness × density) = kg/m²
        if (!mat.densityKgM3) return 0
        return mat.gwpA1A3 * thicknessM * mat.densityKgM3
      default:
        return 0
    }
  }

  return { materials, searchMaterials, getMaterial, calcGwpPerM2 }
}
```

- [ ] **Step 5: Run test — should pass**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Boverket material dataset and useBoverket composable"
```

### Task 21: useAssembly composable

**Files:**
- Create: `src/composables/useAssembly.ts`
- Create: `src/composables/__tests__/useAssembly.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { useAssembly } from '../useAssembly'

describe('useAssembly', () => {
  it('creates a new assembly with defaults', () => {
    const { assembly } = useAssembly()
    expect(assembly.value.name).toBe('')
    expect(assembly.value.layers).toEqual([])
    expect(assembly.value.assemblyType).toBe('wall')
  })

  it('adds a layer and recalculates total GWP', () => {
    const { assembly, addLayer } = useAssembly()
    addLayer({
      materialId: 'bvk-concrete-c30',
      materialName: 'Concrete C30/37',
      hatchType: 'concrete',
      thicknessMm: 150,
    })
    expect(assembly.value.layers.length).toBe(1)
    expect(assembly.value.totalGwp).toBeCloseTo(42, 0)
  })

  it('removes a layer and recalculates', () => {
    const { assembly, addLayer, removeLayer } = useAssembly()
    addLayer({
      materialId: 'bvk-concrete-c30',
      materialName: 'Concrete',
      hatchType: 'concrete',
      thicknessMm: 150,
    })
    const layerId = assembly.value.layers[0].id
    removeLayer(layerId)
    expect(assembly.value.layers.length).toBe(0)
    expect(assembly.value.totalGwp).toBe(0)
  })

  it('reorders layers', () => {
    const { assembly, addLayer, moveLayer } = useAssembly()
    addLayer({ materialId: 'a', materialName: 'First', hatchType: 'concrete', thicknessMm: 100 })
    addLayer({ materialId: 'b', materialName: 'Second', hatchType: 'wood', thicknessMm: 50 })
    moveLayer(1, 0)
    expect(assembly.value.layers[0].materialName).toBe('Second')
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement useAssembly.ts**

```ts
import { ref, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import type { Assembly, AssemblyLayer, AssemblyType, StructuralCategory } from '../types/assembly'
import { useBoverket } from './useBoverket'

// Install uuid: npm install uuid && npm install -D @types/uuid

export function useAssembly() {
  const { calcGwpPerM2 } = useBoverket()

  const assembly = ref<Assembly>({
    id: uuid(),
    userId: '',
    name: '',
    assemblyType: 'wall',
    structuralCategory: 'concrete',
    layers: [],
    totalGwp: 0,
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  function recalculate() {
    for (const layer of assembly.value.layers) {
      layer.gwpPerM2 = calcGwpPerM2(layer.materialId, layer.thicknessMm)
    }
    assembly.value.totalGwp = assembly.value.layers.reduce((sum, l) => sum + l.gwpPerM2, 0)
    assembly.value.updatedAt = new Date().toISOString()
  }

  function addLayer(input: { materialId: string; materialName: string; hatchType: string; thicknessMm: number }) {
    const layer: AssemblyLayer = {
      id: uuid(),
      materialId: input.materialId,
      materialName: input.materialName,
      hatchType: input.hatchType,
      thicknessMm: input.thicknessMm,
      gwpPerM2: 0,
    }
    assembly.value.layers.push(layer)
    recalculate()
  }

  function removeLayer(layerId: string) {
    assembly.value.layers = assembly.value.layers.filter(l => l.id !== layerId)
    recalculate()
  }

  function moveLayer(fromIndex: number, toIndex: number) {
    const layers = [...assembly.value.layers]
    const [moved] = layers.splice(fromIndex, 1)
    layers.splice(toIndex, 0, moved)
    assembly.value.layers = layers
  }

  function updateLayer(layerId: string, updates: Partial<Pick<AssemblyLayer, 'thicknessMm' | 'materialId' | 'materialName' | 'hatchType'>>) {
    const layer = assembly.value.layers.find(l => l.id === layerId)
    if (layer) {
      Object.assign(layer, updates)
      recalculate()
    }
  }

  function loadAssembly(data: Assembly) {
    assembly.value = { ...data }
  }

  return { assembly, addLayer, removeLayer, moveLayer, updateLayer, loadAssembly, recalculate }
}
```

- [ ] **Step 4: Install uuid**

Run: `npm install uuid && npm install -D @types/uuid`

- [ ] **Step 5: Run test — should pass**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add useAssembly composable with GWP recalculation"
```

---

## Chunk 5: Supabase Integration

### Task 22: Supabase client setup

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `.env.example`

- [ ] **Step 1: Create .env.example**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 2: Add .env to .gitignore**

Append to `.gitignore`:
```
.env
.env.local
```

- [ ] **Step 3: Create supabase.ts**

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing — running in offline mode')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Supabase client with offline fallback"
```

### Task 23: useSession composable

**Files:**
- Create: `src/composables/useSession.ts`
- Create: `src/composables/__tests__/useSession.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, vi } from 'vitest'
import { useSession } from '../useSession'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useSession', () => {
  it('starts with no display name', () => {
    const { displayName, isLoggedIn } = useSession()
    expect(displayName.value).toBe('')
    expect(isLoggedIn.value).toBe(false)
  })

  it('sets display name in offline mode', async () => {
    const { setDisplayName, displayName, isLoggedIn } = useSession()
    await setDisplayName('TestUser')
    expect(displayName.value).toBe('TestUser')
    expect(isLoggedIn.value).toBe(true)
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement useSession.ts**

```ts
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const displayName = ref(localStorage.getItem('displayName') ?? '')
const userId = ref(localStorage.getItem('userId') ?? '')

export function useSession() {
  const isLoggedIn = computed(() => displayName.value.length > 0)

  async function setDisplayName(name: string) {
    displayName.value = name
    localStorage.setItem('displayName', name)

    if (supabase) {
      // Sign in anonymously if not already
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const { data } = await supabase.auth.signInAnonymously()
        if (data.user) {
          userId.value = data.user.id
          localStorage.setItem('userId', data.user.id)
        }
      }
      // Upsert display name
      if (userId.value) {
        await supabase.from('users').upsert({
          id: userId.value,
          display_name: name,
        })
      }
    } else {
      // Offline mode — generate local ID
      if (!userId.value) {
        const { v4 } = await import('uuid')
        userId.value = v4()
        localStorage.setItem('userId', userId.value)
      }
    }
  }

  return { displayName, userId, isLoggedIn, setDisplayName }
}
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useSession composable with anonymous auth"
```

### Task 24: useLeaderboard composable

**Files:**
- Create: `src/composables/useLeaderboard.ts`
- Create: `src/composables/__tests__/useLeaderboard.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, vi } from 'vitest'
import { useLeaderboard } from '../useLeaderboard'

vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useLeaderboard', () => {
  it('returns empty entries when offline', async () => {
    const { entries, fetchLeaderboard } = useLeaderboard()
    await fetchLeaderboard('wall', 'concrete')
    expect(entries.value).toEqual([])
  })
})
```

- [ ] **Step 2: Run test — should fail**

- [ ] **Step 3: Implement useLeaderboard.ts**

```ts
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types/leaderboard'
import type { AssemblyType, StructuralCategory } from '../types/assembly'

const PAGE_SIZE = 25

export function useLeaderboard() {
  const entries = ref<LeaderboardEntry[]>([])
  const loading = ref(false)

  async function fetchLeaderboard(
    assemblyType: AssemblyType,
    structuralCategory: StructuralCategory,
    page = 0,
  ) {
    if (!supabase) {
      entries.value = []
      return
    }

    loading.value = true
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .eq('assembly_type', assemblyType)
      .eq('structural_category', structuralCategory)
      .order('total_gwp', { ascending: true })
      .range(from, to)

    if (!error && data) {
      entries.value = data.map((row: any, index: number) => ({
        id: row.id,
        name: row.name,
        assemblyType: row.assembly_type,
        structuralCategory: row.structural_category,
        totalGwp: row.total_gwp,
        displayName: row.display_name,
        rank: row.rank ?? from + index + 1,
      }))
    }
    loading.value = false
  }

  return { entries, loading, fetchLeaderboard }
}
```

- [ ] **Step 4: Run test — should pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useLeaderboard composable"
```

---

## Chunk 6: Application Pages

### Task 25: AppShell layout + NavBar

**Files:**
- Create: `src/app/layout/AppShell.vue`
- Create: `src/app/layout/NavBar.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Implement NavBar.vue**

```vue
<template>
  <nav class="glass-card-solid fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between">
    <router-link to="/" class="font-heading text-lg font-bold text-[var(--color-purple)]">
      Assembly Builder
    </router-link>
    <div class="flex gap-4 items-center">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="font-body text-sm text-[var(--color-purple-light)] hover:text-[var(--color-purple)] transition-colors"
        active-class="!text-[var(--color-rose)] font-semibold"
      >
        {{ link.label }}
      </router-link>
      <span v-if="displayName" class="font-mono text-xs text-[var(--color-purple-light)]">{{ displayName }}</span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useSession } from '../../composables/useSession'

const { displayName } = useSession()

const links = [
  { to: '/build', label: 'Builder' },
  { to: '/my-assemblies', label: 'My Assemblies' },
  { to: '/leaderboard', label: 'Leaderboard' },
]
</script>
```

- [ ] **Step 2: Implement AppShell.vue**

```vue
<template>
  <div class="min-h-screen" style="background: var(--color-lavender);">
    <NavBar />
    <main class="pt-16 px-4 max-w-7xl mx-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from './NavBar.vue'
</script>
```

- [ ] **Step 3: Update App.vue**

```vue
<template>
  <AppShell>
    <RouterView />
  </AppShell>
</template>

<script setup lang="ts">
import AppShell from './app/layout/AppShell.vue'
</script>
```

- [ ] **Step 4: Verify navigation works**

Run `npm run dev`, click through all nav links.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add AppShell layout with NavBar"
```

### Task 26: HomePage

**Files:**
- Modify: `src/app/pages/HomePage.vue`

- [ ] **Step 1: Implement HomePage.vue**

```vue
<template>
  <div class="py-12 flex flex-col items-center gap-8">
    <h1 class="font-heading text-4xl font-extrabold text-[var(--color-purple)]">
      Assembly Builder
    </h1>
    <p class="font-body text-[var(--color-purple-light)] text-center max-w-md">
      Build wall, roof, and floor assemblies. See their climate impact. Compare with others.
    </p>

    <!-- Login -->
    <GlassCard v-if="!isLoggedIn" class="w-full max-w-sm">
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <label class="font-body text-sm text-[var(--color-purple)]">Choose a display name</label>
        <input
          v-model="nameInput"
          type="text"
          placeholder="Your name..."
          class="px-4 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm focus:outline-none focus:border-[var(--color-rose)]"
        />
        <BaseButton label="Start Building" variant="primary" @click="handleLogin" />
      </form>
    </GlassCard>

    <!-- Logged in CTA -->
    <div v-else class="flex gap-4">
      <BaseButton label="New Assembly" variant="primary" @click="$router.push('/build')" />
      <BaseButton label="Leaderboard" variant="secondary" @click="$router.push('/leaderboard')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GlassCard, BaseButton } from '../../ui'
import { useSession } from '../../composables/useSession'

const { isLoggedIn, setDisplayName } = useSession()
const nameInput = ref('')
const router = useRouter()

async function handleLogin() {
  if (nameInput.value.trim()) {
    await setDisplayName(nameInput.value.trim())
    router.push('/build')
  }
}
</script>
```

- [ ] **Step 2: Verify**

Run `npm run dev`, enter a name, confirm redirect to `/build`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add HomePage with display name login"
```

### Task 27: BuilderPage

**Files:**
- Modify: `src/app/pages/BuilderPage.vue`

- [ ] **Step 1: Implement BuilderPage.vue**

```vue
<template>
  <div class="py-8">
    <!-- Top bar -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input
        v-model="assembly.name"
        placeholder="Assembly name..."
        class="font-heading text-xl font-bold bg-transparent border-b-2 border-[rgba(200,180,230,0.4)] focus:border-[var(--color-rose)] outline-none px-1 py-1 text-[var(--color-purple)]"
      />
      <select v-model="assembly.assemblyType" class="font-body text-sm rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="wall">Wall</option>
        <option value="roof">Roof</option>
        <option value="floor">Floor</option>
      </select>
      <select v-model="assembly.structuralCategory" class="font-body text-sm rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="concrete">Concrete</option>
        <option value="wood">Wood</option>
        <option value="hybrid">Hybrid</option>
        <option value="steel">Steel</option>
        <option value="masonry">Masonry</option>
        <option value="other">Other</option>
      </select>
      <label class="flex items-center gap-2 font-body text-sm text-[var(--color-purple-light)]">
        <input type="checkbox" v-model="assembly.isPublic" />
        Public
      </label>
      <BaseButton label="Save" variant="secondary" @click="handleSave" />
    </div>

    <!-- Two panel layout -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left: SVG cross section -->
      <div class="flex-1">
        <GlassCard class="p-6">
          <AssemblyCrossSection
            :layers="uiLayers"
            :title="assembly.name || 'New Assembly'"
            :subtitle="assembly.assemblyType + ' — ' + assembly.structuralCategory"
          />
        </GlassCard>
      </div>

      <!-- Right: Material picker -->
      <div class="w-full lg:w-80">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Add Layer</h3>
          <input
            v-model="searchQuery"
            placeholder="Search materials..."
            class="w-full px-3 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm mb-3 focus:outline-none focus:border-[var(--color-rose)]"
          />
          <div class="max-h-48 overflow-y-auto space-y-1 mb-4">
            <button
              v-for="mat in filteredMaterials"
              :key="mat.id"
              @click="selectedMaterial = mat"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors',
                selectedMaterial?.id === mat.id
                  ? 'bg-[var(--color-pink)] text-[var(--color-purple)]'
                  : 'hover:bg-white/40 text-[var(--color-purple-light)]'
              ]"
            >
              {{ mat.nameEn }}
              <span class="font-mono text-xs text-[var(--color-purple-light)]">{{ mat.category }}</span>
            </button>
          </div>

          <div v-if="selectedMaterial" class="space-y-3">
            <div>
              <label class="font-body text-xs text-[var(--color-purple-light)]">Thickness (mm)</label>
              <input
                v-model.number="thicknessInput"
                type="number"
                min="1"
                class="w-full px-3 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-mono text-sm"
              />
            </div>
            <p class="font-mono text-xs text-[var(--color-rose)]">
              ≈ {{ previewGwp.toFixed(1) }} kg CO₂e/m²
            </p>
            <BaseButton label="Add Layer" variant="primary" @click="handleAddLayer" />
          </div>
        </GlassCard>

        <!-- Layer list for reorder/delete -->
        <GlassCard v-if="assembly.layers.length > 0" class="p-4 mt-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Layers</h3>
          <div class="space-y-2">
            <div
              v-for="(layer, index) in assembly.layers"
              :key="layer.id"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30"
            >
              <span class="font-body text-sm text-[var(--color-purple)] flex-1">{{ layer.materialName }}</span>
              <span class="font-mono text-xs text-[var(--color-purple-light)]">{{ layer.thicknessMm }}mm</span>
              <button @click="moveLayer(index, index - 1)" :disabled="index === 0" class="text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] disabled:opacity-30">↑</button>
              <button @click="moveLayer(index, index + 1)" :disabled="index === assembly.layers.length - 1" class="text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] disabled:opacity-30">↓</button>
              <button @click="removeLayer(layer.id)" class="text-xs text-[var(--color-rose)] hover:text-red-500">✕</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GlassCard, BaseButton } from '../../ui'
import { AssemblyCrossSection } from '../../ui'
import { useAssembly } from '../../composables/useAssembly'
import { useBoverket } from '../../composables/useBoverket'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { BoverketMaterial } from '../../types/material'

const { assembly, addLayer, removeLayer, moveLayer } = useAssembly()
const { materials, searchMaterials, calcGwpPerM2 } = useBoverket()
const { saveAssembly } = useAssemblyStore()

async function handleSave() {
  if (!assembly.value.name.trim()) return
  await saveAssembly(assembly.value)
}

const searchQuery = ref('')
const selectedMaterial = ref<BoverketMaterial | null>(null)
const thicknessInput = ref(100)

const filteredMaterials = computed(() =>
  searchQuery.value ? searchMaterials(searchQuery.value) : materials.value
)

const previewGwp = computed(() =>
  selectedMaterial.value ? calcGwpPerM2(selectedMaterial.value.id, thicknessInput.value) : 0
)

const uiLayers = computed(() =>
  assembly.value.layers.map(l => ({
    id: l.id,
    name: l.materialName,
    hatchType: l.hatchType,
    thicknessMm: l.thicknessMm,
    gwp: l.gwpPerM2,
  }))
)

function handleAddLayer() {
  if (!selectedMaterial.value) return
  addLayer({
    materialId: selectedMaterial.value.id,
    materialName: selectedMaterial.value.nameEn,
    hatchType: selectedMaterial.value.hatchType,
    thicknessMm: thicknessInput.value,
  })
  selectedMaterial.value = null
  thicknessInput.value = 100
}
</script>
```

- [ ] **Step 2: Update UI barrel to export assembly components**

Add to `src/ui/index.ts`:
```ts
export { default as AssemblyCrossSection } from './assembly/AssemblyCrossSection.vue'
```

- [ ] **Step 3: Verify**

Run `npm run dev`, navigate to `/build`, add layers, verify SVG updates.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add BuilderPage with material picker and live SVG preview"
```

### Task 28: MyAssembliesPage + SideBySide comparison

**Files:**
- Modify: `src/app/pages/MyAssembliesPage.vue`
- Create: `src/ui/comparison/SideBySide.vue`

- [ ] **Step 1: Implement SideBySide.vue**

```vue
<template>
  <div class="flex gap-6">
    <div v-for="assembly in assemblies" :key="assembly.id" class="flex-1">
      <AssemblyCrossSection
        :layers="toLayers(assembly)"
        :title="assembly.name"
        :subtitle="`${assembly.assemblyType} — ${assembly.structuralCategory}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AssemblyCrossSection from '../assembly/AssemblyCrossSection.vue'
import type { Assembly } from '../../types/assembly'

defineOptions({ name: 'SideBySide' })

defineProps<{ assemblies: Assembly[] }>()

function toLayers(assembly: Assembly) {
  return assembly.layers.map(l => ({
    id: l.id,
    name: l.materialName,
    hatchType: l.hatchType,
    thicknessMm: l.thicknessMm,
    gwp: l.gwpPerM2,
  }))
}
</script>
```

- [ ] **Step 2: Implement MyAssembliesPage.vue**

```vue
<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-6">My Assemblies</h1>

    <!-- Assembly grid -->
    <div v-if="!comparing" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard
        v-for="a in savedAssemblies"
        :key="a.id"
        class="p-4 cursor-pointer"
        :class="{ 'ring-2 ring-[var(--color-rose)]': selectedIds.has(a.id) }"
        @click="toggleSelect(a.id)"
      >
        <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)]">{{ a.name }}</h3>
        <div class="flex gap-2 mt-1">
          <Badge :label="a.assemblyType" color="lavender" />
          <Badge :label="a.structuralCategory" color="mint" />
        </div>
        <p class="font-mono text-lg font-bold text-[var(--color-rose)] mt-2">
          {{ a.totalGwp.toFixed(1) }} <span class="text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
        </p>
      </GlassCard>
    </div>

    <div v-if="selectedIds.size > 0 && !comparing" class="mt-4">
      <BaseButton
        :label="`Compare ${selectedIds.size} assemblies`"
        variant="primary"
        :disabled="selectedIds.size < 2"
        @click="comparing = true"
      />
    </div>

    <!-- Side by side comparison -->
    <div v-if="comparing">
      <BaseButton label="← Back" variant="ghost" @click="comparing = false" class="mb-4" />
      <SideBySide :assemblies="selectedAssemblies" />
    </div>

    <p v-if="savedAssemblies.length === 0" class="font-body text-[var(--color-purple-light)] text-center py-12">
      No assemblies yet. <router-link to="/build" class="text-[var(--color-rose)] underline">Build your first one.</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlassCard, BaseButton, Badge } from '../../ui'
import SideBySide from '../../ui/comparison/SideBySide.vue'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { Assembly } from '../../types/assembly'

const { assemblies: savedAssemblies, fetchAssemblies } = useAssemblyStore()
onMounted(fetchAssemblies)

const selectedIds = ref(new Set<string>())
const comparing = ref(false)

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else if (selectedIds.value.size < 3) {
    selectedIds.value.add(id)
  }
}

const selectedAssemblies = computed(() =>
  savedAssemblies.value.filter(a => selectedIds.value.has(a.id))
)
</script>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add MyAssembliesPage with SideBySide comparison"
```

### Task 29: LeaderboardPage

**Files:**
- Modify: `src/app/pages/LeaderboardPage.vue`
- Create: `src/ui/leaderboard/LeaderboardTable.vue`
- Create: `src/ui/leaderboard/CategoryFilter.vue`

- [ ] **Step 1: Implement CategoryFilter.vue**

```vue
<template>
  <div class="flex flex-wrap gap-3">
    <div class="flex gap-1">
      <button
        v-for="t in types"
        :key="t"
        :class="[
          'px-3 py-1 rounded-lg font-body text-sm transition-colors',
          assemblyType === t ? 'bg-[var(--color-rose)] text-white' : 'bg-white/40 text-[var(--color-purple-light)] hover:bg-white/60'
        ]"
        @click="$emit('update:assemblyType', t)"
      >{{ t }}</button>
    </div>
    <div class="flex gap-1">
      <button
        v-for="c in categories"
        :key="c"
        :class="[
          'px-3 py-1 rounded-lg font-mono text-xs transition-colors',
          structuralCategory === c ? 'bg-[var(--color-purple)] text-white' : 'bg-white/40 text-[var(--color-purple-light)] hover:bg-white/60'
        ]"
        @click="$emit('update:structuralCategory', c)"
      >{{ c }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CategoryFilter' })

defineProps<{
  assemblyType: string
  structuralCategory: string
}>()

defineEmits<{
  'update:assemblyType': [value: string]
  'update:structuralCategory': [value: string]
}>()

const types = ['wall', 'roof', 'floor']
const categories = ['concrete', 'wood', 'hybrid', 'steel', 'masonry', 'other']
</script>
```

- [ ] **Step 2: Implement LeaderboardTable.vue**

```vue
<template>
  <div class="space-y-2">
    <div
      v-for="entry in entries"
      :key="entry.id"
      :class="[
        'flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors',
        selectedId === entry.id ? 'bg-[var(--color-pink)]' : 'bg-white/30 hover:bg-white/50'
      ]"
      @click="$emit('select', entry.id)"
    >
      <span class="font-mono text-lg font-bold text-[var(--color-purple)] w-8 text-center">{{ entry.rank }}</span>
      <div class="flex-1">
        <p class="font-body text-sm font-semibold text-[var(--color-purple)]">{{ entry.name }}</p>
        <p class="font-mono text-xs text-[var(--color-purple-light)]">{{ entry.displayName }}</p>
      </div>
      <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ entry.totalGwp.toFixed(1) }}</span>
      <span class="font-mono text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
    </div>
    <p v-if="entries.length === 0" class="font-body text-sm text-[var(--color-purple-light)] text-center py-8">
      No entries yet in this category.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from '../../types/leaderboard'

defineOptions({ name: 'LeaderboardTable' })

defineProps<{
  entries: LeaderboardEntry[]
  selectedId?: string
}>()

defineEmits<{ select: [id: string] }>()
</script>
```

- [ ] **Step 3: Implement LeaderboardPage.vue**

```vue
<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-4">Leaderboard</h1>

    <CategoryFilter
      :assemblyType="assemblyType"
      :structuralCategory="structuralCategory"
      @update:assemblyType="assemblyType = $event; fetchData()"
      @update:structuralCategory="structuralCategory = $event; fetchData()"
    />

    <!-- Split view -->
    <div class="flex flex-col lg:flex-row gap-6 mt-6">
      <!-- Left: Public leaderboard -->
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Top Assemblies</h3>
          <LeaderboardTable :entries="entries" :selectedId="selectedPublicId" @select="selectedPublicId = $event" />
        </GlassCard>
      </div>

      <!-- Right: My assemblies in this category -->
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">My Assemblies</h3>
          <LeaderboardTable :entries="myEntries" :selectedId="selectedMyId" @select="selectedMyId = $event" />

          <!-- Diff display -->
          <div v-if="gwpDiff !== null" class="mt-4 p-3 rounded-lg bg-white/40 text-center">
            <span class="font-mono text-lg font-bold" :class="gwpDiff > 0 ? 'text-red-400' : 'text-emerald-500'">
              {{ gwpDiff > 0 ? '+' : '' }}{{ gwpDiff.toFixed(1) }}
            </span>
            <span class="font-mono text-xs text-[var(--color-purple-light)]"> kg CO₂e/m²</span>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlassCard } from '../../ui'
import CategoryFilter from '../../ui/leaderboard/CategoryFilter.vue'
import LeaderboardTable from '../../ui/leaderboard/LeaderboardTable.vue'
import { useLeaderboard } from '../../composables/useLeaderboard'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { AssemblyType, StructuralCategory } from '../../types/assembly'
import type { LeaderboardEntry } from '../../types/leaderboard'

const assemblyType = ref<AssemblyType>('wall')
const structuralCategory = ref<StructuralCategory>('concrete')
const selectedPublicId = ref<string>()
const selectedMyId = ref<string>()

const { entries, fetchLeaderboard } = useLeaderboard()

const { assemblies: myAssemblies, fetchAssemblies } = useAssemblyStore()

const myEntries = computed<LeaderboardEntry[]>(() =>
  myAssemblies.value
    .filter(a => a.assemblyType === assemblyType.value && a.structuralCategory === structuralCategory.value)
    .sort((a, b) => a.totalGwp - b.totalGwp)
    .map((a, i) => ({
      id: a.id,
      name: a.name,
      assemblyType: a.assemblyType,
      structuralCategory: a.structuralCategory,
      totalGwp: a.totalGwp,
      displayName: 'You',
      rank: i + 1,
    }))
)

const gwpDiff = computed(() => {
  const pub = entries.value.find(e => e.id === selectedPublicId.value)
  const mine = myEntries.value.find(e => e.id === selectedMyId.value)
  if (pub && mine) return mine.totalGwp - pub.totalGwp
  return null
})

async function fetchData() {
  await fetchLeaderboard(assemblyType.value, structuralCategory.value)
  await fetchAssemblies()
}

onMounted(fetchData)
</script>
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add LeaderboardPage with split view and GWP diff"
```

---

## Chunk 7: Deployment & Finalization

### Task 30: Supabase assembly persistence

**Files:**
- Create: `src/composables/useAssemblyStore.ts`
- Create: `src/composables/__tests__/useAssemblyStore.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAssemblyStore } from '../useAssemblyStore'

vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useAssemblyStore (offline)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty assemblies', async () => {
    const { assemblies, fetchAssemblies } = useAssemblyStore()
    await fetchAssemblies()
    expect(assemblies.value).toEqual([])
  })

  it('saves and retrieves an assembly from localStorage', async () => {
    const { assemblies, saveAssembly, fetchAssemblies } = useAssemblyStore()
    await saveAssembly({
      id: 'test-1', userId: 'u1', name: 'Test Wall',
      assemblyType: 'wall', structuralCategory: 'concrete',
      layers: [], totalGwp: 42, isPublic: false,
      createdAt: '', updatedAt: '',
    })
    await fetchAssemblies()
    expect(assemblies.value.length).toBe(1)
    expect(assemblies.value[0].name).toBe('Test Wall')
  })

  it('deletes an assembly', async () => {
    const { assemblies, saveAssembly, deleteAssembly, fetchAssemblies } = useAssemblyStore()
    await saveAssembly({
      id: 'test-1', userId: 'u1', name: 'To Delete',
      assemblyType: 'wall', structuralCategory: 'wood',
      layers: [], totalGwp: 10, isPublic: false,
      createdAt: '', updatedAt: '',
    })
    await deleteAssembly('test-1')
    await fetchAssemblies()
    expect(assemblies.value.length).toBe(0)
  })
})
```

- [ ] **Step 2: Run test — should fail**

Run: `npx vitest run src/composables/__tests__/useAssemblyStore.test.ts`

- [ ] **Step 3: Implement useAssemblyStore.ts**

Handles saving/loading assemblies to Supabase with localStorage offline fallback:

```ts
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { Assembly } from '../types/assembly'
import { useSession } from './useSession'

const LOCAL_KEY = 'assemblies'

export function useAssemblyStore() {
  const assemblies = ref<Assembly[]>([])
  const loading = ref(false)

  function loadLocal(): Assembly[] {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  }

  function saveLocal(data: Assembly[]) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  }

  async function fetchAssemblies() {
    const { userId } = useSession()
    loading.value = true

    if (supabase && userId.value) {
      const { data, error } = await supabase
        .from('assemblies')
        .select('*')
        .eq('user_id', userId.value)
        .order('updated_at', { ascending: false })

      if (!error && data) {
        assemblies.value = data.map(row => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          assemblyType: row.assembly_type,
          structuralCategory: row.structural_category,
          layers: (row.lcax_data as any)?.layers ?? [],
          totalGwp: row.total_gwp,
          isPublic: row.is_public,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
        saveLocal(assemblies.value)
      }
    } else {
      assemblies.value = loadLocal()
    }
    loading.value = false
  }

  async function saveAssembly(assembly: Assembly) {
    const { userId } = useSession()
    assembly.userId = userId.value

    if (supabase) {
      await supabase.from('assemblies').upsert({
        id: assembly.id,
        user_id: assembly.userId,
        name: assembly.name,
        assembly_type: assembly.assemblyType,
        structural_category: assembly.structuralCategory,
        lcax_data: { layers: assembly.layers },
        total_gwp: assembly.totalGwp,
        is_public: assembly.isPublic,
        gwp_unit: 'kgCO2e/m2',
        schema_version: 1,
      })
    }

    // Always save locally too
    const local = loadLocal()
    const idx = local.findIndex(a => a.id === assembly.id)
    if (idx >= 0) local[idx] = assembly
    else local.push(assembly)
    saveLocal(local)
    assemblies.value = local
  }

  async function deleteAssembly(id: string) {
    if (supabase) {
      await supabase.from('assemblies').delete().eq('id', id)
    }
    const local = loadLocal().filter(a => a.id !== id)
    saveLocal(local)
    assemblies.value = local
  }

  return { assemblies, loading, fetchAssemblies, saveAssembly, deleteAssembly }
}
```

- [ ] **Step 4: Run test — should pass**

Run: `npx vitest run src/composables/__tests__/useAssemblyStore.test.ts`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useAssemblyStore with Supabase + localStorage persistence"
```

### Task 31: GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deploy workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npx vue-tsc --noEmit
      - run: npm test
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Update vite.config.ts for GitHub Pages base path**

Add `base` to config:
```ts
export default defineConfig({
  base: '/',  // Update if using a subdomain with CNAME
  plugins: [vue(), wasm(), topLevelAwait()],
})
```

- [ ] **Step 3: Create CNAME file (user action)**

Skip this step until the user provides their actual subdomain. When ready, create `public/CNAME` with the subdomain (e.g., `lca.example.com`).

- [ ] **Step 4: Add SPA 404 fallback for Vue Router history mode**

Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // Redirect all 404s to index.html for SPA routing
    // Stores the path in sessionStorage so the app can restore it
    sessionStorage.setItem('spa-redirect', window.location.pathname)
    window.location.replace('/')
  </script>
</head>
</html>
```

Add path restoration to `src/main.ts` (before `app.mount`):
```ts
// Restore SPA route from 404 redirect
const redirectPath = sessionStorage.getItem('spa-redirect')
if (redirectPath) {
  sessionStorage.removeItem('spa-redirect')
  router.replace(redirectPath)
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add GitHub Actions deploy workflow and CNAME"
```

### Task 32: Add .superpowers to .gitignore

- [ ] **Step 1: Append to .gitignore**

```
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers directory"
```

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|------------------|
| 1 | 1–6 | Vite + Vue + Tailwind + Vitest + Storybook + Router + LCAx |
| 2 | 7–11 | UI styles, GlassCard, BaseButton, Badge, barrel export |
| 3 | 12–18 | 9 hatch patterns, AssemblyLayer, DimensionLine, LayerLabel, GwpBar, AssemblyCrossSection |
| 4 | 19–21 | Types, Boverket materials, GWP calculation, useAssembly |
| 5 | 22–24 | Supabase client, useSession, useLeaderboard |
| 6 | 25–29 | AppShell, HomePage, BuilderPage, MyAssembliesPage, LeaderboardPage |
| 7 | 30–32 | Assembly persistence, GitHub Actions deploy, cleanup |
