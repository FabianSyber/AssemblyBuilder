<template>
  <div class="py-8">
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input v-model="assembly.name" placeholder="Assembly name..."
        class="font-heading text-xl font-bold bg-transparent border-b-2 border-[rgba(200,180,230,0.4)] focus:border-[var(--color-rose)] outline-none px-1 py-1 text-[var(--color-purple)]" />
      <select v-model="assembly.assemblyType" class="font-body text-sm rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="wall">Wall</option><option value="roof">Roof</option><option value="floor">Floor</option>
      </select>
      <select v-model="assembly.structuralCategory" class="font-body text-sm rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="concrete">Concrete</option><option value="wood">Wood</option><option value="hybrid">Hybrid</option>
        <option value="steel">Steel</option><option value="masonry">Masonry</option><option value="other">Other</option>
      </select>
      <label class="flex items-center gap-2 font-body text-sm text-[var(--color-purple-light)]">
        <input type="checkbox" v-model="assembly.isPublic" /> Public
      </label>
      <BaseButton label="Save" variant="secondary" @click="handleSave" />
    </div>
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1">
        <GlassCard class="p-6">
          <AssemblyCrossSection :layers="uiLayers" :title="assembly.name || 'New Assembly'"
            :subtitle="assembly.assemblyType + ' — ' + assembly.structuralCategory" />
        </GlassCard>
      </div>
      <div class="w-full lg:w-80">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Add Layer</h3>
          <input v-model="searchQuery" placeholder="Search materials..."
            class="w-full px-3 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm mb-3 focus:outline-none focus:border-[var(--color-rose)]" />
          <div class="max-h-48 overflow-y-auto space-y-1 mb-4">
            <button v-for="mat in filteredMaterials" :key="mat.id" @click="selectedMaterial = mat"
              :class="['w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors',
                selectedMaterial?.id === mat.id ? 'bg-[var(--color-pink)] text-[var(--color-purple)]' : 'hover:bg-white/40 text-[var(--color-purple-light)]']">
              {{ mat.nameEn }} <span class="font-mono text-xs text-[var(--color-purple-light)]">{{ mat.category }}</span>
            </button>
          </div>
          <div v-if="selectedMaterial" class="space-y-3">
            <div>
              <label class="font-body text-xs text-[var(--color-purple-light)]">Thickness (mm)</label>
              <input v-model.number="thicknessInput" type="number" min="1"
                class="w-full px-3 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-mono text-sm" />
            </div>
            <p class="font-mono text-xs text-[var(--color-rose)]">≈ {{ previewGwp.toFixed(1) }} kg CO₂e/m²</p>
            <BaseButton label="Add Layer" variant="primary" @click="handleAddLayer" />
          </div>
        </GlassCard>
        <GlassCard v-if="assembly.layers.length > 0" class="p-4 mt-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Layers</h3>
          <div class="space-y-2">
            <div v-for="(layer, index) in assembly.layers" :key="layer.id"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30">
              <span class="font-body text-sm text-[var(--color-purple)] flex-1">{{ layer.materialName }}</span>
              <span class="font-mono text-xs text-[var(--color-purple-light)]">{{ layer.thicknessMm }}mm</span>
              <button @click="moveLayer(index, index - 1)" :disabled="index === 0" class="text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] disabled:opacity-30">↑</button>
              <button @click="moveLayer(index, index + 1)" :disabled="index === assembly.layers.length - 1" class="text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] disabled:opacity-30">↓</button>
              <button @click="removeLayer(layer.id)" class="text-xs text-[var(--color-rose)] hover:text-red-500">✕</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { GlassCard, BaseButton, AssemblyCrossSection } from '../../ui'
import { useAssembly } from '../../composables/useAssembly'
import { useBoverket } from '../../composables/useBoverket'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { BoverketMaterial } from '../../types/material'

const { assembly, addLayer, removeLayer, moveLayer } = useAssembly()
const { materials, searchMaterials, calcGwpPerM2 } = useBoverket()
const { saveAssembly } = useAssemblyStore()

async function handleSave() { if (!assembly.value.name.trim()) return; await saveAssembly(assembly.value) }

const searchQuery = ref('')
const selectedMaterial = ref<BoverketMaterial | null>(null)
const thicknessInput = ref(100)
const filteredMaterials = computed(() => searchQuery.value ? searchMaterials(searchQuery.value) : materials.value)
const previewGwp = computed(() => selectedMaterial.value ? calcGwpPerM2(selectedMaterial.value.id, thicknessInput.value) : 0)
const uiLayers = computed(() => assembly.value.layers.map(l => ({ id: l.id, name: l.materialName, hatchType: l.hatchType, thicknessMm: l.thicknessMm, gwp: l.gwpPerM2 })))

function handleAddLayer() {
  if (!selectedMaterial.value) return
  addLayer({ materialId: selectedMaterial.value.id, materialName: selectedMaterial.value.nameEn, hatchType: selectedMaterial.value.hatchType, thicknessMm: thicknessInput.value })
  selectedMaterial.value = null; thicknessInput.value = 100
}
</script>
