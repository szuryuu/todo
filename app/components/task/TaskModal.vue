<template>
  <div
    class="fixed inset-0 bg-[rgba(26,24,22,0.4)] backdrop-blur-xs flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-[var(--paper)] border border-[var(--ink)] w-full max-w-lg p-6 space-y-6 relative"
    >
      <div
        class="flex justify-between items-center border-b border-[rgba(26,24,22,0.25)] pb-3"
      >
        <h3 class="text-xl font-serif italic">Detail Task</h3>
        <button
          @click="$emit('close')"
          class="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          Close
        </button>
      </div>

      <div class="space-y-4 font-mono text-sm">
        <div class="space-y-1">
          <label
            class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
            >Judul</label
          >
          <input
            v-model="editedTask.title"
            type="text"
            class="w-full bg-transparent border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)]"
          />
        </div>

        <div class="space-y-1">
          <label
            class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
            >Deskripsi</label
          >
          <textarea
            v-model="editedTask.description"
            rows="3"
            class="w-full bg-transparent border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)] resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label
              class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
              >Status</label
            >
            <select
              v-model="editedTask.status"
              class="w-full bg-[var(--paper)] border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)] uppercase tracking-wider text-xs"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="space-y-1">
            <label
              class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
              >Prioritas</label
            >
            <select
              v-model="editedTask.priority"
              class="w-full bg-[var(--paper)] border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)] uppercase tracking-wider text-xs"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label
              class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
              >Tenggat Waktu</label
            >
            <input
              v-model="editedTask.dueDate"
              type="date"
              class="w-full bg-transparent border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)] text-xs"
            />
          </div>

          <div class="space-y-1">
            <label
              class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] block"
              >Tags (pisahkan koma)</label
            >
            <input
              v-model="tagsString"
              type="text"
              class="w-full bg-transparent border border-[rgba(26,24,22,0.25)] p-2 focus:outline-none focus:border-[var(--ink)] text-xs"
              placeholder="fitur, bug, refactor"
            />
          </div>
        </div>

        <div
          class="border-t border-[rgba(26,24,22,0.15)] pt-3 grid grid-cols-2 gap-2 text-[10px] text-[var(--muted)] uppercase tracking-wider"
        >
          <div>Dibuat: {{ formatDate(task.createdAt) }}</div>
          <div>Diperbarui: {{ formatDate(task.updatedAt) }}</div>
        </div>
      </div>

      <div
        class="flex justify-between items-center border-t border-[rgba(26,24,22,0.25)] pt-4"
      >
        <button
          v-if="editedTask.status !== 'done'"
          @click="markAsDone"
          class="text-xs uppercase tracking-[0.18em] border border-[var(--accent)] text-[var(--accent)] px-4 py-2 hover:bg-[var(--accent)] hover:text-[var(--paper)] transition-colors"
        >
          Mark As Done
        </button>
        <div v-else></div>

        <button
          @click="save"
          class="text-xs uppercase tracking-[0.18em] bg-[var(--ink)] text-[var(--paper)] px-6 py-2 hover:bg-opacity-90 transition-colors"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Task } from "~/types/task";

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", updatedTask: Partial<Task>): void;
}>();

const editedTask = ref<Partial<Task>>({ ...props.task });
const tagsString = ref(props.task.tags ? props.task.tags.join(", ") : "");

watch(
  () => props.task,
  (newTask) => {
    editedTask.value = { ...newTask };
    tagsString.value = newTask.tags ? newTask.tags.join(", ") : "";
  },
  { deep: true },
);

function formatDate(isoString: string) {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function markAsDone() {
  editedTask.value.status = "done";
  save();
}

function save() {
  const tags = tagsString.value
    ? tagsString.value
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  emit("save", {
    ...editedTask.value,
    tags,
  });
}
</script>
