<template>
  <g class="gwp-bar">
    <!-- Glass bar background -->
    <rect
      :x="x"
      :y="y"
      :width="width"
      height="48"
      rx="8"
      ry="8"
      fill="rgba(107,76,122,0.15)"
      stroke="rgba(180,160,200,0.3)"
      stroke-width="1"
    />
    <!-- Total GWP number -->
    <text
      :x="x + width / 2 - 40"
      :y="y + 20"
      fill="rgba(220,210,240,0.95)"
      font-size="20"
      font-family="var(--font-heading, sans-serif)"
      font-weight="600"
      text-anchor="end"
      dominant-baseline="middle"
    >{{ totalGwp }}</text>
    <!-- Unit label -->
    <text
      :x="x + width / 2 - 34"
      :y="y + 20"
      fill="rgba(180,160,200,0.75)"
      font-size="10"
      font-family="var(--font-body, sans-serif)"
      dominant-baseline="middle"
    >kg CO₂e / m²</text>
    <!-- A1-A3 module tag -->
    <rect
      :x="x + width / 2 + 60"
      :y="y + 12"
      width="36"
      height="16"
      rx="4"
      ry="4"
      fill="rgba(107,76,122,0.4)"
      stroke="rgba(180,160,200,0.3)"
      stroke-width="0.8"
    />
    <text
      :x="x + width / 2 + 78"
      :y="y + 21"
      fill="rgba(220,210,240,0.9)"
      font-size="8"
      font-family="var(--font-mono, monospace)"
      font-weight="600"
      text-anchor="middle"
      dominant-baseline="middle"
    >A1-A3</text>
  </g>
</template>
<script setup lang="ts">
defineOptions({ name: 'GwpBar' })
defineProps<{ totalGwp: number; y: number; x: number; width: number }>()
</script>
