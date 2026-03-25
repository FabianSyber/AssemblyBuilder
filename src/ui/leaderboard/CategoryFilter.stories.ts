import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToggleGroup from '../common/ToggleGroup.vue'

const meta = {
  title: 'Composites/CategoryFilter',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const AssemblyTypes: Story = {
  args: { options: ['wall', 'roof', 'floor'], modelValue: 'wall', variant: 'primary' },
}

export const StructuralCategories: Story = {
  args: { options: ['concrete', 'wood', 'hybrid', 'steel', 'masonry', 'other'], modelValue: 'concrete', variant: 'secondary', size: 'sm' },
}
