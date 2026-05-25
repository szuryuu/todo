<template>
  <div class="flex flex-col flex-1 gap-12">
    <header
      class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"
    >
      <div class="relative inline-block">
        <h1 class="text-5xl -rotate-1 relative z-10">{{ greeting }}</h1>
        <div
          class="absolute bottom-1 left-0 w-full h-5 bg-[var(--highlight)] -z-10 -rotate-2"
        ></div>
      </div>
      <div
        class="text-2xl text-[var(--muted)] rotate-2 flex items-center gap-2"
      >
        My Command Center
        <Rocket class="w-6 h-6" stroke-width="2.5" />
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        class="sketchy-box p-6 bg-[#fef08a] rotate-1 flex flex-col items-center justify-center min-h-[160px]"
      >
        <div class="text-6xl font-bold">{{ store.activeTasks.length }}</div>
        <div class="text-xl opacity-80">Active Tasks</div>
      </div>
      <div
        class="sketchy-box p-6 bg-[#bae6fd] -rotate-2 flex flex-col items-center justify-center min-h-[160px]"
      >
        <div class="text-6xl font-bold">{{ store.dueTodayTasks.length }}</div>
        <div class="text-xl opacity-80">Due Today</div>
      </div>
      <div
        class="sketchy-box p-6 bg-[#bbf7d0] rotate-2 flex flex-col items-center justify-center min-h-[160px]"
      >
        <div class="text-6xl font-bold">
          {{ store.completedThisWeek.length }}
        </div>
        <div class="text-xl opacity-80">Done This Week</div>
      </div>
      <div
        class="sketchy-box p-6 bg-[#fecdd3] -rotate-1 flex flex-col items-center justify-center min-h-[160px] text-[var(--accent)]"
      >
        <div class="text-6xl font-bold">{{ store.overdueTasks.length }}</div>
        <div class="text-xl font-bold">Overdue!!</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 items-start mt-4">
      <section class="sketchy-box p-8 flex flex-col h-full bg-white rotate-1">
        <div
          class="flex justify-between items-center mb-6 border-b-2 border-dashed border-[var(--ink)] pb-2"
        >
          <h2 class="text-4xl flex items-center gap-3">
            <Target class="w-8 h-8" stroke-width="2.5" />
            Due Today
          </h2>
        </div>
        <div class="flex-1 flex flex-col gap-4">
          <div
            v-for="task in store.dueTodayTasks"
            :key="task.id"
            class="flex justify-between items-center bg-[#f8fafc] p-4 sketchy-border -rotate-1 hover:rotate-0 transition-transform"
          >
            <div class="flex flex-col">
              <span class="text-2xl">{{ task.title }}</span>
              <span class="text-lg text-[var(--muted)]"
                >Pri: {{ task.priority }}</span
              >
            </div>
            <button
              @click="store.updateTask(task.id, { status: 'done' })"
              class="sketchy-box px-4 py-2 text-xl bg-[#bbf7d0] hover:bg-[#86efac] transition-colors flex items-center gap-2"
            >
              Done <Check class="w-5 h-5" stroke-width="3" />
            </button>
          </div>
          <div
            v-if="store.dueTodayTasks.length === 0"
            class="text-3xl text-[var(--muted)] text-center py-12 opacity-70 rotate-2 flex items-center justify-center gap-3"
          >
            Yay, no tasks for today!
            <PartyPopper class="w-8 h-8" stroke-width="2.5" />
          </div>
        </div>
      </section>

      <section class="sketchy-box p-8 flex flex-col h-full bg-white -rotate-1">
        <div
          class="flex justify-between items-center mb-6 border-b-2 border-dashed border-[var(--ink)] pb-2"
        >
          <h2 class="text-4xl flex items-center gap-3">
            <Brain class="w-8 h-8" stroke-width="2.5" />
            Brain Dump
          </h2>
          <span
            class="text-xl text-[var(--muted)] rotate-3 flex items-center gap-2"
          >
            AI Magic <Wand2 class="w-5 h-5" stroke-width="2.5" />
          </span>
        </div>
        <BrainDump />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Rocket,
  Target,
  Check,
  PartyPopper,
  Brain,
  Wand2,
} from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import BrainDump from "~/components/brain/BrainDump.vue";

const store = useTaskStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning!";
  if (hour < 15) return "Good Afternoon!";
  if (hour < 18) return "Good Evening!";
  return "Good Night!";
});
</script>
