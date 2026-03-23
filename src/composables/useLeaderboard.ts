import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../types/leaderboard'
import type { AssemblyType, StructuralCategory } from '../types/assembly'

const PAGE_SIZE = 25

export function useLeaderboard() {
  const entries = ref<LeaderboardEntry[]>([])
  const loading = ref(false)

  async function fetchLeaderboard(assemblyType: AssemblyType, structuralCategory: StructuralCategory, page = 0) {
    if (!supabase) { entries.value = []; return }
    loading.value = true
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from('leaderboard_view').select('*')
      .eq('assembly_type', assemblyType).eq('structural_category', structuralCategory)
      .order('total_gwp', { ascending: true }).range(from, to)
    if (!error && data) {
      entries.value = data.map((row: any, index: number) => ({
        id: row.id, name: row.name, assemblyType: row.assembly_type,
        structuralCategory: row.structural_category, totalGwp: row.total_gwp,
        displayName: row.display_name, rank: row.rank ?? from + index + 1,
      }))
    }
    loading.value = false
  }

  return { entries, loading, fetchLeaderboard }
}
