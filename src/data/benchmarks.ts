import type { AssemblyType } from '../types/assembly'

/**
 * Benchmark & climate-target reference data.
 *
 * IMPORTANT SCOPE NOTE (this is the whole point of the feature):
 *  - An *assembly* number in this app is A1–A3, per m² of ELEMENT area.
 *  - A *building* target (gränsvärde, Miljöbyggnad) is A1–A5, per m² of gross
 *    floor area (BTA). They are different scopes AND different denominators.
 * We bridge them with an editable elemental split + area ratio, and we always
 * show the caveat. The defaults below are "typical" — adjust per project.
 */

// ── Assembly-level indicative bands ──────────────────────────────────────────
// A1–A3, kg CO₂e per m² of element area. INDICATIVE, not authoritative.
export type BandLevel = 'low' | 'typical' | 'heavy'
export interface Band {
  lowMax: number // ≤ this ⇒ low-carbon
  typicalMax: number // ≤ this ⇒ typical, else heavy
}
export const ASSEMBLY_BANDS: Record<AssemblyType, Band> = {
  wall: { lowMax: 15, typicalMax: 50 },
  roof: { lowMax: 20, typicalMax: 60 },
  floor: { lowMax: 25, typicalMax: 70 },
}

export function bandFor(type: AssemblyType, gwp: number): BandLevel {
  const b = ASSEMBLY_BANDS[type]
  if (gwp <= b.lowMax) return 'low'
  if (gwp <= b.typicalMax) return 'typical'
  return 'heavy'
}

// ── Whole-building climate targets ───────────────────────────────────────────
export interface BuildingTarget {
  id: string
  name: string
  value: number // kg CO₂e / m² BTA
  modules: string
  scope: string
  note: string
}
export const BUILDING_TARGETS: BuildingTarget[] = [
  {
    id: 'gransvarde',
    name: 'Boverket gränsvärde (proposed)',
    value: 375,
    modules: 'A1–A5',
    scope: 'Multi-family housing',
    note: 'Proposed upper-range limit (Kombohus reaches ~230). Not yet in force — realigned to the EU EPBD, now targeted ~2030; expanded declaration ~2028. To be tightened every 5 years.',
  },
  {
    id: 'mb-silver',
    name: 'Miljöbyggnad Silver',
    value: 220,
    modules: 'A1–A5',
    scope: 'per m² BTA',
    note: 'Formally ≈10% below the building-type median (relative metric); 220 used here as a typical absolute working value — edit per building type.',
  },
  {
    id: 'mb-guld',
    name: 'Miljöbyggnad Guld',
    value: 200,
    modules: 'A1–A5',
    scope: 'per m² BTA',
    note: 'Formally ≈20% below the building-type median (15% for småhus); 200 used here as a typical absolute working value.',
  },
]

// ── Elemental allocation (editable) ──────────────────────────────────────────
// Share of WHOLE-BUILDING A1–A5 total per element, derived from a real Plant LCA
// model (concrete/steel building, per-byggdel breakdown ÷ 354 kg/m² BTA total).
// The app's three assemblies map to: floor≈mellanbjälklag, wall≈exterior walls,
// roof≈yttertak. Heavy parts the app can't model separately (interior load-bearing
// walls, foundation, columns) and installations/transport/waste live in the rest.
// Sums to ~1.0. Edit per project.
export const ELEMENT_SHARE: Record<string, number> = {
  floor: 0.24, // mellanbjälklag — heaviest single part (84.8 kg/m²)
  structure: 0.153, // interior load-bearing walls + columns (44.9 + 9.1)
  wall: 0.089, // exterior walls above + below grade (14.6 + 10.6 + 6.3)
  foundation: 0.075, // slabs + other foundation (18.5 + 8.0)
  interior: 0.038, // non-load-bearing interior walls (13.4)
  roof: 0.027, // yttertak (9.6)
  windows: 0.02, // exterior windows (7.0)
  balcony: 0.019, // balconies (6.8)
  stairs: 0.01, // stairs + doors (3.7)
  other: 0.33, // installations, transport (A4), waste (A5)
}

// Element m² per m² BTA — how much of this element exists per m² BTA.
// From the mängd formulas: floor ≈ (N−1)/N, roof ≈ 1/N; here at ~mid-rise.
// Highly form-/storey-dependent; editable in the panel.
export const AREA_PER_BTA: Record<AssemblyType, number> = {
  wall: 0.7,
  roof: 0.2,
  floor: 0.8,
}

/**
 * Translate a whole-building budget into a per-assembly target the app can
 * compare against (kg CO₂e per m² of element area).
 */
export function allocatedElementTarget(
  buildingValue: number,
  type: AssemblyType,
  areaPerBta: number = AREA_PER_BTA[type],
): number {
  if (areaPerBta <= 0) return 0
  return (buildingValue * (ELEMENT_SHARE[type] ?? 0)) / areaPerBta
}
