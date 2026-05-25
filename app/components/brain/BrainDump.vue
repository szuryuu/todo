<template>
  <div class="flex flex-col h-full gap-6">
    <textarea
      v-model="text"
      class="sketchy-border w-full flex-1 min-h-[220px] bg-[#fef9c3] p-6 resize-none focus:outline-none text-2xl placeholder:text-black/30 placeholder:rotate-1"
      placeholder="Just dump everything on your mind here... The AI will sort it out!"
    ></textarea>

    <div class="flex justify-between items-center">
      <div class="text-xl text-[var(--muted)] rotate-2 flex items-center gap-2">
        Gemini 2.0 <Bot class="w-6 h-6" stroke-width="2.5" />
      </div>
      <button
        @click="parseTasks"
        :disabled="loading || !text"
        class="sketchy-box px-8 py-3 bg-[#e9d5ff] text-2xl hover:bg-[#d8b4fe] disabled:opacity-50 disabled:grayscale transition-colors -rotate-1 flex items-center gap-2"
      >
        {{ loading ? "Thinking..." : "Magic Parse" }}
        <Sparkles v-if="!loading" class="w-5 h-5" stroke-width="2.5" />
      </button>
    </div>

    <div
      v-if="error"
      class="sketchy-border bg-[#ffe4e6] text-[var(--accent)] p-4 text-2xl rotate-1 mt-2"
    >
      Uh oh: {{ error }}
    </div>

    <div
      v-if="parsedTasks.length > 0"
      class="flex flex-col gap-6 mt-4 border-t-2 border-dashed border-[var(--ink)] pt-6"
    >
      <h3 class="text-3xl">I found these:</h3>
      <div class="flex flex-col gap-5">
        <div
          v-for="(pt, idx) in parsedTasks"
          :key="idx"
          class="sketchy-border p-5 flex flex-col gap-3 bg-white rotate-1"
        >
          <input
            v-model="pt.title"
            class="bg-transparent border-b-2 border-dotted border-[var(--muted)] focus:outline-none text-3xl w-full pb-1"
          />
          <div class="flex flex-wrap gap-4 items-center text-xl mt-3">
            <select
              v-model="pt.priority"
              class="bg-[#f3f4f6] sketchy-border px-3 py-1 focus:outline-none cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Med</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              v-model="pt.dueDate"
              class="bg-[#f3f4f6] sketchy-border px-3 py-1 focus:outline-none"
            />
            <button
              @click="parsedTasks.splice(idx, 1)"
              class="ml-auto text-[var(--accent)] underline decoration-wavy"
            >
              Drop
            </button>
          </div>
        </div>
      </div>
      <button
        @click="addToBoard"
        class="sketchy-box w-full text-3xl bg-[#bae6fd] p-4 mt-4 hover:bg-[#7dd3fc] transition-colors flex items-center justify-center gap-3"
      >
        Throw them to the board! <Rocket class="w-8 h-8" stroke-width="2.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Bot, Sparkles, Rocket } from "lucide-vue-next";
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
    error.value = err.message || "Parse failure";
  } finally {
    loading.value = false;
  }
}

function addToBoard() {
  parsedTasks.value.forEach((task) => {
    store.addTask({
      title: task.title,
      priority: task.priority || "medium",
      dueDate: task.dueDate || null,
      status: "todo",
      description: "",
      tags: [],
    });
  });
  parsedTasks.value = [];
  text.value = "";
}
</script>
