<template>
  <g>
    <rect :x="x" :y="y" :width="width" :height="renderHeight" :fill="bgFill" :stroke="pattern.strokeColor" stroke-width="1.5" />
    <rect v-if="!fillOverride" :x="x" :y="y" :width="width" :height="renderHeight" :fill="`url(#${pattern.id})`" />
  </g>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getPattern } from '../hatches/patterns'
defineOptions({ name: 'AssemblyLayer' })
const props = defineProps<{
  hatchType: string
  fillOverride?: string
  thicknessMm: number
  y: number
  x: number
  width: number
  scalePixelsPerMm: number
  height?: number
}>()
const renderHeight = computed(() => props.height ?? props.thicknessMm * props.scalePixelsPerMm)
const pattern = computed(() => getPattern(props.hatchType))
const bgFill = computed(() => props.fillOverride ?? pattern.value.fill)
</script>
