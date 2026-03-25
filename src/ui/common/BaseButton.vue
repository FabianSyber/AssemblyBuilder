<template>
  <button class="inline-flex mb-2 mr-2" @click="$emit('click', $event)">
    <span class="relative inline-block isolate">
      <!-- Button surface -->
      <span :class="['btn-style', `btn-${variant}`]">
        {{ label }}
      </span>
      <!-- Shadow outline -->
      <span :class="['btn-shadow-style', `btn-shadow-${variant}`]" />
    </span>
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
.btn-style {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.5s ease-out;
}

.btn-style:hover {
  transform: translate(4px, 4px);
}

.btn-style:active {
  transform: translate(8px, 8px);
}

.btn-shadow-style {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 2px solid;
  transform: translate(8px, 8px);
  pointer-events: none;
  z-index: -1;
  clip-path: inset(0.2rem 0 0 0.2rem round 0.5rem);
}

/* Primary */
.btn-primary {
  background: var(--color-rose);
  color: white;
  border-color: var(--color-rose);
}
.btn-primary:hover {
  background: #d4608c;
}
.btn-shadow-primary {
  border-color: var(--color-rose);
}

/* Secondary */
.btn-secondary {
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-purple);
  border-color: rgba(200, 180, 230, 0.4);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.8);
}
.btn-shadow-secondary {
  border-color: var(--color-purple-light);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-purple);
  border-color: var(--color-purple);
}
.btn-ghost:hover {
  background: var(--color-purple);
  color: white;
}
.btn-shadow-ghost {
  border-color: var(--color-purple);
}
</style>
