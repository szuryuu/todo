<template>
  <div
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click')"
    class="typewriter-border bg-[var(--paper)] p-4 sm:p-5 relative cursor-grab active:cursor-grabbing hover:bg-[var(--surface)] transition-colors group"
  >
    <div class="flex flex-wrap justify-between items-start gap-2 mb-3 sm:mb-4">
      <div class="flex flex-wrap gap-2 sm:gap-3">
        <span
          class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--ink)] uppercase"
          >[{{ task.priority }}]</span
        >
        <span
          class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--ink)] uppercase"
          >[{{ task.energy }}]</span
        >
      </div>
      <button
        @click.stop="handleDelete"
        class="opacity-0 group-hover:opacity-100 font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--accent)] hover:underline"
      >
        DROP
      </button>
    </div>

    <h3
      class="text-lg sm:text-xl text-[var(--ink)] leading-snug"
      :class="{ 'line-through text-[var(--muted)]': task.status === 'done' }"
    >
      <span class="font-mono mr-2">{{
        task.status === "done" ? "[x]" : "[ ]"
      }}</span
      >{{ task.title }}
    </h3>

    <div
      v-if="task.nextAction && task.status !== 'done'"
      class="mt-3 sm:mt-4 pt-3 typewriter-border-t"
    >
      <span
        class="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-[var(--muted)] uppercase block mb-1"
        >NEXT ACTION:</span
      >
      <p class="font-mono text-[10px] sm:text-xs text-[var(--ink)]">
        >> {{ task.nextAction }}
      </p>
    </div>

    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4 sm:mt-6 gap-3 sm:gap-0"
    >
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in task.tags"
          :key="tag"
          class="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-[var(--muted)] uppercase"
          >#{{ tag }}</span
        >
      </div>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span
          v-if="task.pomodoroCount > 0"
          class="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-[var(--accent)] font-bold"
        >
          POM: {{ task.pomodoroCount }}
        </span>
        <span
          v-if="task.dueDate"
          :class="{
            'text-[var(--accent)] font-bold': isOverdue,
            'text-[var(--muted)]': !isOverdue,
          }"
          class="font-mono text-[8px] sm:text-[9px] tracking-[0.22em]"
        >
          DUE: {{ task.dueDate }}
        </span>
      </div>
    </div>

    <span v-if="isStale" class="stamp-accent text-[8px] absolute right-4 top-4">
      STALE
    </span>
    <span
      v-if="task.status === 'done'"
      class="stamp-muted text-[10px] absolute right-4 top-1/2 -translate-y-1/2 opacity-50"
    >
      DONE
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
  if (confirm("Drop task permanently?")) emit("delete");
}
</script>
