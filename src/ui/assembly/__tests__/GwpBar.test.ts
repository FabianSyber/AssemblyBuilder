import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GwpBar from '../GwpBar.vue'

describe('GwpBar', () => {
  it('renders the totalGwp value "31.4"', () => {
    const wrapper = mount(GwpBar, {
      props: { totalGwp: 31.4, x: 60, y: 400, width: 300 },
    })
    expect(wrapper.text()).toContain('31.4')
  })
  it('renders the unit label "kg CO₂e / m²"', () => {
    const wrapper = mount(GwpBar, {
      props: { totalGwp: 31.4, x: 60, y: 400, width: 300 },
    })
    expect(wrapper.text()).toContain('kg CO₂e / m²')
  })
  it('renders A1-A3 module tag', () => {
    const wrapper = mount(GwpBar, {
      props: { totalGwp: 10.0, x: 60, y: 200, width: 200 },
    })
    expect(wrapper.text()).toContain('A1-A3')
  })
})
