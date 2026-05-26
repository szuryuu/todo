import { usePomodoroStore } from "~/stores/pomodoro";
import { useTaskStore } from "~/stores/task";
import {
  POMODORO_SHORT_BREAK_MINUTES,
  POMODORO_LONG_BREAK_MINUTES,
  POMODORO_SESSIONS_BEFORE_LONG_BREAK,
} from "~/utils/constants";

let timerInterval: ReturnType<typeof setInterval> | null = null;

export function usePomodoro() {
  const store = usePomodoroStore();
  const taskStore = useTaskStore();
  const isRunning = ref(false);

  function startTimer(taskId?: string) {
    if (taskId) {
      store.activeTaskId = taskId;
      store.phase = "work";
      store.secondsLeft = (store.workDurationMinutes || 25) * 60;
    }
    if (store.phase === "idle") {
      store.phase = "work";
      store.secondsLeft = (store.workDurationMinutes || 25) * 60;
    }
    isRunning.value = true;
    timerInterval = setInterval(() => {
      if (store.secondsLeft > 0) {
        store.secondsLeft--;
        updateTitle();
      } else {
        completePhase();
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning.value = false;
    if (timerInterval) clearInterval(timerInterval);
  }

  function interruptTimer() {
    pauseTimer();
    if (store.activeTaskId && store.phase === "work") {
      store.sessions.push({
        id: crypto.randomUUID(),
        taskId: store.activeTaskId,
        startedAt: new Date().toISOString(),
        interrupted: true,
      });
    }
    store.phase = "idle";
    store.secondsLeft = 0;
    store.activeTaskId = null;
    document.title = "Szuryuu Todo";
  }

  function completePhase() {
    pauseTimer();
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer", { body: "Phase completed!" });
    }
    if (store.phase === "work") {
      store.sessionCount++;
      if (store.activeTaskId) {
        taskStore.incrementPomodoro(store.activeTaskId);
        store.sessions.push({
          id: crypto.randomUUID(),
          taskId: store.activeTaskId,
          startedAt: new Date(
            Date.now() - (store.workDurationMinutes || 25) * 60000,
          ).toISOString(),
          completedAt: new Date().toISOString(),
          interrupted: false,
        });
      }
      if (store.sessionCount % POMODORO_SESSIONS_BEFORE_LONG_BREAK === 0) {
        store.phase = "long-break";
        store.secondsLeft = POMODORO_LONG_BREAK_MINUTES * 60;
      } else {
        store.phase = "short-break";
        store.secondsLeft = POMODORO_SHORT_BREAK_MINUTES * 60;
      }
    } else {
      store.phase = "idle";
      store.secondsLeft = 0;
    }
    updateTitle();
  }

  function updateTitle() {
    const m = Math.floor(store.secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (store.secondsLeft % 60).toString().padStart(2, "0");
    const task = taskStore.tasks.find((t) => t.id === store.activeTaskId);
    document.title = `${m}:${s} - ${task?.title || store.phase}`;
  }

  return { isRunning, startTimer, pauseTimer, interruptTimer };
}
