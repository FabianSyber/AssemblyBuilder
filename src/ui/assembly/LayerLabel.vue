<template>
  <g class="layer-label">
    <!-- Clip path to prevent text overflow -->
    <clipPath :id="`label-clip-${clipId}`">
      <rect :x="x" :y="centerY - h / 2" :width="w" :height="h" />
    </clipPath>
    <!-- Glass-morphism background rect -->
    <rect
      :x="x"
      :y="centerY - h / 2"
      :width="w"
      :height="h"
      rx="6"
      ry="6"
      fill="rgba(255,255,255,0.08)"
      stroke="rgba(180,160,200,0.25)"
      stroke-width="0.8"
    />
    <g :clip-path="`url(#label-clip-${clipId})`">
      <!-- Layer name -->
      <text
        :x="x + 6"
        :y="isCompact ? centerY - 4 : centerY - 8"
        fill="rgba(220,210,240,0.95)"
        :font-size="isCompact ? 9 : 11"
        font-family="var(--font-body, sans-serif)"
        font-weight="500"
        dominant-baseline="middle"
      >{{ truncatedName }}</text>
      <!-- Thickness + GWP on one line for compact -->
      <text v-if="isCompact"
        :x="x + 6"
        :y="centerY + 8"
        fill="rgba(180,160,200,0.75)"
        font-size="8"
        font-family="var(--font-mono, monospace)"
        dominant-baseline="middle"
      >{{ thicknessMm }}mm · {{ gwp }} kg CO₂e</text>
      <!-- Thickness (default) -->
      <text v-if="!isCompact"
        :x="x + 8"
        :y="centerY + 6"
        fill="rgba(180,160,200,0.75)"
        font-size="9"
        font-family="var(--font-mono, monospace)"
        dominant-baseline="middle"
      >{{ thicknessMm }}mm</text>
      <!-- GWP value (default) -->
      <text v-if="!isCompact"
        :x="x + 8"
        :y="centerY + 18"
        fill="rgba(180,160,200,0.65)"
        font-size="9"
        font-family="var(--font-mono, monospace)"
        dominant-baseline="middle"
      >{{ gwp }} kg CO₂e</text>
    </g>
    <!-- Full name tooltip on hover -->
    <g v-if="isTruncated" class="label-tooltip">
      <rect :x="x" :y="centerY - h / 2" :width="w" :height="h" fill="transparent" />
      <rect
        class="tooltip-bg"
        :x="x"
        :y="centerY - h / 2 - tooltipHeight - 4"
        :width="tooltipBoxWidth"
        :height="tooltipHeight"
        rx="3"
        fill="rgba(20,15,35,0.95)"
        stroke="rgba(180,160,200,0.4)"
        stroke-width="0.5"
      />
      <text
        class="tooltip-text"
        :x="x + 6"
        :y="centerY - h / 2 - tooltipHeight + 2"
        fill="rgba(220,210,240,0.95)"
        font-size="10"
        font-family="var(--font-body, sans-serif)"
        dominant-baseline="hanging"
      >
        <tspan
          v-for="(line, i) in tooltipLines"
          :key="i"
          :x="x + 6"
          :dy="i === 0 ? 0 : 14"
        >{{ line }}</tspan>
      </text>
    </g>
  </g>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'LayerLabel' })
const props = withDefaults(defineProps<{
  name: string
  thicknessMm: number
  gwp: number
  y: number
  x: number
  size?: 'default' | 'compact'
}>(), { size: 'default' })

const isCompact = computed(() => props.size === 'compact')
const w = computed(() => isCompact.value ? 100 : 200)
const h = computed(() => isCompact.value ? 28 : 48)
const maxChars = computed(() => isCompact.value ? 14 : 28)

const centerY = computed(() => props.y)
const truncatedName = computed(() =>
  props.name.length > maxChars.value ? props.name.slice(0, maxChars.value) + '…' : props.name
)
const isTruncated = computed(() => props.name.length > maxChars.value)

const maxLineChars = 20
const tooltipLines = computed(() => {
  const words = props.name.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current && (current + ' ' + word).length > maxLineChars) {
      lines.push(current)
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current)
  return lines
})

const tooltipHeight = computed(() => tooltipLines.value.length * 14 + 8)
const tooltipBoxWidth = computed(() => {
  const longestLine = Math.max(...tooltipLines.value.map(l => l.length))
  return Math.max(longestLine * 6.5 + 16, w.value)
})

const clipId = computed(() => `${props.x}-${props.y}`.replace(/\./g, '_'))
</script>
<style>
.label-tooltip .tooltip-bg,
.label-tooltip .tooltip-text {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.label-tooltip:hover .tooltip-bg,
.label-tooltip:hover .tooltip-text {
  opacity: 1;
}
</style>
