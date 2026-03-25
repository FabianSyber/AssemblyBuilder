import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Atoms/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
  },
} satisfies Meta<typeof BaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { label: 'Save Assembly', variant: 'primary' },
}

export const Secondary: Story = {
  args: { label: 'Compare', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { label: '← Back', variant: 'ghost' },
}
