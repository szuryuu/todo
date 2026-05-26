<template>
  <div class="flex flex-col flex-1 gap-8 items-center justify-center pt-8">
    <div class="text-center space-y-4">
      <span class="stamp-accent text-[12px] mb-4">DEEP WORK</span>
      <h1 class="text-4xl text-[var(--ink)]">Focus Timer</h1>
    </div>

    <div
      v-if="pomodoroStore.phase === 'idle'"
      class="flex items-center gap-4 font-mono text-sm tracking-[0.22em] mt-4"
    >
      <button
        v-for="d in [25, 45, 60]"
        :key="d"
        @click="pomodoroStore.setWorkDuration(d)"
        :class="[
          'px-4 py-2 border transition-colors',
          pomodoroStore.workDurationMinutes === d
            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-bold'
            : 'border-[var(--ink)]/30 text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
        ]"
      >
        {{ d }}M
      </button>
    </div>

    <div class="relative mt-8">
      <svg width="340" height="340" class="-rotate-90">
        <circle
          cx="170"
          cy="170"
          r="160"
          fill="none"
          stroke="rgba(26, 20, 8, 0.18)"
          stroke-width="1"
        />
        <circle
          cx="170"
          cy="170"
          r="160"
          fill="none"
          stroke="#be3228"
          stroke-width="3"
          :stroke-dasharray="1005"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="butt"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-7xl font-bold text-[var(--ink)] tracking-tighter">{{
          formattedTime
        }}</span>
        <span
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] mt-4 uppercase"
        >
          {{ pomodoroStore.phase === "idle" ? "STANDBY" : pomodoroStore.phase }}
        </span>
      </div>
    </div>

    <div
      class="typewriter-border bg-[var(--surface)] p-6 mt-6 w-full max-w-md text-center"
    >
      <span
        class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase block mb-3"
        >CURRENT TARGET</span
      >
      <h2 class="text-2xl text-[var(--ink)]">
        {{ activeTask?.title || "No Task Assigned." }}
      </h2>
    </div>

    <div class="flex flex-wrap justify-center gap-6 mt-8">
      <button
        v-if="!isRunning && pomodoroStore.phase === 'idle'"
        @click="startTimer(activeTask?.id)"
        class="font-mono text-xs tracking-[0.22em] bg-[var(--ink)] text-[var(--paper)] px-8 py-4 font-bold hover:bg-[var(--accent)] transition-colors"
      >
        START SESSION
      </button>
      <button
        v-if="!isRunning && pomodoroStore.phase !== 'idle'"
        @click="startTimer()"
        class="font-mono text-xs tracking-[0.22em] bg-[var(--ink)] text-[var(--paper)] px-8 py-4 font-bold hover:bg-[var(--accent)] transition-colors"
      >
        RESUME
      </button>
      <button
        v-if="isRunning"
        @click="pauseTimer"
        class="font-mono text-xs tracking-[0.22em] typewriter-border bg-[var(--surface)] text-[var(--ink)] px-8 py-4 font-bold hover:bg-[var(--paper)] transition-colors"
      >
        PAUSE
      </button>
      <button
        v-if="pomodoroStore.phase !== 'idle'"
        @click="interruptTimer"
        class="font-mono text-xs tracking-[0.22em] typewriter-border text-[var(--accent)] px-8 py-4 hover:bg-[var(--paper)] transition-colors"
      >
        INTERRUPT
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePomodoroStore } from "~/stores/pomodoro";
import { useTaskStore } from "~/stores/task";
import { usePomodoro } from "~/composables/usePomodoro";
import {
  POMODORO_SHORT_BREAK_MINUTES,
  POMODORO_LONG_BREAK_MINUTES,
} from "~/utils/constants";

const route = useRoute();
const pomodoroStore = usePomodoroStore();
const taskStore = useTaskStore();

const { isRunning, startTimer, pauseTimer, interruptTimer } = usePomodoro();

const activeTask = computed(() => {
  const id = pomodoroStore.activeTaskId || (route.query.task as string);
  return taskStore.tasks.find((t) => t.id === id);
});

const totalSecondsInPhase = computed(() => {
  if (pomodoroStore.phase === "work")
    return (pomodoroStore.workDurationMinutes || 25) * 60;
  if (pomodoroStore.phase === "short-break")
    return POMODORO_SHORT_BREAK_MINUTES * 60;
  if (pomodoroStore.phase === "long-break")
    return POMODORO_LONG_BREAK_MINUTES * 60;
  return (pomodoroStore.workDurationMinutes || 25) * 60;
});

const dashOffset = computed(() => {
  if (pomodoroStore.phase === "idle") return 0;
  const total = 1005;
  const progress = 1 - pomodoroStore.secondsLeft / totalSecondsInPhase.value;
  return total - total * progress;
});

const formattedTime = computed(() => {
  if (pomodoroStore.phase === "idle" && !pomodoroStore.secondsLeft) {
    const m = (pomodoroStore.workDurationMinutes || 25)
      .toString()
      .padStart(2, "0");
    return `${m}:00`;
  }
  const m = Math.floor(pomodoroStore.secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const s = (pomodoroStore.secondsLeft % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
});

onMounted(() => {
  if (route.query.task && pomodoroStore.phase === "idle") {
    startTimer(route.query.task as string);
  }
});
</script>
