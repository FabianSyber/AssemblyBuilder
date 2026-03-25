import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch to reject so fallback data is used
vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('no network in tests'))))

// Re-import fresh module for each test
let useBoverket: typeof import('../useBoverket')['useBoverket']

beforeEach(async () => {
  vi.resetModules()
  const mod = await import('../useBoverket')
  useBoverket = mod.useBoverket
})

describe('useBoverket', () => {
  it('returns materials list', async () => {
    const { materials, fetchMaterials } = useBoverket()
    await fetchMaterials(true)
    expect(materials.value.length).toBeGreaterThan(0)
  })
  it('can search materials by name', async () => {
    const { searchMaterials, fetchMaterials } = useBoverket()
    await fetchMaterials(true)
    const results = searchMaterials('concrete')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].nameEn.toLowerCase()).toContain('concrete')
  })
  it('calculates GWP per m2 for volume-based material', async () => {
    const { calcGwpPerM2, fetchMaterials } = useBoverket()
    await fetchMaterials(true)
    const gwp = calcGwpPerM2('bvk-concrete-c30', 150)
    expect(gwp).toBeCloseTo(42, 0)
  })
  it('calculates GWP per m2 for area-based material', async () => {
    const { calcGwpPerM2, fetchMaterials } = useBoverket()
    await fetchMaterials(true)
    const gwp = calcGwpPerM2('bvk-gypsum-board', 13)
    expect(gwp).toBeCloseTo(3.5, 1)
  })
  it('calculates GWP per m2 for mass-based material', async () => {
    const { calcGwpPerM2, fetchMaterials } = useBoverket()
    await fetchMaterials(true)
    const gwp = calcGwpPerM2('bvk-steel-sheet', 1)
    expect(gwp).toBeCloseTo(21.98, 0)
  })
})
