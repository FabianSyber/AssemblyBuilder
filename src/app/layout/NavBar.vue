<template>
  <nav class="glass-card-solid fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between">
    <router-link to="/" class="font-heading text-lg font-bold text-[var(--color-purple)]">Assembly Builder</router-link>
    <div class="flex gap-4 items-center">
      <router-link v-for="link in links" :key="link.to" :to="link.to"
        class="font-body text-sm text-[var(--color-purple-light)] hover:text-[var(--color-purple)] transition-colors"
        active-class="!text-[var(--color-rose)] font-semibold">{{ link.label }}</router-link>
      <span v-if="displayName" class="font-mono text-xs text-[var(--color-purple-light)]">{{ displayName }}</span>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useSession } from '../../composables/useSession'
const { displayName } = useSession()
const links = [
  { to: '/build', label: 'Builder' },
  { to: '/my-assemblies', label: 'My Assemblies' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/stats', label: 'Stats' },
]
</script>
