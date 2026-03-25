<template>
  <svg
    width="100%"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    xmlns="http://www.w3.org/2000/svg"
    class="assembly-cross-section"
    preserveAspectRatio="xMidYMin meet"
  >
    <!-- Hatch pattern definitions -->
    <defs>
      <HatchPattern v-for="layer in layers" :key="layer.id" :type="layer.hatchType" />
    </defs>

    <!-- Background -->
    <rect x="0" y="0" :width="svgWidth" :height="svgHeight" :fill="bgColor" rx="0" />

    <!-- Title -->
    <text
      :x="svgWidth / 2"
      y="28"
      :fill="titleColor"
      font-size="14"
      font-family="var(--font-heading, sans-serif)"
      font-weight="600"
      text-anchor="middle"
      dominant-baseline="middle"
    >{{ title }}</text>

    <!-- Subtitle -->
    <text
      :x="svgWidth / 2"
      y="46"
      :fill="subtitleColor"
      font-size="10"
      font-family="var(--font-body, sans-serif)"
      text-anchor="middle"
      dominant-baseline="middle"
    >{{ subtitle }}</text>

    <!-- HORIZONTAL layout (walls) -->
    <template v-if="isHorizontal">
      <g v-for="(layer, idx) in layers" :key="layer.id" :data-layer-id="layer.id" class="layer-group">
        <!-- Layer rect: x varies, y fixed, width = thickness, height = assemblyHeight -->
        <AssemblyLayer
          :hatchType="layer.hatchType"
          :fillOverride="layer.fillOverride"
          :thicknessMm="layer.thicknessMm"
          :x="hLayerXPositions[idx]"
          :y="hAssemblyY"
          :width="layer.thicknessMm * scale"
          :height="hAssemblyHeight"
          :scalePixelsPerMm="scale"
        />
        <template v-if="!compact">
          <!-- Dimension line on top (horizontal) -->
          <g class="dimension-line">
            <line
              :x1="hLayerXPositions[idx]"
              :y1="hDimY"
              :x2="hLayerXPositions[idx] + layer.thicknessMm * scale"
              :y2="hDimY"
              stroke="rgba(180,160,200,0.6)"
              stroke-width="1"
              stroke-dasharray="4,3"
            />
            <line
              :x1="hLayerXPositions[idx]"
              :y1="hDimY - 5"
              :x2="hLayerXPositions[idx]"
              :y2="hDimY + 5"
              stroke="rgba(180,160,200,0.8)"
              stroke-width="1.5"
            />
            <line
              :x1="hLayerXPositions[idx] + layer.thicknessMm * scale"
              :y1="hDimY - 5"
              :x2="hLayerXPositions[idx] + layer.thicknessMm * scale"
              :y2="hDimY + 5"
              stroke="rgba(180,160,200,0.8)"
              stroke-width="1.5"
            />
            <text
              :x="hLayerXPositions[idx] + (layer.thicknessMm * scale) / 2"
              :y="hDimY - 10"
              fill="rgba(180,160,200,0.9)"
              font-size="10"
              font-family="var(--font-mono, monospace)"
              text-anchor="middle"
              dominant-baseline="middle"
              :class="{ 'dim-label-compact': layer.thicknessMm < 40 }"
            >{{ layer.thicknessMm }}mm</text>
          </g>
          <!-- Connector line down to label -->
          <line
            :x1="hLayerXPositions[idx] + (layer.thicknessMm * scale) / 2"
            :y1="hAssemblyY + hAssemblyHeight"
            :x2="hLabelXPositions[idx]"
            :y2="hLabelsY"
            stroke="rgba(180,160,200,0.4)"
            stroke-width="0.8"
            stroke-dasharray="3,2"
          />
          <!-- Label below -->
          <LayerLabel
            :name="layer.name"
            :thicknessMm="layer.thicknessMm"
            :gwp="layer.gwp"
            :y="hLabelsY + hLabelCardHeight / 2"
            :x="hLabelXPositions[idx] - hLabelCardWidth / 2"
            size="compact"
          />
        </template>
      </g>
    </template>

    <!-- VERTICAL layout (roofs, floors) -->
    <template v-else>
      <g v-for="(layer, idx) in layers" :key="layer.id" :data-layer-id="layer.id" class="layer-group">
        <AssemblyLayer
          :hatchType="layer.hatchType"
          :fillOverride="layer.fillOverride"
          :thicknessMm="layer.thicknessMm"
          :x="assemblyX"
          :y="layerYPositions[idx]"
          :width="assemblyWidth"
          :scalePixelsPerMm="scale"
        />
        <template v-if="!compact">
          <DimensionLine
            :y1="layerYPositions[idx]"
            :y2="layerYPositions[idx] + layer.thicknessMm * scale"
            :x="assemblyX - 20"
            :label="`${layer.thicknessMm}mm`"
            :thicknessMm="layer.thicknessMm"
          />
          <line
            :x1="assemblyX + assemblyWidth"
            :y1="layerYPositions[idx] + (layer.thicknessMm * scale) / 2"
            :x2="labelX"
            :y2="labelYPositions[idx]"
            stroke="rgba(180,160,200,0.4)"
            stroke-width="0.8"
            stroke-dasharray="3,2"
          />
          <LayerLabel
            :name="layer.name"
            :thicknessMm="layer.thicknessMm"
            :gwp="layer.gwp"
            :y="labelYPositions[idx]"
            :x="labelX"
          />
        </template>
      </g>
    </template>

    <!-- GWP bar at the bottom -->
    <GwpBar
      v-if="layers.length > 0 && !compact"
      :totalGwp="totalGwp"
      :y="gwpBarY"
      :x="gwpBarX"
      :width="gwpBarWidth"
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
  fillOverride?: string
  thicknessMm: number
  gwp: number
}

const props = defineProps<{
  layers: Layer[]
  title: string
  subtitle: string
  orientation?: 'vertical' | 'horizontal'
  compact?: boolean
  narrow?: boolean
  theme?: 'dark' | 'light'
}>()

const bgColor = computed(() => props.theme === 'light' ? 'rgba(255,255,255,0)' : 'rgba(20,15,35,0.95)')
const titleColor = computed(() => props.theme === 'light' ? 'var(--color-purple, #6b4c7a)' : 'rgba(220,210,240,0.95)')
const subtitleColor = computed(() => props.theme === 'light' ? 'rgba(107,76,122,0.65)' : 'rgba(180,160,200,0.65)')

const scale = 0.6          // pixels per mm
const topOffset = 64       // space for title/subtitle
const gwpBarPadding = 16
const labelCardHeight = computed(() => props.narrow ? 38 : 48)
const labelCardWidth = computed(() => props.narrow ? 130 : 200)
const labelMinGap = 6

const isHorizontal = computed(() => props.orientation === 'horizontal')

// ── VERTICAL layout (roofs, floors) ──
const assemblyX = computed(() => props.compact ? 20 : props.narrow ? 36 : 60)
const assemblyWidth = computed(() => props.compact ? 260 : props.narrow ? 220 : 420)
const labelX = computed(() => assemblyX.value + assemblyWidth.value + 16)

const layerYPositions = computed(() => {
  const positions: number[] = []
  let y = topOffset
  for (const layer of props.layers) {
    positions.push(y)
    y += layer.thicknessMm * scale
  }
  return positions
})

const labelYPositions = computed(() => {
  if (props.layers.length === 0) return []
  const ideal = props.layers.map((layer, idx) =>
    layerYPositions.value[idx] + (layer.thicknessMm * scale) / 2
  )
  const spaced = [...ideal]
  const step = labelCardHeight.value + labelMinGap
  for (let i = 1; i < spaced.length; i++) {
    const minY = spaced[i - 1] + step
    if (spaced[i] < minY) spaced[i] = minY
  }
  return spaced
})

const vTotalAssemblyHeight = computed(() =>
  props.layers.reduce((sum, l) => sum + l.thicknessMm * scale, 0)
)

// ── HORIZONTAL layout (walls) ──
const hAssemblyHeight = 160  // fixed visible wall height
const hDimY = topOffset + 16 // dimension line Y (above assembly)
const hAssemblyY = topOffset + 36 // assembly top
const hLabelCardWidth = 100  // compact label width
const hLabelCardHeight = 28  // compact label height

const hTotalThickness = computed(() =>
  props.layers.reduce((sum, l) => sum + l.thicknessMm * scale, 0)
)

const hLabelsY = computed(() => hAssemblyY + hAssemblyHeight + 16)

// Compute label spread width independently (no dependency on assembly position)
const hLabelSpreadWidth = computed(() => {
  const n = props.layers.length
  if (n === 0) return 0
  return n * hLabelCardWidth + (n - 1) * labelMinGap
})

// svgWidth for horizontal: enough to fit both assembly and label spread, with margins
const hSvgWidth = computed(() => {
  const contentWidth = Math.max(hTotalThickness.value, hLabelSpreadWidth.value)
  return Math.max(560, contentWidth + 80) // 40px margin each side
})

// Now center the assembly within the known svgWidth (no circular dep)
const hAssemblyX = computed(() => {
  const effectiveWidth = props.compact
    ? Math.max(compactContentWidth.value, compactContentHeight.value)
    : hSvgWidth.value
  return Math.max(30, (effectiveWidth - hTotalThickness.value) / 2)
})

const hLayerXPositions = computed(() => {
  const positions: number[] = []
  let x = hAssemblyX.value
  for (const layer of props.layers) {
    positions.push(x)
    x += layer.thicknessMm * scale
  }
  return positions
})

// Spread label X positions so they don't overlap, then center the row
const hLabelXPositions = computed(() => {
  if (props.layers.length === 0) return []
  // Ideal: centered under each layer
  const ideal = props.layers.map((layer, idx) =>
    hLayerXPositions.value[idx] + (layer.thicknessMm * scale) / 2
  )
  // Spread so labels don't overlap
  const step = hLabelCardWidth + labelMinGap
  const spaced = [...ideal]
  for (let i = 1; i < spaced.length; i++) {
    const minX = spaced[i - 1] + step
    if (spaced[i] < minX) spaced[i] = minX
  }
  // Center the label row within the SVG
  const svgCenter = hSvgWidth.value / 2
  const labelSpan = spaced[spaced.length - 1] - spaced[0]
  const labelCenter = spaced[0] + labelSpan / 2
  const shift = svgCenter - labelCenter
  return spaced.map(x => x + shift)
})

// ── Shared ──
const gwpBarWidth = computed(() => isHorizontal.value ? Math.max(hTotalThickness.value, 260) : assemblyWidth.value)
const gwpBarX = computed(() => {
  if (isHorizontal.value) {
    // Center the GWP bar under the assembly
    const assemblyCenter = hAssemblyX.value + hTotalThickness.value / 2
    return assemblyCenter - gwpBarWidth.value / 2
  }
  return assemblyX.value
})

const gwpBarY = computed(() => {
  if (isHorizontal.value) {
    const belowAssembly = hLabelsY.value + hLabelCardHeight + gwpBarPadding
    if (hLabelXPositions.value.length === 0) return hAssemblyY + hAssemblyHeight + gwpBarPadding
    return belowAssembly
  }
  const belowLayers = topOffset + vTotalAssemblyHeight.value + gwpBarPadding
  if (labelYPositions.value.length === 0) return belowLayers
  const belowLabels = labelYPositions.value[labelYPositions.value.length - 1] + labelCardHeight.value / 2 + gwpBarPadding
  return Math.max(belowLayers, belowLabels)
})

const compactContentWidth = computed(() => {
  if (isHorizontal.value) return Math.max(300, hTotalThickness.value + 60)
  return assemblyWidth.value + 40
})

const compactContentHeight = computed(() => {
  if (props.layers.length === 0) return topOffset + 60
  if (isHorizontal.value) return hAssemblyY + hAssemblyHeight + 16
  return topOffset + vTotalAssemblyHeight.value + 16
})

const svgWidth = computed(() => {
  if (props.compact) {
    return Math.max(compactContentWidth.value, compactContentHeight.value)
  }
  if (isHorizontal.value) {
    return hSvgWidth.value
  }
  return labelX.value + labelCardWidth.value + 16
})

const svgHeight = computed(() => {
  if (props.layers.length === 0) return topOffset + 60
  if (props.compact) {
    return Math.max(compactContentWidth.value, compactContentHeight.value)
  }
  return gwpBarY.value + 48 + 16
})

const totalGwp = computed(() =>
  Math.round(props.layers.reduce((sum, l) => sum + l.gwp, 0) * 10) / 10
)
</script>
