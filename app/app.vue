<template>
  <div class="min-h-screen flex flex-col font-typewriter">
    <header
      class="w-full typewriter-border-b bg-[var(--paper)]/90 backdrop-blur sticky top-0 z-40"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 min-h-[4rem] py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6"
      >
        <div class="flex items-center justify-between w-full md:w-auto gap-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <span
              class="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[var(--accent)] stamp-accent"
              >ACTIVE</span
            >
            <span
              class="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]"
              >SZURYUU</span
            >
          </div>
          <div class="flex md:hidden">
            <span
              class="font-mono text-[10px] tracking-[0.22em] text-[var(--muted)]"
              >{{ today }}</span
            >
          </div>
        </div>

        <nav
          class="flex items-center gap-4 sm:gap-6 font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] w-full md:w-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap pb-1 md:pb-0"
        >
          <NuxtLink
            to="/"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >FOCUS</NuxtLink
          >
          <NuxtLink
            to="/inbox"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >INBOX</NuxtLink
          >
          <NuxtLink
            to="/kanban"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >ACTIVE</NuxtLink
          >
          <NuxtLink
            to="/someday"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >SOMEDAY</NuxtLink
          >
          <NuxtLink
            to="/pomodoro"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >POMODORO</NuxtLink
          >
          <NuxtLink
            to="/weekly"
            exact-active-class="text-[var(--ink)] font-bold border-b border-[var(--ink)]"
            class="hover:text-[var(--ink)] transition-colors py-1"
            >REVIEW</NuxtLink
          >
        </nav>

        <div class="items-center gap-4 hidden md:flex">
          <span
            class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
            >{{ today }}</span
          >
        </div>
      </div>
    </header>

    <main
      class="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col"
    >
      <NuxtPage />
    </main>

    <footer class="w-full typewriter-border-t py-6 mt-8 sm:mt-12 text-center">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p
          class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
        >
          TYPEWRITER PROTOCOL // 2026
        </p>
        <p
          class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] sm:text-right"
        >
          PAGE <span class="text-[var(--ink)] font-bold">01</span>
        </p>
      </div>
    </footer>

    <QuickCapture />
  </div>
</template>

<script setup lang="ts">
import QuickCapture from "~/components/layout/QuickCapture.vue";
import { onMounted } from "vue";
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const today = new Date().toISOString().split("T")[0];

onMounted(() => {
  store.checkFocusReset();
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
});
</script>
