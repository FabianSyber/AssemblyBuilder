import type { Assembly } from './assembly'
import type { BoverketMaterial } from './material'

export type AchievementCategory = 'gwp' | 'creativity' | 'mastery' | 'exploration'

export interface AchievementDef {
  id: string
  name: string
  description: string
  hint: string
  icon: string
  stamp?: { icon: string; color: string }
  category: AchievementCategory
  check: (assemblies: Assembly[], materials: BoverketMaterial[]) => boolean
  qualifiesAssembly?: (assembly: Assembly, materials: BoverketMaterial[]) => boolean
}

export interface AchievementUnlock {
  unlockedAt: string
  seen: boolean
}

export type AchievementState = Record<string, AchievementUnlock>
