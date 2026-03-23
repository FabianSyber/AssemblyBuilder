import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AssemblyCrossSection from '../AssemblyCrossSection.vue'

const sampleLayers = [
  { id: 'l1', name: 'Concrete', hatchType: 'concrete', thicknessMm: 200, gwp: 15.0 },
  { id: 'l2', name: 'Insulation', hatchType: 'insulation', thicknessMm: 100, gwp: 3.2 },
  { id: 'l3', name: 'Gypsum Board', hatchType: 'gypsum', thicknessMm: 12, gwp: 1.1 },
]

describe('AssemblyCrossSection', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(AssemblyCrossSection, {
      props: { layers: sampleLayers, title: 'Test Wall', subtitle: 'Section A' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })
  it('renders correct number of layer groups by data-layer-id', () => {
    const wrapper = mount(AssemblyCrossSection, {
      props: { layers: sampleLayers, title: 'Test Wall', subtitle: 'Section A' },
    })
    const layerGroups = wrapper.findAll('[data-layer-id]')
    expect(layerGroups.length).toBe(sampleLayers.length)
  })
  it('renders the title text', () => {
    const wrapper = mount(AssemblyCrossSection, {
      props: { layers: sampleLayers, title: 'My Assembly', subtitle: 'Detail 1' },
    })
    expect(wrapper.text()).toContain('My Assembly')
  })
  it('handles empty layers array gracefully', () => {
    const wrapper = mount(AssemblyCrossSection, {
      props: { layers: [], title: 'Empty', subtitle: '' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('[data-layer-id]').length).toBe(0)
  })
})
