import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SideBySide from './SideBySide.vue'

const meta = {
  title: 'Composites/SideBySide',
  component: SideBySide,
  tags: ['autodocs'],
} satisfies Meta<typeof SideBySide>

export default meta
type Story = StoryObj<typeof meta>

export const TwoAssemblies: Story = {
  args: {
    assemblies: [
      {
        id: 'a1', userId: '', name: 'Concrete Wall', assemblyType: 'wall', structuralCategory: 'concrete',
        totalGwp: 57.3, isPublic: true, createdAt: '', updatedAt: '',
        layers: [
          { id: 'l1', materialId: 'm1', materialName: 'Gypsum Board', hatchType: 'gypsum', thicknessMm: 12, gwpPerM2: 1.8 },
          { id: 'l2', materialId: 'm2', materialName: 'Mineral Wool', hatchType: 'insulation', thicknessMm: 120, gwpPerM2: 5.4 },
          { id: 'l3', materialId: 'm3', materialName: 'Concrete', hatchType: 'concrete', thicknessMm: 200, gwpPerM2: 48.0 },
        ],
      },
      {
        id: 'a2', userId: '', name: 'Timber Roof', assemblyType: 'roof', structuralCategory: 'wood',
        totalGwp: -9.5, isPublic: true, createdAt: '', updatedAt: '',
        layers: [
          { id: 'l4', materialId: 'm4', materialName: 'Membrane', hatchType: 'membrane', thicknessMm: 5, gwpPerM2: 3.2 },
          { id: 'l5', materialId: 'm5', materialName: 'Timber Joists', hatchType: 'wood', thicknessMm: 200, gwpPerM2: -18.6 },
          { id: 'l6', materialId: 'm6', materialName: 'EPS Insulation', hatchType: 'insulation', thicknessMm: 180, gwpPerM2: 8.1 },
        ],
      },
    ],
  },
}
