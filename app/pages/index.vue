<template>
  <div class="space-y-12">
    <header>
      <h1 class="text-4xl mb-2 serif-italic">{{ greeting }}</h1>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2">
          {{ store.activeTasks.length }}
        </div>
        <div class="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Active Tasks
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2">
          {{ store.dueTodayTasks.length }}
        </div>
        <div class="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Due Today
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2">
          {{ store.completedThisWeek.length }}
        </div>
        <div class="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Done This Week
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--accent)]"
      >
        <div class="text-5xl serif-italic mb-2">
          {{ store.overdueTasks.length }}
        </div>
        <div class="text-xs uppercase tracking-[0.18em]">Overdue</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <section>
        <h2
          class="text-2xl serif-italic mb-6 border-b border-[rgba(26,24,22,0.25)] pb-2"
        >
          Due Today
        </h2>
        <div class="space-y-4">
          <div
            v-for="task in store.dueTodayTasks"
            :key="task.id"
            class="border border-[rgba(26,24,22,0.15)] p-4 flex justify-between items-center bg-[var(--paper)]"
          >
            <span class="serif-italic text-lg">{{ task.title }}</span>
            <button
              @click="store.updateTask(task.id, { status: 'done' })"
              class="text-xs uppercase tracking-[0.18em] border border-[var(--ink)] px-3 py-1 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              Done
            </button>
          </div>
          <div
            v-if="store.dueTodayTasks.length === 0"
            class="text-[var(--muted)] text-sm italic"
          >
            Tidak ada task jatuh tempo hari ini.
          </div>
        </div>
      </section>
      <section>
        <h2
          class="text-2xl serif-italic mb-6 border-b border-[rgba(26,24,22,0.25)] pb-2"
        >
          Brain Dump
        </h2>
        <BrainDump />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";
import BrainDump from "~/components/brain/BrainDump.vue";

const store = useTaskStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
});
</script>
