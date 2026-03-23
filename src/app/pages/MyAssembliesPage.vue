<template>
  <div class="py-8">
    <h1 class="font-heading text-2xl font-bold text-[var(--color-purple)] mb-6">My Assemblies</h1>
    <div v-if="!comparing" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard v-for="a in savedAssemblies" :key="a.id" class="p-4 cursor-pointer"
        :class="{ 'ring-2 ring-[var(--color-rose)]': selectedIds.has(a.id) }" @click="toggleSelect(a.id)">
        <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)]">{{ a.name }}</h3>
        <div class="flex gap-2 mt-1">
          <Badge :label="a.assemblyType" color="lavender" />
          <Badge :label="a.structuralCategory" color="mint" />
        </div>
        <p class="font-mono text-lg font-bold text-[var(--color-rose)] mt-2">
          {{ a.totalGwp.toFixed(1) }} <span class="text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
        </p>
      </GlassCard>
    </div>
    <div v-if="selectedIds.size > 0 && !comparing" class="mt-4">
      <BaseButton :label="`Compare ${selectedIds.size} assemblies`" variant="primary" :disabled="selectedIds.size < 2" @click="comparing = true" />
    </div>
    <div v-if="comparing">
      <BaseButton label="← Back" variant="ghost" @click="comparing = false" class="mb-4" />
      <SideBySide :assemblies="selectedAssemblies" />
    </div>
    <p v-if="savedAssemblies.length === 0" class="font-body text-[var(--color-purple-light)] text-center py-12">
      No assemblies yet. <router-link to="/build" class="text-[var(--color-rose)] underline">Build your first one.</router-link>
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GlassCard, BaseButton, Badge } from '../../ui'
import SideBySide from '../../ui/comparison/SideBySide.vue'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
const { assemblies: savedAssemblies, fetchAssemblies } = useAssemblyStore()
onMounted(fetchAssemblies)
const selectedIds = ref(new Set<string>())
const comparing = ref(false)
function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) { selectedIds.value.delete(id) }
  else if (selectedIds.value.size < 3) { selectedIds.value.add(id) }
}
const selectedAssemblies = computed(() => savedAssemblies.value.filter(a => selectedIds.value.has(a.id)))
</script>
