<template>
  <g>
    <rect :x="0" :y="y" :width="width" :height="heightPx" :fill="pattern.fill" :stroke="pattern.strokeColor" stroke-width="1.5" />
    <rect :x="0" :y="y" :width="width" :height="heightPx" :fill="`url(#${pattern.id})`" />
  </g>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getPattern } from '../hatches/patterns'
defineOptions({ name: 'AssemblyLayer' })
const props = defineProps<{ hatchType: string; thicknessMm: number; y: number; width: number; scalePixelsPerMm: number }>()
const heightPx = computed(() => props.thicknessMm * props.scalePixelsPerMm)
const pattern = computed(() => getPattern(props.hatchType))
</script>
