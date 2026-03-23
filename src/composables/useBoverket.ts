import { ref } from 'vue'
import type { BoverketMaterial } from '../types/material'
import materialsData from '../data/boverket-materials.json'

const materials = ref<BoverketMaterial[]>(materialsData as BoverketMaterial[])

export function useBoverket() {
  function searchMaterials(query: string): BoverketMaterial[] {
    const q = query.toLowerCase()
    return materials.value.filter(
      m => m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
    )
  }
  function getMaterial(id: string): BoverketMaterial | undefined {
    return materials.value.find(m => m.id === id)
  }
  function calcGwpPerM2(materialId: string, thicknessMm: number): number {
    const mat = getMaterial(materialId)
    if (!mat) return 0
    const thicknessM = thicknessMm / 1000
    switch (mat.declaredUnit) {
      case 'm3': return mat.gwpA1A3 * thicknessM
      case 'm2': return mat.gwpA1A3
      case 'kg':
        if (!mat.densityKgM3) return 0
        return mat.gwpA1A3 * thicknessM * mat.densityKgM3
      default: return 0
    }
  }
  return { materials, searchMaterials, getMaterial, calcGwpPerM2 }
}
