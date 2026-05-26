<template>
  <div class="flex flex-col flex-1 gap-8 sm:gap-12">
    <section
      class="flex flex-col sm:flex-row justify-between items-start sm:items-end typewriter-border-b pb-4 sm:pb-6 gap-4"
    >
      <div>
        <p
          class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] mb-2 uppercase"
        >
          Daily Focus
        </p>
        <h1 class="text-3xl sm:text-4xl text-[var(--ink)] leading-tight">
          {{ greeting }}
        </h1>
      </div>
      <div class="text-left sm:text-right">
        <span
          class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] block mb-1"
          >CAPACITY</span
        >
        <span class="text-2xl sm:text-3xl text-[var(--ink)]"
          >{{ store.focusTasks.length }} / 3</span
        >
      </div>
    </section>

    <DashboardDailyNote />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 flex-1">
      <DashboardFocusList />
      <DashboardActiveQueue />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi.";
  if (hour < 15) return "Selamat Siang.";
  if (hour < 18) return "Selamat Sore.";
  return "Selamat Malam.";
});
</script>
