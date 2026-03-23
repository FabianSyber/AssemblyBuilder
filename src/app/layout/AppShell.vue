<template>
  <div class="min-h-screen" style="background: var(--color-lavender);">
    <NavBar />
    <main class="pt-16 px-4 max-w-7xl mx-auto"><slot /></main>
  </div>
</template>
<script setup lang="ts">
import NavBar from './NavBar.vue'
</script>
