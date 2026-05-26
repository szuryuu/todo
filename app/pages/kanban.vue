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
      <div
        v-for="col in columns"
        :key="col.status"
        class="flex flex-col gap-4 min-h-[500px]"
        @dragover.prevent
        @dragenter.prevent
        @drop="handleDrop($event, col.status)"
      >
        <div
          class="flex items-center justify-between border-b-2 border-[var(--ink)] pb-3"
        >
          <div class="flex items-center gap-3">
            <h2
              class="font-bold text-[var(--ink)] text-lg uppercase tracking-widest"
            >
              {{ col.name }}
            </h2>
            <span class="font-mono text-xs text-[var(--muted)]"
              >[{{ getTasks(col.status).length }}]</span
            >
          </div>
          <button
            @click="toggleQuickAdd(col.status)"
            class="text-[var(--ink)] hover:text-[var(--accent)] transition-colors p-1"
          >
            <Plus :size="20" stroke-width="2" />
          </button>
        </div>

        <div
          v-if="quickAddColumn === col.status"
          class="border border-[rgba(26,20,8,0.18)] bg-[var(--surface)] p-4"
        >
          <input
            v-model="quickTitle"
            type="text"
            placeholder="Type task target..."
            class="w-full bg-transparent text-[var(--ink)] text-lg outline-none placeholder-[var(--muted)] mb-4"
            @keyup.enter="submitQuickAdd(col.status)"
            autofocus
          />
          <div
            class="flex items-center justify-between border-t border-[rgba(26,20,8,0.18)] pt-3"
          >
            <select
              v-model="quickPriority"
              class="bg-transparent font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink)] outline-none cursor-pointer"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
            <div class="flex items-center gap-4">
              <button
                @click="quickAddColumn = null"
                class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              >
                CANCEL
              </button>
              <button
                @click="submitQuickAdd(col.status)"
                class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--paper)] bg-[var(--ink)] px-4 py-1.5 hover:bg-[var(--accent)] transition-colors font-bold"
              >
                ADD
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            v-for="task in getTasks(col.status)"
            :key="task.id"
            draggable="true"
            @dragstart="handleDragStart($event, task.id)"
            class="cursor-grab active:cursor-grabbing"
          >
            <TaskCard
              :task="task"
              @click="openModal(task)"
              @delete="store.deleteTask(task.id)"
            />
          </div>
          <div
            v-if="getTasks(col.status).length === 0"
            class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] text-center py-8 opacity-60"
          >
            [ EMPTY ZONE ]
          </div>
        </div>
      </div>
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
import { ref, computed } from "vue";
import { Plus } from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskContext,
  TaskEnergy,
} from "~/types/task";
import TaskCard from "~/components/task/TaskCard.vue";
import TaskModal from "~/components/task/TaskModal.vue";

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
const quickAddColumn = ref<TaskStatus | null>(null);
const quickTitle = ref("");
const quickPriority = ref<TaskPriority>("medium");

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
    context: "none",
    subtasks: [],
    dueDate: null,
  });
  quickAddColumn.value = null;
  quickTitle.value = "";
}
</script>
