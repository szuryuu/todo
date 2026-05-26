<template>
  <div class="flex flex-col flex-1 gap-8">
    <section class="flex justify-between items-end typewriter-border-b pb-6">
      <div>
        <p
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] mb-2 uppercase"
        >
          Buffer Zone
        </p>
        <h1 class="text-4xl text-[var(--ink)] leading-tight">Inbox</h1>
      </div>
      <div>
        <span class="stamp-muted text-[10px]">UNPROCESSED</span>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 items-start">
      <div
        class="typewriter-border bg-[var(--surface)] p-6 h-full flex flex-col"
      >
        <BrainDump />
      </div>

      <div class="flex flex-col h-full gap-6">
        <h3
          class="font-mono text-sm tracking-[0.22em] text-[var(--ink)] typewriter-border-b pb-2 uppercase font-bold"
        >
          Captured Items [{{ store.inboxTasks.length }}]
        </h3>
        <div class="flex-1 overflow-y-auto space-y-6 pr-2">
          <div
            v-for="task in store.inboxTasks"
            :key="task.id"
            class="typewriter-border p-5 bg-[var(--paper)] hover:bg-[var(--surface)] transition-colors"
          >
            <div class="flex justify-between items-start mb-4">
              <span
                class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]"
                >DATE: {{ new Date(task.createdAt).toLocaleDateString() }}</span
              >
              <button
                @click="store.deleteTask(task.id)"
                class="font-mono text-xs tracking-[0.22em] text-[var(--accent)] hover:underline"
              >
                [X]
              </button>
            </div>
            <h4 class="text-xl text-[var(--ink)] mb-6">{{ task.title }}</h4>
            <div class="flex flex-wrap gap-4 pt-4 typewriter-border-t">
              <button
                @click="store.updateTask(task.id, { bucket: 'active' })"
                class="font-mono text-[10px] tracking-[0.22em] bg-[var(--ink)] text-[var(--paper)] px-3 py-1 font-bold hover:bg-[var(--accent)] transition-colors"
              >
                PROMOTE TO ACTIVE
              </button>
              <button
                @click="store.updateTask(task.id, { bucket: 'someday' })"
                class="font-mono text-[10px] tracking-[0.22em] typewriter-border px-3 py-1 text-[var(--ink)] hover:bg-[var(--surface)] transition-colors"
              >
                MOVE TO SOMEDAY
              </button>
            </div>
          </div>
          <div
            v-if="store.inboxTasks.length === 0"
            class="text-center py-12 font-mono text-xs tracking-[0.22em] text-[var(--muted)] opacity-70"
          >
            [ INBOX IS EMPTY ]
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
</script>
