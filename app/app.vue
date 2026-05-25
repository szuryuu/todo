<template>
  <div>
    <nav
      class="border-b border-[rgba(26,24,22,0.25)] p-4 flex justify-between uppercase tracking-[0.18em] text-xs"
    >
      <div>Szuryuu Todo &mdash; {{ today }}</div>
      <div class="flex gap-4">
        <NuxtLink to="/">Dashboard</NuxtLink>
        <NuxtLink to="/kanban">Kanban</NuxtLink>
      </div>
    </nav>
    <main class="p-8 max-w-7xl mx-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const today = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>
