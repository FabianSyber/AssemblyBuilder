import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AssemblyLayer from '../AssemblyLayer.vue'

describe('AssemblyLayer', () => {
  it('calculates height as thicknessMm * scalePixelsPerMm', () => {
    const wrapper = mount(AssemblyLayer, {
      props: { hatchType: 'concrete', thicknessMm: 150, y: 0, width: 300, scalePixelsPerMm: 0.5 },
    })
    const rects = wrapper.findAll('rect')
    // height = 150 * 0.5 = 75
    expect(rects[0].attributes('height')).toBe('75')
  })
  it('renders at least 2 rect elements', () => {
    const wrapper = mount(AssemblyLayer, {
      props: { hatchType: 'wood', thicknessMm: 100, y: 10, width: 400, scalePixelsPerMm: 1 },
    })
    const rects = wrapper.findAll('rect')
    expect(rects.length).toBeGreaterThanOrEqual(2)
  })
  it('positions layer at correct y offset', () => {
    const wrapper = mount(AssemblyLayer, {
      props: { hatchType: 'steel', thicknessMm: 50, y: 20, width: 200, scalePixelsPerMm: 2 },
    })
    const rects = wrapper.findAll('rect')
    expect(rects[0].attributes('y')).toBe('20')
  })
})
