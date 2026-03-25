import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToggleGroup from './ToggleGroup.vue'

const meta = {
  title: 'Atoms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { options: ['wall', 'roof', 'floor'], modelValue: 'wall', variant: 'primary' },
}

export const Secondary: Story = {
  args: { options: ['concrete', 'wood', 'steel', 'hybrid'], modelValue: 'concrete', variant: 'secondary', size: 'sm' },
}
