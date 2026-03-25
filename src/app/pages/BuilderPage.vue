<template>
  <div class="py-8">
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input v-model="assembly.name" placeholder="Assembly name..."
        class="font-heading text-xl font-bold bg-transparent border-b-2 border-[rgba(200,180,230,0.4)] focus:border-[var(--color-rose)] outline-none px-1 py-1 text-[var(--color-purple)]" />
      <select v-model="assembly.assemblyType" class="font-body text-sm rounded-none border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="wall">Wall</option><option value="roof">Roof</option><option value="floor">Floor</option>
      </select>
      <select v-model="assembly.structuralCategory" class="font-body text-sm rounded-none border border-[rgba(200,180,230,0.4)] bg-white/80 px-3 py-1.5">
        <option value="concrete">Concrete</option><option value="wood">Wood</option><option value="hybrid">Hybrid</option>
        <option value="steel">Steel</option><option value="masonry">Masonry</option><option value="other">Other</option>
      </select>
      <label class="flex items-center gap-2 font-body text-sm text-[var(--color-purple-light)]">
        <input type="checkbox" v-model="assembly.isPublic" class="w-[25px] h-[25px] rounded-none border-2 border-[rgba(200,180,230,0.4)] accent-[var(--color-rose)] cursor-pointer appearance-none bg-white/80 checked:bg-[var(--color-rose)] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center" /> Public
      </label>
      <BaseButton :label="saveLabel" variant="secondary" @click="handleSave" />
    </div>
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1">
        <GlassCard class="p-0">
          <AssemblyCrossSection :layers="uiLayers" :title="assembly.name || 'New Assembly'"
            :subtitle="assembly.assemblyType + ' — ' + assembly.structuralCategory"
            :orientation="assembly.assemblyType === 'wall' ? 'horizontal' : 'vertical'" />
        </GlassCard>
      </div>
      <div class="w-full lg:w-96">
        <GlassCard class="p-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Add Layer</h3>
          <DataTable
            :data="materials"
            :columns="materialColumns"
            :loading="materialsLoading"
            :selectedId="selectedMaterial?.id"
            searchable
            searchPlaceholder="Search materials..."
            :filterableColumns="['category']"
            showCount
            @select="selectedMaterial = $event"
          />
          <div v-if="selectedMaterial" class="space-y-3 mt-3 pt-3 border-t border-[rgba(200,180,230,0.3)]">
            <div>
              <label class="font-body text-xs text-[var(--color-purple-light)]">Thickness (mm)</label>
              <input v-model.number="thicknessInput" type="number" min="1"
                class="w-full px-3 py-2 rounded-none border border-[rgba(200,180,230,0.4)] bg-white/80 font-mono text-sm" />
            </div>
            <p class="font-mono text-xs text-[var(--color-rose)]">≈ {{ previewGwp.toFixed(2) }} kg CO₂e/m²</p>
            <BaseButton label="Add Layer" variant="primary" @click="handleAddLayer" />
          </div>
        </GlassCard>
        <GlassCard v-if="assembly.layers.length > 0" class="p-4 mt-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Layers</h3>
          <div class="space-y-2">
            <div v-for="(layer, index) in assembly.layers" :key="layer.id"
              draggable="true"
              @dragstart="onDragStart(index, $event)"
              @dragover.prevent="onDragOver(index)"
              @dragend="onDragEnd"
              :class="['flex items-center gap-2 px-3 py-2 rounded-none transition-all cursor-grab active:cursor-grabbing',
                dragOverIndex === index ? 'bg-[var(--color-pink)] border-2 border-[var(--color-rose)]' : 'bg-white/30']">
              <span class="text-[var(--color-purple-light)] text-xs select-none">⠿</span>
              <span class="font-body text-sm text-[var(--color-purple)] flex-1">{{ layer.materialName }}</span>
              <input
                v-if="editingThicknessId === layer.id"
                v-model.number="editingThicknessValue"
                type="number"
                min="1"
                class="w-16 px-1 py-0.5 font-mono text-xs text-[var(--color-purple)] border border-[rgba(200,180,230,0.4)] bg-white/80 rounded-none"
                @blur="commitThickness(layer.id)"
                @keydown.enter="commitThickness(layer.id)"
                @keydown.escape="editingThicknessId = null"
                ref="thicknessInputRef"
              />
              <button
                v-else
                @click="startEditThickness(layer.id, layer.thicknessMm)"
                class="font-mono text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)] hover:underline cursor-pointer"
                title="Click to edit thickness"
              >{{ layer.thicknessMm }}mm</button>
              <button @click="toggleFillPicker(layer.id)" class="text-[var(--color-purple-light)] hover:text-[var(--color-purple)]" title="Change fill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
              <button @click="removeLayer(layer.id)" class="text-xs text-[var(--color-rose)] hover:text-red-500">✕</button>
            </div>
          </div>
        </GlassCard>
        <!-- Fill override picker -->
        <GlassCard v-if="fillPickerLayerId" class="p-4 mt-4">
          <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)] mb-3">Fill Override</h3>
          <div class="mb-3">
            <p class="font-body text-xs text-[var(--color-purple-light)] mb-2">Hatch patterns</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="ht in hatchTypes" :key="ht"
                @click="setFillOverride(null, ht)"
                class="w-8 h-8 border-2 border-[rgba(200,180,230,0.4)] hover:border-[var(--color-rose)]"
                :title="ht">
                <svg width="100%" height="100%" :viewBox="`0 0 ${getHatchPattern(ht).width} ${getHatchPattern(ht).height}`">
                  <rect :width="getHatchPattern(ht).width" :height="getHatchPattern(ht).height" :fill="getHatchPattern(ht).fill" />
                  <g v-html="getHatchPattern(ht).svgContent" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p class="font-body text-xs text-[var(--color-purple-light)] mb-2">Solid color</p>
            <div class="flex items-center gap-3">
              <input type="color" v-model="colorPickerValue" class="w-8 h-8 border-none cursor-pointer p-0" />
              <button @click="setFillOverride(colorPickerValue, undefined)"
                class="font-body text-xs text-[var(--color-purple)] hover:text-[var(--color-rose)]">Apply color</button>
              <button v-if="editingLayer?.fillOverride" @click="setFillOverride(null, editingLayer?.hatchType)"
                class="font-body text-xs text-[var(--color-purple-light)] hover:text-[var(--color-purple)]">Reset</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick, h } from 'vue'
import { useRoute } from 'vue-router'
import { GlassCard, BaseButton, AssemblyCrossSection, DataTable } from '../../ui'
import type { ColumnDef } from '@tanstack/vue-table'
import { useAssembly } from '../../composables/useAssembly'
import { useBoverket } from '../../composables/useBoverket'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import type { BoverketMaterial } from '../../types/material'

const materialColumns: ColumnDef<BoverketMaterial, any>[] = [
  { accessorKey: 'nameEn', header: 'Material', cell: (info) => info.getValue() },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'gwpA1A3', header: 'GWP', cell: (info) => h('span', { class: 'font-mono text-xs' }, `${Number(info.getValue()).toFixed(2)}`) },
]

const route = useRoute()
const { assembly, addLayer, removeLayer, moveLayer, updateLayer, loadAssembly, recalculate } = useAssembly()
const { materials, loading: materialsLoading, calcGwpPerM2 } = useBoverket()
const { assemblies: savedAssemblies, fetchAssemblies, saveAssembly } = useAssemblyStore()

onMounted(async () => {
  const editId = route.query.editId as string | undefined
  if (editId) {
    await fetchAssemblies()
    const existing = savedAssemblies.value.find(a => a.id === editId)
    if (existing) {
      loadAssembly(existing)
      recalculate()
    }
  }
})

const saveLabel = ref('Save')
async function handleSave() {
  if (!assembly.value.name.trim()) {
    saveLabel.value = 'Enter a name first'
    setTimeout(() => { saveLabel.value = 'Save' }, 2000)
    return
  }
  saveLabel.value = 'Saving...'
  await saveAssembly(assembly.value)
  saveLabel.value = 'Saved!'
  setTimeout(() => { saveLabel.value = 'Save' }, 2000)
}

const selectedMaterial = ref<BoverketMaterial | null>(null)
const thicknessInput = ref(100)
const previewGwp = computed(() => selectedMaterial.value ? calcGwpPerM2(selectedMaterial.value.id, thicknessInput.value) : 0)
const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(index: number, event: DragEvent) {
  dragFromIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragOver(index: number) {
  dragOverIndex.value = index
}

function onDragEnd() {
  if (dragFromIndex.value !== null && dragOverIndex.value !== null && dragFromIndex.value !== dragOverIndex.value) {
    moveLayer(dragFromIndex.value, dragOverIndex.value)
  }
  dragFromIndex.value = null
  dragOverIndex.value = null
}

const uiLayers = computed(() => assembly.value.layers.map(l => ({ id: l.id, name: l.materialName, hatchType: l.fillOverride ? 'solid' : l.hatchType, fillOverride: l.fillOverride, thicknessMm: l.thicknessMm, gwp: Math.round(l.gwpPerM2 * 100) / 100 })))

function handleAddLayer() {
  if (!selectedMaterial.value) return
  addLayer({ materialId: selectedMaterial.value.id, materialName: selectedMaterial.value.nameEn, hatchType: selectedMaterial.value.hatchType, thicknessMm: thicknessInput.value })
  selectedMaterial.value = null; thicknessInput.value = 100
}

// Fill override picker
const fillPickerLayerId = ref<string | null>(null)
const colorPickerValue = ref('#ec70a0')
const hatchTypes = ['concrete', 'insulation', 'wood', 'membrane', 'steel', 'air', 'brick', 'gypsum', 'earth']

const editingLayer = computed(() => assembly.value.layers.find(l => l.id === fillPickerLayerId.value))

// Inline thickness editing
const editingThicknessId = ref<string | null>(null)
const editingThicknessValue = ref(0)

function startEditThickness(layerId: string, currentMm: number) {
  editingThicknessId.value = layerId
  editingThicknessValue.value = currentMm
  nextTick(() => {
    const input = document.querySelector('input[type="number"][class*="w-16"]') as HTMLInputElement | null
    input?.focus()
    input?.select()
  })
}

function commitThickness(layerId: string) {
  if (editingThicknessValue.value > 0) {
    updateLayer(layerId, { thicknessMm: editingThicknessValue.value })
  }
  editingThicknessId.value = null
}

function toggleFillPicker(layerId: string) {
  fillPickerLayerId.value = fillPickerLayerId.value === layerId ? null : layerId
}

function setFillOverride(color: string | null, hatchType?: string) {
  const layer = assembly.value.layers.find(l => l.id === fillPickerLayerId.value)
  if (!layer) return
  if (color) {
    layer.fillOverride = color
  } else {
    layer.fillOverride = undefined
    if (hatchType) layer.hatchType = hatchType
  }
  fillPickerLayerId.value = null
}

import { getPattern as getHatchPattern } from '../../ui/hatches/patterns'
</script>
