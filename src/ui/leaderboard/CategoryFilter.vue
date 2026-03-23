<template>
  <div class="flex flex-wrap gap-3">
    <div class="flex gap-1">
      <button v-for="t in types" :key="t"
        :class="['px-3 py-1 rounded-lg font-body text-sm transition-colors',
          assemblyType === t ? 'bg-[var(--color-rose)] text-white' : 'bg-white/40 text-[var(--color-purple-light)] hover:bg-white/60']"
        @click="$emit('update:assemblyType', t)">{{ t }}</button>
    </div>
    <div class="flex gap-1">
      <button v-for="c in categories" :key="c"
        :class="['px-3 py-1 rounded-lg font-mono text-xs transition-colors',
          structuralCategory === c ? 'bg-[var(--color-purple)] text-white' : 'bg-white/40 text-[var(--color-purple-light)] hover:bg-white/60']"
        @click="$emit('update:structuralCategory', c)">{{ c }}</button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'CategoryFilter' })
defineProps<{ assemblyType: string; structuralCategory: string }>()
defineEmits<{ 'update:assemblyType': [value: string]; 'update:structuralCategory': [value: string] }>()
const types = ['wall', 'roof', 'floor']
const categories = ['concrete', 'wood', 'hybrid', 'steel', 'masonry', 'other']
</script>
