import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h } from 'vue'
import { HATCH_PATTERNS } from './patterns'

const TYPES = ['concrete', 'insulation', 'wood', 'membrane', 'steel', 'air', 'brick', 'gypsum', 'earth'] as const

const AllPatternsGrid = defineComponent({
  name: 'AllPatternsGrid',
  setup() {
    return () =>
      h('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px;background:#1a1a2e;' },
        TYPES.map(type => {
          const p = HATCH_PATTERNS[type]
          return h('div', { key: type, style: 'display:flex;flex-direction:column;gap:8px;align-items:center;' }, [
            h('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: 120,
              height: 80,
              style: 'border-radius:8px;border:1px solid rgba(255,255,255,0.1)',
            }, [
              h('defs', {}, [
                h('pattern', {
                  id: p.id,
                  width: p.width,
                  height: p.height,
                  patternUnits: 'userSpaceOnUse',
                  innerHTML: p.svgContent,
                }),
              ]),
              h('rect', { x: 0, y: 0, width: 120, height: 80, fill: p.fill }),
              h('rect', { x: 0, y: 0, width: 120, height: 80, fill: `url(#${p.id})` }),
            ]),
            h('span', { style: 'color:#b8a0c8;font-family:monospace;font-size:11px;' }, type),
          ])
        })
      )
  },
})

const meta = {
  title: 'Atoms/HatchPattern',
  component: AllPatternsGrid,
  tags: ['autodocs'],
} satisfies Meta<typeof AllPatternsGrid>

export default meta
type Story = StoryObj<typeof meta>

export const AllTypes: Story = {
  render: () => ({
    components: { AllPatternsGrid },
    template: '<AllPatternsGrid />',
  }),
}
