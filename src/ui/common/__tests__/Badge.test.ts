import { mount } from '@vue/test-utils'
import Badge from '../Badge.vue'

describe('Badge', () => {
  it('renders label text', () => {
    const wrapper = mount(Badge, { props: { label: 'Wall' } })
    expect(wrapper.text()).toContain('Wall')
  })

  it('applies color variant', () => {
    const wrapper = mount(Badge, { props: { label: 'Wood', color: 'mint' } })
    expect(wrapper.classes()).toContain('badge-mint')
  })
})
