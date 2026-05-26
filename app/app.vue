<template>
  <div
    class="bg-zinc-950 text-zinc-100 font-sans min-h-screen selection:bg-amber-500/30 overflow-x-hidden flex flex-col"
  >
    <svg class="absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter
          id="handwritten-distortion"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <pattern
          viewBox="0 0 12 12"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          id="hand-hatch"
        >
          <line
            x1="-2"
            y1="14"
            x2="14"
            y2="-2"
            stroke="currentColor"
            stroke-width="1.2"
            class="text-zinc-800"
            stroke-linecap="round"
          ></line>
        </pattern>
        <pattern
          viewBox="0 0 8 8"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          id="hand-hatch-dense"
        >
          <line
            x1="-2"
            y1="10"
            x2="10"
            y2="-2"
            stroke="currentColor"
            stroke-width="1"
            class="text-amber-500/20"
            stroke-linecap="round"
          ></line>
        </pattern>
      </defs>
    </svg>

    <header
      class="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 sketchy-border"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-8 border border-amber-500 flex items-center justify-center font-hand text-amber-500 font-bold text-lg sketchy-border bg-amber-500/5"
          >
            Σ
          </div>
          <span class="font-hand text-xl font-bold tracking-tight text-zinc-200"
            >szuryuu.todo</span
          >
        </div>

        <nav
          class="hidden md:flex items-center gap-8 font-hand text-sm text-zinc-400"
        >
          <NuxtLink
            to="/"
            exact-active-class="text-amber-500 border-amber-500"
            class="hover:text-amber-500 transition-colors py-1 border-b border-transparent hover:border-amber-500 sketchy-border"
            >Dashboard</NuxtLink
          >
          <NuxtLink
            to="/inbox"
            exact-active-class="text-amber-500 border-amber-500"
            class="hover:text-amber-500 transition-colors py-1 border-b border-transparent hover:border-amber-500 sketchy-border"
            >Inbox</NuxtLink
          >
          <NuxtLink
            to="/kanban"
            exact-active-class="text-amber-500 border-amber-500"
            class="hover:text-amber-500 transition-colors py-1 border-b border-transparent hover:border-amber-500 sketchy-border"
            >Active</NuxtLink
          >
          <NuxtLink
            to="/someday"
            exact-active-class="text-amber-500 border-amber-500"
            class="hover:text-amber-500 transition-colors py-1 border-b border-transparent hover:border-amber-500 sketchy-border"
            >Someday</NuxtLink
          >
          <NuxtLink
            to="/pomodoro"
            exact-active-class="text-amber-500 border-amber-500"
            class="hover:text-amber-500 transition-colors py-1 border-b border-transparent hover:border-amber-500 sketchy-border"
            >Timer</NuxtLink
          >
        </nav>

        <div class="flex items-center gap-4">
          <span class="font-mono text-xs text-zinc-500 hidden sm:inline">{{
            today
          }}</span>
          <NuxtLink
            to="/add"
            class="font-hand text-xs bg-zinc-900 border border-zinc-700 px-4 py-2 hover:bg-amber-500 hover:text-zinc-950 hover:border-amber-500 transition-all sketchy-border rounded-sm"
          >
            New Task
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-7xl w-full mx-auto px-6 py-12 space-y-20 flex-1">
      <NuxtPage />
    </main>

    <footer
      class="w-full border-t border-zinc-800 py-8 mt-20 text-center font-hand text-xs text-zinc-600 sketchy-border"
    >
      <div
        class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p>© 2026 szuryuu.todo — Productivity Protocol v4</p>
        <p class="font-mono text-[10px] text-zinc-700">
          Executed context: DOM_HARDWARE_ACCELERATED_TRUE
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
