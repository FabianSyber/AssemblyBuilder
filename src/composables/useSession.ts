import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const displayName = ref(localStorage.getItem('displayName') ?? '')
const userId = ref(localStorage.getItem('userId') ?? '')

export function useSession() {
  const isLoggedIn = computed(() => displayName.value.length > 0)

  async function setDisplayName(name: string) {
    displayName.value = name
    localStorage.setItem('displayName', name)
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        const { data } = await supabase.auth.signInAnonymously()
        if (data.user) { userId.value = data.user.id; localStorage.setItem('userId', data.user.id) }
      }
      if (userId.value) { await supabase.from('users').upsert({ id: userId.value, display_name: name }) }
    } else {
      if (!userId.value) { const { v4 } = await import('uuid'); userId.value = v4(); localStorage.setItem('userId', userId.value) }
    }
  }

  return { displayName, userId, isLoggedIn, setDisplayName }
}
