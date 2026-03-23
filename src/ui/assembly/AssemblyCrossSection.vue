<template>
  <svg
    :width="svgWidth"
    :height="svgHeight"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    xmlns="http://www.w3.org/2000/svg"
    class="assembly-cross-section"
  >
    <!-- Hatch pattern definitions -->
    <defs>
      <HatchPattern v-for="layer in layers" :key="layer.id" :type="layer.hatchType" />
    </defs>

    <!-- Background -->
    <rect x="0" y="0" :width="svgWidth" :height="svgHeight" fill="rgba(20,15,35,0.95)" rx="12" />

    <!-- Title -->
    <text
      :x="assemblyX + assemblyWidth / 2"
      y="28"
      fill="rgba(220,210,240,0.95)"
      font-size="14"
      font-family="var(--font-heading, sans-serif)"
      font-weight="600"
      text-anchor="middle"
      dominant-baseline="middle"
    >{{ title }}</text>

    <!-- Subtitle -->
    <text
      :x="assemblyX + assemblyWidth / 2"
      y="46"
      fill="rgba(180,160,200,0.65)"
      font-size="10"
      font-family="var(--font-body, sans-serif)"
      text-anchor="middle"
      dominant-baseline="middle"
    >{{ subtitle }}</text>

    <!-- Assembly layers -->
    <g v-for="(layer, idx) in layers" :key="layer.id" :data-layer-id="layer.id">
      <AssemblyLayer
        :hatchType="layer.hatchType"
        :thicknessMm="layer.thicknessMm"
        :y="layerYPositions[idx]"
        :width="assemblyWidth"
        :scalePixelsPerMm="scale"
      />
      <!-- Dimension line on the left -->
      <DimensionLine
        :y1="layerYPositions[idx]"
        :y2="layerYPositions[idx] + layer.thicknessMm * scale"
        :x="assemblyX - 20"
        :label="`${layer.thicknessMm}mm`"
      />
      <!-- Layer label on the right -->
      <LayerLabel
        :name="layer.name"
        :thicknessMm="layer.thicknessMm"
        :gwp="layer.gwp"
        :y="layerYPositions[idx] + (layer.thicknessMm * scale) / 2"
        :x="assemblyX + assemblyWidth"
      />
    </g>

    <!-- GWP bar at the bottom -->
    <GwpBar
      v-if="layers.length > 0"
      :totalGwp="totalGwp"
      :y="gwpBarY"
      :width="assemblyWidth"
    />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import HatchPattern from '../hatches/HatchPattern.vue'
import AssemblyLayer from './AssemblyLayer.vue'
import DimensionLine from './DimensionLine.vue'
import LayerLabel from './LayerLabel.vue'
import GwpBar from './GwpBar.vue'

defineOptions({ name: 'AssemblyCrossSection' })

interface Layer {
  id: string
  name: string
  hatchType: string
  thicknessMm: number
  gwp: number
}

const props = defineProps<{
  layers: Layer[]
  title: string
  subtitle: string
}>()

const scale = 0.6          // pixels per mm
const assemblyX = 60       // left margin for dimension lines
const assemblyWidth = 260  // assembly section width
const topOffset = 64       // space for title/subtitle
const gwpBarPadding = 16

const layerYPositions = computed(() => {
  const positions: number[] = []
  let y = topOffset
  for (const layer of props.layers) {
    positions.push(y)
    y += layer.thicknessMm * scale
  }
  return positions
})

const totalAssemblyHeight = computed(() =>
  props.layers.reduce((sum, l) => sum + l.thicknessMm * scale, 0)
)

const gwpBarY = computed(() => topOffset + totalAssemblyHeight.value + gwpBarPadding)

const svgWidth = 560
const svgHeight = computed(() =>
  props.layers.length > 0
    ? gwpBarY.value + 48 + 16
    : topOffset + 60
)

const totalGwp = computed(() =>
  Math.round(props.layers.reduce((sum, l) => sum + l.gwp, 0) * 10) / 10
)
</script>
