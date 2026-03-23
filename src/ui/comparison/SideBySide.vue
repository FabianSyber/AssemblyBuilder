<template>
  <div class="flex gap-6">
    <div v-for="assembly in assemblies" :key="assembly.id" class="flex-1">
      <AssemblyCrossSection :layers="toLayers(assembly)" :title="assembly.name"
        :subtitle="`${assembly.assemblyType} — ${assembly.structuralCategory}`" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AssemblyCrossSection from '../assembly/AssemblyCrossSection.vue'
import type { Assembly } from '../../types/assembly'
defineOptions({ name: 'SideBySide' })
defineProps<{ assemblies: Assembly[] }>()
function toLayers(assembly: Assembly) {
  return assembly.layers.map(l => ({ id: l.id, name: l.materialName, hatchType: l.hatchType, thicknessMm: l.thicknessMm, gwp: l.gwpPerM2 }))
}
</script>
