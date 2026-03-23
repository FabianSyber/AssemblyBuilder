import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  { path: '/build', name: 'builder', component: () => import('./pages/BuilderPage.vue') },
  { path: '/my-assemblies', name: 'my-assemblies', component: () => import('./pages/MyAssembliesPage.vue') },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('./pages/LeaderboardPage.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
