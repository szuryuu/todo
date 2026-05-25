<template>
  <div
    class="min-h-screen max-w-7xl mx-auto px-6 md:px-12 flex flex-col relative pt-6 pb-12"
  >
    <nav
      class="flex flex-col sm:flex-row justify-between items-center gap-6 border-b-2 border-dashed border-[var(--muted)] pb-6 mb-10"
    >
      <div class="flex items-center gap-4">
        <span class="text-4xl font-bold -rotate-2 flex items-center gap-3">
          <Pencil class="w-8 h-8" stroke-width="2.5" />
          Szuryuu Todo
        </span>
        <span class="text-xl text-[var(--muted)] hidden sm:inline rotate-1"
          >&mdash; {{ today }}</span
        >
      </div>
      <div class="flex gap-8 font-bold text-2xl">
        <NuxtLink
          to="/"
          exact-active-class="text-[var(--accent)] underline decoration-wavy decoration-2 underline-offset-4"
          >Dashboard</NuxtLink
        >
        <NuxtLink
          to="/kanban"
          exact-active-class="text-[var(--accent)] underline decoration-wavy decoration-2 underline-offset-4"
          >Kanban</NuxtLink
        >
        <NuxtLink
          to="/add"
          exact-active-class="text-[var(--accent)] underline decoration-wavy decoration-2 underline-offset-4"
          >+ Add</NuxtLink
        >
      </div>
    </nav>
    <main class="flex-1 flex flex-col">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from "lucide-vue-next";

const today = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>
