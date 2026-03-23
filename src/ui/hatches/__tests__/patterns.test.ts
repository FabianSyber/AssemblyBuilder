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
