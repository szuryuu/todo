<template>
  <div
    class="fixed inset-0 bg-[var(--paper)]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="typewriter-border bg-[var(--paper)] w-full max-w-2xl relative shadow-2xl"
    >
      <div
        class="p-6 typewriter-border-b flex justify-between items-center bg-[var(--surface)]"
      >
        <span
          class="font-mono text-xs tracking-[0.22em] text-[var(--ink)] font-bold uppercase"
          >EDIT ITEM RECORD</span
        >
        <button
          @click="$emit('close')"
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)]"
        >
          [ CLOSE ]
        </button>
      </div>

      <div class="p-8 flex flex-col gap-8">
        <div>
          <label
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
            >TITLE</label
          >
          <input
            v-model="editedTask.title"
            type="text"
            class="w-full bg-transparent typewriter-border-b pb-2 text-2xl text-[var(--ink)] focus:outline-none"
          />
        </div>

        <div>
          <label
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
            >NEXT ACTION</label
          >
          <input
            v-model="editedTask.nextAction"
            type="text"
            class="w-full bg-transparent typewriter-border-b pb-2 font-mono text-sm text-[var(--ink)] focus:outline-none placeholder:text-[var(--muted)]"
            placeholder="Concrete next step..."
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label
              class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
              >STATUS</label
            >
            <select
              v-model="editedTask.status"
              class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
            >
              <option value="todo">TODO</option>
              <option value="in-progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
              >BUCKET</label
            >
            <select
              v-model="editedTask.bucket"
              class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
            >
              <option value="active">ACTIVE</option>
              <option value="inbox">INBOX</option>
              <option value="someday">SOMEDAY</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label
              class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
              >PRIORITY</label
            >
            <select
              v-model="editedTask.priority"
              class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
              >ENERGY</label
            >
            <select
              v-model="editedTask.energy"
              class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
            >
              <option value="light">LIGHT</option>
              <option value="heavy">HEAVY</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] uppercase block mb-2"
              >DEADLINE</label
            >
            <input
              v-model="editedTask.dueDate"
              type="date"
              class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
            />
          </div>
        </div>
      </div>

      <div
        class="p-6 typewriter-border-t flex justify-between items-center bg-[var(--surface)]"
      >
        <button
          v-if="editedTask.status !== 'done'"
          @click="markAsDone"
          class="font-mono text-xs tracking-[0.22em] text-[var(--accent)] hover:underline font-bold"
        >
          [ MARK AS DONE ]
        </button>
        <div v-else></div>

        <button
          @click="save"
          class="bg-[var(--ink)] text-[var(--paper)] px-8 py-3 font-mono text-xs tracking-[0.22em] font-bold hover:bg-[var(--accent)] transition-colors"
        >
          SAVE RECORD
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Task } from "~/types/task";

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", updatedTask: Partial<Task>): void;
}>();

const editedTask = ref<Partial<Task>>({ ...props.task });

watch(
  () => props.task,
  (newTask) => {
    editedTask.value = { ...newTask };
  },
  { deep: true },
);

function markAsDone() {
  editedTask.value.status = "done";
  save();
}

function save() {
  emit("save", { ...editedTask.value });
}
</script>
