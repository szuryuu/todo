<template>
  <div class="flex flex-col flex-1">
    <section class="px-6 py-16 border-b border-zinc-800">
      <p class="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-6">
        — PROTOCOL
      </p>
      <h1 class="font-serif text-5xl text-zinc-100 leading-tight italic">
        Weekly Review
      </h1>
    </section>

    <HatchingDivider label="SYSTEM DIAGNOSTIC" />

    <div
      class="p-8 flex-1 bg-zinc-950 flex flex-col items-center justify-center"
    >
      <div
        class="border border-zinc-800 bg-zinc-900 p-8 max-w-lg w-full text-center"
      >
        <span
          class="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 block"
          >STATUS: PENDING IMPLEMENTATION</span
        >
        <p class="font-mono text-sm text-zinc-400 leading-relaxed uppercase">
          WEEKLY REVIEW COMPILATION MATRIX WILL BE IMPLEMENTED IN ITERATION 3.
          ENSURE ALL STATES ARE RESOLVED BEFORE INITIATING PROTOCOL.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HatchingDivider from "~/components/layout/HatchingDivider.vue";
</script>
