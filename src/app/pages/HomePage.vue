<template>
  <div class="py-12 flex flex-col items-center gap-8">
    <h1 class="font-heading text-4xl font-extrabold text-[var(--color-purple)]">Assembly Builder</h1>
    <p class="font-body text-[var(--color-purple-light)] text-center max-w-md">
      Build wall, roof, and floor assemblies. See their climate impact. Compare with others.
    </p>
    <GlassCard v-if="!isLoggedIn" class="w-full max-w-sm">
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <label class="font-body text-sm text-[var(--color-purple)]">Choose a display name</label>
        <input v-model="nameInput" type="text" placeholder="Your name..."
          class="px-4 py-2 rounded-lg border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm focus:outline-none focus:border-[var(--color-rose)]" />
        <BaseButton label="Start Building" variant="primary" @click="handleLogin" />
      </form>
    </GlassCard>
    <div v-else class="flex gap-4">
      <BaseButton label="New Assembly" variant="primary" @click="$router.push('/build')" />
      <BaseButton label="Leaderboard" variant="secondary" @click="$router.push('/leaderboard')" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GlassCard, BaseButton } from '../../ui'
import { useSession } from '../../composables/useSession'
const { isLoggedIn, setDisplayName } = useSession()
const nameInput = ref('')
const router = useRouter()
async function handleLogin() {
  if (nameInput.value.trim()) { await setDisplayName(nameInput.value.trim()); router.push('/build') }
}
</script>
