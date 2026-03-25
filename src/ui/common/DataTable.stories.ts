import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from './DataTable.vue'

interface SampleRow {
  id: string
  name: string
  category: string
  value: number
}

const sampleData: SampleRow[] = [
  { id: '1', name: 'Concrete C30/37', category: 'Concrete', value: 0.117 },
  { id: '2', name: 'Mineral wool', category: 'Insulation', value: 0.89 },
  { id: '3', name: 'Structural timber', category: 'Timber', value: 0.064 },
  { id: '4', name: 'Gypsum board', category: 'Board', value: 0.27 },
  { id: '5', name: 'Steel sheet', category: 'Metal', value: 2.8 },
  { id: '6', name: 'EPS polystyrene', category: 'Insulation', value: 3.4 },
  { id: '7', name: 'Brick', category: 'Masonry', value: 0.24 },
  { id: '8', name: 'Vapor barrier PE', category: 'Membrane', value: 2.5 },
]

const sampleColumns: ColumnDef<SampleRow, any>[] = [
  { accessorKey: 'name', header: 'Name', cell: (info) => info.getValue() },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'value', header: 'Value', cell: (info) => h('span', { class: 'font-mono text-xs' }, `${Number(info.getValue()).toFixed(3)}`) },
]

const meta = {
  title: 'Building Blocks/DataTable',
  component: DataTable,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    searchable: true,
    searchPlaceholder: 'Search...',
    showCount: true,
  },
}

export const WithFilter: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    searchable: true,
    searchPlaceholder: 'Search...',
    filterableColumns: ['category'],
    showCount: true,
  },
}

export const Loading: Story = {
  args: {
    data: [],
    columns: sampleColumns,
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    data: [],
    columns: sampleColumns,
  },
}
