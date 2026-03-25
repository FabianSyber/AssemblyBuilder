<template>
  <div class="space-y-2">
    <div v-for="item in items" :key="itemKey(item)"
      :class="['flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors',
        selectedId === itemKey(item) ? 'bg-[var(--color-pink)]' : 'bg-white/30 hover:bg-white/50']"
      @click="$emit('select', itemKey(item))">
      <slot name="item" :item="item" :selected="selectedId === itemKey(item)" />
    </div>
    <p v-if="items.length === 0" class="font-body text-sm text-[var(--color-purple-light)] text-center py-8">
      <slot name="empty">No items.</slot>
    </p>
  </div>
</template>
<script setup lang="ts" generic="T extends Record<string, any>">
defineOptions({ name: 'SelectableList' })

const props = withDefaults(defineProps<{
  items: T[]
  selectedId?: string
  keyField?: string
}>(), {
  keyField: 'id',
})

defineEmits<{ select: [id: string] }>()

function itemKey(item: T): string {
  return String(item[props.keyField])
}
</script>
