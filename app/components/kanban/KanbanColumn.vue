<template>
  <div
    class="flex flex-col gap-4 min-h-[500px]"
    @dragover.prevent
    @dragenter.prevent
    @drop="$emit('drop-task', $event, status)"
  >
    <div
      class="flex items-center justify-between border-b-2 border-[var(--ink)] pb-3"
    >
      <div class="flex items-center gap-3">
        <h2
          class="font-bold text-[var(--ink)] text-lg uppercase tracking-widest"
        >
          {{ name }}
        </h2>
        <span class="font-mono text-xs text-[var(--muted)]"
          >[{{ tasks.length }}]</span
        >
      </div>
      <button
        @click="toggleQuickAdd"
        class="text-[var(--ink)] hover:text-[var(--accent)] transition-colors p-1"
      >
        <Plus :size="20" stroke-width="2" />
      </button>
    </div>

    <div
      v-if="isQuickAddOpen"
      class="border border-[rgba(26,20,8,0.18)] bg-[var(--surface)] p-4"
    >
      <input
        v-model="quickTitle"
        type="text"
        placeholder="Type task target..."
        class="w-full bg-transparent text-[var(--ink)] text-lg outline-none placeholder-[var(--muted)] mb-4"
        @keyup.enter="submitQuickAdd"
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
            @click="isQuickAddOpen = false"
            class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            CANCEL
          </button>
          <button
            @click="submitQuickAdd"
            class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--paper)] bg-[var(--ink)] px-4 py-1.5 hover:bg-[var(--accent)] transition-colors font-bold"
          >
            ADD
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        draggable="true"
        @dragstart="$emit('dragstart-task', $event, task.id)"
        class="cursor-grab active:cursor-grabbing"
      >
        <TaskCard
          :task="task"
          @click="$emit('open-modal', task)"
          @delete="$emit('delete-task', task.id)"
        />
      </div>
      <div
        v-if="tasks.length === 0"
        class="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] text-center py-8 opacity-60"
      >
        [ EMPTY ZONE ]
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import type { Task, TaskStatus, TaskPriority } from "~/types/task";

const props = defineProps<{
  name: string;
  status: TaskStatus;
  tasks: Task[];
}>();
const emit = defineEmits([
  "drop-task",
  "dragstart-task",
  "open-modal",
  "delete-task",
]);

const store = useTaskStore();
const isQuickAddOpen = ref(false);
const quickTitle = ref("");
const quickPriority = ref<TaskPriority>("medium");

function toggleQuickAdd() {
  isQuickAddOpen.value = !isQuickAddOpen.value;
  if (isQuickAddOpen.value) {
    quickTitle.value = "";
    quickPriority.value = "medium";
  }
}

function submitQuickAdd() {
  if (!quickTitle.value.trim()) return;
  store.addTask({
    title: quickTitle.value.trim(),
    priority: quickPriority.value,
    status: props.status,
    bucket: "active",
    energy: "light",
    context: "none",
    subtasks: [],
    dueDate: null,
  });
  isQuickAddOpen.value = false;
  quickTitle.value = "";
}
</script>
