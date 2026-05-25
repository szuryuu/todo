<template>
  <div class="flex flex-col flex-1 max-w-3xl mx-auto w-full gap-8">
    <header
      class="flex justify-between items-end border-b-2 border-dashed border-[var(--muted)] pb-4 mt-6"
    >
      <div>
        <h1 class="text-5xl rotate-1 flex items-center gap-3">
          <PenLine class="w-10 h-10" stroke-width="2.5" />
          Add New Task
        </h1>
      </div>
    </header>

    <div class="sketchy-box bg-white p-8 md:p-14 -rotate-1 mt-6">
      <div class="flex flex-col gap-10">
        <div>
          <label class="text-2xl text-[var(--muted)] block mb-3"
            >What do you need to do?</label
          >
          <input
            v-model="title"
            ref="titleInput"
            type="text"
            placeholder="Feed the cat..."
            class="w-full bg-transparent border-b-2 border-[var(--ink)] py-2 text-4xl focus:outline-none placeholder:text-[var(--muted)] placeholder:opacity-40"
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="flex flex-col md:flex-row gap-10">
          <div class="flex-1">
            <label class="text-2xl text-[var(--muted)] block mb-3">When?</label>
            <input
              v-model="dueDate"
              type="date"
              class="w-full bg-transparent sketchy-border px-5 py-3 text-2xl focus:outline-none bg-[#f8fafc]"
            />
          </div>

          <div class="flex-1">
            <label class="text-2xl text-[var(--muted)] block mb-3"
              >How important?</label
            >
            <select
              v-model="priority"
              class="w-full bg-transparent sketchy-border px-5 py-3 text-2xl focus:outline-none bg-[#f8fafc] cursor-pointer"
            >
              <option value="low">Whatever (Low)</option>
              <option value="medium">Normal (Med)</option>
              <option value="high">Urgent! (High)</option>
            </select>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-between items-center pt-10 border-t-2 border-dashed border-[var(--ink)] mt-6 gap-6"
        >
          <NuxtLink
            to="/"
            class="text-2xl text-[var(--muted)] underline decoration-wavy hover:text-[var(--accent)]"
          >
            Oops, nevermind
          </NuxtLink>
          <button
            @click="handleSubmit"
            class="sketchy-box px-10 py-4 bg-[var(--ink)] text-[var(--paper)] text-3xl rotate-2 hover:rotate-0 transition-transform flex items-center gap-3"
          >
            Save it! <Rocket class="w-6 h-6" stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PenLine, Rocket } from "lucide-vue-next";
import { useTaskStore } from "~/stores/task";
import type { TaskPriority } from "~/types/task";

const store = useTaskStore();
const router = useRouter();

const title = ref("");
const dueDate = ref("");
const priority = ref<TaskPriority>("medium");
const titleInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  titleInput.value?.focus();
});

function handleSubmit() {
  if (!title.value.trim()) return;
  store.addTask({
    title: title.value.trim(),
    dueDate: dueDate.value || null,
    priority: priority.value,
    status: "todo",
    description: "",
    tags: [],
  });
  router.push("/");
}
</script>
