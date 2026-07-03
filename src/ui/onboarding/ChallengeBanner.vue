<template>
  <GlassCard :active="progress.passed" class="p-5 mb-6">
    <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-[10px] uppercase tracking-wider text-[var(--color-rose)]">Tutorial</span>
          <h2 class="font-heading text-lg font-bold text-[var(--color-purple)]">{{ challenge.name }}</h2>
        </div>
        <p class="font-body text-sm text-[var(--color-purple-light)]">{{ challenge.tagline }}</p>
      </div>
      <button
        class="font-body text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] hover:underline"
        @click="$emit('exit')"
      >Exit tutorial</button>
    </div>

    <!-- Progress bar: 0 .. baseline, with a target marker -->
    <div class="relative h-6 mb-2">
      <div class="absolute inset-0 bg-white/30 rounded-none overflow-hidden">
        <div
          class="h-full transition-all duration-300"
          :class="progress.passed ? 'bg-[var(--color-mint)]' : 'bg-[var(--color-rose)]'"
          :style="{ width: fillPct + '%' }"
        />
      </div>
      <!-- Target marker -->
      <div
        class="absolute top-[-4px] bottom-[-4px] w-[2px] bg-[var(--color-purple)]"
        :style="{ left: targetPct + '%' }"
        title="Target"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 mb-4">
      <div class="flex items-baseline gap-4 font-mono text-xs text-[var(--color-purple-light)]">
        <span>Baseline <b class="text-[var(--color-purple)]">{{ baselineGwp.toFixed(1) }}</b></span>
        <span>Now <b :class="progress.passed ? 'text-[var(--color-mint-dark,var(--color-purple))]' : 'text-[var(--color-rose)]'">{{ currentGwp.toFixed(1) }}</b></span>
        <span>Target <b class="text-[var(--color-purple)]">≤ {{ targetGwp.toFixed(1) }}</b></span>
        <span class="text-[10px]">kg CO₂e/m²</span>
      </div>
      <div class="font-mono text-sm font-bold" :class="progress.pct >= 0 ? 'text-[var(--color-rose)]' : 'text-[var(--color-purple-light)]'">
        {{ progress.pct >= 0 ? '−' : '+' }}{{ Math.abs(progress.pct * 100).toFixed(0) }}%
      </div>
    </div>

    <div v-if="!progress.passed" class="font-body text-sm text-[var(--color-purple)] bg-white/30 px-3 py-2">
      💡 {{ hint }}
    </div>
    <div v-else class="flex flex-wrap items-center justify-between gap-3">
      <p class="font-body text-sm text-[var(--color-purple)] flex-1 min-w-[240px]">🎉 {{ challenge.successMessage }}</p>
      <BaseButton label="Keep building →" variant="primary" @click="$emit('finish')" />
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import BaseButton from '../common/BaseButton.vue'
import type { Challenge } from '../../data/challenges'
import type { ChallengeProgress } from '../../composables/useOnboarding'

const props = defineProps<{
  challenge: Challenge
  baselineGwp: number
  currentGwp: number
  targetGwp: number
  progress: ChallengeProgress
  hint: string
}>()

defineEmits<{ (e: 'exit'): void; (e: 'finish'): void }>()

// Current value as a fraction of baseline, clamped to the visible track.
const fillPct = computed(() => {
  if (props.baselineGwp <= 0) return 0
  return Math.max(0, Math.min(100, (props.currentGwp / props.baselineGwp) * 100))
})
const targetPct = computed(() =>
  props.baselineGwp > 0 ? Math.min(100, (props.targetGwp / props.baselineGwp) * 100) : 50,
)
</script>
