import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAssemblyStore } from '../useAssemblyStore'

vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useAssemblyStore (offline)', () => {
  beforeEach(() => { localStorage.clear() })

  it('starts with empty assemblies', async () => {
    const { assemblies, fetchAssemblies } = useAssemblyStore()
    await fetchAssemblies()
    expect(assemblies.value).toEqual([])
  })

  it('saves and retrieves an assembly from localStorage', async () => {
    const { assemblies, saveAssembly, fetchAssemblies } = useAssemblyStore()
    await saveAssembly({
      id: 'test-1', userId: 'u1', name: 'Test Wall',
      assemblyType: 'wall', structuralCategory: 'concrete',
      layers: [], totalGwp: 42, isPublic: false, createdAt: '', updatedAt: '',
    })
    await fetchAssemblies()
    expect(assemblies.value.length).toBe(1)
    expect(assemblies.value[0].name).toBe('Test Wall')
  })

  it('deletes an assembly', async () => {
    const { saveAssembly, deleteAssembly, assemblies, fetchAssemblies } = useAssemblyStore()
    await saveAssembly({
      id: 'test-1', userId: 'u1', name: 'To Delete',
      assemblyType: 'wall', structuralCategory: 'wood',
      layers: [], totalGwp: 10, isPublic: false, createdAt: '', updatedAt: '',
    })
    await deleteAssembly('test-1')
    await fetchAssemblies()
    expect(assemblies.value.length).toBe(0)
  })
})
