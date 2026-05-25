<template>
  <div
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click')"
    class="border border-[rgba(26,24,22,0.15)] p-4 bg-[var(--paper)] cursor-grab active:cursor-grabbing hover:bg-[var(--surface)] transition-colors space-y-3"
  >
    <div class="flex justify-between items-start gap-2">
      <h4 class="font-serif italic text-lg leading-tight text-[var(--ink)]">
        {{ task.title }}
      </h4>
      <button
        @click.stop="handleDelete"
        class="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
      >
        &times;
      </button>
    </div>

    <p
      v-if="task.description"
      class="text-xs text-[var(--muted)] line-clamp-2 font-mono"
    >
      {{ task.description }}
    </p>

    <div
      class="flex flex-wrap gap-2 items-center text-xs font-mono uppercase tracking-[0.18em]"
    >
      <span :class="priorityClass" class="border px-2 py-0.5 text-[10px]">
        {{ task.priority }}
      </span>

      <span
        v-if="task.dueDate"
        :class="{ 'text-[var(--accent)] font-bold': isOverdue }"
        class="text-[var(--muted)] text-[10px]"
      >
        {{ task.dueDate }}
      </span>
    </div>

    <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-1">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="text-[9px] font-mono uppercase tracking-wider bg-[rgba(26,24,22,0.05)] px-1.5 py-0.5 text-[var(--muted)]"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "~/types/task";

const props = defineProps<{
  task: Task;
}>();

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

const priorityClass = computed(() => {
  switch (props.task.priority) {
    case "high":
      return "border-[var(--accent)] text-[var(--accent)] bg-[rgba(192,86,59,0.05)]";
    case "medium":
      return "border-[var(--ink)] text-[var(--ink)]";
    default:
      return "border-[rgba(26,24,22,0.2)] text-[var(--muted)]";
  }
});

function handleDelete() {
  if (confirm("Hapus task ini?")) {
    emit("delete");
  }
}
</script>
