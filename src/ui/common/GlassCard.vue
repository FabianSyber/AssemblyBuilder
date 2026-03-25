<template>
  <div class="glass-card" :style="overflow ? { overflow: 'visible', position: 'relative' } : {}">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GlassCard' })

interface Props {
  overflow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  overflow: false
})
</script>
