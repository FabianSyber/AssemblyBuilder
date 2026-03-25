import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import GwpBar from './GwpBar.vue'

const Wrapper = defineComponent({
  props: { totalGwp: Number },
  setup(props) {
    return () => h('svg', { width: 400, height: 70, xmlns: 'http://www.w3.org/2000/svg', style: 'background:rgba(20,15,35,0.95)' }, [
      h(GwpBar, { totalGwp: props.totalGwp ?? 42.5, y: 10, x: 20, width: 360 }),
    ])
  },
})

const meta = {
  title: 'Building Blocks/GwpBar',
  component: Wrapper,
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { totalGwp: 42.5 } }
export const Low: Story = { args: { totalGwp: 8.2 } }
export const High: Story = { args: { totalGwp: 156.3 } }
