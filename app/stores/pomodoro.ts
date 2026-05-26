import { defineStore } from "pinia";
import type { PomodoroSession } from "../types/task";

export const usePomodoroStore = defineStore("pomodoro", {
  state: () => ({
    activeTaskId: null as string | null,
    phase: "idle" as "work" | "short-break" | "long-break" | "idle",
    secondsLeft: 0,
    sessionCount: 0,
    sessions: [] as PomodoroSession[],
  }),
  persist: true,
});
