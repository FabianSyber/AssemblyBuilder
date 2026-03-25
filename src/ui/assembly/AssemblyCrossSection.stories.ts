import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AssemblyCrossSection from './AssemblyCrossSection.vue'

const meta = {
  title: 'Composites/AssemblyCrossSection',
  component: AssemblyCrossSection,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof AssemblyCrossSection>

export default meta
type Story = StoryObj<typeof meta>

export const ConcreteWall: Story = {
  args: {
    title: 'Concrete Wall',
    subtitle: 'External facade — A1-A3',
    orientation: 'horizontal',
    layers: [
      { id: 'cw-1', name: 'Gypsum Board', hatchType: 'gypsum', thicknessMm: 12, gwp: 1.8 },
      { id: 'cw-2', name: 'Mineral Wool', hatchType: 'insulation', thicknessMm: 120, gwp: 5.4 },
      { id: 'cw-3', name: 'Concrete', hatchType: 'concrete', thicknessMm: 200, gwp: 48.0 },
      { id: 'cw-4', name: 'Render', hatchType: 'gypsum', thicknessMm: 15, gwp: 2.1 },
    ],
  },
}

export const TimberRoof: Story = {
  args: {
    title: 'Timber Roof Assembly',
    subtitle: 'Flat roof — A1-A3',
    layers: [
      { id: 'tr-1', name: 'Membrane', hatchType: 'membrane', thicknessMm: 5, gwp: 3.2 },
      { id: 'tr-2', name: 'Wood Deck', hatchType: 'wood', thicknessMm: 22, gwp: -4.5 },
      { id: 'tr-3', name: 'EPS Insulation', hatchType: 'insulation', thicknessMm: 180, gwp: 8.1 },
      { id: 'tr-4', name: 'Vapour Barrier', hatchType: 'membrane', thicknessMm: 3, gwp: 1.4 },
      { id: 'tr-5', name: 'Timber Joists', hatchType: 'wood', thicknessMm: 200, gwp: -18.6 },
    ],
  },
}

export const NarrowRoof: Story = {
  args: {
    title: 'Timber Roof (Narrow)',
    subtitle: 'Comparison view — A1-A3',
    narrow: true,
    layers: [
      { id: 'nr-1', name: 'Membrane', hatchType: 'membrane', thicknessMm: 5, gwp: 3.2 },
      { id: 'nr-2', name: 'Wood Deck', hatchType: 'wood', thicknessMm: 22, gwp: -4.5 },
      { id: 'nr-3', name: 'EPS Insulation', hatchType: 'insulation', thicknessMm: 180, gwp: 8.1 },
      { id: 'nr-4', name: 'Vapour Barrier', hatchType: 'membrane', thicknessMm: 3, gwp: 1.4 },
      { id: 'nr-5', name: 'Timber Joists', hatchType: 'wood', thicknessMm: 200, gwp: -18.6 },
    ],
  },
}

export const NarrowWall: Story = {
  args: {
    title: 'Concrete Wall (Narrow)',
    subtitle: 'Comparison view — A1-A3',
    orientation: 'horizontal',
    narrow: true,
    layers: [
      { id: 'nw-1', name: 'Gypsum Board', hatchType: 'gypsum', thicknessMm: 12, gwp: 1.8 },
      { id: 'nw-2', name: 'Mineral Wool', hatchType: 'insulation', thicknessMm: 120, gwp: 5.4 },
      { id: 'nw-3', name: 'Concrete', hatchType: 'concrete', thicknessMm: 200, gwp: 48.0 },
      { id: 'nw-4', name: 'Render', hatchType: 'gypsum', thicknessMm: 15, gwp: 2.1 },
    ],
  },
}

export const Empty: Story = {
  args: {
    title: 'New Assembly',
    subtitle: 'No layers yet',
    layers: [],
  },
}
