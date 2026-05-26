<template>
  <section class="flex flex-col gap-4 sm:gap-6">
    <div class="flex justify-between items-center typewriter-border-b pb-2">
      <h2 class="text-xl sm:text-2xl text-[var(--ink)]">Selected Focus</h2>
      <span class="stamp-accent text-[8px]">EXECUTE</span>
    </div>
    <div class="flex-1 space-y-4 sm:space-y-6">
      <div
        v-for="task in store.focusTasks"
        :key="task.id"
        class="typewriter-border p-4 sm:p-6 bg-[var(--paper)] hover:bg-[var(--surface)] transition-colors relative"
      >
        <h3 class="text-lg sm:text-xl text-[var(--ink)]">{{ task.title }}</h3>
        <p
          v-if="task.nextAction"
          class="font-mono text-[10px] sm:text-xs text-[var(--muted)] mt-3 sm:mt-4"
        >
          >> {{ task.nextAction }}
        </p>
        <div
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 typewriter-border-t"
        >
          <button
            @click="store.updateTask(task.id, { isFocusToday: false })"
            class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-2 sm:py-0"
          >
            [ UNSET ]
          </button>
          <button
            @click="startPomodoro(task.id)"
            class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--paper)] bg-[var(--ink)] px-4 py-2 hover:bg-[var(--accent)] transition-colors font-bold"
          >
            START TIMER
          </button>
        </div>
      </div>
      <div
        v-if="store.focusTasks.length < 3"
        class="typewriter-border p-4 sm:p-6 text-center border-dashed bg-transparent opacity-60"
      >
        <span
          class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
          >SLOT AVAILABLE</span
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const router = useRouter();

function startPomodoro(id: string) {
  router.push(`/pomodoro?task=${id}`);
}
</script>
