import { ref } from 'vue'
import type { BoverketMaterial } from '../types/material'
import fallbackData from '../data/boverket-materials.json'

const BOVERKET_API = 'https://api.boverket.se/klimatdatabas/api/Klimat/v2/GetAllresources/latest/sv/json'

const materials = ref<BoverketMaterial[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

const CATEGORY_HATCH_MAP: Record<string, string> = {
  'Betong': 'concrete',
  'Isolering': 'insulation',
  'Trävaror': 'wood',
  'Stål och andra metaller': 'steel',
  'Tätskikt': 'membrane',
  'Murblock och tegel': 'brick',
  'Byggskivor': 'gypsum',
  'Bruk och bindemedel': 'gypsum',
  'Färg och fog': 'gypsum',
  'Fönster, dörrar och glas': 'steel',
  'Energi och bränsle': 'air',
  'Återbrukade byggprodukter': 'concrete',
}

function mapResource(raw: Record<string, any>): BoverketMaterial | null {
  const id = String(raw.ResourceId)
  const name = raw.Name ?? ''
  const names = raw.Names ?? {}
  const nameEn = names.EN ?? name

  // Get Boverket category
  const boverketCat = (raw.Categories ?? []).find(
    (c: any) => c.ClassificationType === 'Boverket'
  )
  const category = boverketCat?.Text ?? ''
  const hatchType = CATEGORY_HATCH_MAP[category] ?? 'concrete'

  // Get GWP A1-A3 value
  const gwpItem = (raw.DataItems ?? []).find(
    (d: any) => d.PropertyCode?.includes('GWP')
  )
  if (!gwpItem) return null

  const a1a3 = (gwpItem.DataValueItems ?? []).find(
    (v: any) => v.DataModuleCode === 'A1-A3 Conservative'
  )
  const gwpPerKg = a1a3?.Value ?? 0

  // Get density from Conversions
  const volumeConversion = (raw.Conversions ?? []).find(
    (c: any) => c.Field === 'Volume'
  )
  const densityKgM3 = volumeConversion?.Value ?? null

  // The API reports everything per kg. Convert to per m3 for our internal format
  // since most building calculations work with volume.
  const declaredUnit = 'kg'
  const gwpA1A3 = gwpPerKg

  return {
    id: `bvk-${id}`,
    name,
    nameEn,
    category,
    declaredUnit,
    gwpA1A3,
    densityKgM3: densityKgM3 != null ? Number(densityKgM3) : undefined,
    hatchType,
  }
}

const BUILT_IN_MATERIALS: BoverketMaterial[] = [
  { id: 'builtin-air-gap', name: 'Luftspalt', nameEn: 'Air gap', category: 'Air', declaredUnit: 'm3', gwpA1A3: 0, densityKgM3: 1.2, hatchType: 'air' },
]

async function fetchMaterials(force = false) {
  if (fetched && !force) return
  fetched = true
  loading.value = true
  error.value = null

  try {
    const res = await fetch(BOVERKET_API)
    if (!res.ok) throw new Error(`API responded ${res.status}`)
    const data = await res.json()
    const resources: any[] = data.Resources ?? []

    const mapped = resources
      .map(mapResource)
      .filter((m): m is BoverketMaterial => m !== null)

    if (mapped.length > 0) {
      materials.value = [...BUILT_IN_MATERIALS, ...mapped]
      loading.value = false
      return
    }
    throw new Error('No materials parsed from API')
  } catch (e) {
    error.value = `Boverket API unavailable, using fallback data.`
    console.warn('Boverket API error:', e)
    materials.value = [...BUILT_IN_MATERIALS, ...(fallbackData as BoverketMaterial[])]
  }

  loading.value = false
}

export function useBoverket() {
  // Trigger fetch on first use
  fetchMaterials()

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
  return { materials, loading, error, searchMaterials, getMaterial, calcGwpPerM2, fetchMaterials }
}
