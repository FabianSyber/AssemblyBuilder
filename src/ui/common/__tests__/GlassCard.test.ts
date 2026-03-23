import { mount } from '@vue/test-utils'
import GlassCard from '../GlassCard.vue'

describe('GlassCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(GlassCard, {
      slots: { default: '<p>Hello</p>' },
    })
    expect(wrapper.text()).toContain('Hello')
  })

  it('applies glass-card class', () => {
    const wrapper = mount(GlassCard)
    expect(wrapper.classes()).toContain('glass-card')
  })
})
