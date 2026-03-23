import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders label', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton, { props: { label: 'Go' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies variant class', () => {
    const wrapper = mount(BaseButton, { props: { label: 'Go', variant: 'primary' } })
    expect(wrapper.classes()).toContain('btn-primary')
  })
})
