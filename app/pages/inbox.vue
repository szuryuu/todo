<template>
  <div class="space-y-8 h-full flex flex-col">
    <section
      class="flex justify-between items-end border-b border-zinc-800 pb-4 sketchy-border"
    >
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight font-sans text-zinc-100 flex items-center gap-3"
        >
          <span
            class="size-3 bg-amber-500 inline-block rounded-full animate-pulse"
          ></span>
          Inbox / Brain Dump
        </h1>
        <p class="font-hand text-zinc-500 mt-1">
          Raw thoughts waiting for triage.
        </p>
      </div>
      <div
        class="font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 sketchy-border"
      >
        Total Captured: {{ store.inboxTasks.length }}
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1">
      <div
        class="border border-zinc-800 bg-zinc-900/10 p-6 sketchy-border relative h-full flex flex-col"
      >
        <div class="absolute inset-0 -z-10 bg-zinc-950">
          <svg width="100%" height="100%" aria-hidden="true">
            <rect
              width="100%"
              height="100%"
              fill="url(#hand-hatch)"
              class="sketchy-border"
            ></rect>
          </svg>
        </div>
        <BrainDump />
      </div>

      <div
        class="border border-zinc-800 bg-zinc-950 p-6 sketchy-border relative flex flex-col h-full max-h-[800px]"
      >
        <h3
          class="font-hand text-lg font-bold text-zinc-200 mb-4 border-b border-zinc-800 pb-2 sketchy-border"
        >
          Unprocessed Nodes
        </h3>

        <div class="flex-1 overflow-y-auto space-y-4 pr-2">
          <div
            v-for="task in store.inboxTasks"
            :key="task.id"
            class="border border-zinc-800 bg-zinc-900/40 p-4 sketchy-border hover:border-amber-500/50 transition-colors group"
          >
            <div class="flex flex-col gap-2">
              <span class="font-mono text-[10px] text-zinc-500"
                >Captured:
                {{ new Date(task.createdAt).toLocaleDateString() }}</span
              >
              <span
                class="font-sans text-sm text-zinc-200 font-medium leading-snug"
                >{{ task.title }}</span
              >
            </div>
            <div
              class="flex gap-3 mt-4 border-t border-zinc-800 pt-3 sketchy-border"
            >
              <button
                @click="store.updateTask(task.id, { bucket: 'active' })"
                class="font-hand text-[10px] bg-amber-500 text-zinc-950 px-3 py-1 font-bold sketchy-border hover:bg-amber-400"
              >
                Promote Active
              </button>
              <button
                @click="store.updateTask(task.id, { bucket: 'someday' })"
                class="font-hand text-[10px] text-zinc-400 border border-zinc-700 px-3 py-1 sketchy-border hover:text-zinc-200"
              >
                Someday
              </button>
              <button
                @click="store.deleteTask(task.id)"
                class="font-hand text-[10px] text-red-500 hover:text-red-400 ml-auto"
              >
                Drop
              </button>
            </div>
          </div>

          <div v-if="store.inboxTasks.length === 0" class="text-center py-12">
            <p class="font-hand text-zinc-500">Inbox is completely clear.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";
import BrainDump from "~/components/brain/BrainDump.vue";

const store = useTaskStore();
</script>
