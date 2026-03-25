<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { GlassCard, AchievementCard } from '../../ui'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import { useAchievements } from '../../composables/useAchievements'
import { useBoverket } from '../../composables/useBoverket'
import type { AchievementCategory } from '../../types/achievement'

defineOptions({ name: 'StatsPage' })

const { assemblies, fetchAssemblies } = useAssemblyStore()
const { state, achievements, markAllSeen, unlockedCount } = useAchievements()
const { materials } = useBoverket()

const categoryFilter = ref<AchievementCategory | 'all'>('all')

const filteredAchievements = computed(() =>
  categoryFilter.value === 'all'
    ? achievements
    : achievements.filter(a => a.category === categoryFilter.value)
)

// Builder stats
const totalLayers = computed(() => assemblies.value.reduce((s, a) => s + a.layers.length, 0))
const uniqueMaterials = computed(() => new Set(assemblies.value.flatMap(a => a.layers.map(l => l.materialId))).size)
const averageGwp = computed(() => {
  const withGwp = assemblies.value.filter(a => a.totalGwp > 0)
  if (withGwp.length === 0) return 0
  return withGwp.reduce((s, a) => s + a.totalGwp, 0) / withGwp.length
})

// Builds by type
const wallCount = computed(() => assemblies.value.filter(a => a.assemblyType === 'wall').length)
const roofCount = computed(() => assemblies.value.filter(a => a.assemblyType === 'roof').length)
const floorCount = computed(() => assemblies.value.filter(a => a.assemblyType === 'floor').length)
const maxTypeCount = computed(() => Math.max(wallCount.value, roofCount.value, floorCount.value, 1))

// Personal records
const lowestGwpWall = computed(() => {
  const walls = assemblies.value.filter(a => a.assemblyType === 'wall' && a.totalGwp > 0)
  return walls.length > 0 ? Math.min(...walls.map(a => a.totalGwp)) : null
})
const lowestGwpRoof = computed(() => {
  const roofs = assemblies.value.filter(a => a.assemblyType === 'roof' && a.totalGwp > 0)
  return roofs.length > 0 ? Math.min(...roofs.map(a => a.totalGwp)) : null
})
const lowestGwpFloor = computed(() => {
  const floors = assemblies.value.filter(a => a.assemblyType === 'floor' && a.totalGwp > 0)
  return floors.length > 0 ? Math.min(...floors.map(a => a.totalGwp)) : null
})
const mostLayers = computed(() => {
  if (assemblies.value.length === 0) return null
  return Math.max(...assemblies.value.map(a => a.layers.length))
})
const thinnest = computed(() => {
  const withLayers = assemblies.value.filter(a => a.layers.length > 0)
  if (withLayers.length === 0) return null
  return Math.min(...withLayers.map(a => a.layers.reduce((s, l) => s + l.thicknessMm, 0)))
})
const thickest = computed(() => {
  const withLayers = assemblies.value.filter(a => a.layers.length > 0)
  if (withLayers.length === 0) return null
  return Math.max(...withLayers.map(a => a.layers.reduce((s, l) => s + l.thicknessMm, 0)))
})

onMounted(fetchAssemblies)
onUnmounted(() => markAllSeen())

const categories: { label: string; value: AchievementCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'GWP', value: 'gwp' },
  { label: 'Creativity', value: 'creativity' },
  { label: 'Mastery', value: 'mastery' },
  { label: 'Exploration', value: 'exploration' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8" style="font-family: var(--font-heading)">Stats</h1>

    <!-- Builder Stats -->
    <GlassCard class="mb-8 p-6">
      <h2 class="text-xl font-semibold mb-4" style="font-family: var(--font-heading)">Builder Stats</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="stat-value">{{ assemblies.length }}</div>
          <div class="stat-label">Assemblies</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalLayers }}</div>
          <div class="stat-label">Layers placed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ uniqueMaterials }}</div>
          <div class="stat-label">Materials used</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ averageGwp.toFixed(1) }}</div>
          <div class="stat-label">Avg GWP</div>
        </div>
      </div>
      <h3 class="text-sm font-semibold mb-2 opacity-70">Builds by type</h3>
      <div class="flex flex-col gap-2">
        <div class="type-bar-row">
          <span class="type-label">Wall</span>
          <div class="type-bar-track">
            <div class="type-bar-fill" :style="{ width: (wallCount / maxTypeCount * 100) + '%' }" />
          </div>
          <span class="type-count">{{ wallCount }}</span>
        </div>
        <div class="type-bar-row">
          <span class="type-label">Roof</span>
          <div class="type-bar-track">
            <div class="type-bar-fill roof" :style="{ width: (roofCount / maxTypeCount * 100) + '%' }" />
          </div>
          <span class="type-count">{{ roofCount }}</span>
        </div>
        <div class="type-bar-row">
          <span class="type-label">Floor</span>
          <div class="type-bar-track">
            <div class="type-bar-fill floor" :style="{ width: (floorCount / maxTypeCount * 100) + '%' }" />
          </div>
          <span class="type-count">{{ floorCount }}</span>
        </div>
      </div>
    </GlassCard>

    <!-- Achievement Showcase -->
    <GlassCard class="mb-8 p-6">
      <h2 class="text-xl font-semibold mb-4" style="font-family: var(--font-heading)">Achievements</h2>
      <div class="mb-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: (unlockedCount() / achievements.length * 100) + '%' }" />
          </div>
          <span class="text-sm font-mono opacity-70">{{ unlockedCount() }} / {{ achievements.length }}</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="cat in categories" :key="cat.value"
            class="filter-tab"
            :class="{ active: categoryFilter === cat.value }"
            @click="categoryFilter = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AchievementCard
          v-for="a in filteredAchievements" :key="a.id"
          :achievement="a"
          :unlock="state[a.id]"
        />
      </div>
    </GlassCard>

    <!-- Personal Records -->
    <GlassCard class="p-6">
      <h2 class="text-xl font-semibold mb-4" style="font-family: var(--font-heading)">Personal Records</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="record-card">
          <div class="record-label">Best wall GWP</div>
          <div class="record-value">{{ lowestGwpWall !== null ? lowestGwpWall.toFixed(1) + ' kgCO₂e/m²' : '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Best roof GWP</div>
          <div class="record-value">{{ lowestGwpRoof !== null ? lowestGwpRoof.toFixed(1) + ' kgCO₂e/m²' : '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Best floor GWP</div>
          <div class="record-value">{{ lowestGwpFloor !== null ? lowestGwpFloor.toFixed(1) + ' kgCO₂e/m²' : '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Most layers</div>
          <div class="record-value">{{ mostLayers ?? '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Thinnest assembly</div>
          <div class="record-value">{{ thinnest !== null ? thinnest + ' mm' : '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Thickest assembly</div>
          <div class="record-value">{{ thickest !== null ? thickest + ' mm' : '—' }}</div>
        </div>
        <div class="record-card">
          <div class="record-label">Materials tried</div>
          <div class="record-value">{{ uniqueMaterials }} / {{ materials.length }}</div>
        </div>
      </div>
    </GlassCard>
  </div>
</template>

<style scoped>
.stat-card {
  text-align: center;
  padding: 16px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}
.stat-value {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 700;
}
.stat-label {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 4px;
}
.type-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.type-label {
  width: 40px;
  font-size: 12px;
  font-family: var(--font-mono);
  opacity: 0.7;
}
.type-bar-track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.type-bar-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--color-purple);
  transition: width 0.3s ease;
}
.type-bar-fill.roof { background: var(--color-lavender); }
.type-bar-fill.floor { background: var(--color-mint); }
.type-count {
  width: 24px;
  font-size: 12px;
  font-family: var(--font-mono);
  text-align: right;
}
.progress-track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--color-rose);
  transition: width 0.3s ease;
}
.filter-tab {
  padding: 4px 12px;
  font-size: 12px;
  font-family: var(--font-mono);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-tab:hover { background: rgba(255, 255, 255, 0.08); }
.filter-tab.active {
  background: var(--color-rose);
  border-color: var(--color-rose);
  color: white;
}
.record-card {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}
.record-label {
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 4px;
}
.record-value {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;
}
</style>
