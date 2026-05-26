<template>
  <div class="typewriter-border p-4 sm:p-6 bg-[var(--surface)]">
    <label
      class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] block mb-2 uppercase"
      >Daily Note</label
    >
    <input
      v-model="dailyNote"
      type="text"
      placeholder="Hari ini saya fokus ke..."
      class="w-full bg-transparent text-xl sm:text-2xl text-[var(--ink)] focus:outline-none placeholder:text-[var(--muted)] placeholder:opacity-50 typewriter-border-b pb-2"
      @blur="saveDailyNote"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const dailyNote = ref("");

onMounted(() => {
  const today = new Date().toISOString().split("T")[0];
  const existingNote = store.dailyNotes.find((n) => n.date === today);
  if (existingNote) dailyNote.value = existingNote.focus;
});

function saveDailyNote() {
  const today = new Date().toISOString().split("T")[0];
  const index = store.dailyNotes.findIndex((n) => n.date === today);
  if (index !== -1) {
    store.dailyNotes[index].focus = dailyNote.value;
  } else {
    store.dailyNotes.push({ date: today, focus: dailyNote.value });
  }
}
</script>
