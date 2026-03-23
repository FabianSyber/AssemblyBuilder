<template>
  <div class="space-y-2">
    <div v-for="entry in entries" :key="entry.id"
      :class="['flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors',
        selectedId === entry.id ? 'bg-[var(--color-pink)]' : 'bg-white/30 hover:bg-white/50']"
      @click="$emit('select', entry.id)">
      <span class="font-mono text-lg font-bold text-[var(--color-purple)] w-8 text-center">{{ entry.rank }}</span>
      <div class="flex-1">
        <p class="font-body text-sm font-semibold text-[var(--color-purple)]">{{ entry.name }}</p>
        <p class="font-mono text-xs text-[var(--color-purple-light)]">{{ entry.displayName }}</p>
      </div>
      <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ entry.totalGwp.toFixed(1) }}</span>
      <span class="font-mono text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
    </div>
    <p v-if="entries.length === 0" class="font-body text-sm text-[var(--color-purple-light)] text-center py-8">No entries yet in this category.</p>
  </div>
</template>
<script setup lang="ts">
import type { LeaderboardEntry } from '../../types/leaderboard'
defineOptions({ name: 'LeaderboardTable' })
defineProps<{ entries: LeaderboardEntry[]; selectedId?: string }>()
defineEmits<{ select: [id: string] }>()
</script>
