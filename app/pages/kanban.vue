<template>
  <div class="flex flex-col flex-1 gap-8">
    <section class="flex justify-between items-end typewriter-border-b pb-6">
      <div>
        <p
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] mb-2 uppercase"
        >
          Active Pipeline
        </p>
        <h1 class="text-4xl text-[var(--ink)] leading-tight">Kanban Board</h1>
      </div>
      <div>
        <span
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase"
          >TOTAL: {{ store.tasks.length }}</span
        >
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start">
      <div
        v-for="column in columns"
        :key="column.status"
        @dragover.prevent
        @drop="handleDrop(column.status)"
        class="flex flex-col min-h-[600px] typewriter-border bg-[var(--surface)] p-2"
      >
        <div
          class="p-3 typewriter-border-b flex justify-between items-center mb-4 bg-[var(--paper)]"
        >
          <h2
            class="font-mono text-sm tracking-[0.22em] text-[var(--ink)] font-bold uppercase"
          >
            {{ column.name }}
          </h2>
          <div class="flex items-center gap-4">
            <span
              class="font-mono text-[10px] text-[var(--muted)] tracking-[0.22em]"
            >
              [{{ store.tasksByStatus(column.status).length }}]
            </span>
            <button
              @click="toggleQuickAdd(column.status)"
              class="font-mono text-sm text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
            >
              [+]
            </button>
          </div>
        </div>

        <div
          v-if="quickAddColumn === column.status"
          class="mb-4 typewriter-border bg-[var(--paper)] p-4"
        >
          <input
            v-model="quickTitle"
            type="text"
            placeholder="Type task..."
            class="w-full bg-transparent typewriter-border-b pb-2 mb-4 text-lg text-[var(--ink)] focus:outline-none placeholder:text-[var(--muted)]"
            @keyup.enter="submitQuickAdd(column.status)"
          />
          <div class="flex justify-between items-center">
            <select
              v-model="quickPriority"
              class="bg-transparent font-mono text-[10px] tracking-[0.22em] text-[var(--ink)] focus:outline-none uppercase"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
            <div class="flex gap-4">
              <button
                @click="quickAddColumn = null"
                class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]"
              >
                CANCEL
              </button>
              <button
                @click="submitQuickAdd(column.status)"
                class="font-mono text-[10px] tracking-[0.22em] bg-[var(--ink)] text-[var(--paper)] px-3 py-1 font-bold"
              >
                ADD
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-4 flex-1 overflow-y-auto px-1 pb-4">
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
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] text-center py-8 opacity-60"
          >
            [ EMPTY ]
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
  { name: "TODO", status: "todo" },
  { name: "IN PROGRESS", status: "in-progress" },
  { name: "DONE", status: "done" },
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
