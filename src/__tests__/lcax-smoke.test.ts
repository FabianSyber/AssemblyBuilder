import { describe, it, expect } from 'vitest'

describe('LCAx', () => {
  it('can be imported', async () => {
    const lcax = await import('lcax')
    expect(lcax).toBeDefined()
    // Log available exports to verify API surface
    console.log('LCAx exports:', Object.keys(lcax))
  })
})
