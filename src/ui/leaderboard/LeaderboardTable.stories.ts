import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SelectableList from '../common/SelectableList.vue'

const entries = [
  { id: '1', name: 'Green Wall', subtitle: 'Alice', totalGwp: 12.5, rank: 1 },
  { id: '2', name: 'Eco Roof', subtitle: 'Bob', totalGwp: 18.3, rank: 2 },
  { id: '3', name: 'Concrete Wall', subtitle: 'Carol', totalGwp: 57.2, rank: 3 },
]

const meta = {
  title: 'Composites/LeaderboardList',
  component: SelectableList,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectableList>

export default meta
type Story = StoryObj<typeof meta>

export const WithEntries: Story = {
  args: { items: entries, selectedId: '2' },
  render: (args) => ({
    components: { SelectableList },
    setup: () => ({ args }),
    template: `<SelectableList v-bind="args">
      <template #item="{ item }">
        <span class="font-mono text-lg font-bold text-[var(--color-purple)] w-8 text-center">{{ item.rank }}</span>
        <div class="flex-1">
          <p class="font-body text-sm font-semibold text-[var(--color-purple)]">{{ item.name }}</p>
          <p class="font-mono text-xs text-[var(--color-purple-light)]">{{ item.subtitle }}</p>
        </div>
        <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ item.totalGwp.toFixed(2) }}</span>
        <span class="font-mono text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
      </template>
    </SelectableList>`,
  }),
}

export const Empty: Story = {
  args: { items: [] },
  render: (args) => ({
    components: { SelectableList },
    setup: () => ({ args }),
    template: `<SelectableList v-bind="args">
      <template #item="{ item }">{{ item }}</template>
      <template #empty>No entries yet in this category.</template>
    </SelectableList>`,
  }),
}
