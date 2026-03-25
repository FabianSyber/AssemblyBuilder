<script setup lang="ts">
import { computed } from 'vue'
import type { Stamp } from '../../composables/useAchievements'

defineOptions({ name: 'StampRow' })

const props = withDefaults(defineProps<{
  stamps: Stamp[]
  maxVisible?: number
}>(), {
  maxVisible: 4,
})

const visible = computed(() => props.stamps.slice(0, props.maxVisible))
const overflow = computed(() => Math.max(0, props.stamps.length - props.maxVisible))
</script>

<template>
  <div v-if="stamps.length > 0" class="stamp-row">
    <span
      v-for="(stamp, i) in visible"
      :key="i"
      class="stamp-pill"
      :style="{ color: stamp.color }"
    >
      {{ stamp.icon }}
    </span>
    <span v-if="overflow > 0" class="stamp-pill stamp-overflow">
      +{{ overflow }}
    </span>
  </div>
</template>

<style scoped>
.stamp-row {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  gap: 3px;
  z-index: 10;
  pointer-events: none;
}
.stamp-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(200, 180, 230, 0.3);
  line-height: 1;
}
.stamp-overflow {
  font-size: 10px;
  color: var(--color-purple-light);
  font-family: var(--font-mono);
  width: auto;
  padding: 0 6px;
}
</style>
