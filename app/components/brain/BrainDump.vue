<template>
  <div class="flex flex-col gap-4">
    <textarea
      v-model="text"
      class="w-full h-48 bg-transparent border border-[rgba(26,24,22,0.25)] p-4 resize-none focus:outline-none focus:border-[var(--ink)] font-mono text-sm leading-relaxed"
      placeholder="Tulis semua yang ada di pikiranmu..."
    ></textarea>

    <button
      @click="parseTasks"
      :disabled="loading || !text"
      class="self-start uppercase tracking-[0.18em] text-xs border border-[var(--ink)] px-6 py-3 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors disabled:opacity-50"
    >
      {{ loading ? "Memproses..." : "Pisahkan" }}
    </button>

    <div v-if="error" class="text-[var(--accent)] text-xs mt-2">
      {{ error }}
    </div>

    <div v-if="parsedTasks.length > 0" class="mt-6 space-y-4">
      <h3
        class="text-lg serif-italic border-b border-[rgba(26,24,22,0.25)] pb-2"
      >
        Hasil Ekstraksi
      </h3>
      <div
        v-for="(pt, idx) in parsedTasks"
        :key="idx"
        class="border border-[rgba(26,24,22,0.15)] p-4 flex flex-col gap-2"
      >
        <input
          v-model="pt.title"
          class="bg-transparent border-b border-dashed border-[rgba(26,24,22,0.25)] focus:outline-none font-serif italic text-lg w-full"
        />
        <div class="flex gap-4 mt-2">
          <select
            v-model="pt.priority"
            class="bg-transparent text-xs uppercase tracking-[0.18em] focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            v-model="pt.dueDate"
            class="bg-transparent text-xs uppercase tracking-[0.18em] focus:outline-none"
          />
          <button
            @click="parsedTasks.splice(idx, 1)"
            class="ml-auto text-[var(--accent)] text-xs uppercase tracking-[0.18em]"
          >
            Hapus
          </button>
        </div>
      </div>
      <button
        @click="addToBoard"
        class="w-full mt-4 uppercase tracking-[0.18em] text-xs bg-[var(--ink)] text-[var(--paper)] px-6 py-3 hover:bg-opacity-90 transition-colors"
      >
        Tambahkan ke Board
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
    error.value = err.message || "Gagal mengekstrak teks";
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
