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
})
