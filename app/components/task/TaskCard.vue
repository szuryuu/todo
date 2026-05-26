<template>
  <div
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click')"
    class="border border-zinc-800 bg-zinc-900/40 p-4 relative overflow-hidden sketchy-border hover:border-amber-500/50 hover:bg-zinc-900/80 transition-colors cursor-grab active:cursor-grabbing group"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex gap-2 items-center">
        <span
          class="font-mono text-[9px] text-zinc-400 border border-zinc-700 px-1.5 py-0.5 sketchy-border bg-zinc-950 uppercase"
          >{{ task.priority }}</span
        >
        <span
          class="font-mono text-[9px] text-zinc-400 border border-zinc-700 px-1.5 py-0.5 sketchy-border bg-zinc-950 uppercase"
          >{{ task.energy }}</span
        >
      </div>
      <button
        @click.stop="handleDelete"
        class="opacity-0 group-hover:opacity-100 font-hand text-[10px] text-red-500 hover:text-red-400 transition-opacity bg-red-500/10 px-2 py-0.5 sketchy-border"
      >
        rm
      </button>
    </div>

    <h3 class="font-sans font-medium text-zinc-200 text-sm leading-snug">
      {{ task.title }}
    </h3>

    <div
      v-if="task.nextAction"
      class="mt-4 relative p-3 border border-amber-500/20 bg-amber-500/5 sketchy-border"
    >
      <span
        class="absolute -top-2 left-2 font-hand text-[9px] text-amber-500 bg-zinc-950 px-1"
        >Next Instruction</span
      >
      <p class="font-hand text-xs text-zinc-300">↳ {{ task.nextAction }}</p>
    </div>

    <div
      class="flex justify-between items-end mt-4 pt-3 border-t border-zinc-800 sketchy-border"
    >
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in task.tags"
          :key="tag"
          class="font-mono text-[9px] text-zinc-500 bg-zinc-950 px-1 sketchy-border"
          >#{{ tag }}</span
        >
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="task.pomodoroCount > 0"
          class="font-mono text-[9px] text-amber-500 bg-amber-500/10 px-1 sketchy-border border border-amber-500/20"
        >
          CYCLES: {{ task.pomodoroCount }}
        </span>
        <span
          v-if="task.dueDate"
          :class="{ 'text-red-400': isOverdue, 'text-zinc-500': !isOverdue }"
          class="font-mono text-[9px]"
        >
          {{ task.dueDate }}
        </span>
      </div>
    </div>

    <span
      v-if="isStale"
      class="absolute right-2 top-1/2 -translate-y-1/2 font-hand text-[10px] text-amber-500 opacity-80 -rotate-90 origin-right pointer-events-none"
    >
      ⚠️ STALE
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "~/types/task";

const props = defineProps<{ task: Task }>();
const emit = defineEmits<{
  (e: "dragstart", event: DragEvent): void;
  (e: "click"): void;
  (e: "delete"): void;
}>();

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === "done") return false;
  const today = new Date().toISOString().split("T")[0];
  return props.task.dueDate < today;
});

const isStale = computed(() => {
  if (!props.task.staleSince || props.task.status !== "in-progress")
    return false;
  const diffTime = Math.abs(
    new Date().getTime() - new Date(props.task.staleSince).getTime(),
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 5;
});

function handleDelete() {
  if (confirm("DESTROY NODE?")) emit("delete");
}
</script>
