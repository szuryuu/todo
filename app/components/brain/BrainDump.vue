<template>
  <div class="flex flex-col h-full">
    <div
      class="pb-4 typewriter-border-b flex justify-between items-center mb-6"
    >
      <span
        class="font-mono text-xs tracking-[0.22em] text-[var(--ink)] font-bold uppercase"
        >Raw Input</span
      >
      <span class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]"
        >AI MODEL: GEMINI 2.0</span
      >
    </div>
    <textarea
      v-model="text"
      class="w-full flex-1 min-h-[250px] bg-transparent border-none p-2 text-xl text-[var(--ink)] placeholder:text-[var(--muted)] placeholder:opacity-50 focus:outline-none resize-none leading-relaxed"
      placeholder="Tulis semua yang ada di pikiranmu..."
    ></textarea>
    <div class="flex justify-end pt-6 typewriter-border-t">
      <button
        @click="parseTasks"
        :disabled="loading || !text"
        class="bg-[var(--ink)] text-[var(--paper)] px-8 py-3 font-mono text-xs tracking-[0.22em] font-bold hover:bg-[var(--accent)] disabled:opacity-50 transition-colors"
      >
        {{ loading ? "PARSING..." : "PISAHKAN" }}
      </button>
    </div>
    <div
      v-if="error"
      class="mt-4 p-4 typewriter-border text-[var(--accent)] font-mono text-xs tracking-[0.22em] uppercase"
    >
      [ ERR: {{ error }} ]
    </div>
    <div
      v-if="parsedTasks.length > 0"
      class="mt-8 pt-6 typewriter-border-t flex flex-col"
    >
      <div
        class="mb-4 font-mono text-xs tracking-[0.22em] text-[var(--ink)] font-bold uppercase"
      >
        EXTRACTED RESULTS
      </div>
      <div class="space-y-4">
        <div
          v-for="(pt, idx) in parsedTasks"
          :key="idx"
          class="p-5 typewriter-border bg-[var(--paper)] flex flex-col gap-4"
        >
          <input
            v-model="pt.title"
            class="w-full bg-transparent typewriter-border-b pb-2 text-xl text-[var(--ink)] focus:outline-none"
          />
          <div class="flex flex-wrap gap-4 items-center mt-2">
            <select
              v-model="pt.priority"
              class="bg-[var(--surface)] typewriter-border px-2 py-1 font-mono text-[10px] text-[var(--ink)] tracking-[0.22em] uppercase focus:outline-none"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
            <select
              v-model="pt.energy"
              class="bg-[var(--surface)] typewriter-border px-2 py-1 font-mono text-[10px] text-[var(--ink)] tracking-[0.22em] uppercase focus:outline-none"
            >
              <option value="light">LIGHT</option>
              <option value="heavy">HEAVY</option>
            </select>
            <input
              type="date"
              v-model="pt.dueDate"
              class="bg-[var(--surface)] typewriter-border px-2 py-1 font-mono text-[10px] text-[var(--ink)] tracking-[0.22em] uppercase focus:outline-none"
            />
            <button
              @click="parsedTasks.splice(idx, 1)"
              class="ml-auto font-mono text-[10px] tracking-[0.22em] text-[var(--accent)] hover:underline"
            >
              DROP
            </button>
          </div>
        </div>
      </div>
      <button
        @click="addToInbox"
        class="w-full mt-6 typewriter-border bg-[var(--surface)] text-[var(--ink)] px-6 py-4 font-mono text-xs tracking-[0.22em] font-bold hover:bg-[var(--paper)] transition-colors"
      >
        KIRIM KE INBOX
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const text = ref("");
const loading = ref(false);
const error = ref("");
const parsedTasks = ref<any[]>([]);
const store = useTaskStore();

async function parseTasks() {
  loading.value = true;
  error.value = "";
  try {
    const res = await $fetch("/api/parse-tasks", {
      method: "POST",
      body: { text: text.value },
    });
    parsedTasks.value = Array.isArray(res) ? res : [];
  } catch (err: any) {
    error.value = err.message || "PARSE FAILURE";
  } finally {
    loading.value = false;
  }
}

function addToInbox() {
  parsedTasks.value.forEach((task) => {
    store.addTask({
      title: task.title,
      priority: task.priority || "medium",
      energy: task.energy || "light",
      dueDate: task.dueDate || null,
      status: "todo",
      bucket: "inbox",
      context: "none",
      subtasks: [],
      description: "",
      tags: [],
    });
  });
  parsedTasks.value = [];
  text.value = "";
}
</script>
