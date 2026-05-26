import { defineStore } from "pinia";
import type { Task, TaskStatus, DailyNote } from "../types/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
    dailyNotes: [] as DailyNote[],
    lastFocusDate: "",
  }),
  getters: {
    inboxTasks: (state) => state.tasks.filter((t) => t.bucket === "inbox"),
    activeTasks: (state) =>
      state.tasks.filter((t) => t.bucket === "active" && t.status !== "done"),
    somedayTasks: (state) => state.tasks.filter((t) => t.bucket === "someday"),
    tasksByStatus: (state) => (status: TaskStatus) =>
      state.tasks.filter((t) => t.bucket === "active" && t.status === status),
    focusTasks: (state) => state.tasks.filter((t) => t.isFocusToday),
    dueTodayTasks: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.tasks.filter(
        (t) =>
          t.bucket === "active" && t.dueDate === today && t.status !== "done",
      );
    },
    overdueTasks: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.tasks.filter(
        (t) =>
          t.bucket === "active" &&
          t.dueDate &&
          t.dueDate < today &&
          t.status !== "done",
      );
    },
  },
  actions: {
    checkFocusReset() {
      const today = new Date().toISOString().split("T")[0];
      if (this.lastFocusDate !== today) {
        this.tasks.forEach((t) => {
          t.isFocusToday = false;
        });
        this.lastFocusDate = today;
      }
    },
    addTask(
      task: Omit<Task, "id" | "createdAt" | "updatedAt" | "pomodoroCount">,
    ) {
      const now = new Date().toISOString();
      this.tasks.push({
        ...task,
        id: crypto.randomUUID(),
        pomodoroCount: 0,
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTask(id: string, updates: Partial<Task>) {
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        const now = new Date().toISOString();
        const task = this.tasks[index];
        const newStatus = updates.status || task.status;

        let staleSince = task.staleSince;
        if (newStatus === "in-progress" && task.status !== "in-progress") {
          staleSince = now;
        } else if (newStatus !== "in-progress") {
          staleSince = undefined;
        }

        this.tasks[index] = {
          ...task,
          ...updates,
          staleSince,
          updatedAt: now,
          completedAt:
            newStatus === "done" && task.status !== "done"
              ? now
              : task.completedAt,
        };
      }
    },
    deleteTask(id: string) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
    },
    incrementPomodoro(id: string) {
      const task = this.tasks.find((t) => t.id === id);
      if (task) task.pomodoroCount++;
    },
  },
  persist: true,
});
