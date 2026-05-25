<template>
  <div
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
    @click="$emit('click')"
    class="sketchy-box p-5 cursor-grab active:cursor-grabbing group relative transition-transform hover:-translate-y-1.5"
    :class="bgClass"
  >
    <div class="flex justify-between items-start gap-4 mb-3">
      <h4 class="text-3xl leading-none pr-8">{{ task.title }}</h4>
      <button
        @click.stop="handleDelete"
        class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--accent)] transition-opacity"
      >
        <X class="w-7 h-7" stroke-width="2.5" />
      </button>
    </div>

    <p
      v-if="task.description"
      class="text-xl text-[var(--muted)] line-clamp-2 mb-4"
    >
      {{ task.description }}
    </p>

    <div class="flex flex-wrap gap-x-5 gap-y-3 items-center text-xl mt-3">
      <span :class="priorityClass" class="sketchy-border px-3 bg-white/60">
        {{ task.priority }}
      </span>
      <span
        v-if="task.dueDate"
        :class="{
          'text-[var(--accent)] font-bold decoration-wavy underline': isOverdue,
        }"
        class="text-[var(--ink)] flex items-center gap-2"
      >
        <Calendar class="w-5 h-5" stroke-width="2.5" /> {{ task.dueDate }}
      </span>
    </div>

    <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-2 mt-4">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="text-lg border-2 border-[var(--ink)] px-3 rounded-full border-dashed bg-white/40"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X, Calendar } from "lucide-vue-next";
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

const priorityClass = computed(() => {
  switch (props.task.priority) {
    case "high":
      return "text-[var(--accent)]";
    case "medium":
      return "text-[var(--ink)] font-bold";
    default:
      return "text-[var(--muted)]";
  }
});

const bgClass = computed(() => {
  if (props.task.status === "done") return "bg-[#f1f5f9]";
  switch (props.task.priority) {
    case "high":
      return "bg-[#ffe4e6]";
    case "medium":
      return "bg-white";
    default:
      return "bg-white";
  }
});

function handleDelete() {
  if (confirm("Throw away this task? 🗑️")) emit("delete");
}
</script>
