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
      :style="{ color: stamp.color, '--shadow-color': stamp.color }"
    >
      {{ stamp.icon }}
      <span class="stamp-tooltip">{{ stamp.name }}</span>
    </span>
    <span v-if="overflow > 0" class="stamp-pill stamp-overflow">
      +{{ overflow }}
    </span>
  </div>
</template>

<style scoped>
.stamp-row {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  gap: 4px;
  z-index: 10;
  overflow: visible;
}
.stamp-pill {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 16px;
  border-radius: 6px;
  background: var(--color-purple);
  border: 2px solid rgba(200, 180, 230, 0.4);
  line-height: 1;
  box-shadow: 3px 3px 0px 0px var(--shadow-color, rgba(200, 180, 230, 0.5));
  cursor: default;
  transition: transform 0.15s ease;
}
.stamp-pill:hover {
  transform: translateY(-2px);
}
.stamp-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 11px;
  color: white;
  background: var(--color-purple);
  border: 2px solid rgba(200, 180, 230, 0.4);
  border-radius: 6px;
  padding: 4px 8px;
  box-shadow: 3px 3px 0px 0px rgba(200, 180, 230, 0.3);
  pointer-events: none;
  z-index: 50;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}
.stamp-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-purple);
}
.stamp-pill:hover .stamp-tooltip {
  visibility: visible;
  opacity: 1;
}
.stamp-overflow {
  font-size: 10px;
  color: var(--color-purple-light);
  font-family: var(--font-mono);
  width: auto;
  padding: 0 6px;
}
</style>
