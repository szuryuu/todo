<template>
  <div class="max-w-2xl mx-auto space-y-8 mt-8">
    <section class="border-b border-zinc-800 pb-4 sketchy-border">
      <h1
        class="text-3xl font-extrabold tracking-tight font-sans text-zinc-100 flex items-center gap-3"
      >
        Deploy New Instruction
      </h1>
      <p class="font-hand text-zinc-500 mt-1">
        Manually insert a node into the system.
      </p>
    </section>

    <div
      class="border border-zinc-800 bg-zinc-900/20 p-8 sketchy-border space-y-8 relative"
    >
      <div class="absolute inset-0 -z-10 bg-zinc-950 opacity-50">
        <svg width="100%" height="100%" aria-hidden="true">
          <rect
            width="100%"
            height="100%"
            fill="url(#hand-hatch)"
            class="sketchy-border"
          ></rect>
        </svg>
      </div>

      <div>
        <label class="font-mono text-[10px] text-zinc-500 uppercase block mb-2"
          >Instruction Title</label
        >
        <input
          v-model="title"
          ref="titleInput"
          type="text"
          placeholder="Declare task intent..."
          class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-sans text-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors sketchy-border"
          @keyup.enter="handleSubmit"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            class="font-mono text-[10px] text-zinc-500 uppercase block mb-2"
            >Deadline Constraints</label
          >
          <input
            v-model="dueDate"
            type="date"
            class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors sketchy-border"
          />
        </div>
        <div>
          <label
            class="font-mono text-[10px] text-zinc-500 uppercase block mb-2"
            >Priority Level</label
          >
          <select
            v-model="priority"
            class="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 font-mono text-sm text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors uppercase tracking-widest sketchy-border"
          >
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
          </select>
        </div>
      </div>

      <div
        class="border-t border-zinc-800 pt-6 flex justify-between items-center sketchy-border"
      >
        <NuxtLink
          to="/"
          class="font-hand text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Abort
        </NuxtLink>
        <button
          @click="handleSubmit"
          class="font-hand text-sm bg-amber-500 text-zinc-950 px-8 py-3 font-bold sketchy-border hover:bg-amber-400"
        >
          Commit Node
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTaskStore } from "~/stores/task";
import type { TaskPriority, TaskEnergy } from "~/types/task";

const store = useTaskStore();
const router = useRouter();

const title = ref("");
const dueDate = ref("");
const priority = ref<TaskPriority>("medium");
const energy = ref<TaskEnergy>("light");
const titleInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  titleInput.value?.focus();
});

function handleSubmit() {
  if (!title.value.trim()) return;
  store.addTask({
    title: title.value.trim(),
    dueDate: dueDate.value || null,
    priority: priority.value,
    energy: energy.value,
    status: "todo",
    bucket: "active",
    description: "",
    tags: [],
  });
  router.push("/kanban");
}
</script>
