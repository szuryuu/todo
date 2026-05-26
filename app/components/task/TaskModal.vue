<template>
  <div
    class="fixed inset-0 bg-zinc-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-none"
  >
    <div class="border border-zinc-700 bg-zinc-900 w-full max-w-2xl relative">
      <div
        class="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950"
      >
        <span class="font-mono text-xs text-zinc-500 tracking-widest uppercase"
          >EDIT CONFIGURATION //</span
        >
        <button
          @click="$emit('close')"
          class="font-mono text-xs text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          [ CLOSE ]
        </button>
      </div>

      <div class="p-8 flex flex-col gap-6">
        <div>
          <label
            class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
            >TITLE</label
          >
          <input
            v-model="editedTask.title"
            type="text"
            class="w-full bg-zinc-950 border-b border-zinc-700 px-0 py-3 font-serif italic text-2xl text-zinc-100 focus:outline-none focus:border-zinc-400 transition-colors"
          />
        </div>

        <div>
          <label
            class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
            >NEXT ACTION</label
          >
          <input
            v-model="editedTask.nextAction"
            type="text"
            class="w-full bg-zinc-950 border-b border-zinc-700 px-0 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-400 transition-colors uppercase"
            placeholder="CONCRETE NEXT STEP..."
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label
              class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
              >STATUS</label
            >
            <select
              v-model="editedTask.status"
              class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
            >
              <option value="todo">TODO</option>
              <option value="in-progress">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
              >BUCKET</label
            >
            <select
              v-model="editedTask.bucket"
              class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
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
              class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
              >PRIORITY</label
            >
            <select
              v-model="editedTask.priority"
              class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
            >
              <option value="low">LOW</option>
              <option value="medium">MED</option>
              <option value="high">HIGH</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
              >ENERGY</label
            >
            <select
              v-model="editedTask.energy"
              class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
            >
              <option value="light">LIGHT</option>
              <option value="heavy">HEAVY</option>
            </select>
          </div>
          <div>
            <label
              class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
              >DEADLINE</label
            >
            <input
              v-model="editedTask.dueDate"
              type="date"
              class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
            />
          </div>
        </div>

        <div>
          <label
            class="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2"
            >NOTES (RAW)</label
          >
          <textarea
            v-model="editedTask.description"
            rows="3"
            class="w-full bg-zinc-950 border border-zinc-700 p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:border-zinc-500 resize-none transition-colors leading-relaxed"
            placeholder="ADDITIONAL LOGS..."
          ></textarea>
        </div>
      </div>

      <div
        class="p-6 border-t border-zinc-800 flex justify-between items-center bg-zinc-950"
      >
        <button
          v-if="editedTask.status !== 'done'"
          @click="markAsDone"
          class="font-mono text-xs text-zinc-400 tracking-widest uppercase hover:text-zinc-100 transition-colors"
        >
          MARK AS DONE
        </button>
        <div v-else></div>

        <button
          @click="save"
          class="border border-zinc-100 bg-zinc-100 text-zinc-950 px-8 py-3 font-mono text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors"
        >
          SAVE CHANGES
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
