import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('no network in tests'))))

let useAchievements: typeof import('../useAchievements')['useAchievements']
let useBoverket: typeof import('../useBoverket')['useBoverket']

beforeEach(async () => {
  vi.resetModules()
  localStorage.clear()
  const bvk = await import('../useBoverket')
  useBoverket = bvk.useBoverket
  const { fetchMaterials } = useBoverket()
  await fetchMaterials(true)
  const mod = await import('../useAchievements')
  useAchievements = mod.useAchievements
})

describe('useAchievements', () => {
  it('starts with empty state', () => {
    const { state } = useAchievements()
    expect(Object.keys(state.value)).toHaveLength(0)
  })

  it('returns all achievement definitions', () => {
    const { achievements } = useAchievements()
    expect(achievements.length).toBeGreaterThan(0)
    for (const a of achievements) {
      expect(a.id).toBeTruthy()
      expect(a.check).toBeInstanceOf(Function)
    }
  })

  it('unlocks "first-steps" when evaluating with one assembly', () => {
    const { evaluate, state } = useAchievements()
    const { materials } = useBoverket()
    evaluate([{
      id: '1', userId: '', name: 'Test', assemblyType: 'wall',
      structuralCategory: 'concrete', layers: [
        { id: 'l1', materialId: 'bvk-concrete-c30', materialName: 'Concrete',
          hatchType: 'concrete', thicknessMm: 150, gwpPerM2: 42 }
      ],
      totalGwp: 42, isPublic: false, createdAt: '', updatedAt: '',
    }], materials.value)
    expect(state.value['first-steps']).toBeDefined()
    expect(state.value['first-steps'].seen).toBe(false)
  })

  it('persists state to localStorage', () => {
    const { evaluate } = useAchievements()
    const { materials } = useBoverket()
    evaluate([{
      id: '1', userId: '', name: 'Test', assemblyType: 'wall',
      structuralCategory: 'concrete', layers: [], totalGwp: 0,
      isPublic: false, createdAt: '', updatedAt: '',
    }], materials.value)
    const raw = localStorage.getItem('ab-achievements')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(parsed['first-steps']).toBeDefined()
  })

  it('does not revoke previously unlocked achievements', () => {
    const { evaluate, state } = useAchievements()
    const { materials } = useBoverket()
    const assembly = {
      id: '1', userId: '', name: 'Test', assemblyType: 'wall' as const,
      structuralCategory: 'concrete' as const, layers: [],
      totalGwp: 0, isPublic: false, createdAt: '', updatedAt: '',
    }
    evaluate([assembly], materials.value)
    expect(state.value['first-steps']).toBeDefined()
    evaluate([], materials.value)
    expect(state.value['first-steps']).toBeDefined()
  })

  it('records non-save events like comparison', () => {
    const { record, state } = useAchievements()
    record('comparison')
    expect(state.value['the-comparator']).toBeDefined()
  })

  it('marks achievements as seen', () => {
    const { evaluate, markAllSeen, state } = useAchievements()
    const { materials } = useBoverket()
    evaluate([{
      id: '1', userId: '', name: 'T', assemblyType: 'wall',
      structuralCategory: 'concrete', layers: [], totalGwp: 0,
      isPublic: false, createdAt: '', updatedAt: '',
    }], materials.value)
    expect(state.value['first-steps'].seen).toBe(false)
    markAllSeen()
    expect(state.value['first-steps'].seen).toBe(true)
  })

  describe('GWP achievements', () => {
    it('unlocks "the-minimalist" for a wall under 5 GWP', () => {
      const { evaluate, state } = useAchievements()
      const { materials } = useBoverket()
      evaluate([{
        id: '1', userId: '', name: 'Light Wall', assemblyType: 'wall',
        structuralCategory: 'wood', layers: [
          { id: 'l1', materialId: 'bvk-wood-clt', materialName: 'CLT',
            hatchType: 'wood', thicknessMm: 100, gwpPerM2: 4 }
        ],
        totalGwp: 4, isPublic: false, createdAt: '', updatedAt: '',
      }], materials.value)
      expect(state.value['the-minimalist']).toBeDefined()
    })

    it('does NOT unlock "the-minimalist" for a wall with 0 GWP', () => {
      const { evaluate, state } = useAchievements()
      const { materials } = useBoverket()
      evaluate([{
        id: '1', userId: '', name: 'Empty', assemblyType: 'wall',
        structuralCategory: 'wood', layers: [], totalGwp: 0,
        isPublic: false, createdAt: '', updatedAt: '',
      }], materials.value)
      expect(state.value['the-minimalist']).toBeUndefined()
    })

    it('unlocks "featherweight" for any assembly under 3 GWP', () => {
      const { evaluate, state } = useAchievements()
      const { materials } = useBoverket()
      evaluate([{
        id: '1', userId: '', name: 'Ultra Light', assemblyType: 'roof',
        structuralCategory: 'wood', layers: [
          { id: 'l1', materialId: 'bvk-wood-clt', materialName: 'CLT',
            hatchType: 'wood', thicknessMm: 50, gwpPerM2: 2 }
        ],
        totalGwp: 2, isPublic: false, createdAt: '', updatedAt: '',
      }], materials.value)
      expect(state.value['featherweight']).toBeDefined()
    })
  })

  describe('Creativity achievements', () => {
    it('unlocks "layer-cake" for 8+ layers', () => {
      const { evaluate, state } = useAchievements()
      const { materials } = useBoverket()
      const layers = Array.from({ length: 8 }, (_, i) => ({
        id: `l${i}`, materialId: 'bvk-concrete-c30', materialName: 'Concrete',
        hatchType: 'concrete', thicknessMm: 50, gwpPerM2: 14,
      }))
      evaluate([{
        id: '1', userId: '', name: 'Cake', assemblyType: 'wall',
        structuralCategory: 'concrete', layers, totalGwp: 112,
        isPublic: false, createdAt: '', updatedAt: '',
      }], materials.value)
      expect(state.value['layer-cake']).toBeDefined()
    })

    it('unlocks "monolith" for single-layer assembly', () => {
      const { evaluate, state } = useAchievements()
      const { materials } = useBoverket()
      evaluate([{
        id: '1', userId: '', name: 'Mono', assemblyType: 'wall',
        structuralCategory: 'concrete', layers: [
          { id: 'l1', materialId: 'bvk-concrete-c30', materialName: 'Concrete',
            hatchType: 'concrete', thicknessMm: 200, gwpPerM2: 56 }
        ],
        totalGwp: 56, isPublic: false, createdAt: '', updatedAt: '',
      }], materials.value)
      expect(state.value['monolith']).toBeDefined()
    })
  })

  describe('getStampsForAssembly', () => {
    it('returns stamps only for qualifying assemblies', () => {
      const { evaluate, getStampsForAssembly } = useAchievements()
      const { materials } = useBoverket()
      const lightWall = {
        id: '1', userId: '', name: 'Light Wall', assemblyType: 'wall' as const,
        structuralCategory: 'wood' as const, layers: [
          { id: 'l1', materialId: 'bvk-wood-clt', materialName: 'CLT',
            hatchType: 'wood', thicknessMm: 100, gwpPerM2: 4 }
        ],
        totalGwp: 4, isPublic: false, createdAt: '', updatedAt: '',
      }
      const heavyWall = {
        id: '2', userId: '', name: 'Heavy Wall', assemblyType: 'wall' as const,
        structuralCategory: 'concrete' as const, layers: [
          { id: 'l1', materialId: 'bvk-concrete-c30', materialName: 'Concrete',
            hatchType: 'concrete', thicknessMm: 300, gwpPerM2: 84 }
        ],
        totalGwp: 84, isPublic: false, createdAt: '', updatedAt: '',
      }
      evaluate([lightWall, heavyWall], materials.value)
      const lightStamps = getStampsForAssembly(lightWall, materials.value)
      const heavyStamps = getStampsForAssembly(heavyWall, materials.value)
      expect(lightStamps).toContain('🌱')
      expect(heavyStamps).not.toContain('🌱')
    })

    it('returns empty array when no stamps qualify', () => {
      const { getStampsForAssembly } = useAchievements()
      const { materials } = useBoverket()
      const assembly = {
        id: '1', userId: '', name: 'X', assemblyType: 'wall' as const,
        structuralCategory: 'concrete' as const, layers: [],
        totalGwp: 50, isPublic: false, createdAt: '', updatedAt: '',
      }
      expect(getStampsForAssembly(assembly, materials.value)).toEqual([])
    })
  })
})
