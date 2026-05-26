<template>
  <div class="min-h-screen flex flex-col font-typewriter">
    <header
      class="w-full typewriter-border-b bg-[var(--paper)]/90 backdrop-blur sticky top-0 z-40"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-16 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <span
            class="font-mono text-xs tracking-[0.25em] text-[var(--accent)] stamp-accent"
            >ACTIVE FILE</span
          >
          <span class="text-2xl font-bold tracking-tight text-[var(--ink)]"
            >SZURYUU.TODO</span
          >
        </div>

        <nav
          class="flex items-center gap-6 font-mono text-xs tracking-[0.22em] text-[var(--muted)]"
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

        <div class="flex items-center gap-4 hidden lg:flex">
          <span
            class="font-mono text-xs tracking-[0.22em] text-[var(--muted)]"
            >{{ today }}</span
          >
        </div>
      </div>
    </header>

    <main class="max-w-7xl w-full mx-auto px-6 py-12 flex-1 flex flex-col">
      <NuxtPage />
    </main>

    <footer class="w-full typewriter-border-t py-6 mt-12 text-center">
      <div
        class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p class="font-mono text-xs tracking-[0.22em] text-[var(--muted)]">
          TYPEWRITER PROTOCOL // 2026
        </p>
        <p
          class="font-mono text-xs tracking-[0.22em] text-[var(--muted)] text-right"
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
