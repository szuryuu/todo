<template>
  <div class="flex flex-col flex-1 gap-8">
    <section class="flex justify-between items-end typewriter-border-b pb-6">
      <div>
        <p
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] mb-2 uppercase"
        >
          Aspirations
        </p>
        <h1 class="text-4xl text-[var(--ink)] leading-tight">Someday</h1>
      </div>
      <div>
        <span class="stamp-muted text-[10px]">PARKED</span>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="task in store.somedayTasks"
        :key="task.id"
        class="typewriter-border bg-[var(--paper)] p-6 flex flex-col justify-between hover:bg-[var(--surface)] transition-colors min-h-[220px]"
      >
        <div>
          <h3 class="text-xl text-[var(--ink)] mb-4">{{ task.title }}</h3>
        </div>
        <div
          class="flex justify-between items-center typewriter-border-t pt-4 mt-6"
        >
          <span
            class="font-mono text-[9px] tracking-[0.22em] text-[var(--muted)]"
            >{{ new Date(task.createdAt).toLocaleDateString() }}</span
          >
          <button
            @click="store.updateTask(task.id, { bucket: 'inbox' })"
            class="font-mono text-[10px] tracking-[0.22em] text-[var(--ink)] hover:text-[var(--accent)] font-bold"
          >
            TO INBOX
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="store.somedayTasks.length === 0"
      class="text-center py-20 font-mono text-xs tracking-[0.22em] text-[var(--muted)] typewriter-border border-dashed opacity-60"
    >
      [ NO IDEAS PARKED ]
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
</script>
