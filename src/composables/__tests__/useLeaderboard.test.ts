import { describe, it, expect, vi } from 'vitest'
import { useLeaderboard } from '../useLeaderboard'

vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useLeaderboard', () => {
  it('returns empty entries when offline', async () => {
    const { entries, fetchLeaderboard } = useLeaderboard()
    await fetchLeaderboard('wall', 'concrete')
    expect(entries.value).toEqual([])
  })
})
