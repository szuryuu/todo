<template>
  <div class="space-y-20">
    <section class="text-center max-w-3xl mx-auto space-y-6 relative py-8">
      <div
        class="inline-block font-mono text-xs text-amber-500 border border-amber-500/30 bg-amber-500/5 px-3 py-1 rounded-full sketchy-border"
      >
        [Protocol: Daily Focus / Active]
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight font-sans">
        Execute Intentions Without <br />
        <span class="font-hand text-amber-500 relative inline-block mx-1">
          Losing Control
          <svg
            class="absolute -bottom-2 left-0 w-full h-2 text-amber-500/60 sketchy-border"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0,5 Q25,2 50,5 T100,5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ></path>
          </svg>
        </span>
      </h1>
      <p
        class="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed"
      >
        Limit your daily scope to three explicit tasks. Drop the noise, align
        your cognitive load, and execute systematically.
      </p>

      <div
        class="relative w-full h-12 border-y border-zinc-800 overflow-hidden flex items-center justify-center sketchy-border mt-8"
      >
        <div class="absolute inset-0 -z-10 bg-zinc-950">
          <svg width="100%" height="100%" aria-hidden="true">
            <rect
              width="100%"
              height="100%"
              fill="url(#hand-hatch)"
              class="sketchy-border"
            ></rect>
          </svg>
        </div>
        <span
          class="relative z-10 bg-zinc-950 px-6 py-1 font-hand text-xs font-bold tracking-widest text-zinc-500 uppercase border-x border-zinc-800 sketchy-border"
        >
          Command Center Overview
        </span>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-hand text-lg text-zinc-400 flex items-center gap-2">
        <span
          class="size-2 bg-amber-500 inline-block rounded-full animate-pulse"
        ></span>
        System Telemetry
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="border border-zinc-800 bg-zinc-900/20 p-6 relative overflow-hidden flex flex-col justify-between h-44 sketchy-border"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-hand text-xs text-zinc-500 uppercase">
                Focus Allocation
              </p>
              <h3 class="text-3xl font-mono font-bold mt-1 text-zinc-100">
                {{ store.focusTasks.length
                }}<span class="text-xs text-zinc-500">/3 Slots</span>
              </h3>
            </div>
            <span
              class="font-mono text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 sketchy-border"
              v-if="store.focusTasks.length === 3"
              >MAX</span
            >
            <span
              class="font-mono text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 sketchy-border"
              v-else
              >OPEN</span
            >
          </div>
          <div
            class="w-full h-5 border border-zinc-700 bg-zinc-950 p-0.5 relative sketchy-border mt-4"
          >
            <div
              class="h-full bg-amber-500/20 relative"
              :style="{ width: (store.focusTasks.length / 3) * 100 + '%' }"
            >
              <svg class="w-full h-full" aria-hidden="true">
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#hand-hatch-dense)"
                  class="sketchy-border"
                ></rect>
              </svg>
            </div>
          </div>
          <div
            class="absolute bottom-1 right-2 font-hand text-[10px] text-zinc-600"
          >
            ref: daily-focus-queue
          </div>
        </div>

        <div
          class="border border-zinc-800 bg-zinc-900/20 p-6 relative overflow-hidden flex flex-col justify-between h-44 sketchy-border md:col-span-2"
        >
          <div class="flex justify-between items-start">
            <p class="font-hand text-xs text-zinc-500 uppercase">
              Global Directive Instruction
            </p>
          </div>
          <input
            v-model="dailyNote"
            type="text"
            placeholder="DEFINE TODAY'S CORE OBJECTIVE..."
            class="w-full bg-transparent font-hand text-2xl text-amber-500 focus:outline-none placeholder:text-zinc-700 mt-2"
            @blur="saveDailyNote"
          />
          <div class="w-full h-12 relative">
            <svg
              class="w-full h-full text-zinc-800 sketchy-border"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <path
                d="M0,15 L15,12 L30,17 L45,8 L60,14 L75,5 L90,12 L100,7"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div
        class="lg:col-span-2 border border-zinc-800 p-6 space-y-6 relative bg-zinc-900/10 sketchy-border"
      >
        <span
          class="absolute -top-2.5 -left-1.5 text-zinc-600 font-mono text-lg font-light pointer-events-none"
          >+</span
        >
        <span
          class="absolute -top-2.5 -right-1.5 text-zinc-600 font-mono text-lg font-light pointer-events-none"
          >+</span
        >
        <span
          class="absolute -bottom-2.5 -left-1.5 text-zinc-600 font-mono text-lg font-light pointer-events-none"
          >+</span
        >
        <span
          class="absolute -bottom-2.5 -right-1.5 text-zinc-600 font-mono text-lg font-light pointer-events-none"
          >+</span
        >

        <div
          class="flex justify-between items-center border-b border-zinc-800 pb-4 sketchy-border"
        >
          <div>
            <h3 class="font-hand text-lg font-bold text-zinc-200">
              Execution Pipeline
            </h3>
            <p class="text-xs text-zinc-500 font-mono">ID: pipe-focus-today</p>
          </div>
          <span
            class="font-hand text-xs text-amber-500 border border-amber-500/40 px-2 py-1 bg-amber-500/5 sketchy-border"
            >Sequential Logic</span
          >
        </div>

        <div class="space-y-4 font-mono text-xs">
          <div v-for="(task, idx) in store.focusTasks" :key="task.id">
            <div class="flex items-center gap-4 relative z-10">
              <div
                class="w-24 font-hand text-amber-500 text-right animate-pulse"
              >
                Node 0{{ idx + 1 }}
              </div>
              <div
                class="size-6 border border-amber-500 bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold font-sans text-[10px] sketchy-border"
              >
                ▶
              </div>
              <div
                class="flex-1 border border-amber-500 bg-amber-500/5 p-3 flex justify-between items-center relative overflow-hidden sketchy-border"
              >
                <div class="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%">
                    <rect
                      width="100%"
                      height="100%"
                      fill="url(#hand-hatch)"
                    ></rect>
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-amber-400 font-sans font-medium text-sm">{{
                    task.title
                  }}</span>
                  <span
                    v-if="task.nextAction"
                    class="text-amber-500 font-hand opacity-80 mt-1"
                    >↳ {{ task.nextAction }}</span
                  >
                </div>
                <div class="flex gap-2">
                  <button
                    @click="store.updateTask(task.id, { isFocusToday: false })"
                    class="text-[10px] text-zinc-500 hover:text-zinc-300 font-hand border border-zinc-700 px-2 py-1 sketchy-border bg-zinc-950"
                  >
                    Eject
                  </button>
                  <button
                    @click="startPomodoro(task.id)"
                    class="text-[10px] text-zinc-950 bg-amber-500 font-bold px-2 py-1 sketchy-border hover:bg-amber-400 transition-colors"
                  >
                    Exec
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="idx < store.focusTasks.length - 1"
              class="h-6 ml-32 w-4 relative z-0"
            >
              <svg
                class="w-full h-full text-zinc-700 sketchy-border"
                viewBox="0 0 10 20"
                preserveAspectRatio="none"
              >
                <line
                  x1="5"
                  y1="0"
                  x2="5"
                  y2="20"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-dasharray="3 3"
                ></line>
              </svg>
            </div>
          </div>

          <div v-if="store.focusTasks.length < 3">
            <div v-if="store.focusTasks.length > 0" class="h-6 ml-32 w-4">
              <svg
                class="w-full h-full text-zinc-700 sketchy-border"
                viewBox="0 0 10 20"
                preserveAspectRatio="none"
              >
                <line
                  x1="5"
                  y1="0"
                  x2="5"
                  y2="20"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-dasharray="3 3"
                ></line>
              </svg>
            </div>
            <div class="flex items-center gap-4 opacity-50">
              <div class="w-24 font-hand text-zinc-500 text-right">
                Idle Node
              </div>
              <div
                class="size-6 border border-zinc-700 bg-zinc-900 text-zinc-600 flex items-center justify-center font-bold font-sans text-[10px] sketchy-border"
              >
                ○
              </div>
              <div
                class="flex-1 border border-zinc-800 p-3 bg-zinc-950 flex justify-between items-center sketchy-border"
              >
                <span class="text-zinc-600 font-hand"
                  >Awaiting payload assignment...</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="border border-zinc-800 p-6 space-y-4 bg-amber-500/[0.02] relative sketchy-border"
      >
        <div class="absolute inset-0 -z-10 opacity-30">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#hand-hatch)"></rect>
          </svg>
        </div>
        <div
          class="flex justify-between items-end border-b border-zinc-800 pb-2 sketchy-border"
        >
          <h4
            class="font-hand text-base font-bold text-amber-500 tracking-wider"
          >
            Active Pool
          </h4>
          <div
            class="font-mono text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 sketchy-border"
          >
            Available Tasks
          </div>
        </div>

        <div
          class="w-full bg-zinc-950 rounded-sm overflow-hidden font-mono text-xs text-zinc-400 space-y-1 relative sketchy-border border border-zinc-800 p-2"
        >
          <div
            v-for="task in availableActive"
            :key="task.id"
            class="flex gap-3 hover:bg-zinc-900/50 p-2 transition-colors border-b border-zinc-800/50 last:border-0 group items-center"
          >
            <span class="text-zinc-600 select-none text-[10px] w-8 uppercase">{{
              task.priority.slice(0, 3)
            }}</span>
            <span class="text-zinc-300 flex-1 font-sans text-xs truncate">{{
              task.title
            }}</span>
            <button
              @click="setFocus(task.id)"
              :disabled="store.focusTasks.length >= 3"
              class="opacity-0 group-hover:opacity-100 transition-opacity font-hand text-amber-500 hover:text-amber-400 disabled:opacity-30 border border-amber-500/50 px-2 py-0.5 bg-amber-500/10 sketchy-border"
            >
              Load
            </button>
          </div>
          <div
            v-if="availableActive.length === 0"
            class="p-2 text-zinc-600 font-hand text-center"
          >
            Pool is empty.
          </div>
        </div>
      </div>
    </section>
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
