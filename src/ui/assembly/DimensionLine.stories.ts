import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import DimensionLine from './DimensionLine.vue'

const Wrapper = defineComponent({
  props: { thicknessMm: Number },
  setup(props) {
    const mm = props.thicknessMm ?? 150
    return () => h('svg', { width: 100, height: mm * 0.6 + 20, xmlns: 'http://www.w3.org/2000/svg', style: 'background:rgba(20,15,35,0.95)' }, [
      h(DimensionLine, { y1: 10, y2: 10 + mm * 0.6, x: 40, label: `${mm}mm`, thicknessMm: mm }),
    ])
  },
})

const meta = {
  title: 'Building Blocks/DimensionLine',
  component: Wrapper,
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Normal: Story = { args: { thicknessMm: 150 } }
export const Thin: Story = { args: { thicknessMm: 15 } }
