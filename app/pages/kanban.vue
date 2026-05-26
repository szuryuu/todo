<template>
  <div class="flex flex-col h-full gap-8">
    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[rgba(26,20,8,0.18)] pb-6"
    >
      <div>
        <span
          class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
          >Active Pipeline</span
        >
        <h1
          class="text-4xl font-bold text-[var(--ink)] uppercase tracking-tight"
        >
          Kanban Board
        </h1>
      </div>

      <div
        class="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em]"
      >
        <div
          class="flex items-center border border-[rgba(26,20,8,0.18)] bg-[var(--surface)] p-0.5"
        >
          <button
            @click="filterContext = 'all'"
            :class="
              filterContext === 'all'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            ALL
          </button>
          <button
            @click="filterContext = 'campus'"
            :class="
              filterContext === 'campus'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            CAMPUS
          </button>
          <button
            @click="filterContext = 'work'"
            :class="
              filterContext === 'work'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            WORK
          </button>
          <button
            @click="filterContext = 'personal'"
            :class="
              filterContext === 'personal'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            PERSONAL
          </button>
        </div>
        <div
          class="flex items-center border border-[rgba(26,20,8,0.18)] bg-[var(--surface)] p-0.5"
        >
          <button
            @click="filterEnergy = 'all'"
            :class="
              filterEnergy === 'all'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            ALL ENERGY
          </button>
          <button
            @click="filterEnergy = 'light'"
            :class="
              filterEnergy === 'light'
                ? 'bg-[var(--ink)] text-[var(--paper)] font-bold'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            "
            class="px-3 py-1.5 transition-colors"
          >
            LIGHT
          </button>
        </div>
      </div>
    </header>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start flex-1"
    >
      <KanbanColumn
        v-for="col in columns"
        :key="col.status"
        :name="col.name"
        :status="col.status"
        :tasks="getTasks(col.status)"
        @drop-task="handleDrop"
        @dragstart-task="handleDragStart"
        @open-modal="openModal"
        @delete-task="store.deleteTask"
      />
    </div>

    <TaskModal
      :is-open="isModalOpen"
      :task="selectedTask"
      @close="closeModal"
      @save="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";
import type { Task, TaskStatus, TaskContext, TaskEnergy } from "~/types/task";

const store = useTaskStore();
const filterContext = ref<TaskContext | "all">("all");
const filterEnergy = ref<TaskEnergy | "all">("all");

const columns: { name: string; status: TaskStatus }[] = [
  { name: "TODO", status: "todo" },
  { name: "IN PROGRESS", status: "in-progress" },
  { name: "DONE", status: "done" },
];

const draggedTaskId = ref<string | null>(null);
const selectedTask = ref<Task | null>(null);
const isModalOpen = ref(false);

const filteredTasks = computed(() => {
  return store.activeTasks.filter((t) => {
    const matchContext =
      filterContext.value === "all" || t.context === filterContext.value;
    const matchEnergy =
      filterEnergy.value === "all" || t.energy === filterEnergy.value;
    return matchContext && matchEnergy;
  });
});

function getTasks(status: TaskStatus) {
  return filteredTasks.value.filter((t) => t.status === status);
}

function handleDragStart(event: DragEvent, id: string) {
  draggedTaskId.value = id;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }
}

function handleDrop(event: DragEvent, status: TaskStatus) {
  const taskId =
    draggedTaskId.value || event.dataTransfer?.getData("text/plain");
  if (taskId) {
    store.updateTask(taskId, { status });
  }
  draggedTaskId.value = null;
}

function openModal(task: Task) {
  selectedTask.value = task;
  isModalOpen.value = true;
}

function closeModal() {
  selectedTask.value = null;
  isModalOpen.value = false;
}
</script>
