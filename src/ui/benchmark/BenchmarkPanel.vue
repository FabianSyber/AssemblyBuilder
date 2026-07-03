<template>
  <GlassCard class="p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-heading text-sm font-semibold text-[var(--color-purple)]">Benchmark</h3>
      <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide font-semibold"
        :style="{ background: bandColor, color: '#2c1f36' }">{{ bandLabel }}</span>
    </div>

    <!-- Assembly-level band (always visible) -->
    <div class="flex items-baseline justify-between mb-2">
      <span class="font-body text-xs text-[var(--color-purple)]">This {{ assemblyType }} · A1–A3</span>
      <span class="font-mono text-base font-bold text-[var(--color-purple)]">{{ gwp.toFixed(1) }}<span class="text-[10px] text-[var(--color-purple)] ml-1">kg CO₂e/m²</span></span>
    </div>

    <!-- Legible band bar: three labelled zones + a clear pointer -->
    <div class="relative mt-6 mb-1">
      <!-- current-value pointer -->
      <div class="absolute -top-5 flex flex-col items-center -translate-x-1/2 z-10" :style="{ left: pct(gwp) + '%' }">
        <span class="font-mono text-[11px] font-bold text-[var(--color-purple)] leading-none whitespace-nowrap">{{ gwp.toFixed(0) }}</span>
        <span class="text-[var(--color-purple)] text-[10px] leading-none">▼</span>
      </div>
      <div class="flex h-5 w-full overflow-hidden border border-[rgba(107,76,122,0.25)]">
        <div class="flex items-center justify-center" :style="{ width: zoneW(0, band.lowMax) + '%', background: ZONE.low }">
          <span class="font-mono text-[10px] font-semibold" style="color:#1f4d3f">Low</span>
        </div>
        <div class="flex items-center justify-center" :style="{ width: zoneW(band.lowMax, band.typicalMax) + '%', background: ZONE.typical }">
          <span class="font-mono text-[10px] font-semibold" style="color:#7a4b12">Typical</span>
        </div>
        <div class="flex items-center justify-center flex-1" :style="{ background: ZONE.heavy }">
          <span class="font-mono text-[10px] font-semibold text-white">Heavy</span>
        </div>
      </div>
      <!-- scale ticks -->
      <div class="relative h-3 mt-0.5 font-mono text-[9px] text-[var(--color-purple)]">
        <span class="absolute -translate-x-1/2" :style="{ left: pct(band.lowMax) + '%' }">{{ band.lowMax }}</span>
        <span class="absolute -translate-x-1/2" :style="{ left: pct(band.typicalMax) + '%' }">{{ band.typicalMax }}</span>
      </div>
    </div>

    <!-- Expandable: building-budget comparison -->
    <button class="w-full flex items-center justify-between mt-2 pt-3 border-t border-[rgba(200,180,230,0.4)] text-left"
      @click="expanded = !expanded">
      <span class="font-body text-xs font-semibold text-[var(--color-purple)]">Compare to a building climate budget</span>
      <span class="text-[var(--color-purple)] text-xs transition-transform" :class="{ 'rotate-90': expanded }">▶</span>
    </button>

    <div v-if="expanded" class="mt-3">
      <div class="flex flex-wrap gap-1.5 mb-3">
        <button v-for="t in targets" :key="t.id"
          class="px-2 py-1 text-[11px] font-mono border transition-colors"
          :class="selected.id === t.id
            ? 'bg-[var(--color-rose)] text-white border-[var(--color-rose)]'
            : 'bg-white/70 text-[var(--color-purple)] border-[rgba(107,76,122,0.35)] hover:border-[var(--color-rose)]'"
          @click="selectedId = t.id">{{ t.name.replace(' (proposed)', '') }}</button>
      </div>

      <div class="flex items-baseline justify-between font-mono text-xs text-[var(--color-purple)] mb-1">
        <span>Building budget</span>
        <span><b>{{ selected.value }}</b> kg/m² BTA · {{ selected.modules }}</span>
      </div>
      <div class="flex items-baseline justify-between font-mono text-xs text-[var(--color-purple)] mb-2">
        <span>{{ assemblyType }}’s allocated share</span>
        <span>this {{ assemblyType }} vs <b :style="{ color: withinBudget ? '#1f7a4d' : 'var(--color-rose)' }">≤ {{ allocated.toFixed(0) }}</b></span>
      </div>

      <!-- Allocation bar: fill = current, dark line = allocated target at 100% -->
      <div class="relative h-5 bg-[rgba(107,76,122,0.12)] border border-[rgba(107,76,122,0.25)] overflow-hidden">
        <div class="absolute inset-y-0 left-0 transition-all"
          :style="{ width: allocFillPct + '%', background: withinBudget ? ZONE.low : ZONE.heavy }" />
        <div class="absolute inset-y-0 right-0 w-[2px] bg-[var(--color-purple)]" />
        <span class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold"
          :style="{ color: withinBudget ? '#1f4d3f' : '#fff' }">
          {{ gwp.toFixed(0) }} / {{ allocated.toFixed(0) }} kg/m²
        </span>
      </div>
      <p class="font-body text-[11px] mt-1.5" :style="{ color: withinBudget ? '#1f7a4d' : 'var(--color-rose)' }">
        {{ withinBudget
          ? `Within this ${assemblyType}’s share of the ${targetShort} budget.`
          : `Over its allocated share — this ${assemblyType} eats into other parts’ budget.` }}
      </p>

      <!-- Assumptions (editable) -->
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] text-[var(--color-purple)]">
        <label class="font-body">{{ assemblyType }} m² per m² BTA</label>
        <input v-model.number="areaPerBta" type="number" min="0.05" step="0.05"
          class="w-16 px-2 py-0.5 font-mono text-xs text-[var(--color-purple)] border border-[rgba(107,76,122,0.4)] bg-white/90" />
        <span class="font-body">· element share {{ (share * 100).toFixed(1) }}% of total</span>
      </div>

      <p class="font-body text-[11px] text-[var(--color-purple)] mt-3 leading-snug opacity-90">
        ⓘ {{ selected.note }}
      </p>
      <p class="font-body text-[11px] text-[var(--color-purple)] mt-1.5 leading-snug opacity-90">
        <b>Scope:</b> building targets are A1–A5 per m² BTA; this assembly is A1–A3 per m² of element area. Shares are Plant-LCA-derived; the allocation is an indicative bridge, not a compliance check.
      </p>
    </div>
  </GlassCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import type { AssemblyType } from '../../types/assembly'
import {
  ASSEMBLY_BANDS,
  BUILDING_TARGETS,
  ELEMENT_SHARE,
  AREA_PER_BTA,
  bandFor,
  allocatedElementTarget,
} from '../../data/benchmarks'

const props = defineProps<{ assemblyType: AssemblyType; gwp: number }>()

// Legible zone colours (the pastel tokens are too pale for filled bars).
const ZONE = { low: '#a9d9c4', typical: '#f4d19b', heavy: '#ec70a0' }

const expanded = ref(false)

const targets = BUILDING_TARGETS
const selectedId = ref(BUILDING_TARGETS[0].id)
const selected = computed(() => targets.find((t) => t.id === selectedId.value) ?? targets[0])
const targetShort = computed(() => selected.value.name.replace(' (proposed)', ''))

const areaPerBta = ref(AREA_PER_BTA[props.assemblyType])
const share = computed(() => ELEMENT_SHARE[props.assemblyType] ?? 0)

const band = computed(() => ASSEMBLY_BANDS[props.assemblyType])
const bandLabel = computed(() => ({ low: 'Low-carbon', typical: 'Typical', heavy: 'Heavy' })[bandFor(props.assemblyType, props.gwp)])
const bandColor = computed(() => ({ low: ZONE.low, typical: ZONE.typical, heavy: ZONE.heavy })[bandFor(props.assemblyType, props.gwp)])

// Scale the band bar to ~1.4× the typical ceiling so "heavy" has room.
const bandScale = computed(() => band.value.typicalMax * 1.4)
function pct(v: number) {
  return Math.max(0, Math.min(100, (v / bandScale.value) * 100))
}
function zoneW(from: number, to: number) {
  return pct(to) - pct(from)
}

const allocated = computed(() => allocatedElementTarget(selected.value.value, props.assemblyType, areaPerBta.value || AREA_PER_BTA[props.assemblyType]))
const withinBudget = computed(() => props.gwp <= allocated.value)
const allocFillPct = computed(() => (allocated.value > 0 ? Math.max(0, Math.min(100, (props.gwp / allocated.value) * 100)) : 0))
</script>
