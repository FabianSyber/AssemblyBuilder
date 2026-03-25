import type { Meta, StoryObj } from '@storybook/vue3-vite'
import GlassCard from './GlassCard.vue'

const meta = {
  title: 'Atoms/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
} satisfies Meta<typeof GlassCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { GlassCard },
    template: `<GlassCard class="p-6" style="max-width:320px">
      <h3 style="font-weight:600;margin-bottom:8px">Card Title</h3>
      <p style="font-size:14px;color:#6b4c7a">Some content inside a glass card with the offset shadow.</p>
    </GlassCard>`,
  }),
}
