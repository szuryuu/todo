# Spec: Szuryuu Todo App — Prototype

> Tujuan: personal productivity tool untuk mengelola kegiatan yang selama ini hanya ada di kepala.
> Stack: Nuxt 4 + Bun. Prototype phase — no backend, semua state di localStorage.

---

## Stack & Setup

- **Framework**: Nuxt 4 (latest), dengan `compatibilityVersion: 4` di `nuxt.config.ts`
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **State**: Pinia (`@pinia/nuxt`) + `@pinia-plugin-persistedstate/nuxt`
- **AI**: Google Gemini API (`gemini-2.0-flash`, free tier) via Nuxt server route
- **Icons**: `lucide-vue-next`
- **Persistence**: localStorage via pinia-plugin-persistedstate

```bash
bun create nuxt@latest todo-app
cd todo-app
bun add @pinia/nuxt @pinia-plugin-persistedstate/nuxt lucide-vue-next
bun add -d @tailwindcss/vite tailwindcss
```

---

## Struktur Direktori (Nuxt 4 convention)

```
app/
├── pages/
│   ├── index.vue              ← Dashboard + Daily Focus
│   ├── kanban.vue             ← Kanban board
│   ├── inbox.vue              ← Inbox (hasil Brain Dump)
│   ├── someday.vue            ← Someday / Mau Coba
│   ├── weekly.vue             ← Weekly Review
│   └── pomodoro.vue           ← Pomodoro timer
├── components/
│   ├── task/
│   │   ├── TaskCard.vue
│   │   ├── TaskModal.vue
│   │   └── TaskBadge.vue
│   ├── brain/
│   │   └── BrainDump.vue
│   ├── pomodoro/
│   │   └── PomodoroTimer.vue
│   └── layout/
│       └── QuickCapture.vue   ← floating input, muncul di semua halaman
├── composables/
│   ├── useTask.ts
│   ├── useBrainDump.ts
│   └── usePomodoro.ts
├── stores/
│   ├── task.ts
│   └── pomodoro.ts
├── types/
│   └── task.ts
└── utils/
    └── constants.ts           ← POMODORO_WORK_MINUTES, dll

server/
└── api/
    └── parse-tasks.post.ts
```

---

## Data Model

```typescript
// types/task.ts

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskEnergy = "light" | "heavy";
export type TaskBucket = "active" | "inbox" | "someday";

export interface Task {
  id: string; // crypto.randomUUID()
  title: string;
  nextAction?: string; // "langkah konkret berikutnya"
  status: TaskStatus;
  priority: TaskPriority;
  energy: TaskEnergy; // light = bisa dikerjakan saat lelah
  bucket: TaskBucket; // active | inbox | someday
  dueDate?: string | null; // ISO date YYYY-MM-DD
  tags?: string[];
  pomodoroCount: number; // berapa sesi pomodoro sudah dijalankan untuk task ini
  staleSince?: string; // ISO datetime, di-set saat masuk in-progress
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  focus: string; // "hari ini saya fokus ke..."
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startedAt: string;
  completedAt?: string;
  interrupted: boolean;
}
```

---

## Fitur

### 1. Brain Dump → Inbox

Fitur paling penting. Satu textarea besar, ketik semua yang ada di pikiran, AI yang memecah.

**Flow:**

1. User buka halaman Brain Dump atau tekan shortcut global
2. Textarea besar — placeholder: _"Tulis semua yang ada di pikiranmu..."_
3. Klik **"Pisahkan"** → request ke `/api/parse-tasks`
4. Gemini memecah teks menjadi array task terstruktur
5. Preview muncul — user bisa edit judul, ubah priority, set energy, hapus
6. Klik **"Kirim ke Inbox"** → semua masuk ke `bucket: 'inbox'`, panel tutup

**Gemini prompt (di server route):**

```
Kamu adalah asisten produktivitas.
Dari teks berikut, ekstrak daftar task yang perlu dilakukan.
Kembalikan HANYA JSON array:
[{ "title": string, "priority": "low"|"medium"|"high", "energy": "light"|"heavy", "dueDate": "YYYY-MM-DD"|null }]
- priority: deadline eksplisit = high, "besok/segera" = medium, sisanya = low
- energy: butuh konsentrasi tinggi = heavy, bisa sambil santai = light
- dueDate: isi jika ada petunjuk waktu spesifik, null jika tidak ada
Teks: {userInput}
```

**Error handling:**

- Gemini gagal → error message, textarea tidak dikosongkan
- Response bukan valid JSON → fallback: satu task dengan title = seluruh teks

---

### 2. Inbox (`/inbox`)

Buffer antara pikiran mentah dan komitmen nyata. Semua hasil Brain Dump masuk sini.

**Tampilan:** daftar sederhana, urutan terbaru di atas.

**Aksi per item:**

- **Promosikan ke Active** → pindah ke kanban, status `todo`, bucket `active`
- **Pindah ke Someday** → bucket `someday`
- **Hapus** — confirm dulu

**Aturan:** tidak ada due date, tidak ada priority enforcement di Inbox. Keputusan dibuat saat promosi.

---

### 3. Kanban Board (`/kanban`) — Active Tasks

Tiga kolom: **Todo** | **In Progress** | **Done**

Hanya menampilkan task dengan `bucket: 'active'`.

**Fitur kolom:**

- Jumlah task per kolom di header
- Drag and drop antar kolom (native HTML5 drag API)
- Tombol `+` untuk quick add langsung ke kolom

**Task card menampilkan:**

- Title + nextAction (jika ada)
- Priority badge + Energy badge (`LIGHT` / `HEAVY` — monospace uppercase)
- Due date — merah jika overdue
- Staleness warning: jika task sudah `in-progress` lebih dari 5 hari, tampilkan label `STALE · N DAYS` dalam warna muted
- Jumlah pomodoro selesai (`🍅 ×3`)
- Tombol start pomodoro langsung dari card

**Task modal:**

- Edit semua field termasuk `nextAction` dan `energy`
- Timestamps sebagai info, tidak bisa diedit
- Tombol "Mark as Done" shortcut

---

### 4. Inbox Buffer

Sudah dijelaskan di fitur 1. Poin kunci:

- Task di Inbox **tidak masuk kanban**
- Tidak ada pressure — ini tempat parkir, bukan komitmen
- User buka Inbox saat ada waktu untuk "triage" pikiran yang sudah di-dump

---

### 5. Daily Focus — Maks 3 Task (`/` dashboard)

Setiap hari, pilih maksimal 3 task dari Active yang mau dikerjakan hari ini.

**Implementasi:**

- Field boolean `isFocusToday` di Task — di-reset otomatis tiap ganti hari (cek tanggal di store action)
- Dashboard menampilkan 3 slot Focus — jika belum dipilih, tampilkan prompt "Pilih task untuk hari ini"
- User pilih dari daftar Active tasks
- Task focus ditampilkan paling atas, bisa langsung start Pomodoro

**Aturan:** tidak bisa pilih lebih dari 3. Jika mau ganti, harus unset dulu yang lama.

---

### 6. Quick Capture (global)

Shortcut `Ctrl+Space` atau tombol floating `+` di pojok kanan bawah semua halaman.

**Behavior:**

- Muncul input sederhana: judul saja
- Enter → langsung masuk `bucket: 'inbox'`, status `todo`, priority `medium`, energy `light`
- Tidak ada modal, tidak ada navigasi — capture cepat, lanjut kerja

**Komponen:** `QuickCapture.vue` di `app.vue`, selalu mount.

---

### 7. Next Action per Task

Field `nextAction` — satu kalimat: langkah konkret paling kecil berikutnya.

**Contoh:**

- Title: "Belajar Nuxt" → nextAction: "Selesaikan chapter routing dulu"
- Title: "Buat CV" → nextAction: "Cari template, pilih satu"

**Tampilan:** di bawah title di task card, font muted, italic. Di modal bisa diedit.

Opsional saat create, tapi dianjurkan. Jika kosong, task card tetap valid.

---

### 8. Someday (`/someday`)

Keinginan dan aspirasi yang belum jadi komitmen.

**Tampilan:** grid sederhana, seperti sticky notes.

**Setiap item hanya punya:** title, catatan singkat (opsional), tanggal ditambahkan.

**Tidak ada:** due date, priority, status, kanban.

**Aksi:** promosikan ke Active (masuk Inbox dulu untuk triage), atau hapus.

**Diakses saat Weekly Review** untuk mempertimbangkan apa yang mau dipromosikan.

---

### 9. Weekly Review (`/weekly`)

Ritual mingguan, bukan dashboard. Muncul sebagai halaman khusus.

**Konten (dibagi tiga bagian):**

**Bagian 1 — Minggu lalu:**

- Berapa task selesai
- Task yang masih stuck di in-progress (overdue atau stale)
- Daily notes dari 7 hari terakhir

**Bagian 2 — Inbox & Someday triage:**

- Daftar semua item di Inbox yang belum diproses
- Daftar Someday — pilih mana yang mau dipromosikan ke Active minggu ini

**Bagian 3 — Minggu ini:**

- Input: "Minggu ini saya ingin fokus ke..." (satu kalimat)
- Konfirmasi task Active yang akan dibawa ke minggu ini

**Tidak ada chart.** Hanya teks dan aksi.

---

### 10. Energy Level per Task

Field `energy: 'light' | 'heavy'` di setiap task.

- `heavy` — butuh konsentrasi penuh, kondisi mental prima
- `light` — bisa dikerjakan saat lelah, tidak butuh fokus tinggi

**Tampilan di kanban:** badge kecil `HEAVY` atau `LIGHT` — monospace uppercase, warna berbeda.

**Manfaat:** saat tidak produktif, filter kanban untuk tampilkan hanya task `light`. Tidak ada fitur filter eksplisit di V1 — cukup user sadar badge ini saat memilih task.

---

### 11. Pomodoro Timer (`/pomodoro`)

Timer yang terikat ke task spesifik, bukan standalone countdown.

**Konstanta (di `utils/constants.ts`):**

```typescript
export const POMODORO_WORK_MINUTES = 25;
export const POMODORO_SHORT_BREAK_MINUTES = 5;
export const POMODORO_LONG_BREAK_MINUTES = 15;
export const POMODORO_SESSIONS_BEFORE_LONG_BREAK = 4;
```

**Flow:**

1. User pilih task dari daftar Active (atau dari Daily Focus)
2. Timer menampilkan countdown 25:00
3. Klik **"Mulai"** → timer berjalan, tab title berubah: `"25:00 — Belajar Nuxt"`
4. Selesai → notifikasi browser (`Notification API`), sesi dicatat ke `PomodoroSession`
5. `pomodoroCount` di task bertambah +1
6. Otomatis masuk fase break (5 menit atau 15 menit setelah 4 sesi)
7. Klik **"Interupsi"** → sesi dicatat sebagai `interrupted: true`, timer reset

**State (Pinia store `pomodoro.ts`):**

```typescript
interface PomodoroState {
  activeTaskId: string | null;
  phase: "work" | "short-break" | "long-break" | "idle";
  secondsLeft: number;
  sessionCount: number; // sesi work berturut-turut
  sessions: PomodoroSession[];
}
```

**Tampilan halaman `/pomodoro`:**

- Besar, terpusat — angka countdown Special Elite besar
- Di bawah timer: nama task aktif
- Progress ring (SVG) mengelilingi angka
- Tombol: Mulai / Pause / Interupsi / Skip Break
- Riwayat sesi hari ini di bawah (list sederhana)

**Di task card:** badge `🍅 ×N` menunjukkan total sesi selesai. Tombol ▶ start langsung dari card → navigate ke `/pomodoro` dengan task sudah terpilih.

**Timer tetap berjalan saat navigasi halaman lain** — state di Pinia, countdown via `setInterval` di composable `usePomodoro.ts`. Tab title terus update.

---

## Daily Note

Field sederhana di dashboard, satu per hari.

**Tampilan:** di bawah Daily Focus, satu input text.

- Placeholder: _"Hari ini saya fokus ke..."_
- Auto-save saat blur
- Disimpan di store terpisah atau sebagai array `DailyNote[]` di task store

Digunakan di Weekly Review untuk melihat pattern minggu lalu.

---

## Staleness Indicator

Task dengan `status: 'in-progress'` yang tidak di-update lebih dari 5 hari ditandai otomatis.

**Implementasi:**

- `staleSince` di-set saat task pertama kali pindah ke `in-progress`
- Getter di store menghitung selisih hari dari `staleSince` ke `now`
- Jika > 5 hari: task card menampilkan label `STALE · 7 DAYS` (mono, muted, warna warning)
- Tidak ada pop-up, tidak ada notifikasi — hanya visual di card

---

## Clean Code & Best Practice Nuxt 4

### Nuxt 4 Specifics

- Gunakan `app/` directory
- Auto-imports aktif — tidak perlu manual import `ref`, `computed`
- Server routes di `server/api/` — Gemini API call wajib di sini
- `useAsyncData` / `useFetch` untuk fetching, tidak ada axios

### State Management

- Store terpisah: `task.ts` dan `pomodoro.ts`
- Store hanya berisi state, getters, actions — tidak ada UI logic
- Business logic di composable, bukan di komponen

### Komponen

- Satu komponen, satu tanggung jawab
- Props di-type eksplisit dengan TypeScript interface
- `defineEmits<{ ... }>()` eksplisit
- Tidak ada logic kompleks di template

### TypeScript

- Strict mode aktif
- Tidak ada `any`
- Semua type di `types/task.ts`

### Lain-lain

- Tidak ada komentar inline
- Magic number/string → `utils/constants.ts`
- `.env` untuk API key, tidak pernah expose ke client

---

## Design Brief

**Referensi visual**: Typewriter Sheet — kertas ivory lusuh, Special Elite, stempel tinta merah.
Design concept #06 sebagai panduan utama.

**Palette:**

```css
--paper: #f0e8d4;
--ink: #1a1408;
--muted: #9a8868;
--accent: #be3228;
--surface: #e8dfc8;
--typewriter: "Special Elite", cursive;
--mono: "Courier Prime", "Courier New", monospace;
```

**Texture background:**

```css
background:
  repeating-linear-gradient(
    transparent,
    transparent 24px,
    rgba(100, 80, 50, 0.09) 24px,
    rgba(100, 80, 50, 0.09) 25px
  ),
  var(--paper);
```

**Typography:**

- Special Elite → semua teks konten utama: title task, judul halaman, isi textarea, angka countdown Pomodoro
- Courier Prime/monospace → semua label, badge, timestamp, stempel, metadata chrome
- Uppercase + `letter-spacing: 0.22em` → semua label kecil (STALE, HEAVY, LIGHT, HIGH, ACTIVE FILE, INBOX)
- Hierarki visual bukan dari italic — gunakan ukuran dan opacity sebagai pengganti

**Komponen feel:**

- Border tipis `1px solid rgba(26, 20, 8, 0.18)` — tidak ada shadow
- Rounded corners nol atau minimal (`border-radius: 1px`) — typewriter tidak mengenal sudut tumpul
- Hover: background shift ringan ke `var(--surface)`
- Stamp element: border `1.5px solid rgba(190, 50, 40, 0.3)`, warna teks `rgba(190, 50, 40, 0.65)`, rotate `-1.5deg`, uppercase, `letter-spacing: 0.25em` — digunakan untuk status label (ACTIVE FILE, DONE, INBOX)
- Checkbox task: karakter `[ ]` dan `[x]` dalam monospace, bukan elemen HTML checkbox
- Done state: `text-decoration: line-through`, warna turun ke `var(--muted)` (`#9a8868`)
- Footer/metadata halaman: warna `#7a6848`, font mono, rata kanan

---

## Out of Scope (Prototype)

- Authentication
- Backend / database — semua localStorage
- Push notification / reminder
- Recurring task
- Multi-user
- Mobile responsiveness — desktop first
- Analytics / chart

---

## Environment Variables

```env
# .env
GEMINI_API_KEY=your_key_here

# .env.example
GEMINI_API_KEY=
```

---

## Urutan Build yang Disarankan

1. `types/task.ts` + `utils/constants.ts`
2. `stores/task.ts` + `stores/pomodoro.ts`
3. `composables/useTask.ts` + `composables/usePomodoro.ts`
4. `server/api/parse-tasks.post.ts`
5. `components/layout/QuickCapture.vue` + `app.vue`
6. `pages/inbox.vue`
7. `pages/kanban.vue` + TaskCard + TaskModal
8. `pages/index.vue` (Dashboard + Daily Focus)
9. `pages/pomodoro.vue` + PomodoroTimer
10. `components/brain/BrainDump.vue`
11. `pages/someday.vue`
12. `pages/weekly.vue`
