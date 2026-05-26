<template>
  <div>
    <button
      @click="isOpen = true"
      class="fixed bottom-8 right-8 bg-[var(--ink)] text-[var(--paper)] px-4 py-3 font-mono text-xs tracking-[0.22em] font-bold hover:bg-[var(--accent)] transition-colors z-50"
    >
      [+] CAPTURE
    </button>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-[var(--paper)]/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
      @click.self="isOpen = false"
    >
      <div
        class="typewriter-border bg-[var(--paper)] w-full max-w-2xl shadow-xl"
      >
        <div
          class="p-6 typewriter-border-b flex justify-between bg-[var(--surface)]"
        >
          <span
            class="font-mono text-xs tracking-[0.22em] text-[var(--ink)] font-bold uppercase"
            >QUICK ENTRY</span
          >
          <span
            class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]"
            >ESC TO CANCEL</span
          >
        </div>
        <div class="p-8">
          <input
            v-model="title"
            ref="inputRef"
            type="text"
            placeholder="Type and hit Enter..."
            class="w-full bg-transparent typewriter-border-b pb-2 text-3xl text-[var(--ink)] focus:outline-none placeholder:text-[var(--muted)] placeholder:opacity-50"
            @keyup.enter="submit"
            @keyup.esc="isOpen = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const isOpen = ref(false);
const title = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    inputRef.value?.focus();
  }
});

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && e.code === "Space") {
    e.preventDefault();
    isOpen.value = true;
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

function submit() {
  if (!title.value.trim()) return;
  store.addTask({
    title: title.value.trim(),
    status: "todo",
    priority: "medium",
    energy: "light",
    bucket: "inbox",
    context: "none",
    subtasks: [],
    dueDate: null,
    tags: [],
  });
  title.value = "";
  isOpen.value = false;
}
</script>
