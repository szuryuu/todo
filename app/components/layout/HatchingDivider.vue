<template>
  <div
    class="relative w-full h-16 border-y border-zinc-800 overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0">
      <svg width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern
            id="hatch-1"
            viewBox="0 0 10 10"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="10"
              x2="10"
              y2="0"
              stroke="#3f3f46"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch-1)" />
      </svg>
    </div>
    <span
      class="relative z-10 bg-zinc-950 px-6 py-2 text-xs font-bold tracking-widest text-zinc-400 uppercase border-x border-zinc-800 font-mono"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
</script>
