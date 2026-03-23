<template>
  <g class="dimension-line">
    <!-- Main vertical dashed line -->
    <line
      :x1="x"
      :y1="y1"
      :x2="x"
      :y2="y2"
      stroke="rgba(180,160,200,0.6)"
      stroke-width="1"
      stroke-dasharray="4,3"
    />
    <!-- Top tick mark -->
    <line
      :x1="x - 5"
      :y1="y1"
      :x2="x + 5"
      :y2="y1"
      stroke="rgba(180,160,200,0.8)"
      stroke-width="1.5"
    />
    <!-- Bottom tick mark -->
    <line
      :x1="x - 5"
      :y1="y2"
      :x2="x + 5"
      :y2="y2"
      stroke="rgba(180,160,200,0.8)"
      stroke-width="1.5"
    />
    <!-- Rotated label -->
    <text
      :x="x + 8"
      :y="midY"
      :transform="`rotate(-90, ${x + 8}, ${midY})`"
      fill="rgba(180,160,200,0.9)"
      font-size="10"
      font-family="var(--font-mono, monospace)"
      text-anchor="middle"
      dominant-baseline="middle"
    >{{ label }}</text>
  </g>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'DimensionLine' })
const props = defineProps<{ y1: number; y2: number; x: number; label: string }>()
const midY = computed(() => (props.y1 + props.y2) / 2)
</script>
