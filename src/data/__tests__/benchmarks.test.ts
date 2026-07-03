import { describe, it, expect } from 'vitest'
import {
  bandFor,
  allocatedElementTarget,
  ELEMENT_SHARE,
  AREA_PER_BTA,
  BUILDING_TARGETS,
} from '../benchmarks'

describe('bandFor', () => {
  it('classifies a wall by its indicative band', () => {
    expect(bandFor('wall', 10)).toBe('low')
    expect(bandFor('wall', 40)).toBe('typical')
    expect(bandFor('wall', 90)).toBe('heavy')
  })

  it('treats negative (biogenic) GWP as low-carbon', () => {
    expect(bandFor('wall', -20)).toBe('low')
  })
})

describe('allocatedElementTarget', () => {
  it('splits the building budget by element share and area ratio', () => {
    // 375 * 0.089 / 0.7 ≈ 47.7 for a wall
    const wall = allocatedElementTarget(375, 'wall')
    expect(wall).toBeCloseTo((375 * ELEMENT_SHARE.wall) / AREA_PER_BTA.wall, 5)
    expect(wall).toBeGreaterThan(40)
    expect(wall).toBeLessThan(55)
  })

  it('makes the floor (heaviest part) the largest allocation', () => {
    expect(allocatedElementTarget(375, 'floor')).toBeGreaterThan(allocatedElementTarget(375, 'wall'))
    expect(allocatedElementTarget(375, 'floor')).toBeGreaterThan(allocatedElementTarget(375, 'roof'))
  })

  it('scales inversely with the area-per-BTA ratio', () => {
    const base = allocatedElementTarget(375, 'roof', 0.3)
    const doubled = allocatedElementTarget(375, 'roof', 0.6)
    expect(doubled).toBeCloseTo(base / 2, 5)
  })

  it('guards against a zero area ratio', () => {
    expect(allocatedElementTarget(375, 'wall', 0)).toBe(0)
  })
})

describe('BUILDING_TARGETS', () => {
  it('includes the gränsvärde and both Miljöbyggnad levels', () => {
    const ids = BUILDING_TARGETS.map((t) => t.id)
    expect(ids).toEqual(expect.arrayContaining(['gransvarde', 'mb-silver', 'mb-guld']))
  })
})
