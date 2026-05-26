<template>
  <section class="flex flex-col gap-4 sm:gap-6">
    <div class="flex justify-between items-center typewriter-border-b pb-2">
      <h2 class="text-xl sm:text-2xl text-[var(--ink)]">Active Queue</h2>
      <span
        class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
        >{{ availableActive.length }} PENDING</span
      >
    </div>
    <div class="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
      <div
        v-for="task in availableActive"
        :key="task.id"
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 typewriter-border bg-[var(--paper)] hover:bg-[var(--surface)] transition-colors"
      >
        <div class="flex flex-col gap-2 w-full sm:w-auto">
          <span class="text-base sm:text-lg text-[var(--ink)]">{{
            task.title
          }}</span>
          <div class="flex gap-2 sm:gap-3 flex-wrap">
            <span
              class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase"
              >PRIORITY: {{ task.priority }}</span
            >
            <span
              class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase"
              >ENERGY: {{ task.energy }}</span
            >
          </div>
        </div>
        <button
          @click="setFocus(task.id)"
          :disabled="store.focusTasks.length >= 3"
          class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] px-3 py-2 sm:py-1 typewriter-border text-[var(--ink)] disabled:opacity-30 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
        >
          [ FOCUS ]
        </button>
      </div>
      <div
        v-if="availableActive.length === 0"
        class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] text-center py-8"
      >
        QUEUE IS EMPTY.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const availableActive = computed(() =>
  store.activeTasks.filter((t) => !t.isFocusToday),
);

function setFocus(id: string) {
  if (store.focusTasks.length < 3) store.updateTask(id, { isFocusToday: true });
}
</script>
