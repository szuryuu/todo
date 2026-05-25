<template>
  <div class="space-y-8">
    <header
      class="flex justify-between items-center border-b border-[rgba(26,24,22,0.25)] pb-4"
    >
      <h1 class="text-3xl font-serif italic">Kanban Board</h1>
      <div class="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        Total: {{ store.tasks.length }} Tasks
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <div
        v-for="column in columns"
        :key="column.status"
        @dragover.prevent
        @drop="handleDrop(column.status)"
        class="border border-[rgba(26,24,22,0.15)] bg-[var(--surface)] p-4 space-y-4 min-h-[500px]"
      >
        <div
          class="flex justify-between items-center border-b border-[rgba(26,24,22,0.15)] pb-2"
        >
          <h2 class="text-xl font-serif italic flex items-center gap-2">
            {{ column.name }}
            <span
              class="font-mono text-xs uppercase tracking-wider bg-[rgba(26,24,22,0.1)] px-2 py-0.5 text-[var(--muted)]"
            >
              {{ store.tasksByStatus(column.status).length }}
            </span>
          </h2>
          <button
            @click="toggleQuickAdd(column.status)"
            class="text-lg font-mono leading-none hover:text-[var(--accent)] transition-colors"
          >
            +
          </button>
        </div>

        <div
          v-if="quickAddColumn === column.status"
          class="border border-[rgba(26,24,22,0.25)] p-3 bg-[var(--paper)] space-y-3"
        >
          <input
            v-model="quickTitle"
            type="text"
            placeholder="Judul task cepat..."
            class="w-full bg-transparent border-b border-[rgba(26,24,22,0.25)] pb-1 text-sm font-mono focus:outline-none focus:border-[var(--ink)]"
            @keyup.enter="submitQuickAdd(column.status)"
          />
          <div class="flex justify-between items-center gap-2">
            <select
              v-model="quickPriority"
              class="bg-transparent font-mono text-[10px] uppercase tracking-wider focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div class="flex gap-2">
              <button
                @click="quickAddColumn = null"
                class="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]"
              >
                Batal
              </button>
              <button
                @click="submitQuickAdd(column.status)"
                class="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)] font-bold"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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
            class="text-center py-12 text-xs text-[var(--muted)] italic font-mono border border-dashed border-[rgba(26,24,22,0.1)]"
          >
            Kolom kosong
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
  { name: "Todo", status: "todo" },
  { name: "In Progress", status: "in-progress" },
  { name: "Done", status: "done" },
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
    description: "",
    tags: [],
    dueDate: null,
  });
  quickAddColumn.value = null;
  quickTitle.value = "";
}
</script>
