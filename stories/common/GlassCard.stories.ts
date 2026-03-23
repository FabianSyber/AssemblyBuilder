import type { Meta, StoryObj } from '@storybook/vue3'
import GlassCard from '../../src/ui/common/GlassCard.vue'

const meta: Meta<typeof GlassCard> = {
  title: 'Common/GlassCard',
  component: GlassCard,
}
export default meta

type Story = StoryObj<typeof GlassCard>

export const Default: Story = {
  render: () => ({
    components: { GlassCard },
    template: `
      <div style="background: #ede7f6; padding: 32px;">
        <GlassCard>
          <h3 style="font-family: var(--font-heading); font-weight: 700;">Card Title</h3>
          <p style="font-family: var(--font-body); color: #666;">Some content here</p>
        </GlassCard>
      </div>
    `,
  }),
}
