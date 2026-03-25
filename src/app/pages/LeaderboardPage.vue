<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-4">Leaderboard</h1>
    <p v-if="!isOnline" class="font-body text-xs text-[var(--color-rose)] mb-4">
      Supabase not connected — showing local assemblies only.
    </p>
    <div class="flex flex-wrap gap-3 mb-6">
      <ToggleGroup :options="assemblyTypes" v-model="assemblyType" variant="primary" @update:modelValue="fetchData()" />
      <ToggleGroup :options="structuralCategories" v-model="structuralCategory" variant="secondary" size="sm" @update:modelValue="fetchData()" />
    </div>
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Top Assemblies</h3>
          <p class="font-body text-xs text-[var(--color-purple-light)] mb-2">Click an assembly to fork it into your builder.</p>
          <SelectableList :items="entries" :selectedId="selectedPublicId" @select="handlePublicSelect">
            <template #item="{ item }">
              <span class="font-mono text-lg font-bold text-[var(--color-purple)] w-8 text-center">{{ item.rank }}</span>
              <div class="flex-1">
                <p class="font-body text-sm font-semibold text-[var(--color-purple)]">{{ item.name }}</p>
                <p class="font-mono text-xs text-[var(--color-purple-light)]">{{ item.displayName }}</p>
              </div>
              <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ item.totalGwp.toFixed(2) }}</span>
              <span class="font-mono text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
            </template>
            <template #empty>No entries yet in this category.</template>
          </SelectableList>
        </GlassCard>
      </div>
      <div class="flex-1">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">My Assemblies</h3>
          <SelectableList :items="myEntries" :selectedId="selectedMyId" @select="selectedMyId = $event">
            <template #item="{ item }">
              <div class="relative flex items-center gap-4 w-full">
                <StampRow v-if="item.layers && item.layers.length > 0" :stamps="getStampsForAssembly(toAssembly(item), materials)" />
                <span class="font-mono text-lg font-bold text-[var(--color-purple)] w-8 text-center">{{ item.rank }}</span>
                <div class="flex-1">
                  <p class="font-body text-sm font-semibold text-[var(--color-purple)]">{{ item.name }}</p>
                  <p class="font-mono text-xs text-[var(--color-purple-light)]">{{ item.displayName }}</p>
                </div>
                <span class="font-mono text-lg font-bold text-[var(--color-rose)]">{{ item.totalGwp.toFixed(2) }}</span>
                <span class="font-mono text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
              </div>
            </template>
            <template #empty>No entries yet in this category.</template>
          </SelectableList>
          <div v-if="gwpDiff !== null" class="mt-4 p-3 bg-white/40 text-center">
            <span class="font-mono text-lg font-bold" :class="gwpDiff > 0 ? 'text-red-400' : 'text-emerald-500'">
              {{ gwpDiff > 0 ? '+' : '' }}{{ gwpDiff.toFixed(2) }}
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
import { useRouter } from 'vue-router'
import { v4 as uuid } from 'uuid'
import { GlassCard, SelectableList, ToggleGroup, StampRow } from '../../ui'
import { useLeaderboard } from '../../composables/useLeaderboard'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import { useAchievements } from '../../composables/useAchievements'
import { useBoverket } from '../../composables/useBoverket'
import { useSession } from '../../composables/useSession'
import { supabase } from '../../lib/supabase'
import type { AssemblyType, StructuralCategory, Assembly } from '../../types/assembly'
import type { LeaderboardEntry } from '../../types/leaderboard'

const router = useRouter()
const { getStampsForAssembly } = useAchievements()
const { materials } = useBoverket()
const { displayName } = useSession()
const isOnline = !!supabase
const assemblyTypes = ['wall', 'roof', 'floor']
const structuralCategories = ['concrete', 'wood', 'hybrid', 'steel', 'masonry', 'other']
const assemblyType = ref<AssemblyType>('wall')
const structuralCategory = ref<StructuralCategory>('concrete')
const selectedPublicId = ref<string>()
const selectedMyId = ref<string>()
const { entries, fetchLeaderboard } = useLeaderboard()
const { assemblies: myAssemblies, fetchAssemblies, saveAssembly } = useAssemblyStore()

const myEntries = computed<LeaderboardEntry[]>(() =>
  myAssemblies.value
    .filter(a => a.assemblyType === assemblyType.value && a.structuralCategory === structuralCategory.value)
    .sort((a, b) => a.totalGwp - b.totalGwp)
    .map((a, i) => ({ id: a.id, name: a.name, assemblyType: a.assemblyType, structuralCategory: a.structuralCategory, totalGwp: a.totalGwp, displayName: 'You', rank: i + 1, layers: a.layers }))
)

const gwpDiff = computed(() => {
  const pub = entries.value.find(e => e.id === selectedPublicId.value)
  const mine = myEntries.value.find(e => e.id === selectedMyId.value)
  if (pub && mine) return mine.totalGwp - pub.totalGwp
  return null
})

// Construct a minimal Assembly-compatible object from a LeaderboardEntry for stamp computation.
// Only call this when entry.layers is defined and non-empty.
function toAssembly(entry: LeaderboardEntry): Assembly {
  return {
    id: entry.id,
    userId: '',
    name: entry.name,
    assemblyType: entry.assemblyType,
    structuralCategory: entry.structuralCategory,
    layers: entry.layers ?? [],
    totalGwp: entry.totalGwp,
    isPublic: true,
    createdAt: '',
    updatedAt: '',
  }
}

async function handlePublicSelect(id: string) {
  selectedPublicId.value = id
  const entry = entries.value.find(e => e.id === id)
  if (!entry || !entry.layers || entry.layers.length === 0) return

  // Fork: create a local copy with new id, private
  const forked = {
    id: uuid(),
    userId: '',
    name: `${entry.name} (copy)`,
    assemblyType: entry.assemblyType,
    structuralCategory: entry.structuralCategory,
    layers: entry.layers.map(l => ({ ...l, id: uuid() })),
    totalGwp: entry.totalGwp,
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await saveAssembly(forked)
  router.push({ name: 'builder', query: { editId: forked.id } })
}

async function fetchData() { await fetchLeaderboard(assemblyType.value, structuralCategory.value); await fetchAssemblies() }
onMounted(fetchData)
</script>
