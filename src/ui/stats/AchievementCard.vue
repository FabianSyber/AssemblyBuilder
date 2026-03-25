<script setup lang="ts">
import type { AchievementDef, AchievementUnlock } from '../../types/achievement'

defineOptions({ name: 'AchievementCard' })

defineProps<{
  achievement: AchievementDef
  unlock?: AchievementUnlock
}>()
</script>

<template>
  <div
    class="achievement-card"
    :class="{
      'achievement-locked': !unlock,
      'achievement-new': unlock && !unlock.seen,
    }"
  >
    <div class="achievement-icon">
      {{ unlock ? achievement.icon : '🔒' }}
    </div>
    <div class="achievement-info">
      <div class="achievement-name">
        {{ unlock ? achievement.name : '???' }}
      </div>
      <div class="achievement-desc">
        {{ unlock ? achievement.description : achievement.hint }}
      </div>
    </div>
    <div v-if="unlock && !unlock.seen" class="achievement-badge">NEW</div>
  </div>
</template>

<style scoped>
.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  position: relative;
}
.achievement-new {
  border-color: var(--color-rose);
  box-shadow: 0 0 12px rgba(255, 100, 130, 0.3);
}
.achievement-locked {
  opacity: 0.45;
}
.achievement-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.achievement-name {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 14px;
}
.achievement-desc {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}
.achievement-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-rose);
  color: white;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 9999px;
}
</style>
