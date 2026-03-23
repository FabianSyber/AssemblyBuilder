import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { Assembly } from '../types/assembly'
import { useSession } from './useSession'

const LOCAL_KEY = 'assemblies'

export function useAssemblyStore() {
  const assemblies = ref<Assembly[]>([])
  const loading = ref(false)

  function loadLocal(): Assembly[] {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  }

  function saveLocal(data: Assembly[]) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  }

  async function fetchAssemblies() {
    const { userId } = useSession()
    loading.value = true
    if (supabase && userId.value) {
      const { data, error } = await supabase
        .from('assemblies').select('*')
        .eq('user_id', userId.value)
        .order('updated_at', { ascending: false })
      if (!error && data) {
        assemblies.value = data.map(row => ({
          id: row.id, userId: row.user_id, name: row.name,
          assemblyType: row.assembly_type, structuralCategory: row.structural_category,
          layers: (row.lcax_data as any)?.layers ?? [], totalGwp: row.total_gwp,
          isPublic: row.is_public, createdAt: row.created_at, updatedAt: row.updated_at,
        }))
        saveLocal(assemblies.value)
      }
    } else {
      assemblies.value = loadLocal()
    }
    loading.value = false
  }

  async function saveAssembly(assembly: Assembly) {
    const { userId } = useSession()
    assembly.userId = userId.value
    if (supabase) {
      await supabase.from('assemblies').upsert({
        id: assembly.id, user_id: assembly.userId, name: assembly.name,
        assembly_type: assembly.assemblyType, structural_category: assembly.structuralCategory,
        lcax_data: { layers: assembly.layers }, total_gwp: assembly.totalGwp,
        is_public: assembly.isPublic, gwp_unit: 'kgCO2e/m2', schema_version: 1,
      })
    }
    const local = loadLocal()
    const idx = local.findIndex(a => a.id === assembly.id)
    if (idx >= 0) local[idx] = assembly
    else local.push(assembly)
    saveLocal(local)
    assemblies.value = local
  }

  async function deleteAssembly(id: string) {
    if (supabase) { await supabase.from('assemblies').delete().eq('id', id) }
    const local = loadLocal().filter(a => a.id !== id)
    saveLocal(local)
    assemblies.value = local
  }

  return { assemblies, loading, fetchAssemblies, saveAssembly, deleteAssembly }
}
