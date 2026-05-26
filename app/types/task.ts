export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskEnergy = "light" | "heavy";
export type TaskBucket = "active" | "inbox" | "someday";
export type TaskContext = "campus" | "work" | "personal" | "none";

export interface Subtask {
  id: string;
  title: string;
  isDone: boolean;
}

export interface Task {
  id: string;
  title: string;
  nextAction?: string;
  status: TaskStatus;
  priority: TaskPriority;
  energy: TaskEnergy;
  bucket: TaskBucket;
  context: TaskContext;
  subtasks: Subtask[];
  dueDate?: string | null;
  tags?: string[];
  pomodoroCount: number;
  isFocusToday?: boolean;
  staleSince?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DailyNote {
  date: string;
  focus: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startedAt: string;
  completedAt?: string;
  interrupted: boolean;
}
