import type { AssemblyType, StructuralCategory } from './assembly'

export interface LeaderboardEntry {
  id: string
  name: string
  assemblyType: AssemblyType
  structuralCategory: StructuralCategory
  totalGwp: number
  displayName: string
  rank: number
}
