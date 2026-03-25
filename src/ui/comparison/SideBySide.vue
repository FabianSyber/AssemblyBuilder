<template>
  <div class="grid gap-6 grid-cols-1 md:grid-cols-2">
    <div v-for="assembly in assemblies" :key="assembly.id">
      <AssemblyCrossSection :layers="toLayers(assembly)" :title="assembly.name"
        :subtitle="`${assembly.assemblyType} — ${assembly.structuralCategory}`"
        :orientation="assembly.assemblyType === 'wall' ? 'horizontal' : 'vertical'" />
    </div>
  </div>
</template>
<script setup lang="ts">
import AssemblyCrossSection from '../assembly/AssemblyCrossSection.vue'
import type { Assembly } from '../../types/assembly'
defineOptions({ name: 'SideBySide' })
defineProps<{ assemblies: Assembly[] }>()
function toLayers(assembly: Assembly) {
  return assembly.layers.map(l => ({ id: l.id, name: l.materialName, hatchType: l.fillOverride ? 'solid' : l.hatchType, fillOverride: l.fillOverride, thicknessMm: l.thicknessMm, gwp: l.gwpPerM2 }))
}
</script>
