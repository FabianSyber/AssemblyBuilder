<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-4">Leaderboard</h1>
    <CategoryFilter :assemblyType="assemblyType" :structuralCategory="structuralCategory"
      @update:assemblyType="assemblyType = $event as AssemblyType; fetchData()" @update:structuralCategory="structuralCategory = $event as StructuralCategory; fetchData()" />
    <div class="flex flex-col lg:flex-row gap-6 mt-6">
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Top Assemblies</h3>
          <LeaderboardTable :entries="entries" :selectedId="selectedPublicId" @select="selectedPublicId = $event" />
        </GlassCard>
      </div>
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">My Assemblies</h3>
          <LeaderboardTable :entries="myEntries" :selectedId="selectedMyId" @select="selectedMyId = $event" />
          <div v-if="gwpDiff !== null" class="mt-4 p-3 rounded-lg bg-white/40 text-center">
            <span class="font-mono text-lg font-bold" :class="gwpDiff > 0 ? 'text-red-400' : 'text-emerald-500'">
              {{ gwpDiff > 0 ? '+' : '' }}{{ gwpDiff.toFixed(1) }}
            </span>
            <span class="font-mono text-xs text-[var(--color-purple-light)]"> kg CO₂e/m²</span>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlassCard } from '../../ui'
import CategoryFilter from '../../ui/leaderboard/CategoryFilter.vue'
import LeaderboardTable from '../../ui/leaderboard/LeaderboardTable.vue'
import { useLeaderboard } from '../../composables/useLeaderboard'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { AssemblyType, StructuralCategory } from '../../types/assembly'
import type { LeaderboardEntry } from '../../types/leaderboard'
const assemblyType = ref<AssemblyType>('wall')
const structuralCategory = ref<StructuralCategory>('concrete')
const selectedPublicId = ref<string>()
const selectedMyId = ref<string>()
const { entries, fetchLeaderboard } = useLeaderboard()
const { assemblies: myAssemblies, fetchAssemblies } = useAssemblyStore()
const myEntries = computed<LeaderboardEntry[]>(() =>
  myAssemblies.value
    .filter(a => a.assemblyType === assemblyType.value && a.structuralCategory === structuralCategory.value)
    .sort((a, b) => a.totalGwp - b.totalGwp)
    .map((a, i) => ({ id: a.id, name: a.name, assemblyType: a.assemblyType, structuralCategory: a.structuralCategory, totalGwp: a.totalGwp, displayName: 'You', rank: i + 1 }))
)
const gwpDiff = computed(() => {
  const pub = entries.value.find(e => e.id === selectedPublicId.value)
  const mine = myEntries.value.find(e => e.id === selectedMyId.value)
  if (pub && mine) return mine.totalGwp - pub.totalGwp
  return null
})
async function fetchData() { await fetchLeaderboard(assemblyType.value, structuralCategory.value); await fetchAssemblies() }
onMounted(fetchData)
</script>
