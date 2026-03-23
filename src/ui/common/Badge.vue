<template>
  <span :class="['badge', `badge-${color}`]">{{ label }}</span>
</template>

<script setup lang="ts">
defineOptions({ name: 'Badge' })

withDefaults(defineProps<{
  label: string
  color?: 'pink' | 'lavender' | 'mint' | 'blue' | 'peach'
}>(), {
  color: 'lavender',
})
</script>

<style scoped>
.badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
}
.badge-pink { background: var(--color-pink); color: var(--color-purple); }
.badge-lavender { background: var(--color-lavender); color: var(--color-purple); }
.badge-mint { background: var(--color-mint); color: #2d6a5e; }
.badge-blue { background: var(--color-blue); color: #1565c0; }
.badge-peach { background: var(--color-peach); color: #bf360c; }
</style>
