# LCA Assembly Builder — Design Spec

## Overview

A web application for building wall, roof, and floor assemblies, connecting them to Boverket's Klimatdatabas for GWP (Global Warming Potential) data, and comparing results on a public leaderboard. The visual identity centers on architectural cross-section drawings with SVG hatch patterns, rendered in a flat pastel / glass-morphism aesthetic.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 + TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Component dev | Storybook |
| LCA engine | LCAx (npm, WASM) |
| Material data | Boverket Klimatdatabas REST API |
| Backend | Supabase (PostgreSQL + JS client) |
| Auth | Display name + session token (no email/password) |
| Deploy | GitHub Pages + CNAME subdomain on one.com |

## Visual Style

- **Flat pastel palette** — soft pinks, lavenders, mint greens, baby blues, peach. No gradients.
- **Glass-morphism** — semi-transparent white cards (`rgba(255,255,255,0.6)`), subtle borders, backdrop blur where supported.
- **Architectural SVG hatches** — each material type has a standard hatch pattern rendered as SVG `<pattern>` elements with pastel-tinted strokes.
- **Typography** — Poppins for headings, Inter for body, monospace for dimensions/values. Matching PortfolioPage conventions.
- **Borders** — bold 2px strokes on assembly layers, soft 1px on UI cards. No dark offset shadows; transparent/glass style only.
- **PortfolioPage alignment** — follows the same Tailwind config patterns, color token approach, and component structure as the existing PortfolioPage repo.

## Project Structure

```
AssemblyBuilder/
├── src/
│   ├── app/                        # Application-specific code
│   │   ├── pages/
│   │   │   ├── HomePage.vue        # Login + recent assemblies
│   │   │   ├── BuilderPage.vue     # Assembly cross-section builder
│   │   │   ├── MyAssembliesPage.vue # Saved assemblies + compare
│   │   │   └── LeaderboardPage.vue # Ranked assemblies + diff
│   │   ├── layout/
│   │   │   ├── AppShell.vue
│   │   │   └── NavBar.vue
│   │   └── router.ts
│   │
│   ├── ui/                         # Portable component library
│   │   ├── styles/
│   │   │   ├── tokens.css          # Pastel palette, spacing, typography CSS vars
│   │   │   ├── glass.css           # Glass-morphism utilities
│   │   │   ├── hatches.css         # Hatch-specific styles
│   │   │   └── index.css           # Barrel import
│   │   ├── assembly/
│   │   │   ├── AssemblyCrossSection.vue  # Main SVG cross-section renderer
│   │   │   ├── AssemblyLayer.vue         # Single layer with hatch + label
│   │   │   ├── DimensionLine.vue         # Technical dimension annotation
│   │   │   ├── GwpBar.vue               # Total GWP summary bar
│   │   │   └── LayerLabel.vue            # Glass-morphism label card
│   │   ├── hatches/
│   │   │   ├── patterns.ts              # SVG pattern definitions
│   │   │   └── HatchPattern.vue         # Reusable SVG <pattern> component
│   │   ├── comparison/
│   │   │   ├── SideBySide.vue           # Up to 3 assemblies side by side
│   │   │   └── LeaderboardCompare.vue   # Your assembly vs. category best
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.vue
│   │   │   └── CategoryFilter.vue
│   │   ├── common/
│   │   │   ├── GlassCard.vue            # Glass-morphism card primitive
│   │   │   ├── BaseButton.vue
│   │   │   └── Badge.vue
│   │   └── index.ts                     # Public API barrel export
│   │
│   ├── composables/
│   │   ├── useBoverket.ts          # Boverket API client
│   │   ├── useAssembly.ts          # Assembly CRUD + LCAx calculation
│   │   ├── useLeaderboard.ts       # Leaderboard queries
│   │   └── useSession.ts           # Display name / session token
│   │
│   ├── types/
│   │   ├── assembly.ts             # App-specific types extending LCAx
│   │   ├── material.ts             # Boverket material mapping
│   │   └── leaderboard.ts          # Leaderboard/ranking types
│   │
│   ├── lib/
│   │   └── supabase.ts             # Supabase client init
│   │
│   ├── styles/
│   │   └── main.css                # Tailwind base + imports ui/styles
│   │
│   └── main.ts
│
├── .storybook/                     # Storybook config (imports ui/styles)
├── stories/                        # Story files mirror ui/ structure
├── docs/
└── ...config files
```

### Key separation

- **`src/ui/`** — zero app dependencies. Only Vue + props. Own CSS. Storybook target. Portable to other repos.
- **`src/app/`** — application wiring: routes, pages, Supabase integration, Boverket API calls.
- **`src/composables/`** — shared logic consumed by app pages.

## Data Model (Supabase)

### `users` table

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| display_name | text | Chosen by user |
| session_token | text | Stored in browser localStorage |
| created_at | timestamptz | |

### `assemblies` table

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK → users) | |
| name | text | User-given name |
| assembly_type | enum | `wall`, `roof`, `floor` |
| structural_category | text | `concrete`, `wood`, `hybrid`, `steel`, etc. |
| lcax_data | jsonb | Full LCAx Assembly object (products, EPDs, etc.) |
| total_gwp | numeric | Denormalized from LCAx calculation, for leaderboard sorting |
| is_public | boolean | Visible on leaderboard |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `leaderboard_view` (Supabase View)

```sql
SELECT
  a.id, a.name, a.assembly_type, a.structural_category, a.total_gwp,
  u.display_name,
  RANK() OVER (
    PARTITION BY a.assembly_type, a.structural_category
    ORDER BY a.total_gwp ASC
  ) as rank
FROM assemblies a
JOIN users u ON a.user_id = u.id
WHERE a.is_public = true;
```

### LCAx Integration

- Materials from Boverket map to LCAx `GenericData` type
- Each layer is an LCAx `Product` with associated impact data
- Assembly structure follows LCAx `Assembly` schema
- GWP calculation: `calculateAssembly()` via WASM → extract with `getImpactTotal(results, "gwp")`
- `total_gwp` is recalculated client-side on every edit and synced to Supabase

## SVG Hatch Pattern Library

| Hatch Type | SVG Pattern | Material Types |
|---|---|---|
| `concrete` | Scattered dots/pebbles | Concrete, screed |
| `insulation` | Wavy sine curves | Mineral wool, EPS, XPS |
| `wood` | Horizontal grain lines | Timber, battens, CLT |
| `membrane` | Diagonal thin lines | Vapor barriers, wind barriers |
| `steel` | Dense diagonal crosshatch | Steel beams, reinforcement |
| `air` | Empty with dashed border | Ventilated air gaps |
| `brick` | Stacked rectangles | Masonry, brick |
| `gypsum` | Fine stipple | Plasterboard |
| `earth` | Mixed dots + short dashes | Soil, gravel fill |

All patterns use semi-transparent pastel strokes over soft tinted fills. Each is a Vue component (`HatchPattern.vue`) that registers its `<pattern>` in a parent SVG `<defs>` block.

## Pages & User Flow

### 1. Home / Login

- Display name input → creates user in Supabase, stores session token in localStorage
- Shows recent public assemblies as mini cross-section cards
- CTA: "Start Building"

### 2. Builder

The core page. Two-panel layout:

- **Left panel:** SVG cross-section that builds up as layers are added. Each layer rendered with correct hatch, thickness proportional to mm value, and dimension lines. Layers are drag-to-reorder. Running GWP total bar at the bottom.
- **Right panel:** Material picker. Search Boverket catalog → select material → set thickness in mm → add to stack. Shows per-layer GWP as it's added.
- **Top bar:** Assembly name, type selector (wall/roof/floor), structural category, save button, public toggle.

Calculation flow: user adds/edits layer → LCAx Assembly JSON updated → `calculateAssembly()` called → GWP values update in real-time → SVG re-renders.

### 3. My Assemblies / Compare

- Grid of saved assemblies as mini cross-section thumbnail cards
- Select up to 3 → side-by-side view with:
  - Aligned layer stacks at same scale
  - Per-layer GWP comparison
  - Total GWP diff highlighted
- Duplicate + edit workflow for iterating variants

### 4. Leaderboard

Split-view layout:

- **Left side:** Public leaderboard ranked by lowest GWP/m² within selected type + structural category. Shows mini cross-sections, display name, rank, GWP.
- **Right side:** Your own assemblies in that same category.
- **Diff overlay:** `+/-` GWP difference between selected entries on each side. Click any entry on either side to update the comparison.
- Category filter bar at top (type tabs + structural category pills).

## Boverket API Integration

- REST API returning JSON with ~200 generic building products
- Materials mapped to LCAx `GenericData` with GWP impact values per life cycle module
- Client-side fetching (public API, no keys needed)
- Cached in browser after first fetch
- User guides on exact endpoint structure during implementation

## Deployment

- **Frontend:** Static build via `vite build`, deployed to GitHub Pages
- **Domain:** CNAME record on one.com pointing subdomain to `<username>.github.io`
- **Backend:** Supabase hosted (free tier)
- **CI:** GitHub Actions builds and deploys on push to main

## Future Considerations (Out of Scope for MVP)

- Custom material entries (user-defined EPDs)
- Additional impact categories beyond GWP
- Assembly templates / presets
- Export to PDF / image
- Import/export LCAx JSON files
- Social features (comments, likes)
- Additional assembly types beyond wall/roof/floor
