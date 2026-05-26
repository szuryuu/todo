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

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 flex-1">
      <section class="flex flex-col gap-4 sm:gap-6">
        <div class="flex justify-between items-center typewriter-border-b pb-2">
          <h2 class="text-xl sm:text-2xl text-[var(--ink)]">Selected Focus</h2>
          <span class="stamp-accent text-[8px]">EXECUTE</span>
        </div>

        <div class="flex-1 space-y-4 sm:space-y-6">
          <div
            v-for="task in store.focusTasks"
            :key="task.id"
            class="typewriter-border p-4 sm:p-6 bg-[var(--paper)] hover:bg-[var(--surface)] transition-colors relative"
          >
            <h3 class="text-lg sm:text-xl text-[var(--ink)]">
              {{ task.title }}
            </h3>
            <p
              v-if="task.nextAction"
              class="font-mono text-[10px] sm:text-xs text-[var(--muted)] mt-3 sm:mt-4"
            >
              >> {{ task.nextAction }}
            </p>

            <div
              class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 typewriter-border-t"
            >
              <button
                @click="store.updateTask(task.id, { isFocusToday: false })"
                class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-2 sm:py-0"
              >
                [ UNSET ]
              </button>
              <button
                @click="startPomodoro(task.id)"
                class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--paper)] bg-[var(--ink)] px-4 py-2 hover:bg-[var(--accent)] transition-colors font-bold"
              >
                START TIMER
              </button>
            </div>
          </div>

          <div
            v-if="store.focusTasks.length < 3"
            class="typewriter-border p-4 sm:p-6 text-center border-dashed bg-transparent opacity-60"
          >
            <span
              class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
              >SLOT AVAILABLE</span
            >
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4 sm:gap-6">
        <div class="flex justify-between items-center typewriter-border-b pb-2">
          <h2 class="text-xl sm:text-2xl text-[var(--ink)]">Active Queue</h2>
          <span
            class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)]"
            >{{ availableActive.length }} PENDING</span
          >
        </div>

        <div class="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
          <div
            v-for="task in availableActive"
            :key="task.id"
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 typewriter-border bg-[var(--paper)] hover:bg-[var(--surface)] transition-colors"
          >
            <div class="flex flex-col gap-2 w-full sm:w-auto">
              <span class="text-base sm:text-lg text-[var(--ink)]">{{
                task.title
              }}</span>
              <div class="flex gap-2 sm:gap-3 flex-wrap">
                <span
                  class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase"
                  >PRIORITY: {{ task.priority }}</span
                >
                <span
                  class="font-mono text-[8px] sm:text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase"
                  >ENERGY: {{ task.energy }}</span
                >
              </div>
            </div>
            <button
              @click="setFocus(task.id)"
              :disabled="store.focusTasks.length >= 3"
              class="w-full sm:w-auto text-center font-mono text-[10px] sm:text-xs tracking-[0.22em] px-3 py-2 sm:py-1 typewriter-border text-[var(--ink)] disabled:opacity-30 hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              [ FOCUS ]
            </button>
          </div>

          <div
            v-if="availableActive.length === 0"
            class="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[var(--muted)] text-center py-8"
          >
            QUEUE IS EMPTY.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTaskStore } from "~/stores/task";

const store = useTaskStore();
const router = useRouter();
const dailyNote = ref("");

onMounted(() => {
  const today = new Date().toISOString().split("T")[0];
  const existingNote = store.dailyNotes.find((n) => n.date === today);
  if (existingNote) dailyNote.value = existingNote.focus;
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi.";
  if (hour < 15) return "Selamat Siang.";
  if (hour < 18) return "Selamat Sore.";
  return "Selamat Malam.";
});

const availableActive = computed(() =>
  store.activeTasks.filter((t) => !t.isFocusToday),
);

function setFocus(id: string) {
  if (store.focusTasks.length < 3) store.updateTask(id, { isFocusToday: true });
}

function saveDailyNote() {
  const today = new Date().toISOString().split("T")[0];
  const index = store.dailyNotes.findIndex((n) => n.date === today);

  if (index !== -1) {
    store.dailyNotes[index].focus = dailyNote.value;
  } else {
    store.dailyNotes.push({ date: today, focus: dailyNote.value });
  }
}

function startPomodoro(id: string) {
  router.push(`/pomodoro?task=${id}`);
}
</script>
