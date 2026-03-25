<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-4">My Assemblies</h1>

    <!-- Action bar -->
    <div v-if="savedAssemblies.length > 0 && !comparing" class="flex flex-wrap items-center gap-3 mb-6">
      <BaseButton v-if="selectedIds.size >= 2" :label="`Compare ${selectedIds.size}`" variant="primary" @click="() => { comparing = true; record('comparison') }" />
      <BaseButton v-if="selectedIds.size === 1" label="Edit" variant="secondary" @click="editSelected" />
      <BaseButton v-if="selectedIds.size > 0" label="Delete" variant="ghost" @click="deleteTarget = 'selected'" />
      <BaseButton v-if="selectedIds.size > 0" label="Clear selection" variant="ghost" @click="selectedIds = new Set()" />
    </div>
    <p v-if="selectedIds.size > 0 && !comparing" class="font-body text-xs text-[var(--color-purple-light)] mb-4">
      {{ selectedIds.size }} {{ selectedIds.size === 1 ? 'assembly' : 'assemblies' }} selected
    </p>

    <!-- Assembly grid -->
    <div v-if="!comparing" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard v-for="a in savedAssemblies" :key="a.id" class="p-4 cursor-pointer" :overflow="true"
        :class="{ 'ring-2 ring-[var(--color-rose)]': selectedIds.has(a.id) }" @click="toggleSelect(a.id)">
        <StampRow :stamps="getStampsForAssembly(a, materials)" />
        <div class="aspect-square overflow-hidden mb-3">
          <AssemblyCrossSection
            :layers="toLayers(a)"
            :title="a.name"
            :subtitle="`${a.assemblyType} — ${a.structuralCategory}`"
            :orientation="a.assemblyType === 'wall' ? 'horizontal' : 'vertical'"
            compact
            theme="light"
          />
        </div>
        <div class="flex gap-2 mb-1">
          <Badge :label="a.assemblyType" color="lavender" />
          <Badge :label="a.structuralCategory" color="mint" />
        </div>
        <p class="font-mono text-lg font-bold text-[var(--color-rose)]">
          {{ a.totalGwp.toFixed(2) }} <span class="text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
        </p>
      </GlassCard>
    </div>

    <!-- Compare view -->
    <div v-if="comparing">
      <BaseButton label="← Back" variant="ghost" @click="comparing = false" class="mb-4" />
      <SideBySide :assemblies="selectedAssemblies" />
    </div>

    <!-- Empty state -->
    <p v-if="savedAssemblies.length === 0" class="font-body text-[var(--color-purple-light)] text-center py-12">
      No assemblies yet. <router-link to="/build" class="text-[var(--color-rose)] underline">Build your first one.</router-link>
    </p>

    <!-- Delete confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click.self="deleteTarget = null">
      <div class="p-6 max-w-sm bg-white border-2 border-[rgba(200,180,230,0.4)] box-shadow-[10px_10px_0px_0px_rgba(200,180,230,0.3)]">
        <p class="font-body text-sm text-[var(--color-purple)] mb-4">
          Delete {{ selectedIds.size }} {{ selectedIds.size === 1 ? 'assembly' : 'assemblies' }}? This cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <BaseButton label="Cancel" variant="ghost" @click="deleteTarget = null" />
          <BaseButton label="Delete" variant="primary" @click="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GlassCard, BaseButton, Badge, SideBySide, AssemblyCrossSection, StampRow } from '../../ui'
import type { Assembly } from '../../types/assembly'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import { useAchievements } from '../../composables/useAchievements'
import { useBoverket } from '../../composables/useBoverket'

const router = useRouter()
const { assemblies: savedAssemblies, fetchAssemblies, deleteAssembly } = useAssemblyStore()
const { getStampsForAssembly, record } = useAchievements()
const { materials } = useBoverket()
onMounted(fetchAssemblies)

const selectedIds = ref(new Set<string>())
const comparing = ref(false)
const deleteTarget = ref<string | null>(null)

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

const selectedAssemblies = computed(() => savedAssemblies.value.filter(a => selectedIds.value.has(a.id)))

function toLayers(a: Assembly) {
  return a.layers.map(l => ({ id: l.id, name: l.materialName, hatchType: l.hatchType, fillOverride: l.fillOverride, thicknessMm: l.thicknessMm, gwp: Math.round(l.gwpPerM2 * 100) / 100 }))
}

function editSelected() {
  const id = [...selectedIds.value][0]
  router.push({ name: 'builder', query: { editId: id } })
}

async function handleDelete() {
  for (const id of selectedIds.value) {
    await deleteAssembly(id)
  }
  selectedIds.value = new Set()
  deleteTarget.value = null
}
</script>
