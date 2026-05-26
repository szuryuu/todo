import { defineStore } from "pinia";
import type { PomodoroSession } from "../types/task";

export const usePomodoroStore = defineStore("pomodoro", {
  state: () => ({
    activeTaskId: null as string | null,
    phase: "idle" as "work" | "short-break" | "long-break" | "idle",
    secondsLeft: 25 * 60,
    sessionCount: 0,
    sessions: [] as PomodoroSession[],
    workDurationMinutes: 25,
  }),
  actions: {
    setWorkDuration(minutes: number) {
      this.workDurationMinutes = minutes;
      if (this.phase === "idle") {
        this.secondsLeft = minutes * 60;
      }
    },
  },
  persist: true,
});
