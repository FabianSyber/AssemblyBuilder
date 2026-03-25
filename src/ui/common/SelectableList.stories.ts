import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SelectableList from './SelectableList.vue'

const sampleItems = [
  { id: '1', name: 'Green Wall', subtitle: 'Alice', value: 12.5, rank: 1 },
  { id: '2', name: 'Eco Roof', subtitle: 'Bob', value: 18.3, rank: 2 },
  { id: '3', name: 'Concrete Wall', subtitle: 'Carol', value: 57.2, rank: 3 },
]

const meta = {
  title: 'Building Blocks/SelectableList',
  component: SelectableList,
  tags: ['autodocs'],
} satisfies Meta<typeof SelectableList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: sampleItems,
    selectedId: '2',
  },
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
        <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ item.value.toFixed(2) }}</span>
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
      <template #empty>Nothing here yet.</template>
    </SelectableList>`,
  }),
}
