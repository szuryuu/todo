<template>
  <div class="space-y-8 h-full flex flex-col items-center justify-center pt-12">
    <div class="text-center space-y-4">
      <div
        class="inline-block font-mono text-[10px] text-amber-500 border border-amber-500/30 bg-amber-500/5 px-3 py-1 rounded-full sketchy-border"
      >
        [Telemetry Focus Timer]
      </div>
      <h1
        class="text-4xl font-extrabold tracking-tight font-sans text-zinc-100"
      >
        Node Execution
      </h1>
      <p class="font-hand text-zinc-500 max-w-md mx-auto">
        Lock your attention to a single node. Background telemetry will record
        your cycle completion.
      </p>
    </div>

    <div class="relative mt-8">
      <svg width="300" height="300" class="-rotate-90 sketchy-border">
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="#27272a"
          stroke-width="2"
        />
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="#f59e0b"
          stroke-width="2"
          :stroke-dasharray="879"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
        />
      </svg>
      <div
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <span
          class="font-mono text-6xl font-bold text-zinc-100 tracking-tighter"
          >{{ formattedTime }}</span
        >
        <span class="font-hand text-xs text-amber-500 mt-2"
          >{{
            pomodoroStore.phase === "idle" ? "Standby" : pomodoroStore.phase
          }}
          Phase</span
        >
      </div>
    </div>

    <div
      class="border border-zinc-800 bg-zinc-900/40 p-4 sketchy-border mt-4 w-full max-w-md text-center relative overflow-hidden"
    >
      <div class="absolute inset-0 -z-10 opacity-30">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#hand-hatch)"></rect>
        </svg>
      </div>
      <span class="font-mono text-[10px] text-zinc-500 uppercase block mb-1"
        >Target Node</span
      >
      <h2 class="font-sans text-lg text-zinc-200">
        {{ activeTask?.title || "None Selected" }}
      </h2>
    </div>

    <div class="flex gap-4 mt-6">
      <button
        v-if="!isRunning && pomodoroStore.phase === 'idle' && activeTask"
        @click="startTimer(activeTask.id)"
        class="font-hand text-sm bg-amber-500 text-zinc-950 px-8 py-3 font-bold sketchy-border hover:bg-amber-400"
      >
        Initialize Cycle
      </button>
      <button
        v-if="isRunning"
        @click="pauseTimer"
        class="font-hand text-sm border border-amber-500/50 bg-amber-500/10 text-amber-500 px-8 py-3 sketchy-border hover:bg-amber-500/20"
      >
        Halt
      </button>
      <button
        v-if="pomodoroStore.phase !== 'idle'"
        @click="interruptTimer"
        class="font-hand text-sm border border-red-500/50 bg-red-500/10 text-red-500 px-8 py-3 sketchy-border hover:bg-red-500/20"
      >
        Abort Mission
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
  POMODORO_WORK_MINUTES,
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
  if (pomodoroStore.phase === "work") return POMODORO_WORK_MINUTES * 60;
  if (pomodoroStore.phase === "short-break")
    return POMODORO_SHORT_BREAK_MINUTES * 60;
  if (pomodoroStore.phase === "long-break")
    return POMODORO_LONG_BREAK_MINUTES * 60;
  return POMODORO_WORK_MINUTES * 60;
});

const dashOffset = computed(() => {
  if (pomodoroStore.phase === "idle") return 0;
  const total = 879;
  const progress = 1 - pomodoroStore.secondsLeft / totalSecondsInPhase.value;
  return total - total * progress;
});

const formattedTime = computed(() => {
  if (pomodoroStore.phase === "idle" && !pomodoroStore.secondsLeft)
    return "25:00";
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
