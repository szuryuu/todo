<template>
  <div class="flex flex-col h-full gap-4">
    <div
      class="flex justify-between items-center border-b border-zinc-800 pb-3 sketchy-border"
    >
      <h3 class="font-hand text-lg font-bold text-zinc-200">
        AI Telemetry Parser
      </h3>
      <span
        class="font-mono text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 sketchy-border"
        >Gemini 2.0 Node</span
      >
    </div>

    <textarea
      v-model="text"
      class="w-full flex-1 min-h-[200px] bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed sketchy-border"
      placeholder="Dump unstructured thoughts, logs, and tasks here. The parser will split them into discrete actionable nodes..."
    ></textarea>

    <div class="flex justify-end">
      <button
        @click="parseTasks"
        :disabled="loading || !text"
        class="font-hand text-sm bg-amber-500 text-zinc-950 px-6 py-2 font-bold sketchy-border hover:bg-amber-400 disabled:opacity-50 transition-colors"
      >
        {{ loading ? "Running Parser..." : "Execute Parsing Sequence" }}
      </button>
    </div>

    <div
      v-if="error"
      class="border border-red-500/50 bg-red-500/10 text-red-400 p-3 font-mono text-xs sketchy-border mt-2"
    >
      [ERR] {{ error }}
    </div>

    <div
      v-if="parsedTasks.length > 0"
      class="mt-4 border-t border-zinc-800 pt-4 sketchy-border"
    >
      <h4 class="font-hand text-sm text-zinc-400 mb-3">Extracted Nodes:</h4>
      <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        <div
          v-for="(pt, idx) in parsedTasks"
          :key="idx"
          class="border border-zinc-800 bg-zinc-950 p-3 sketchy-border flex flex-col gap-3"
        >
          <input
            v-model="pt.title"
            class="w-full bg-transparent border-b border-zinc-800 pb-1 font-sans text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <div class="flex flex-wrap gap-2 items-center">
            <select
              v-model="pt.priority"
              class="bg-zinc-900 border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-400 focus:outline-none sketchy-border"
            >
              <option value="low">LOW</option>
              <option value="medium">MED</option>
              <option value="high">HIGH</option>
            </select>
            <select
              v-model="pt.energy"
              class="bg-zinc-900 border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-400 focus:outline-none sketchy-border"
            >
              <option value="light">LIGHT</option>
              <option value="heavy">HEAVY</option>
            </select>
            <input
              type="date"
              v-model="pt.dueDate"
              class="bg-zinc-900 border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-400 focus:outline-none sketchy-border"
            />
            <button
              @click="parsedTasks.splice(idx, 1)"
              class="font-hand text-[10px] text-red-500 hover:text-red-400 ml-auto"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
      <button
        @click="addToInbox"
        class="w-full mt-4 font-hand text-sm bg-zinc-200 text-zinc-950 px-4 py-2 font-bold sketchy-border hover:bg-white transition-colors"
      >
        Commit All to Inbox
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
    error.value = err.message || "Parser Encountered Critical Error";
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
      description: "",
      tags: [],
    });
  });
  parsedTasks.value = [];
  text.value = "";
}
</script>
