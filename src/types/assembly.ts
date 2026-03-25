export type AssemblyType = 'wall' | 'roof' | 'floor'
export type StructuralCategory = 'concrete' | 'wood' | 'hybrid' | 'steel' | 'masonry' | 'other'

export interface AssemblyLayer {
  id: string
  materialId: string
  materialName: string
  hatchType: string
  fillOverride?: string // solid color hex or undefined to use hatch
  thicknessMm: number
  gwpPerM2: number
}

export interface Assembly {
  id: string
  userId: string
  name: string
  assemblyType: AssemblyType
  structuralCategory: StructuralCategory
  layers: AssemblyLayer[]
  totalGwp: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}
