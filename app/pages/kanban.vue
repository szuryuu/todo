<template>
  <div class="flex flex-col flex-1 gap-10">
    <header
      class="flex justify-between items-end border-b-2 border-dashed border-[var(--muted)] pb-4"
    >
      <div>
        <h1 class="text-5xl -rotate-1 flex items-center gap-3">
          <Pin class="w-10 h-10" stroke-width="2.5" />
          Kanban Board
        </h1>
      </div>
      <div class="text-2xl rotate-2">Total tasks: {{ store.tasks.length }}</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start">
      <div
        v-for="(column, idx) in columns"
        :key="column.status"
        @dragover.prevent
        @drop="handleDrop(column.status)"
        class="flex flex-col min-h-[600px] sketchy-box p-5 bg-[#f8fafc]"
        :class="{
          'rotate-1': idx === 0,
          '-rotate-1': idx === 1,
          'rotate-2': idx === 2,
        }"
      >
        <div
          class="flex justify-between items-center mb-6 border-b-2 border-[var(--ink)] pb-4 border-dashed"
        >
          <h2 class="text-3xl flex items-center gap-3">
            <span class="text-2xl px-3 sketchy-border bg-white">{{
              store.tasksByStatus(column.status).length
            }}</span>
            {{ column.name }}
          </h2>
          <button
            @click="toggleQuickAdd(column.status)"
            class="sketchy-box w-10 h-10 flex items-center justify-center text-3xl bg-[#fef08a] hover:bg-[#fde047] transition-colors"
          >
            +
          </button>
        </div>

        <div
          v-if="quickAddColumn === column.status"
          class="sketchy-border p-4 mb-6 bg-[#fef9c3] rotate-1"
        >
          <input
            v-model="quickTitle"
            type="text"
            placeholder="Write task..."
            class="w-full bg-transparent border-b-2 border-[var(--ink)] border-dotted pb-2 mb-4 text-2xl focus:outline-none placeholder:text-black/30"
            @keyup.enter="submitQuickAdd(column.status)"
          />
          <div class="flex justify-between items-center">
            <select
              v-model="quickPriority"
              class="bg-transparent text-xl focus:outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Med</option>
              <option value="high">High</option>
            </select>
            <div class="flex gap-4">
              <button
                @click="quickAddColumn = null"
                class="text-xl text-[var(--accent)] underline decoration-wavy"
              >
                Cancel
              </button>
              <button
                @click="submitQuickAdd(column.status)"
                class="sketchy-box px-4 py-1 bg-white text-xl"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-10">
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
            class="text-center py-12 text-2xl text-[var(--muted)] opacity-60 -rotate-2 flex items-center justify-center gap-3"
          >
            Nothing here... <Ghost class="w-8 h-8" stroke-width="2" />
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
import { Pin, Ghost } from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import type { Task, TaskStatus, TaskPriority } from "~/types/task";
import TaskCard from "~/components/task/TaskCard.vue";
import TaskModal from "~/components/task/TaskModal.vue";

const store = useTaskStore();

const columns: { name: string; status: TaskStatus }[] = [
  { name: "To-Do", status: "todo" },
  { name: "Doing", status: "in-progress" },
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
