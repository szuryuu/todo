<template>
  <div class="space-y-8 h-full flex flex-col">
    <section
      class="flex justify-between items-end border-b border-zinc-800 pb-4 sketchy-border"
    >
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight font-sans text-zinc-100 flex items-center gap-3"
        >
          <span
            class="size-3 bg-amber-500 inline-block rounded-full animate-pulse"
          ></span>
          Active Pipelines
        </h1>
        <p class="font-hand text-zinc-500 mt-1">
          Status and progression of active nodes.
        </p>
      </div>
      <div
        class="font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 sketchy-border"
      >
        Nodes Allocated: {{ store.activeTasks.length }}
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
      <div
        v-for="(column, idx) in columns"
        :key="column.status"
        @dragover.prevent
        @drop="handleDrop(column.status)"
        class="flex flex-col min-h-[600px] border border-zinc-800 bg-zinc-900/10 p-2 sketchy-border relative"
      >
        <div
          class="p-3 border-b border-zinc-800 flex justify-between items-center mb-4 sketchy-border bg-zinc-950"
        >
          <div class="flex items-center gap-2">
            <h2 class="font-sans font-bold text-sm text-zinc-200 uppercase">
              {{ column.name }}
            </h2>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-mono text-[10px] text-zinc-500">
              {{ store.tasksByStatus(column.status).length }} vol
            </span>
            <button
              @click="toggleQuickAdd(column.status)"
              class="font-mono text-xs text-amber-500 border border-amber-500/30 bg-amber-500/10 px-1.5 sketchy-border hover:bg-amber-500 hover:text-zinc-950 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div
          v-if="quickAddColumn === column.status"
          class="mb-4 border border-zinc-700 bg-zinc-900 p-3 sketchy-border"
        >
          <input
            v-model="quickTitle"
            type="text"
            placeholder="Initialize instruction..."
            class="w-full bg-transparent border-b border-zinc-700 pb-2 mb-3 font-sans text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
            @keyup.enter="submitQuickAdd(column.status)"
          />
          <div class="flex justify-between items-center">
            <select
              v-model="quickPriority"
              class="bg-zinc-950 font-mono text-[10px] text-zinc-400 border border-zinc-800 px-1 py-0.5 focus:outline-none sketchy-border"
            >
              <option value="low">LOW</option>
              <option value="medium">MED</option>
              <option value="high">HIGH</option>
            </select>
            <div class="flex gap-2">
              <button
                @click="quickAddColumn = null"
                class="font-hand text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                Abort
              </button>
              <button
                @click="submitQuickAdd(column.status)"
                class="font-hand text-[10px] bg-amber-500 text-zinc-950 px-2 py-0.5 sketchy-border font-bold hover:bg-amber-400"
              >
                Deploy
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto px-1 pb-4">
          <TaskCard
            v-for="task in store.tasksByStatus(column.status)"
            :key="task.id"
            :task="task"
            @dragstart="handleDragStart(task.id)"
            @click="openTask(task)"
            @delete="store.deleteTask(task.id)"
          />
          <div
            v-if="store.tasksByStatus(column.status).length === 0"
            class="font-hand text-sm text-zinc-600 text-center py-8"
          >
            Pipeline stream clear.
          </div>
        </div>
      </div>
    </div>

    <TaskModal
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
      @save="handleSaveTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "~/stores/task";
import type { Task, TaskStatus, TaskPriority } from "~/types/task";
import TaskCard from "~/components/task/TaskCard.vue";
import TaskModal from "~/components/task/TaskModal.vue";

const store = useTaskStore();

const columns: { name: string; status: TaskStatus }[] = [
  { name: "Queue", status: "todo" },
  { name: "Processing", status: "in-progress" },
  { name: "Resolved", status: "done" },
];

const draggedTaskId = ref<string | null>(null);
const selectedTask = ref<Task | null>(null);
const quickAddColumn = ref<TaskStatus | null>(null);
const quickTitle = ref("");
const quickPriority = ref<TaskPriority>("medium");

function handleDragStart(id: string) {
  draggedTaskId.value = id;
}
function handleDrop(status: TaskStatus) {
  if (draggedTaskId.value) {
    store.updateTask(draggedTaskId.value, { status });
    draggedTaskId.value = null;
  }
}
function openTask(task: Task) {
  selectedTask.value = task;
}
function handleSaveTask(updatedFields: Partial<Task>) {
  if (selectedTask.value) {
    store.updateTask(selectedTask.value.id, updatedFields);
    selectedTask.value = null;
  }
}
function toggleQuickAdd(status: TaskStatus) {
  if (quickAddColumn.value === status) {
    quickAddColumn.value = null;
  } else {
    quickAddColumn.value = status;
    quickTitle.value = "";
    quickPriority.value = "medium";
  }
}
function submitQuickAdd(status: TaskStatus) {
  if (!quickTitle.value.trim()) return;
  store.addTask({
    title: quickTitle.value.trim(),
    priority: quickPriority.value,
    status: status,
    bucket: "active",
    energy: "light",
    description: "",
    tags: [],
    dueDate: null,
  });
  quickAddColumn.value = null;
  quickTitle.value = "";
}
</script>
