<template>
  <div>
    <!-- Search -->
    <input
      v-if="searchable"
      v-model="globalFilter"
      :placeholder="searchPlaceholder"
      class="w-full px-3 py-2 rounded-none border border-[rgba(200,180,230,0.4)] bg-white/80 font-body text-sm mb-2 focus:outline-none focus:border-[var(--color-rose)]"
    />

    <!-- Table -->
    <div class="max-h-64 overflow-y-auto">
      <p v-if="loading" class="font-body text-xs text-[var(--color-purple-light)] py-2 text-center">Loading...</p>
      <table v-else class="w-full">
        <thead class="sticky top-0 bg-white/90 z-10">
          <tr>
            <th
              v-for="header in table.getHeaderGroups()[0]?.headers"
              :key="header.id"
              class="text-left px-2 py-1 font-body text-xs font-semibold text-[var(--color-purple)] cursor-pointer select-none border-b border-[rgba(200,180,230,0.3)]"
            >
              <template v-if="filterableColumns.includes(header.column.id)">
                <span
                  @click.stop="toggleFilterDropdown(header.column.id)"
                  class="inline-flex items-center gap-1 hover:text-[var(--color-rose)]"
                >
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <span class="text-[10px]">{{ openFilterColumn === header.column.id ? '▲' : '▼' }}</span>
                  <span v-if="(columnFilters[header.column.id]?.size ?? 0) > 0"
                    class="ml-1 px-1 bg-[var(--color-rose)] text-white text-[10px] leading-tight">
                    {{ columnFilters[header.column.id]?.size }}
                  </span>
                </span>
              </template>
              <template v-else>
                <span @click="header.column.getToggleSortingHandler()?.($event)">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <span class="ml-1 text-[var(--color-purple-light)]">
                    {{ { asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? '' }}
                  </span>
                </span>
              </template>
            </th>
          </tr>
          <tr v-if="openFilterColumn">
            <td :colspan="table.getHeaderGroups()[0]?.headers.length ?? 1" class="p-0">
              <div class="border-b border-[rgba(200,180,230,0.3)] bg-white/95 p-2 max-h-40 overflow-y-auto">
                <div class="flex flex-wrap gap-1 mb-1" v-if="(columnFilters[openFilterColumn]?.size ?? 0) > 0">
                  <span
                    v-for="val in columnFilters[openFilterColumn]"
                    :key="val"
                    class="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-xs bg-[var(--color-pink)] text-[var(--color-purple)] border border-[var(--color-rose)]"
                  >
                    {{ val }}
                    <button @click="toggleFilterValue(openFilterColumn!, val)" class="hover:text-[var(--color-rose)]">✕</button>
                  </span>
                  <button @click="clearColumnFilter(openFilterColumn!)" class="font-body text-xs text-[var(--color-rose)] hover:underline ml-1">Clear</button>
                </div>
                <label
                  v-for="val in uniqueColumnValues(openFilterColumn)"
                  :key="val"
                  class="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/60 font-body text-xs text-[var(--color-purple-light)]"
                >
                  <input
                    type="checkbox"
                    :checked="columnFilters[openFilterColumn!]?.has(val)"
                    @change="toggleFilterValue(openFilterColumn!, val)"
                    class="w-4 h-4 rounded-none border-2 border-[rgba(200,180,230,0.4)] accent-[var(--color-rose)] cursor-pointer appearance-none bg-white/80 checked:bg-[var(--color-rose)] relative checked:after:content-['✓'] checked:after:text-white checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                  />
                  {{ val }}
                  <span class="ml-auto font-mono text-[10px] text-[var(--color-purple-light)]">
                    {{ columnValueCount(openFilterColumn!, val) }}
                  </span>
                </label>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            @click="$emit('select', row.original)"
            :class="['cursor-pointer transition-colors',
              isSelected(row.original)
                ? 'bg-[var(--color-pink)]'
                : 'hover:bg-white/40']"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-2 py-1.5 font-body text-sm text-[var(--color-purple-light)] border-b border-[rgba(200,180,230,0.15)]"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td :colspan="table.getHeaderGroups()[0]?.headers.length ?? 1" class="px-2 py-4 font-body text-xs text-[var(--color-purple-light)] text-center">
              <slot name="empty">No data found</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="showCount" class="font-mono text-xs text-[var(--color-purple-light)] mt-2">
      {{ table.getRowModel().rows.length }} of {{ data.length }} items
    </p>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'

defineOptions({ name: 'DataTable' })

const props = withDefaults(defineProps<{
  data: T[]
  columns: ColumnDef<T, any>[]
  loading?: boolean
  selectedId?: string
  keyField?: string
  searchable?: boolean
  searchPlaceholder?: string
  filterableColumns?: string[]
  showCount?: boolean
}>(), {
  loading: false,
  keyField: 'id',
  searchable: false,
  searchPlaceholder: 'Search...',
  filterableColumns: () => [],
  showCount: false,
})

defineEmits<{ select: [item: T] }>()

const globalFilter = ref('')
const sorting = ref<SortingState>([])
const openFilterColumn = ref<string | null>(null)
const columnFilters = ref<Record<string, Set<string>>>({})

function toggleFilterDropdown(colId: string) {
  openFilterColumn.value = openFilterColumn.value === colId ? null : colId
}

function toggleFilterValue(colId: string, val: string) {
  const current = columnFilters.value[colId] ?? new Set<string>()
  const next = new Set(current)
  if (next.has(val)) next.delete(val)
  else next.add(val)
  columnFilters.value = { ...columnFilters.value, [colId]: next }
}

function clearColumnFilter(colId: string) {
  columnFilters.value = { ...columnFilters.value, [colId]: new Set<string>() }
}

function uniqueColumnValues(colId: string): string[] {
  const vals = new Set(props.data.map(row => String(row[colId])))
  return [...vals].sort()
}

function columnValueCount(colId: string, val: string): number {
  return props.data.filter(row => String(row[colId]) === val).length
}

function isSelected(row: T): boolean {
  return props.selectedId != null && String(row[props.keyField]) === props.selectedId
}

// Pre-filter by column filters
const filteredData = computed(() => {
  let result = props.data
  for (const [colId, selected] of Object.entries(columnFilters.value)) {
    if (selected.size > 0) {
      result = result.filter(row => selected.has(String(row[colId])))
    }
  }
  return result
})

const table = useVueTable({
  get data() { return filteredData.value },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get globalFilter() { return globalFilter.value },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  globalFilterFn: 'includesString',
})
</script>
