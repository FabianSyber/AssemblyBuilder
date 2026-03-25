import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types/leaderboard'
import type { Assembly, AssemblyType, StructuralCategory } from '../types/assembly'

const PAGE_SIZE = 25
const LOCAL_KEY = 'assemblies'

function loadLocalAssemblies(): Assembly[] {
  const raw = localStorage.getItem(LOCAL_KEY)
  return raw ? JSON.parse(raw) : []
}

export function useLeaderboard() {
  const entries = ref<LeaderboardEntry[]>([])
  const loading = ref(false)

  async function fetchLeaderboard(assemblyType: AssemblyType, structuralCategory: StructuralCategory, page = 0) {
    loading.value = true

    if (supabase) {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      const { data, error } = await supabase
        .from('leaderboard_view').select('*')
        .eq('assembly_type', assemblyType).eq('structural_category', structuralCategory)
        .order('total_gwp', { ascending: true }).range(from, to)
      if (!error && data && data.length > 0) {
        entries.value = data.map((row: any, index: number) => ({
          id: row.id, name: row.name, assemblyType: row.assembly_type,
          structuralCategory: row.structural_category, totalGwp: row.total_gwp,
          displayName: row.display_name, rank: row.rank ?? from + index + 1,
          layers: (row.lcax_data as any)?.layers ?? [],
        }))
        loading.value = false
        return
      }
    }

    // Fallback: use local assemblies as leaderboard
    const local = loadLocalAssemblies()
      .filter(a => a.assemblyType === assemblyType && a.structuralCategory === structuralCategory && a.layers.length > 0)
      .sort((a, b) => a.totalGwp - b.totalGwp)

    entries.value = local.map((a, i) => ({
      id: a.id, name: a.name, assemblyType: a.assemblyType,
      structuralCategory: a.structuralCategory, totalGwp: a.totalGwp,
      displayName: 'Local', rank: i + 1,
      layers: a.layers,
    }))

    loading.value = false
  }

  return { entries, loading, fetchLeaderboard }
}
