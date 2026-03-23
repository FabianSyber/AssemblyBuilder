import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DimensionLine from '../DimensionLine.vue'

describe('DimensionLine', () => {
  it('renders text containing the label', () => {
    const wrapper = mount(DimensionLine, {
      props: { y1: 0, y2: 100, x: 50, label: '200mm' },
    })
    expect(wrapper.text()).toContain('200mm')
  })
  it('renders 3 or more line elements', () => {
    const wrapper = mount(DimensionLine, {
      props: { y1: 10, y2: 110, x: 40, label: '150mm' },
    })
    const lines = wrapper.findAll('line')
    expect(lines.length).toBeGreaterThanOrEqual(3)
  })
  it('uses the provided x position', () => {
    const wrapper = mount(DimensionLine, {
      props: { y1: 0, y2: 80, x: 60, label: '80mm' },
    })
    const lines = wrapper.findAll('line')
    // At least one line should reference x=60
    const hasX = lines.some(l => l.attributes('x1') === '60' || l.attributes('x2') === '60')
    expect(hasX).toBe(true)
  })
})
