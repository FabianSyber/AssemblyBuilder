<template>
  <g class="layer-label">
    <!-- Connector line from assembly to label card -->
    <line
      :x1="x"
      :y1="centerY"
      :x2="x + 16"
      :y2="centerY"
      stroke="rgba(180,160,200,0.4)"
      stroke-width="0.8"
      stroke-dasharray="3,2"
    />
    <!-- Glass-morphism background rect -->
    <rect
      :x="x + 16"
      :y="centerY - cardHeight / 2"
      :width="cardWidth"
      :height="cardHeight"
      rx="6"
      ry="6"
      fill="rgba(255,255,255,0.08)"
      stroke="rgba(180,160,200,0.25)"
      stroke-width="0.8"
    />
    <!-- Layer name -->
    <text
      :x="x + 24"
      :y="centerY - 8"
      fill="rgba(220,210,240,0.95)"
      font-size="11"
      font-family="var(--font-body, sans-serif)"
      font-weight="500"
      dominant-baseline="middle"
    >{{ name }}</text>
    <!-- Thickness -->
    <text
      :x="x + 24"
      :y="centerY + 6"
      fill="rgba(180,160,200,0.75)"
      font-size="9"
      font-family="var(--font-mono, monospace)"
      dominant-baseline="middle"
    >{{ thicknessMm }}mm</text>
    <!-- GWP value -->
    <text
      :x="x + 24"
      :y="centerY + 18"
      fill="rgba(180,160,200,0.65)"
      font-size="9"
      font-family="var(--font-mono, monospace)"
      dominant-baseline="middle"
    >{{ gwp }} kg CO₂e</text>
  </g>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'LayerLabel' })
const props = defineProps<{ name: string; thicknessMm: number; gwp: number; y: number; x: number }>()
const cardWidth = 130
const cardHeight = 48
const centerY = computed(() => props.y)
</script>
