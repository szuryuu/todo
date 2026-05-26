<template>
  <div class="max-w-3xl mx-auto space-y-8 w-full mt-10">
    <section class="typewriter-border-b pb-6">
      <p
        class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] mb-2 uppercase"
      >
        Manual Entry
      </p>
      <h1 class="text-4xl text-[var(--ink)] leading-tight">Insert Task</h1>
    </section>

    <div class="typewriter-border bg-[var(--paper)] p-8 md:p-12 space-y-10">
      <div>
        <label
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] block mb-4 uppercase"
          >Task Description</label
        >
        <input
          v-model="title"
          ref="titleInput"
          type="text"
          placeholder="What needs to be done?"
          class="w-full bg-transparent typewriter-border-b pb-3 text-3xl text-[var(--ink)] focus:outline-none placeholder:text-[var(--muted)] placeholder:opacity-50"
          @keyup.enter="handleSubmit"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] block mb-4 uppercase"
            >Deadline</label
          >
          <input
            v-model="dueDate"
            type="date"
            class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none"
          />
        </div>
        <div>
          <label
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] block mb-4 uppercase"
            >Priority</label
          >
          <select
            v-model="priority"
            class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
          >
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] block mb-4 uppercase"
            >Energy Required</label
          >
          <select
            v-model="energy"
            class="w-full bg-[var(--surface)] typewriter-border px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none tracking-[0.22em] uppercase"
          >
            <option value="light">LIGHT</option>
            <option value="heavy">HEAVY</option>
          </select>
        </div>
      </div>

      <div class="typewriter-border-t pt-8 flex justify-between items-center">
        <NuxtLink
          to="/"
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >[ ABORT ]</NuxtLink
        >
        <button
          @click="handleSubmit"
          class="font-mono text-xs tracking-[0.22em] bg-[var(--ink)] text-[var(--paper)] px-8 py-3 font-bold hover:bg-[var(--accent)] transition-colors"
        >
          COMMIT
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    context: "none",
    subtasks: [],
  });
  router.push("/kanban");
}
</script>
