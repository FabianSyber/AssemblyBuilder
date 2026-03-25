import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['pink', 'lavender', 'mint', 'blue', 'peach'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Lavender: Story = { args: { label: 'wall', color: 'lavender' } }
export const Mint: Story = { args: { label: 'wood', color: 'mint' } }
export const Pink: Story = { args: { label: 'concrete', color: 'pink' } }
export const Blue: Story = { args: { label: 'roof', color: 'blue' } }
export const Peach: Story = { args: { label: 'steel', color: 'peach' } }

export const AllColors: Story = {
  render: () => ({
    components: { Badge },
    template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
      <Badge label="pink" color="pink" />
      <Badge label="lavender" color="lavender" />
      <Badge label="mint" color="mint" />
      <Badge label="blue" color="blue" />
      <Badge label="peach" color="peach" />
    </div>`,
  }),
}
