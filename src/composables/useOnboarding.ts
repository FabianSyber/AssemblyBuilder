import { ref, computed } from 'vue'
import type { Challenge } from '../data/challenges'

const DONE_KEY = 'ab-challenges-done'

function loadDone(): Record<string, string> {
  const raw = localStorage.getItem(DONE_KEY)
  return raw ? JSON.parse(raw) : {}
}

function saveDone(d: Record<string, string>) {
  localStorage.setItem(DONE_KEY, JSON.stringify(d))
}

// --- State (module-level singleton) ---
const active = ref<Challenge | null>(null)
const baselineGwp = ref(0)
const done = ref<Record<string, string>>(loadDone())

export interface ChallengeProgress {
  /** kg saved vs baseline (can be negative if the user went over). */
  reduced: number
  /** Fraction reduced vs baseline, e.g. 0.5 for a 50% cut. */
  pct: number
  passed: boolean
}

export function useOnboarding() {
  const targetGwp = computed(() =>
    active.value ? baselineGwp.value * active.value.targetRatio : 0,
  )

  function start(challenge: Challenge, baseline: number) {
    active.value = challenge
    baselineGwp.value = baseline
  }

  function stop() {
    active.value = null
    baselineGwp.value = 0
  }

  function progress(currentGwp: number): ChallengeProgress {
    const reduced = baselineGwp.value - currentGwp
    const pct = baselineGwp.value !== 0 ? reduced / baselineGwp.value : 0
    return { reduced, pct, passed: !!active.value && currentGwp <= targetGwp.value }
  }

  function activeHint(currentGwp: number): string {
    if (!active.value) return ''
    const hints = active.value.hints
    const { pct, passed } = progress(currentGwp)
    if (passed) return hints[hints.length - 1]
    if (hints.length <= 2) return hints[0]
    // Distribute the non-success hints across 0..1 progress toward the target.
    const midHints = hints.slice(0, -1)
    const step = 1 / midHints.length
    const idx = Math.min(midHints.length - 1, Math.max(0, Math.floor(pct / step)))
    return midHints[idx]
  }

  function complete(id: string) {
    if (done.value[id]) return
    done.value = { ...done.value, [id]: new Date().toISOString() }
    saveDone(done.value)
  }

  function isDone(id: string): boolean {
    return !!done.value[id]
  }

  return { active, baselineGwp, targetGwp, done, start, stop, progress, activeHint, complete, isDone }
}
