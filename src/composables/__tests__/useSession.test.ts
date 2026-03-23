import { describe, it, expect, vi } from 'vitest'
import { useSession } from '../useSession'

vi.mock('../../lib/supabase', () => ({ supabase: null }))

describe('useSession', () => {
  it('starts with no display name', () => {
    const { displayName, isLoggedIn } = useSession()
    expect(displayName.value).toBe('')
    expect(isLoggedIn.value).toBe(false)
  })
  it('sets display name in offline mode', async () => {
    const { setDisplayName, displayName, isLoggedIn } = useSession()
    await setDisplayName('TestUser')
    expect(displayName.value).toBe('TestUser')
    expect(isLoggedIn.value).toBe(true)
  })
})
