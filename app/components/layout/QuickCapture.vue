<template>
  <div>
    <button
      @click="isOpen = true"
      class="fixed bottom-8 right-8 border border-zinc-100 bg-zinc-100 text-zinc-950 px-4 py-3 font-mono text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors z-50"
    >
      [+] CAPTURE
    </button>

    <div
      v-if="isOpen"
      class="fixed inset-0 bg-zinc-950/90 z-50 flex items-center justify-center p-6 backdrop-blur-none"
      @click.self="isOpen = false"
    >
      <div class="border border-zinc-700 bg-zinc-900 w-full max-w-2xl">
        <div
          class="p-6 border-b border-zinc-800 flex justify-between bg-zinc-950"
        >
          <span
            class="font-mono text-xs text-zinc-500 tracking-widest uppercase"
            >QUICK CAPTURE // CTRL+SPACE</span
          >
          <span
            class="font-mono text-xs text-zinc-600 tracking-widest uppercase"
            >ESC TO CANCEL</span
          >
        </div>
        <div class="p-8">
          <input
            v-model="title"
            ref="inputRef"
            type="text"
            placeholder="ENTER LOG..."
            class="w-full bg-transparent border-b border-zinc-700 py-4 font-serif italic text-3xl text-zinc-100 focus:outline-none focus:border-zinc-400 transition-colors uppercase"
            @keyup.enter="submit"
            @keyup.esc="isOpen = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
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
    dueDate: null,
    tags: [],
  });
  title.value = "";
  isOpen.value = false;
}
</script>
