<template>
  <div class="py-12">
    <!-- Hero -->
    <div class="flex flex-col items-center gap-8 mb-16">
      <h1 class="font-heading text-4xl font-extrabold text-[var(--color-purple)]">Assembly Builder</h1>
      <p class="font-body text-[var(--color-purple-light)] text-center max-w-md">
        Build wall, roof, and floor assemblies. See their climate impact. Compare with others.
      </p>
      <GlassCard v-if="!isLoggedIn" class="w-full max-w-sm">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <label class="font-body text-sm text-[var(--color-purple)]">Choose a display name</label>
          <input v-model="nameInput" type="text" placeholder="Your name..."
            class="px-4 py-2 rounded-none border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm focus:outline-none focus:border-[var(--color-rose)]" />
          <BaseButton label="Start Building" variant="primary" @click="handleLogin" />
        </form>
      </GlassCard>
      <div v-else class="flex gap-4">
        <BaseButton label="New Assembly" variant="primary" @click="$router.push('/build')" />
        <BaseButton label="Leaderboard" variant="secondary" @click="$router.push('/leaderboard')" />
      </div>
    </div>

    <!-- Assembly showcase -->
    <div v-if="showcaseAssemblies.length > 0">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-heading text-xl font-bold text-[var(--color-purple)]">
          {{ hasOwnAssemblies ? 'Your Assemblies' : 'Featured Assemblies' }}
        </h2>
        <router-link v-if="hasOwnAssemblies" to="/my-assemblies" class="font-body text-sm text-[var(--color-rose)] hover:underline">
          View all
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard v-for="a in showcaseAssemblies" :key="a.id" class="p-4 cursor-pointer" :overflow="true"
          @click="navigateToAssembly(a)">
          <StampRow :stamps="getStampsForAssembly(a, materials)" />
          <div class="mb-3 aspect-square overflow-hidden">
            <AssemblyCrossSection
              :layers="toLayers(a)"
              :title="a.name"
              :subtitle="`${a.assemblyType} — ${a.structuralCategory}`"
              :orientation="a.assemblyType === 'wall' ? 'horizontal' : 'vertical'"
              compact
              theme="light"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <Badge :label="a.assemblyType" color="lavender" />
              <Badge :label="a.structuralCategory" color="mint" />
            </div>
            <p class="font-mono text-lg font-bold text-[var(--color-rose)]">
              {{ a.totalGwp.toFixed(2) }} <span class="text-xs text-[var(--color-purple-light)]">kg CO₂e/m²</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GlassCard, BaseButton, Badge, AssemblyCrossSection, StampRow } from '../../ui'
import { useSession } from '../../composables/useSession'
import { useAssemblyStore } from '../../composables/useAssemblyStore'
import { useLeaderboard } from '../../composables/useLeaderboard'
import { useAchievements } from '../../composables/useAchievements'
import { useBoverket } from '../../composables/useBoverket'
import type { Assembly } from '../../types/assembly'

const { getStampsForAssembly } = useAchievements()
const { materials } = useBoverket()
const { isLoggedIn, setDisplayName } = useSession()
const { assemblies: myAssemblies, fetchAssemblies } = useAssemblyStore()
const { entries: leaderboardEntries, fetchLeaderboard } = useLeaderboard()
const nameInput = ref('')
const router = useRouter()

async function handleLogin() {
  if (nameInput.value.trim()) { await setDisplayName(nameInput.value.trim()); router.push('/build') }
}

onMounted(async () => {
  await fetchAssemblies()
  if (myAssemblies.value.length === 0) {
    await fetchLeaderboard('wall', 'concrete')
  }
})

const hasOwnAssemblies = computed(() => myAssemblies.value.length > 0)

// Show user's assemblies if they have any, otherwise show leaderboard entries as placeholder
const showcaseAssemblies = computed<Assembly[]>(() => {
  if (hasOwnAssemblies.value) {
    return myAssemblies.value.slice(0, 6)
  }
  // Convert leaderboard entries to Assembly-like objects for display
  return leaderboardEntries.value.slice(0, 6).map(e => ({
    id: e.id,
    userId: '',
    name: e.name,
    assemblyType: e.assemblyType,
    structuralCategory: e.structuralCategory,
    layers: [],
    totalGwp: e.totalGwp,
    isPublic: true,
    createdAt: '',
    updatedAt: '',
  }))
})

function toLayers(assembly: Assembly) {
  return assembly.layers.map(l => ({
    id: l.id,
    name: l.materialName,
    hatchType: l.hatchType,
    fillOverride: l.fillOverride,
    thicknessMm: l.thicknessMm,
    gwp: Math.round(l.gwpPerM2 * 100) / 100,
  }))
}

function navigateToAssembly(a: Assembly) {
  if (hasOwnAssemblies.value) {
    router.push({ name: 'builder', query: { editId: a.id } })
  } else {
    router.push('/leaderboard')
  }
}
</script>
