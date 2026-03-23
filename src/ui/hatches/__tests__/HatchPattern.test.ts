import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HatchPattern from '../HatchPattern.vue'

describe('HatchPattern', () => {
  it('renders an SVG pattern element with correct id', () => {
    const wrapper = mount(HatchPattern, { props: { type: 'concrete' } })
    const pattern = wrapper.find('pattern')
    expect(pattern.exists()).toBe(true)
    expect(pattern.attributes('id')).toBe('hatch-concrete')
  })
  it('renders SVG content inside pattern', () => {
    const wrapper = mount(HatchPattern, { props: { type: 'insulation' } })
    const pattern = wrapper.find('pattern')
    expect(pattern.html()).toContain('path')
  })
})
