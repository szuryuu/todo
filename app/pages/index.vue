<template>
  <div class="space-y-12">
    <header
      class="border-b border-[rgba(26,24,22,0.25)] pb-4 flex justify-between items-baseline"
    >
      <h1 class="text-4xl serif-italic">{{ greeting }}</h1>
      <div
        class="text-xs font-mono uppercase tracking-[0.18em] text-[var(--muted)]"
      >
        Command Center
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2 text-[var(--ink)]">
          {{ store.activeTasks.length }}
        </div>
        <div
          class="text-xs uppercase tracking-[0.18em] text-[var(--muted)] font-mono"
        >
          Active Tasks
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2 text-[var(--ink)]">
          {{ store.dueTodayTasks.length }}
        </div>
        <div
          class="text-xs uppercase tracking-[0.18em] text-[var(--muted)] font-mono"
        >
          Due Today
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)]"
      >
        <div class="text-5xl serif-italic mb-2 text-[var(--ink)]">
          {{ store.completedThisWeek.length }}
        </div>
        <div
          class="text-xs uppercase tracking-[0.18em] text-[var(--muted)] font-mono"
        >
          Done This Week
        </div>
      </div>
      <div
        class="border border-[rgba(26,24,22,0.15)] p-6 flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--accent)] border-[rgba(192,86,59,0.3)]"
      >
        <div class="text-5xl serif-italic mb-2 font-bold">
          {{ store.overdueTasks.length }}
        </div>
        <div class="text-xs uppercase tracking-[0.18em] font-mono font-bold">
          Overdue
        </div>
      </div>
    </div>

    <section
      class="border border-[rgba(26,24,22,0.15)] p-6 bg-[var(--surface)] max-w-2xl"
    >
      <h3
        class="text-xs font-mono uppercase tracking-[0.18em] text-[var(--muted)] mb-4"
      >
        Quick Add Task
      </h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end font-mono text-xs"
      >
        <div class="space-y-1">
          <label
            class="text-[9px] uppercase tracking-wider text-[var(--muted)] block"
            >Judul Task</label
          >
          <input
            v-model="newTitle"
            type="text"
            placeholder="Beli bahan makanan..."
            class="w-full bg-transparent border-b border-[var(--ink)] py-1 focus:outline-none"
            @keyup.enter="handleQuickAdd"
          />
        </div>
        <div class="space-y-1">
          <label
            class="text-[9px] uppercase tracking-wider text-[var(--muted)] block"
            >Tenggat Waktu</label
          >
          <input
            v-model="newDueDate"
            type="date"
            class="w-full bg-transparent border-b border-[var(--ink)] py-1 focus:outline-none"
          />
        </div>
        <div class="space-y-1 flex items-center justify-between gap-4">
          <div class="flex-1">
            <label
              class="text-[9px] uppercase tracking-wider text-[var(--muted)] block"
              >Prioritas</label
            >
            <select
              v-model="newPriority"
              class="w-full bg-transparent border-b border-[var(--ink)] py-1 focus:outline-none uppercase"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            @click="handleQuickAdd"
            class="border border-[var(--ink)] px-4 py-1.5 uppercase tracking-wider hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors h-fit self-end font-bold"
          >
            Add
          </button>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <section class="space-y-6">
        <h2
          class="text-2xl serif-italic border-b border-[rgba(26,24,22,0.25)] pb-2"
        >
          Due Today
        </h2>
        <div class="space-y-3">
          <div
            v-for="task in store.dueTodayTasks"
            :key="task.id"
            class="border border-[rgba(26,24,22,0.15)] p-4 flex justify-between items-center bg-[var(--paper)]"
          >
            <div class="space-y-1">
              <span class="serif-italic text-lg text-[var(--ink)]">{{
                task.title
              }}</span>
              <div
                class="flex gap-2 text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider"
              >
                <span>{{ task.priority }} priority</span>
              </div>
            </div>
            <button
              @click="store.updateTask(task.id, { status: 'done' })"
              class="text-xs uppercase tracking-[0.18em] border border-[var(--ink)] px-4 py-1.5 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors font-mono"
            >
              Mark Done
            </button>
          </div>
          <div
            v-if="store.dueTodayTasks.length === 0"
            class="text-[var(--muted)] text-sm italic font-mono py-4"
          >
            Tidak ada task jatuh tempo hari ini.
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2
          class="text-2xl serif-italic border-b border-[rgba(26,24,22,0.25)] pb-2"
        >
          Brain Dump
        </h2>
        <BrainDump />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTaskStore } from "~/stores/task";
import type { TaskPriority } from "~/types/task";
import BrainDump from "~/components/brain/BrainDump.vue";

const store = useTaskStore();

const newTitle = ref("");
const newDueDate = ref("");
const newPriority = ref<TaskPriority>("medium");

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
});

function handleQuickAdd() {
  if (!newTitle.value.trim()) return;
  store.addTask({
    title: newTitle.value.trim(),
    dueDate: newDueDate.value || null,
    priority: newPriority.value,
    status: "todo",
    description: "",
    tags: [],
  });
  newTitle.value = "";
  newDueDate.value = "";
  newPriority.value = "medium";
}
</script>
