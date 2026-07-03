import type { AssemblyType, StructuralCategory } from '../types/assembly'
import type { BoverketMaterial } from '../types/material'

/** A single baseline layer, resolved against whatever material catalog is loaded. */
export interface ChallengeLayerSpec {
  role: string
  hatchType: string
  /** Preferred material id (fallback-data ids); used if present in the catalog. */
  preferId?: string
  /** Name substring to prefer within the hatch type when preferId is absent. */
  preferName?: string
  thicknessMm: number
}

export interface Challenge {
  id: string
  name: string
  tagline: string
  intro: string
  assemblyType: AssemblyType
  structuralCategory: StructuralCategory
  baseline: ChallengeLayerSpec[]
  /** Pass when current GWP <= baseline GWP * targetRatio. */
  targetRatio: number
  /** Ordered hints; the LAST entry is shown on success. */
  hints: string[]
  successMessage: string
  achievementId?: string
}

export interface ResolvedLayer {
  materialId: string
  materialName: string
  hatchType: string
  thicknessMm: number
}

export const challenges: Challenge[] = [
  {
    id: 'halve-wall',
    name: 'Halve the Wall',
    tagline: 'Cut a code-typical concrete wall’s carbon in half',
    intro:
      'Here’s a standard concrete exterior wall. Your mission: redesign it to emit less than half the carbon — without deleting the wall. Swap materials, change thicknesses, and watch the number drop.',
    assemblyType: 'wall',
    structuralCategory: 'concrete',
    baseline: [
      { role: 'Structure', hatchType: 'concrete', preferName: 'concrete c30', thicknessMm: 200 },
      { role: 'Insulation', hatchType: 'insulation', preferName: 'eps', thicknessMm: 100 },
      { role: 'Interior lining', hatchType: 'gypsum', preferName: 'gypsum board', thicknessMm: 13 },
    ],
    targetRatio: 0.5,
    hints: [
      'The concrete structure dominates this wall’s footprint. What if the load-bearing layer were timber-based — CLT, glulam or structural timber?',
      'Great progress. Notice timber can even show a negative GWP: it stores biogenic carbon. And see how little the insulation choice moves the total compared to the structure.',
      'Target smashed! You halved this wall’s embodied carbon by rethinking its structure — the single biggest lever in most assemblies.',
    ],
    successMessage:
      'You cut the wall’s embodied carbon in half. Structure is almost always the biggest lever — keep that in mind on real projects.',
    achievementId: 'carbon-cutter',
  },
]

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}

/** Resolve a challenge's baseline specs to concrete materials from the loaded catalog. */
export function resolveBaseline(challenge: Challenge, materials: BoverketMaterial[]): ResolvedLayer[] {
  const resolved: ResolvedLayer[] = []
  for (const spec of challenge.baseline) {
    let m: BoverketMaterial | undefined
    if (spec.preferId) m = materials.find((x) => x.id === spec.preferId)
    if (!m && spec.preferName) {
      const n = spec.preferName.toLowerCase()
      m = materials.find(
        (x) =>
          x.hatchType === spec.hatchType &&
          (x.nameEn.toLowerCase().includes(n) || x.name.toLowerCase().includes(n)),
      )
    }
    if (!m) m = materials.find((x) => x.hatchType === spec.hatchType)
    if (!m) continue
    resolved.push({
      materialId: m.id,
      materialName: m.nameEn,
      hatchType: m.hatchType,
      thicknessMm: spec.thicknessMm,
    })
  }
  return resolved
}
