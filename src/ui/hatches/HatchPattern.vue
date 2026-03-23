<template>
  <pattern :id="pattern.id" :width="pattern.width" :height="pattern.height" patternUnits="userSpaceOnUse" v-html="pattern.svgContent" />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getPattern } from './patterns'
defineOptions({ name: 'HatchPattern' })
const props = defineProps<{ type: string }>()
const pattern = computed(() => getPattern(props.type))
</script>
