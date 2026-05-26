<template>
  <div class="flex flex-col flex-1">
    <section class="px-6 py-16 border-b border-zinc-800">
      <p class="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-6">
        — COLD STORAGE
      </p>
      <h1 class="font-serif text-5xl text-zinc-100 leading-tight italic">
        Someday<br /><span class="text-zinc-500 not-italic"
          >Count: {{ store.somedayTasks.length }}</span
        >
      </h1>
    </section>

    <HatchingDivider label="ASPIRATIONS" />

    <div class="p-6 flex-1 bg-zinc-950">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="task in store.somedayTasks"
          :key="task.id"
          class="border border-zinc-700 bg-zinc-900 p-6 flex flex-col justify-between hover:bg-zinc-800 transition-colors min-h-[200px]"
        >
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="font-mono text-xs text-zinc-500 tracking-widest"
                >IDEA //</span
              >
              <span class="text-zinc-700 text-xs font-mono">¬</span>
            </div>
            <h3 class="font-serif text-xl text-zinc-100 italic mb-3">
              {{ task.title }}
            </h3>
          </div>
          <div
            class="flex justify-between items-center border-t border-zinc-800 pt-4 mt-6"
          >
            <span
              class="font-mono text-xs text-zinc-600 tracking-widest uppercase"
              >{{ new Date(task.createdAt).toLocaleDateString() }}</span
            >
            <button
              @click="store.updateTask(task.id, { bucket: 'inbox' })"
              class="font-mono text-xs text-zinc-400 tracking-widest uppercase hover:text-zinc-100 transition-colors"
            >
              TO INBOX →
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="store.somedayTasks.length === 0"
        class="border border-dashed border-zinc-800 p-12 text-center max-w-2xl mx-auto mt-12"
      >
        <span class="font-mono text-xs text-zinc-600 tracking-widest uppercase"
          >NOTHING PARKED FOR LATER.</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";
import HatchingDivider from "~/components/layout/HatchingDivider.vue";

const store = useTaskStore();
</script>
