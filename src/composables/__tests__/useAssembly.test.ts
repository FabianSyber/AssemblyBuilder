import { describe, it, expect } from 'vitest'
import { useAssembly } from '../useAssembly'

describe('useAssembly', () => {
  it('creates a new assembly with defaults', () => {
    const { assembly } = useAssembly()
    expect(assembly.value.name).toBe('')
    expect(assembly.value.layers).toEqual([])
    expect(assembly.value.assemblyType).toBe('wall')
  })
  it('adds a layer and recalculates total GWP', () => {
    const { assembly, addLayer } = useAssembly()
    addLayer({ materialId: 'bvk-concrete-c30', materialName: 'Concrete C30/37', hatchType: 'concrete', thicknessMm: 150 })
    expect(assembly.value.layers.length).toBe(1)
    expect(assembly.value.totalGwp).toBeCloseTo(42, 0)
  })
  it('removes a layer and recalculates', () => {
    const { assembly, addLayer, removeLayer } = useAssembly()
    addLayer({ materialId: 'bvk-concrete-c30', materialName: 'Concrete', hatchType: 'concrete', thicknessMm: 150 })
    const layerId = assembly.value.layers[0].id
    removeLayer(layerId)
    expect(assembly.value.layers.length).toBe(0)
    expect(assembly.value.totalGwp).toBe(0)
  })
  it('reorders layers', () => {
    const { assembly, addLayer, moveLayer } = useAssembly()
    addLayer({ materialId: 'a', materialName: 'First', hatchType: 'concrete', thicknessMm: 100 })
    addLayer({ materialId: 'b', materialName: 'Second', hatchType: 'wood', thicknessMm: 50 })
    moveLayer(1, 0)
    expect(assembly.value.layers[0].materialName).toBe('Second')
  })
})
