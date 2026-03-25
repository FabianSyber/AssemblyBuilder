import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import AssemblyLayer from './AssemblyLayer.vue'
import HatchPattern from '../hatches/HatchPattern.vue'

const Wrapper = defineComponent({
  props: { hatchType: String, fillOverride: String },
  setup(props) {
    return () => h('svg', { width: 300, height: 80, xmlns: 'http://www.w3.org/2000/svg', style: 'background:rgba(20,15,35,0.95)' }, [
      h('defs', {}, [h(HatchPattern, { type: props.hatchType ?? 'concrete' })]),
      h(AssemblyLayer, { hatchType: props.hatchType ?? 'concrete', fillOverride: props.fillOverride, thicknessMm: 120, x: 10, y: 10, width: 280, height: 60, scalePixelsPerMm: 0.6 }),
    ])
  },
})

const meta = {
  title: 'Building Blocks/AssemblyLayer',
  component: Wrapper,
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Concrete: Story = { args: { hatchType: 'concrete' } }
export const Wood: Story = { args: { hatchType: 'wood' } }
export const Insulation: Story = { args: { hatchType: 'insulation' } }
export const SolidOverride: Story = { args: { hatchType: 'concrete', fillOverride: '#ec70a0' } }
