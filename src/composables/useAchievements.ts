import { ref } from 'vue'
import type { Assembly } from '../types/assembly'
import type { BoverketMaterial } from '../types/material'
import type { AchievementDef, AchievementState } from '../types/achievement'

const LOCAL_KEY = 'ab-achievements'

function loadState(): AchievementState {
  const raw = localStorage.getItem(LOCAL_KEY)
  return raw ? JSON.parse(raw) : {}
}

function saveState(s: AchievementState) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(s))
}

export interface Stamp {
  icon: string
  color: string
  name: string
}

// --- Achievement Definitions ---

export const achievements: AchievementDef[] = [
  // GWP
  {
    id: 'the-minimalist', name: 'The Minimalist',
    description: 'Build a wall under 5 kgCO₂e/m²', hint: 'Build something light...',
    icon: '🌱', stamp: { icon: '●', color: 'var(--color-mint)' }, category: 'gwp',
    check: (aa) => aa.some(a => a.assemblyType === 'wall' && a.totalGwp > 0 && a.totalGwp < 5),
    qualifiesAssembly: (a) => a.assemblyType === 'wall' && a.totalGwp > 0 && a.totalGwp < 5,
  },
  {
    id: 'light-roof', name: 'Light Roof',
    description: 'Build a roof under 8 kgCO₂e/m²', hint: 'Roofs can be light too...',
    icon: '☁️', stamp: { icon: '○', color: 'var(--color-blue)' }, category: 'gwp',
    check: (aa) => aa.some(a => a.assemblyType === 'roof' && a.totalGwp > 0 && a.totalGwp < 8),
    qualifiesAssembly: (a) => a.assemblyType === 'roof' && a.totalGwp > 0 && a.totalGwp < 8,
  },
  {
    id: 'featherweight', name: 'Featherweight',
    description: 'Any assembly under 3 kgCO₂e/m²', hint: 'Go ultra-light...',
    icon: '🪶', stamp: { icon: '◇', color: 'var(--color-mint)' }, category: 'gwp',
    check: (aa) => aa.some(a => a.totalGwp > 0 && a.totalGwp < 3),
    qualifiesAssembly: (a) => a.totalGwp > 0 && a.totalGwp < 3,
  },
  {
    id: 'light-floor', name: 'Light Floor',
    description: 'Build a floor under 10 kgCO₂e/m²', hint: 'Floors need not be heavy...',
    icon: '🍃', stamp: { icon: '●', color: 'var(--color-mint)' }, category: 'gwp',
    check: (aa) => aa.some(a => a.assemblyType === 'floor' && a.totalGwp > 0 && a.totalGwp < 10),
    qualifiesAssembly: (a) => a.assemblyType === 'floor' && a.totalGwp > 0 && a.totalGwp < 10,
  },
  {
    id: 'heavyweight', name: 'Heavyweight',
    description: 'Build an assembly over 20 kgCO₂e/m²', hint: 'Some builds are meant to be heavy...',
    icon: '⚓', stamp: { icon: '■', color: 'var(--color-purple-light)' }, category: 'gwp',
    check: (aa) => aa.some(a => a.totalGwp > 20),
    qualifiesAssembly: (a) => a.totalGwp > 20,
  },

  // Creativity
  {
    id: 'layer-cake', name: 'Layer Cake',
    description: '8+ layers in one assembly', hint: 'Keep stacking...',
    icon: '🍰', stamp: { icon: '≡', color: 'var(--color-peach)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.length >= 8),
    qualifiesAssembly: (a) => a.layers.length >= 8,
  },
  {
    id: 'solid-foundation', name: 'Solid Foundation',
    description: 'Build an assembly with 2+ layers', hint: 'Stack them up...',
    icon: '🧱', stamp: { icon: '▤', color: 'var(--color-lavender)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.length >= 2),
    qualifiesAssembly: (a) => a.layers.length >= 2,
  },
  {
    id: 'wafer-thin', name: 'Wafer Thin',
    description: 'Assembly with total thickness under 50mm', hint: 'Thin is in...',
    icon: '📄', stamp: { icon: '─', color: 'var(--color-blue)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.length > 0 && a.layers.reduce((s, l) => s + l.thicknessMm, 0) < 50),
    qualifiesAssembly: (a) => a.layers.length > 0 && a.layers.reduce((s, l) => s + l.thicknessMm, 0) < 50,
  },
  {
    id: 'the-wall', name: 'The Wall',
    description: 'Assembly with total thickness over 500mm', hint: 'Go big...',
    icon: '🧱', stamp: { icon: '█', color: 'var(--color-purple-light)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.reduce((s, l) => s + l.thicknessMm, 0) > 500),
    qualifiesAssembly: (a) => a.layers.reduce((s, l) => s + l.thicknessMm, 0) > 500,
  },
  {
    id: 'thick-build', name: 'Thick Build',
    description: 'Assembly over 200mm total thickness', hint: 'Build it thick...',
    icon: '📐', stamp: { icon: '▮', color: 'var(--color-peach)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.reduce((s, l) => s + l.thicknessMm, 0) > 200),
    qualifiesAssembly: (a) => a.layers.reduce((s, l) => s + l.thicknessMm, 0) > 200,
  },
  {
    id: 'monolith', name: 'Monolith',
    description: 'Build a single-layer assembly', hint: 'Sometimes less is more...',
    icon: '🗿', stamp: { icon: '◆', color: 'var(--color-purple)' }, category: 'creativity',
    check: (aa) => aa.some(a => a.layers.length === 1),
    qualifiesAssembly: (a) => a.layers.length === 1,
  },
  {
    id: 'rainbow', name: 'Rainbow',
    description: '5+ different material categories in one assembly', hint: 'Mix it up...',
    icon: '🌈', stamp: { icon: '◉', color: 'var(--color-rose)' }, category: 'creativity',
    check: (aa, mats) => aa.some(a => {
      const types = new Set(a.layers.map(l => mats.find(m => m.id === l.materialId)?.hatchType).filter(Boolean))
      return types.size >= 5
    }),
    qualifiesAssembly: (a, mats) => {
      const types = new Set(a.layers.map(l => mats.find(m => m.id === l.materialId)?.hatchType).filter(Boolean))
      return types.size >= 5
    },
  },

  // Mastery
  {
    id: 'triple-threat', name: 'Triple Threat',
    description: 'Build at least one wall, roof, and floor', hint: 'Try every type...',
    icon: '🏗️', stamp: { icon: '△', color: 'var(--color-rose)' }, category: 'mastery',
    check: (aa) => {
      const types = new Set(aa.map(a => a.assemblyType))
      return types.has('wall') && types.has('roof') && types.has('floor')
    },
    qualifiesAssembly: (a, _mats) => ['wall', 'roof', 'floor'].includes(a.assemblyType),
  },
  {
    id: 'woodworker', name: 'Woodworker',
    description: 'Use every wood material across your builds', hint: 'Explore the timber aisle...',
    icon: '🪵', category: 'mastery',
    check: (aa, mats) => {
      const woodMats = mats.filter(m => m.hatchType === 'wood')
      const usedIds = new Set(aa.flatMap(a => a.layers.map(l => l.materialId)))
      return woodMats.length > 0 && woodMats.every(m => usedIds.has(m.id))
    },
  },
  {
    id: 'material-scholar', name: 'Material Scholar',
    description: 'Use 25+ unique materials across your builds', hint: 'Keep experimenting...',
    icon: '📚', category: 'mastery',
    check: (aa) => {
      const usedIds = new Set(aa.flatMap(a => a.layers.map(l => l.materialId)))
      return usedIds.size >= 25
    },
  },
  {
    id: 'insulation-expert', name: 'Insulation Expert',
    description: 'Use every insulation material', hint: 'Wrap it up...',
    icon: '🧤', category: 'mastery',
    check: (aa, mats) => {
      const insulMats = mats.filter(m => m.hatchType === 'insulation')
      const usedIds = new Set(aa.flatMap(a => a.layers.map(l => l.materialId)))
      return insulMats.length > 0 && insulMats.every(m => usedIds.has(m.id))
    },
  },
  {
    id: 'full-catalog', name: 'Full Catalog',
    description: 'Use every material at least once', hint: 'Gotta catch them all...',
    icon: '🏆', category: 'mastery',
    check: (aa, mats) => {
      const usedIds = new Set(aa.flatMap(a => a.layers.map(l => l.materialId)))
      return mats.length > 0 && mats.every(m => usedIds.has(m.id))
    },
  },

  // Exploration
  {
    id: 'first-steps', name: 'First Steps',
    description: 'Create your first assembly', hint: 'Everyone starts somewhere...',
    icon: '👣', category: 'exploration',
    check: (aa) => aa.length >= 1,
  },
  {
    id: 'collector', name: 'Collector',
    description: 'Create 10 assemblies', hint: 'Keep building...',
    icon: '📦', category: 'exploration',
    check: (aa) => aa.length >= 10,
  },
  {
    id: 'prolific', name: 'Prolific',
    description: 'Create 25 assemblies', hint: 'You can\'t stop...',
    icon: '🏭', category: 'exploration',
    check: (aa) => aa.length >= 25,
  },
  {
    id: 'the-comparator', name: 'The Comparator',
    description: 'Use the side-by-side comparison feature', hint: 'Compare and contrast...',
    icon: '⚖️', category: 'exploration',
    check: () => false, // Unlocked via record('comparison'), not via evaluate
  },
]

// --- State (module-level singleton) ---

const state = ref<AchievementState>(loadState())
const recordedEvents = ref<Set<string>>(new Set())

export function useAchievements() {

  function evaluate(allAssemblies: Assembly[], materials: BoverketMaterial[]) {
    let changed = false
    for (const def of achievements) {
      if (state.value[def.id]) continue
      if (def.check(allAssemblies, materials)) {
        state.value[def.id] = { unlockedAt: new Date().toISOString(), seen: false }
        changed = true
      }
    }
    if (changed) {
      state.value = { ...state.value }
      saveState(state.value)
    }
  }

  function record(event: string) {
    recordedEvents.value.add(event)
    if (event === 'comparison' && !state.value['the-comparator']) {
      state.value = {
        ...state.value,
        'the-comparator': { unlockedAt: new Date().toISOString(), seen: false },
      }
      saveState(state.value)
    }
  }

  function getStampsForAssembly(assembly: Assembly, materials: BoverketMaterial[]): Stamp[] {
    const stamps: Stamp[] = []
    for (const def of achievements) {
      if (!def.stamp || !state.value[def.id] || !def.qualifiesAssembly) continue
      if (def.qualifiesAssembly(assembly, materials)) {
        stamps.push({ ...def.stamp, name: def.name })
      }
    }
    return stamps
  }

  function markAllSeen() {
    let changed = false
    for (const id of Object.keys(state.value)) {
      if (!state.value[id].seen) {
        state.value[id] = { ...state.value[id], seen: true }
        changed = true
      }
    }
    if (changed) {
      state.value = { ...state.value }
      saveState(state.value)
    }
  }

  function unlockedCount(): number {
    return Object.keys(state.value).length
  }

  return { state, achievements, evaluate, record, getStampsForAssembly, markAllSeen, unlockedCount }
}
