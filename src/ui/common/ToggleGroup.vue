<template>
  <div class="flex gap-1">
    <button v-for="opt in options" :key="opt"
      :class="['px-3 py-1 rounded-lg transition-colors',
        fontClass,
        modelValue === opt ? activeClass : 'bg-white/40 text-[var(--color-purple-light)] hover:bg-white/60']"
      @click="$emit('update:modelValue', opt)">{{ opt }}</button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
defineOptions({ name: 'ToggleGroup' })

const props = withDefaults(defineProps<{
  options: string[]
  modelValue: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
}>(), {
  variant: 'primary',
  size: 'md',
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const activeClass = computed(() =>
  props.variant === 'primary'
    ? 'bg-[var(--color-rose)] text-white'
    : 'bg-[var(--color-purple)] text-white'
)

const fontClass = computed(() =>
  props.size === 'sm' ? 'font-mono text-xs' : 'font-body text-sm'
)
</script>
