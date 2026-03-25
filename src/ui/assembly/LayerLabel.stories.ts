import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import LayerLabel from './LayerLabel.vue'

const Wrapper = defineComponent({
  props: { name: String },
  setup(props) {
    return () => h('svg', { width: 300, height: 80, xmlns: 'http://www.w3.org/2000/svg', style: 'background:rgba(20,15,35,0.95)' }, [
      h(LayerLabel, { name: props.name ?? 'Mineral Wool', thicknessMm: 120, gwp: 5.4, y: 40, x: 20 }),
    ])
  },
})

const meta = {
  title: 'Building Blocks/LayerLabel',
  component: Wrapper,
  tags: ['autodocs'],
} satisfies Meta<typeof Wrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Short: Story = { args: { name: 'Mineral Wool' } }
export const Long: Story = { args: { name: 'EPS expanded polystyrene insulation board' } }
