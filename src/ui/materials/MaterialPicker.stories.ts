import { h } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '../common/DataTable.vue'

interface Material {
  id: string
  nameEn: string
  category: string
  gwpA1A3: number
}

const sampleMaterials: Material[] = [
  { id: 'bvk-1', nameEn: 'Concrete C30/37', category: 'Betong', gwpA1A3: 0.117 },
  { id: 'bvk-2', nameEn: 'Mineral wool', category: 'Isolering', gwpA1A3: 0.89 },
  { id: 'bvk-3', nameEn: 'Structural timber', category: 'Trävaror', gwpA1A3: 0.064 },
  { id: 'bvk-4', nameEn: 'Gypsum board', category: 'Byggskivor', gwpA1A3: 0.27 },
  { id: 'bvk-5', nameEn: 'Steel sheet', category: 'Stål och andra metaller', gwpA1A3: 2.8 },
  { id: 'bvk-6', nameEn: 'EPS expanded polystyrene', category: 'Isolering', gwpA1A3: 3.4 },
  { id: 'bvk-7', nameEn: 'Brick', category: 'Murblock och tegel', gwpA1A3: 0.24 },
  { id: 'bvk-8', nameEn: 'Vapor barrier PE film', category: 'Tätskikt', gwpA1A3: 2.5 },
]

const columns: ColumnDef<Material, any>[] = [
  { accessorKey: 'nameEn', header: 'Material', cell: (info) => info.getValue() },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'gwpA1A3', header: 'GWP', cell: (info) => h('span', { class: 'font-mono text-xs' }, `${Number(info.getValue()).toFixed(2)}`) },
]

const meta = {
  title: 'Composites/MaterialPicker',
  component: DataTable,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: sampleMaterials,
    columns,
    searchable: true,
    searchPlaceholder: 'Search materials...',
    filterableColumns: ['category'],
    showCount: true,
  },
}

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true,
  },
}

export const WithSelection: Story = {
  args: {
    data: sampleMaterials,
    columns,
    searchable: true,
    searchPlaceholder: 'Search materials...',
    filterableColumns: ['category'],
    showCount: true,
    selectedId: 'bvk-3',
  },
}
