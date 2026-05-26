# SKILL: Utilitarian Technical UI

## 1. Core Philosophy

Arsitektur yang tidak bersembunyi. Struktur diekspos secara brutal. Batas ditampilkan apa adanya.
Tidak ada shadow. Tidak ada gradasi yang menipu. Tidak ada radius yang memperhalus realita.
Gunakan panduan ini untuk seluruh konstruksi halaman dan komponen, mewujudkan estetik **dark-technical-editorial**.

## 2. Design Principles (Absolute Directives)

- **Hard Border:** Semua border wajib `1px solid` dari _zinc palette_. Tidak ada `rounded-*` kecuali `rounded-none`. Batas adalah batas — tegas dan jujur.
- **Diagonal Hatching:** Gunakan tekstur _hatching_ (garis arsiran SVG) sebagai pengisi ruang, bukan warna solid berat atau gradasi.
- **Strict Typographic Segregation:** Teks narasi dan heading utama menggunakan Serif. Data, UI chrome, angka, dan metadata menggunakan Monospace. Dua dunia ini tidak boleh dicampur.
- **Monochrome Zinc Absolute:** Tidak ada warna aksen semantik (merah/hijau/biru). Satu-satunya _emphasis_ adalah intensitas warna Zinc (contoh: `zinc-100` untuk terang, `text-zinc-500` untuk redup).
- **Chrome as Navigation:** Gunakan nomor kromatik (`01 //`, `02 //`) sebagai label navigasi visual dan hierarki ruang, bukan dekorasi.

## 3. Color System (Tailwind v4 Mapping)

Hanya gunakan skema warna Zinc.

| Role                   | Tailwind Class    | Penggunaan                                        |
| :--------------------- | :---------------- | :------------------------------------------------ |
| **Background Base**    | `bg-zinc-950`     | Warna dasar seluruh halaman (body/main).          |
| **Background Surface** | `bg-zinc-900`     | Background untuk card, panel, container.          |
| **Background Raised**  | `bg-zinc-800`     | State hover, background input aktif.              |
| **Border Main**        | `border-zinc-700` | Border standar untuk semua elemen.                |
| **Border Dim**         | `border-zinc-800` | Border untuk elemen sekunder/pemisah ringan.      |
| **Text Primary**       | `text-zinc-100`   | Teks utama, judul, emphasis, nilai stat.          |
| **Text Muted**         | `text-zinc-500`   | Deskripsi, body text, label sekunder.             |
| **Text Dim**           | `text-zinc-700`   | Placeholder teks, elemen disabled, chrome footer. |

## 4. Typography Rules

| Konteks                  | Font Family | Weight | Style                    | Transform |
| :----------------------- | :---------- | :----- | :----------------------- | :-------- |
| **Heading Halaman**      | Serif       | 400    | Normal / Italic (1 kata) | None      |
| **Sub-heading**          | Serif       | 400    | Normal                   | None      |
| **Label, Badge, Status** | Mono        | 700    | Normal                   | UPPERCASE |
| **Body, Deskripsi**      | Mono        | 400    | Normal                   | None      |
| **Angka Besar (Stat)**   | Serif       | 400    | Italic                   | None      |
| **Chrome / Metadata**    | Mono        | 400    | Normal                   | UPPERCASE |
| **Nomor Item (01 //)**   | Mono        | 400    | Normal                   | None      |
| **Placeholder Input**    | Mono        | 400    | Normal                   | UPPERCASE |

## 5. Component Anatomy

### 5.1. Hatching Divider

Section separator utama. Wajib _full-width_, tinggi tetap (`h-12` atau `h-16`). Label memotong garis di tengah.

```html
<div
  class="relative w-full h-16 border-y border-zinc-700 overflow-hidden flex items-center justify-center"
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
    class="relative z-10 bg-zinc-950 px-6 py-2 text-xs font-bold tracking-widest text-zinc-400 uppercase border-x border-zinc-700 font-mono"
  >
    LABEL SECTION
  </span>
</div>
```

### 5.2. Hard Border Card

```html
<div
  class="border border-zinc-700 bg-zinc-900 p-6 hover:bg-zinc-800 transition-colors"
>
  <div class="flex justify-between items-start mb-4">
    <span class="font-mono text-xs text-zinc-500 tracking-widest">01 //</span>
    <span class="text-zinc-700 text-xs font-mono">¬</span>
  </div>
  <h3 class="font-serif text-xl text-zinc-100 mb-3">Judul Task</h3>
  <p class="font-mono text-sm text-zinc-500 leading-relaxed">
    Deskripsi atau next action di sini.
  </p>
</div>
```

### 5.3. Badges / Status Labels

```html
<span
  class="font-mono text-xs tracking-widest uppercase border border-zinc-600 px-2 py-0.5 text-zinc-300"
  >HIGH</span
>
<span
  class="font-mono text-xs tracking-widest uppercase border border-zinc-600 px-2 py-0.5 text-zinc-400 italic"
  >STALE · 7 DAYS</span
>
```

### 5.4. Inputs & Textareas

```html
<input
  type="text"
  class="w-full bg-zinc-950 border-b border-zinc-700 px-0 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-400 transition-colors"
  placeholder="TULIS DI SINI..."
/>

<textarea
  class="w-full bg-zinc-900 border border-zinc-700 p-4 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none transition-colors leading-relaxed"
  placeholder="Brain dump..."
  rows="8"
></textarea>
```

### 5.5. Buttons

```html
<button
  class="border border-zinc-100 bg-zinc-100 text-zinc-950 px-6 py-3 font-mono text-xs tracking-widest uppercase hover:bg-zinc-200 transition-colors"
>
  MULAI SEKARANG →
</button>
<button
  class="border border-zinc-700 text-zinc-400 px-6 py-3 font-mono text-xs tracking-widest uppercase hover:border-zinc-500 hover:text-zinc-200 transition-colors"
>
  DOKUMENTASI
</button>
```

### 5.6. Stat Card & Pomodoro Timer

```html
<div class="border border-zinc-700 bg-zinc-900 p-6 flex flex-col gap-3">
  <span class="font-mono text-xs text-zinc-600 tracking-widest uppercase"
    >ACTIVE TASKS</span
  >
  <span class="font-serif text-5xl text-zinc-100 italic">12</span>
  <span class="font-mono text-xs text-zinc-600 tracking-widest"
    >TODO + IN-PROGRESS</span
  >
</div>

<div class="flex flex-col items-center gap-8">
  <div class="relative">
    <svg width="200" height="200" class="-rotate-90">
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#27272a"
        stroke-width="1"
      />
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#71717a"
        stroke-width="1"
        stroke-dasharray="565"
        stroke-dashoffset="141"
        stroke-linecap="square"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="font-serif text-5xl italic text-zinc-100">24:13</span>
    </div>
  </div>
  <span class="font-mono text-xs text-zinc-500 tracking-widest uppercase"
    >WORK SESSION · 2 OF 4</span
  >
</div>
```

## 6. Layout Pattern & Page Chrome

Struktur kerangka halaman wajib konsisten dari header hingga footer.

```html
<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
  <header
    class="border-b border-zinc-800 px-6 py-4 flex justify-between items-center"
  >
    <div class="flex items-center gap-4">
      <span class="font-mono text-xs text-zinc-600 tracking-widest uppercase"
        >—</span
      >
      <span class="font-mono text-xs text-zinc-500 tracking-widest uppercase"
        >UTILITARIAN TECHNICAL UI</span
      >
    </div>
    <nav class="flex gap-6">
      <a
        class="font-mono text-xs text-zinc-500 tracking-widest uppercase hover:text-zinc-200 transition-colors"
        >DASHBOARD</a
      >
    </nav>
  </header>

  <section class="px-6 py-16 border-b border-zinc-800">
    <p class="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-6">
      — LABEL HALAMAN
    </p>
    <h1 class="font-serif text-5xl text-zinc-100 leading-tight">
      Heading Utama<br /><span class="text-zinc-500"
        >yang Tidak Bersembunyi.</span
      >
    </h1>
  </section>

  <div
    class="relative w-full h-16 border-y border-zinc-800 overflow-hidden flex items-center justify-center"
  ></div>

  <main class="flex-1 px-6 py-12"></main>

  <footer
    class="border-t border-zinc-800 px-6 py-3 flex justify-between items-center mt-auto"
  >
    <span class="font-mono text-xs text-zinc-700 tracking-widest"
      >BUILD — YYYY.MM // ZINC PALETTE // NO GRADIENTS</span
    >
    <span class="font-mono text-xs text-zinc-700 tracking-widest"
      >◉ STABLE</span
    >
  </footer>
</div>
```

## 7. STRICT PROHIBITIONS (NEVER DO THIS)

Pelanggaran terhadap aturan ini akan merusak integritas desain:

- NO BORDER RADIUS: Dilarang keras menggunakan rounded-sm, rounded-md, rounded-lg, rounded-full.
- NO SHADOWS: Dilarang menggunakan shadow-\*. Hierarki visual ditentukan oleh warna background, bukan bayangan.
- NO GRADIENTS: Dilarang menggunakan bg-gradient-_, from-_, via-_, to-_.
- NO COLORS OUTSIDE ZINC: Dilarang menggunakan semantik warna (red, green, blue). Status error menggunakan italic dan warna zinc-400, bukan merah.
- NO BLUR/GLASSMORPHISM: Dilarang menggunakan backdrop-blur-\*.
- STRICT TYPOGRAPHY USAGE: Dilarang menggunakan font Sans-Serif untuk label data (harus Mono). Dilarang menggunakan font Mono untuk heading naratif (harus Serif).
- NO UNNECESSARY ANIMATION: Animasi hanya diizinkan untuk transition-colors dan transition-opacity. Tidak ada scale, translate, atau bounce.
