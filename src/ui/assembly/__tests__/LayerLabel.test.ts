import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LayerLabel from '../LayerLabel.vue'

describe('LayerLabel', () => {
  it('renders the layer name', () => {
    const wrapper = mount(LayerLabel, {
      props: { name: 'Concrete Slab', thicknessMm: 150, gwp: 18.2, y: 20, x: 300 },
    })
    expect(wrapper.text()).toContain('Concrete Slab')
  })
  it('renders thickness as "150mm"', () => {
    const wrapper = mount(LayerLabel, {
      props: { name: 'Insulation', thicknessMm: 150, gwp: 18.2, y: 0, x: 300 },
    })
    expect(wrapper.text()).toContain('150mm')
  })
  it('renders gwp value "18.2"', () => {
    const wrapper = mount(LayerLabel, {
      props: { name: 'Wood Panel', thicknessMm: 100, gwp: 18.2, y: 0, x: 300 },
    })
    expect(wrapper.text()).toContain('18.2')
  })
})
