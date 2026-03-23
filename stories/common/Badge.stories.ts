import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '../../src/ui/common/Badge.vue'

const meta: Meta<typeof Badge> = {
  title: 'Common/Badge',
  component: Badge,
  argTypes: {
    color: { control: 'select', options: ['pink', 'lavender', 'mint', 'blue', 'peach'] },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Wall: Story = { args: { label: 'Wall', color: 'lavender' } }
export const Wood: Story = { args: { label: 'Wood', color: 'mint' } }
export const Concrete: Story = { args: { label: 'Concrete', color: 'blue' } }
