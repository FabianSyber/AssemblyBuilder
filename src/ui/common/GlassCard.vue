<template>
  <div
    class="glass-card"
    :class="{ 'glass-card--active': active }"
    :style="overflow ? { overflow: 'visible', position: 'relative' } : {}"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GlassCard' })

withDefaults(defineProps<{
  overflow?: boolean
  active?: boolean
}>(), {
  overflow: false,
  active: false,
})
</script>

<style scoped>
.glass-card--active {
  border-color: var(--color-rose);
}
</style>
