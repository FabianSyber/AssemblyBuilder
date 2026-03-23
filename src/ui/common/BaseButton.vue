<template>
  <button
    :class="['btn', `btn-${variant}`]"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseButton' })

withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
}>(), {
  variant: 'primary',
})

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<style scoped>
.btn {
  font-family: var(--font-body);
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}
.btn-primary {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
}
.btn-primary:hover { opacity: 0.9; }
.btn-secondary {
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-purple);
  border-color: rgba(200, 180, 230, 0.4);
}
.btn-ghost {
  background: transparent;
  color: var(--color-purple);
}
</style>
