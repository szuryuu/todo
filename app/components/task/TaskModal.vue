<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="sketchy-box bg-white w-full max-w-2xl p-8 md:p-10 relative -rotate-1"
    >
      <div
        class="flex justify-between items-center border-b-2 border-dashed border-[var(--ink)] pb-4 mb-6"
      >
        <h3 class="text-4xl flex items-center gap-3">
          Edit Task
          <FileEdit class="w-8 h-8" stroke-width="2.5" />
        </h3>
        <button
          @click="$emit('close')"
          class="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <X class="w-8 h-8" stroke-width="2.5" />
        </button>
      </div>

      <div class="flex flex-col gap-6 text-2xl">
        <div>
          <label class="text-[var(--muted)] block mb-2">Title</label>
          <input
            v-model="editedTask.title"
            type="text"
            class="w-full bg-transparent border-b-2 border-[var(--ink)] py-2 focus:outline-none text-3xl"
          />
        </div>

        <div>
          <label class="text-[var(--muted)] block mb-2">Notes</label>
          <textarea
            v-model="editedTask.description"
            rows="3"
            class="w-full bg-[#fef9c3] sketchy-border p-4 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label class="text-[var(--muted)] block mb-2">Status</label>
            <select
              v-model="editedTask.status"
              class="w-full bg-white sketchy-border px-4 py-2 focus:outline-none cursor-pointer"
            >
              <option value="todo">To-Do</option>
              <option value="in-progress">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label class="text-[var(--muted)] block mb-2">Priority</label>
            <select
              v-model="editedTask.priority"
              class="w-full bg-white sketchy-border px-4 py-2 focus:outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label class="text-[var(--muted)] block mb-2">Deadline</label>
            <input
              v-model="editedTask.dueDate"
              type="date"
              class="w-full bg-white sketchy-border px-4 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label class="text-[var(--muted)] block mb-2"
              >Tags (comma separated)</label
            >
            <input
              v-model="tagsString"
              type="text"
              class="w-full bg-transparent border-b-2 border-[var(--ink)] py-2 focus:outline-none"
              placeholder="work, urgent"
            />
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t-2 border-dashed border-[var(--ink)] gap-4"
      >
        <button
          v-if="editedTask.status !== 'done'"
          @click="markAsDone"
          class="sketchy-border px-6 py-3 text-[var(--accent)] bg-[#ffe4e6] hover:bg-[#fecdd3] rotate-2 transition-colors flex items-center gap-2"
        >
          Mark As Done <Check class="w-6 h-6" stroke-width="3" />
        </button>
        <div v-else></div>

        <button
          @click="save"
          class="sketchy-box px-10 py-3 bg-[var(--ink)] text-[var(--paper)] text-3xl -rotate-1 hover:rotate-0 transition-transform"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { FileEdit, X, Check } from "lucide-vue-next";
import type { Task } from "~/types/task";

const props = defineProps<{ task: Task }>();
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
  emit("save", { ...editedTask.value, tags });
}
</script>
