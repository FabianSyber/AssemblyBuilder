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
    const gwp = calcGwpPerM2('bvk-concrete-c30', 150)
    expect(gwp).toBeCloseTo(42, 0)
  })
  it('calculates GWP per m2 for area-based material', () => {
    const { calcGwpPerM2 } = useBoverket()
    const gwp = calcGwpPerM2('bvk-gypsum-board', 13)
    expect(gwp).toBeCloseTo(3.5, 1)
  })
  it('calculates GWP per m2 for mass-based material', () => {
    const { calcGwpPerM2 } = useBoverket()
    const gwp = calcGwpPerM2('bvk-steel-sheet', 1)
    expect(gwp).toBeCloseTo(21.98, 0)
  })
})
