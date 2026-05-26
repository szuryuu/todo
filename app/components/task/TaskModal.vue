<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-[var(--paper)]/95 backdrop-blur flex items-center justify-center p-4 sm:p-6"
    @click.self="close"
  >
    <div
      class="w-full max-w-2xl bg-[var(--paper)] typewriter-border p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
    >
      <div class="flex justify-between items-start mb-6">
        <h2
          class="text-2xl font-bold text-[var(--ink)] uppercase tracking-tight"
        >
          TARGET DETAILS
        </h2>
        <button
          @click="close"
          class="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <X :size="24" />
        </button>
      </div>

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label
            class="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]"
            >TITLE</label
          >
          <input
            v-model="form.title"
            type="text"
            class="w-full bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--ink)] outline-none py-2 text-lg font-bold text-[var(--ink)] transition-colors"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]"
            >NEXT ACTION (MICRO-STEP)</label
          >
          <input
            v-model="form.nextAction"
            type="text"
            class="w-full bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--ink)] outline-none py-2 font-mono text-sm text-[var(--ink)] italic transition-colors"
            placeholder="Langkah konkret pertama..."
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label
              class="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]"
              >CONTEXT</label
            >
            <select
              v-model="form.context"
              class="w-full bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--ink)] outline-none py-2 font-mono text-sm text-[var(--ink)] uppercase tracking-widest cursor-pointer"
            >
              <option value="none">NONE</option>
              <option value="campus">CAMPUS</option>
              <option value="work">WORK</option>
              <option value="personal">PERSONAL</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]"
              >ENERGY LEVEL</label
            >
            <select
              v-model="form.energy"
              class="w-full bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--ink)] outline-none py-2 font-mono text-sm text-[var(--ink)] uppercase tracking-widest cursor-pointer"
            >
              <option value="light">LIGHT</option>
              <option value="heavy">HEAVY</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]"
            >MICRO-TASKS</label
          >
          <div class="flex gap-2">
            <input
              v-model="newSubtask"
              @keyup.enter="addSubtask"
              type="text"
              class="flex-1 bg-transparent border-b border-[var(--ink)]/30 focus:border-[var(--ink)] outline-none py-2 font-mono text-sm text-[var(--ink)]"
              placeholder="Tambah sub-task..."
            />
            <button
              @click="addSubtask"
              class="px-4 border border-[var(--ink)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              ADD
            </button>
          </div>
          <div class="flex flex-col gap-2 mt-2">
            <div
              v-for="sub in form.subtasks"
              :key="sub.id"
              class="flex items-start gap-3 font-mono text-sm"
            >
              <button
                @click="sub.isDone = !sub.isDone"
                class="text-[var(--ink)] hover:text-[var(--accent)] transition-colors mt-0.5"
              >
                <span v-if="sub.isDone">[x]</span>
                <span v-else>[ ]</span>
              </button>
              <span
                :class="{ 'line-through text-[var(--muted)]': sub.isDone }"
                class="flex-1 leading-snug"
                >{{ sub.title }}</span
              >
              <button
                @click="removeSubtask(sub.id)"
                class="text-[var(--muted)] hover:text-[var(--accent)]"
              >
                <X :size="14" />
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-[var(--ink)]/10"
        >
          <button
            @click="close"
            class="px-6 py-2 border border-transparent font-mono text-xs uppercase tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            CANCEL
          </button>
          <button
            @click="save"
            class="px-6 py-2 border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-xs uppercase tracking-widest font-bold hover:bg-transparent hover:text-[var(--ink)] transition-colors"
          >
            SAVE TARGET
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import type { Task, Subtask } from "~/types/task";

const props = defineProps<{ isOpen: boolean; task: Task | null }>();
const emit = defineEmits(["close", "save"]);

const form = ref<Partial<Task>>({ subtasks: [] });
const newSubtask = ref("");

watch(
  () => props.task,
  (newVal) => {
    if (newVal) {
      form.value = {
        ...newVal,
        subtasks: newVal.subtasks
          ? JSON.parse(JSON.stringify(newVal.subtasks))
          : [],
      };
    }
  },
  { deep: true, immediate: true },
);

const addSubtask = () => {
  if (!newSubtask.value.trim()) return;
  if (!form.value.subtasks) form.value.subtasks = [];
  form.value.subtasks.push({
    id: crypto.randomUUID(),
    title: newSubtask.value.trim(),
    isDone: false,
  });
  newSubtask.value = "";
};

const removeSubtask = (id: string) => {
  if (form.value.subtasks) {
    form.value.subtasks = form.value.subtasks.filter((s) => s.id !== id);
  }
};

const close = () => emit("close");
const save = () => {
  if (props.task) {
    const store = useTaskStore();
    store.updateTask(props.task.id, { ...form.value });
  }
  emit("save");
  close();
};
</script>
