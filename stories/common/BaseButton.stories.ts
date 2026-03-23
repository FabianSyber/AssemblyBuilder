import type { Meta, StoryObj } from '@storybook/vue3'
import BaseButton from '../../src/ui/common/BaseButton.vue'

const meta: Meta<typeof BaseButton> = {
  title: 'Common/BaseButton',
  component: BaseButton,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
  },
}
export default meta

type Story = StoryObj<typeof BaseButton>

export const Primary: Story = { args: { label: 'Start Building', variant: 'primary' } }
export const Secondary: Story = { args: { label: 'Compare', variant: 'secondary' } }
export const Ghost: Story = { args: { label: 'Cancel', variant: 'ghost' } }
