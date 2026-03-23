import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import type { Assembly, AssemblyLayer } from '../types/assembly'
import { useBoverket } from './useBoverket'

export function useAssembly() {
  const { calcGwpPerM2 } = useBoverket()
  const assembly = ref<Assembly>({
    id: uuid(), userId: '', name: '', assemblyType: 'wall', structuralCategory: 'concrete',
    layers: [], totalGwp: 0, isPublic: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  })

  function recalculate() {
    for (const layer of assembly.value.layers) {
      layer.gwpPerM2 = calcGwpPerM2(layer.materialId, layer.thicknessMm)
    }
    assembly.value.totalGwp = assembly.value.layers.reduce((sum, l) => sum + l.gwpPerM2, 0)
    assembly.value.updatedAt = new Date().toISOString()
  }

  function addLayer(input: { materialId: string; materialName: string; hatchType: string; thicknessMm: number }) {
    const layer: AssemblyLayer = { id: uuid(), materialId: input.materialId, materialName: input.materialName, hatchType: input.hatchType, thicknessMm: input.thicknessMm, gwpPerM2: 0 }
    assembly.value.layers.push(layer)
    recalculate()
  }

  function removeLayer(layerId: string) {
    assembly.value.layers = assembly.value.layers.filter(l => l.id !== layerId)
    recalculate()
  }

  function moveLayer(fromIndex: number, toIndex: number) {
    const layers = [...assembly.value.layers]
    const [moved] = layers.splice(fromIndex, 1)
    layers.splice(toIndex, 0, moved)
    assembly.value.layers = layers
  }

  function updateLayer(layerId: string, updates: Partial<Pick<AssemblyLayer, 'thicknessMm' | 'materialId' | 'materialName' | 'hatchType'>>) {
    const layer = assembly.value.layers.find(l => l.id === layerId)
    if (layer) { Object.assign(layer, updates); recalculate() }
  }

  function loadAssembly(data: Assembly) { assembly.value = { ...data } }

  return { assembly, addLayer, removeLayer, moveLayer, updateLayer, loadAssembly, recalculate }
}
