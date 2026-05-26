<template>
  <div
    class="border border-[rgba(26,20,8,0.18)] bg-[var(--paper)] p-5 flex flex-col gap-4 hover:bg-[var(--surface)] transition-colors group relative rounded-[1px]"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="task.priority === 'high'"
          class="px-2 py-0.5 border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] uppercase tracking-[0.22em] font-bold"
          >HIGH</span
        >
        <span
          class="px-2 py-0.5 border border-[var(--ink)] text-[var(--ink)] font-mono text-[10px] uppercase tracking-[0.22em]"
          >{{ task.energy }}</span
        >
        <span
          v-if="task.context && task.context !== 'none'"
          class="px-2 py-0.5 border border-dashed border-[var(--muted)] text-[var(--muted)] font-mono text-[10px] uppercase tracking-[0.22em]"
          >{{ task.context }}</span
        >
      </div>
      <div class="flex items-center gap-3">
        <div
          v-if="isStale"
          class="px-2 py-0.5 border-[1.5px] border-[rgba(190,50,40,0.3)] text-[rgba(190,50,40,0.65)] font-mono text-[10px] uppercase tracking-[0.25em] -rotate-[1.5deg] font-bold"
        >
          STALE
        </div>
        <button
          @click.stop="$emit('delete')"
          class="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <Trash2 :size="16" stroke-width="1.5" />
        </button>
      </div>
    </div>

    <div>
      <h3
        :class="[
          'text-xl font-bold text-[var(--ink)] leading-snug',
          { 'line-through text-[var(--muted)]': task.status === 'done' },
        ]"
      >
        {{ task.title }}
      </h3>
      <p
        v-if="task.nextAction"
        class="font-mono text-sm text-[var(--muted)] mt-2 opacity-80"
      >
        > {{ task.nextAction }}
      </p>
    </div>

    <div
      v-if="task.subtasks && task.subtasks.length > 0"
      class="flex items-center gap-3 font-mono text-[10px] text-[var(--muted)] uppercase tracking-[0.22em]"
    >
      <span
        >MICRO-TASKS [{{ completedSubtasks }}/{{ task.subtasks.length }}]</span
      >
      <div class="flex-1 h-[1px] bg-[rgba(26,20,8,0.18)]"></div>
    </div>

    <div
      class="flex items-center justify-between border-t border-[rgba(26,20,8,0.18)] pt-4 font-mono text-[10px] uppercase tracking-[0.22em]"
    >
      <span
        :class="
          isOverdue
            ? 'text-[rgba(190,50,40,0.65)] font-bold -rotate-[1.5deg]'
            : 'text-[var(--muted)]'
        "
      >
        {{ task.dueDate || "NO DEADLINE" }}
      </span>
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-1 text-[var(--ink)]">
          <Timer :size="14" stroke-width="2" />
          <span>×{{ task.pomodoroCount }}</span>
        </div>
        <button
          @click.stop="startPomodoro"
          class="flex items-center gap-1 opacity-0 md:group-hover:opacity-100 text-[var(--ink)] hover:text-[var(--accent)] transition-colors font-bold"
        >
          <Play :size="14" stroke-width="2.5" fill="currentColor" />
          <span>START</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Play, Trash2, Timer } from "lucide-vue-next";
import { usePomodoroStore } from "~/stores/pomodoro";
import type { Task } from "~/types/task";

const props = defineProps<{ task: Task }>();
const emit = defineEmits(["delete"]);
const router = useRouter();

const isStale = computed(() => {
  if (props.task.status !== "in-progress" || !props.task.staleSince)
    return false;
  const days = Math.floor(
    (new Date().getTime() - new Date(props.task.staleSince).getTime()) /
      (1000 * 3600 * 24),
  );
  return days >= 5;
});

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === "done") return false;
  return props.task.dueDate < new Date().toISOString().split("T")[0];
});

const completedSubtasks = computed(
  () => props.task.subtasks?.filter((s) => s.isDone).length || 0,
);

const startPomodoro = () => {
  const pomodoroStore = usePomodoroStore();
  pomodoroStore.activeTaskId = props.task.id;
  router.push("/pomodoro");
};
</script>
