import { defineStore } from "pinia";
import type { Task, TaskStatus } from "../types/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [] as Task[],
  }),
  getters: {
    activeTasks: (state) => state.tasks.filter((t) => t.status !== "done"),
    dueTodayTasks: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.tasks.filter(
        (t) => t.dueDate === today && t.status !== "done",
      );
    },
    completedThisWeek: (state) => {
      const now = new Date();
      const startOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay()),
      ).toISOString();
      return state.tasks.filter(
        (t) =>
          t.status === "done" && t.completedAt && t.completedAt >= startOfWeek,
      );
    },
    overdueTasks: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return state.tasks.filter(
        (t) => t.dueDate && t.dueDate < today && t.status !== "done",
      );
    },
    tasksByStatus: (state) => (status: TaskStatus) =>
      state.tasks.filter((t) => t.status === status),
  },
  actions: {
    addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
      const now = new Date().toISOString();
      this.tasks.push({
        ...task,
        id: crypto.randomUUID(),
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

        this.tasks[index] = {
          ...task,
          ...updates,
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
  },
  persist: true,
});
