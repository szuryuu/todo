# Spec: Szuryuu Todo App — Prototype

> Tujuan: personal productivity tool untuk mengelola kegiatan yang selama ini hanya ada di kepala.
> Stack: Nuxt 4 + Bun. Prototype phase — no backend, semua state di localStorage.

---

## Stack & Setup

- **Framework**: Nuxt 4 (latest), dengan `compatibilityVersion: 4` di `nuxt.config.ts`
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 (via `@nuxtjs/tailwindcss` atau native Nuxt module)
- **State**: Pinia (`@pinia/nuxt`)
- **AI**: Google Gemini API (`gemini-2.0-flash`, free tier) via `$fetch` di Nuxt server route
- **Icons**: `@iconify/vue` atau `lucide-vue-next`
- **Persistence**: `localStorage` via Pinia plugin (`pinia-plugin-persistedstate`)

```bash
bun create nuxt@latest todo-app
cd todo-app
bun add @pinia/nuxt pinia-plugin-persistedstate lucide-vue-next
bun add -d @nuxtjs/tailwindcss
```

---

## Struktur Direktori (Nuxt 4 convention)

```
app/
├── pages/
│   ├── index.vue          ← Dashboard
│   └── kanban.vue         ← Kanban board
├── components/
│   ├── task/
│   │   ├── TaskCard.vue
│   │   ├── TaskModal.vue
│   │   └── TaskBadge.vue
│   ├── dashboard/
│   │   ├── StatCard.vue
│   │   └── ActivityChart.vue
│   └── brain/
│       └── BrainDump.vue  ← Fitur AI textarea
├── composables/
│   ├── useTask.ts
│   └── useBrainDump.ts
├── stores/
│   └── task.ts            ← Pinia store
└── types/
    └── task.ts            ← Type definitions

server/
└── api/
    └── parse-tasks.post.ts ← Gemini API call (key tidak expose ke client)
```

---

## Data Model

```typescript
// types/task.ts

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: string; // crypto.randomUUID()
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string, nullable
  tags?: string[];
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  completedAt?: string; // ISO datetime, set saat status → done
}
```

---

## Fitur

### 1. Dashboard (`/`)

Tampilkan ringkasan keadaan saat ini. Bukan laporan — ini command center harian.

**Konten:**

- **Header**: greeting dinamis (pagi/siang/malam) + tanggal hari ini
- **Stat cards** (4 buah):
  - Total task aktif (todo + in-progress)
  - Task jatuh tempo hari ini
  - Task selesai minggu ini
  - Task overdue (due date sudah lewat, belum done)
- **Due Today list**: card task yang due hari ini, bisa langsung toggle status
- **Quick Add**: input singkat untuk tambah task cepat (title + due date + priority, tanpa buka modal)
- **Brain Dump shortcut**: tombol menuju atau membuka panel Brain Dump

**Catatan implementasi:**

- Semua data dari Pinia store, computed via `computed()` — tidak ada logic di template
- Tanggal dihitung relatif terhadap `new Date()` saat render
- Overdue hanya untuk task yang belum `done`

---

### 2. Kanban Board (`/kanban`)

Tiga kolom: **Todo** | **In Progress** | **Done**

**Fitur kolom:**

- Jumlah task per kolom ditampilkan di header kolom
- Drag and drop antar kolom untuk ubah status (gunakan native HTML5 drag API atau `@vueuse/integrations` — tidak perlu library berat)
- Tombol `+` di setiap kolom untuk tambah task langsung ke kolom tersebut

**Task card menampilkan:**

- Title
- Priority badge (color-coded: low/medium/high)
- Due date (merah jika overdue)
- Tags (jika ada)
- Tombol hapus (confirm dulu)

**Task modal (buka saat klik card):**

- Edit semua field: title, description, status, priority, due date, tags
- Timestamps (createdAt, updatedAt) ditampilkan sebagai info, tidak bisa diedit
- Tombol "Mark as Done" shortcut

---

### 3. Brain Dump (komponen `BrainDump.vue`)

Ini fitur inti. Satu textarea besar, ketik semua yang ada di pikiran, AI yang memisahkan.

**Flow:**

1. User membuka panel Brain Dump (bisa dari dashboard atau floating button)
2. Textarea besar muncul — placeholder: _"Tulis semua yang ada di pikiranmu..."_
3. User mengetik bebas, contoh:
   ```
   besok harus beli bahan makanan sama belajar nuxt kayaknya,
   juga ada deadline tugas desain hari jumat, dan jangan lupa
   balas email pak budi yang udah nunggu dari kemarin
   ```
4. Klik tombol **"Pisahkan"**
5. Request ke `/api/parse-tasks` (server route) — kirim teks mentah
6. Server memanggil Gemini API dengan prompt yang sudah diformat
7. Response: array task terstruktur dikembalikan ke client
8. UI menampilkan preview task hasil parsing — user bisa **edit judul**, **ubah priority**, **set due date**, atau **hapus** sebelum konfirmasi
9. Klik **"Tambahkan ke Board"** → task masuk ke store, panel tertutup

**Server route (`/api/parse-tasks.post.ts`):**

```typescript
// Prompt ke Gemini:
// "Kamu adalah asisten produktivitas.
//  Dari teks berikut, ekstrak daftar task yang perlu dilakukan.
//  Kembalikan HANYA JSON array dengan format:
//  [{ title: string, priority: 'low'|'medium'|'high', dueDate: string|null }]
//  Tentukan priority dari konteks (deadline = high, 'besok' = medium, dll).
//  dueDate dalam format YYYY-MM-DD jika ada petunjuk waktu, null jika tidak ada.
//  Teks: {userInput}"

// Response Gemini di-parse, validasi strukturnya, lalu return ke client.
// API key dibaca dari process.env.GEMINI_API_KEY — tidak pernah expose ke client.
```

**Error handling:**

- Gemini gagal → tampilkan pesan error, textarea tetap terisi (tidak hilang)
- Response bukan valid JSON → fallback: buat satu task dengan title = seluruh teks

---

## Clean Code & Best Practice Nuxt 4

### Nuxt 4 Specifics

- Gunakan `app/` directory (Nuxt 4 default, bukan `src/`)
- `useAsyncData` atau `useFetch` untuk semua data fetching — tidak ada `axios`
- Auto-imports aktif — tidak perlu manual import `ref`, `computed`, `useFetch`
- Server routes di `server/api/` — logic AI **wajib** di sini, bukan di composable client-side

### State Management

- Satu store: `stores/task.ts` via Pinia
- Store hanya berisi: state, getters (computed), actions
- Tidak ada business logic di komponen — semua lewat composable atau store action
- `pinia-plugin-persistedstate` untuk sync ke localStorage otomatis

### Komponen

- Setiap komponen satu tanggung jawab
- Props selalu di-type dengan TypeScript interface
- Emit events didefinisikan eksplisit dengan `defineEmits<{ ... }>()`
- Tidak ada logic kompleks di template — pindahkan ke `computed()` atau method

### TypeScript

- Strict mode aktif di `tsconfig.json`
- Tidak ada `any` kecuali terpaksa dan diberi komentar alasannya
- Semua type di `types/task.ts`, diimport sesuai kebutuhan

### Lain-lain

- Tidak ada komentar inline — nama variabel dan fungsi harus self-explanatory
- Fungsi maksimal melakukan satu hal
- Magic number/string → extract ke konstanta di `utils/` atau top of file
- `.env` untuk API key, `.env.example` disertakan, `.env` di `.gitignore`

---

## Design Brief (untuk generate UI)

**Referensi visual**: Editorial motion poster — paper-toned, monospace chrome, serif accent.
Lihat `example.html` sebagai panduan estetik utama. Bukan dark dashboard, bukan SaaS modern.

**Aesthetic**: Editorial / archival — seperti majalah cetak yang didigitalisasi. Restrained, typographic-first, tidak ada elemen dekoratif berlebihan. Terasa personal dan intentional.

**Palette (CSS variables):**

```css
--paper: #f3eee5; /* background utama */
--ink: #1a1816; /* teks, border */
--muted: #7a766c; /* label, timestamp, dimmed */
--accent: #c0563b; /* action utama, overdue, high priority */
--surface: #ede8de; /* card/surface sedikit lebih gelap dari paper */
--serif: "Cormorant Garamond", "Iowan Old Style", Georgia, serif;
--mono: ui-monospace, "JetBrains Mono", monospace;
```

**Texture**: Dotted grid di background via CSS:

```css
background:
  radial-gradient(circle, rgba(26, 24, 22, 0.1) 1px, transparent 1.4px) 0 0 /
    28px 28px,
  var(--paper);
```

**Typography**:

- Serif italic untuk headline, judul task, nama kolom kanban
- Monospace untuk semua label, badge, timestamp, chrome detail, status
- Uppercase + `letter-spacing: 0.18em` untuk semua label kecil

**Chrome detail** (ikuti pattern example.html):

- Corner labels: top-left app name + tanggal, top-right context info
- Thin baseline rule (`1px solid rgba(26,24,22,0.25)`) sebagai separator
- Stat card menggunakan angka besar serif italic + label mono di bawahnya

**Komponen feel**:

- Border tipis `1px solid rgba(26,24,22,0.15)` — tidak ada shadow
- Rounded corners minimal atau tidak sama sekali
- Priority badge: monospace uppercase, background subtle, accent color untuk high
- Hover state: background shift ringan, bukan shadow atau lift effect
- Tidak ada icon berlebihan — teks dan tipografi yang bicara

---

## Out of Scope (Prototype)

- Authentication — tidak ada
- Backend/database — semua localStorage
- Notifikasi/reminder — tidak ada
- Recurring task — tidak ada
- Multi-user — tidak ada
- Mobile responsiveness — desktop first, mobile belakangan

---

## Environment Variables

```env
# .env
GEMINI_API_KEY=your_key_here

# .env.example
GEMINI_API_KEY=
```
