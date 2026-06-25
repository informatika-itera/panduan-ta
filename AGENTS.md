# AGENTS.md

Panduan untuk AI agents yang bekerja di repository ini.

## Repository Overview

Website Pedoman Tugas Akhir Program Studi Teknik Informatika ITERA. Mengonversi dokumen pedoman (Word/PDF) menjadi website interaktif dengan dark/light mode.

## Tech Stack

- **Build**: Node.js script (`build.js`) — mengonversi markdown ke HTML
- **Runtime**: Static HTML + vanilla JS (zero dependencies di production)
- **Styling**: CSS custom properties untuk dark/light mode
- **Markdown**: Client-side rendering via `marked.js` (CDN)
- **Deployment**: GitHub Pages (branch `gh-pages`)

## File Structure

```
├── src/                            # Source files (editing targets)
│   ├── styles.css                  # CSS source (dark/light mode, layouts)
│   ├── script.js                   # JS source (theme toggle, sidebar, reveal.js init)
│   ├── slides.html                 # Slide sosialisasi HTML sections (reveal.js format)
│   ├── reveal-theme.css            # reveal.js theme overrides (dark/light)
│   └── templates/
│       ├── base.html               # HTML skeleton (head, topbar, script tag)
│       ├── index.html              # Homepage body content
│       ├── pedoman.html            # Pedoman page body (with TOC + markdown)
│       └── changelog.html          # Changelog page body
├── vendor/                         # Vendored libraries
│   └── reveal.js/
│       ├── reveal.css              # reveal.js base CSS (read-only)
│       └── reveal.js               # reveal.js runtime (read-only)
├── content/                        # Source documents (gitignored)
│   ├── Pedoman_TA_IF.md            # Markdown source pedoman
│   ├── changelog.md                # Markdown source changelog
│   ├── draft-deklarasi-ai.*        # Draft documents
│   └── raw/                        # Original documents (docx, pdf)
├── formulir/                       # Downloadable forms (tracked)
│   ├── *.docx                      # Admin forms (Kartu Kendali, Surat, dll)
│   └── draft-deklarasi-ai.*        # Draft deklarasi AI
├── build.js                        # Build script (~200 lines)
├── index.html                      # Generated: homepage
├── pedoman.html                    # Generated: pedoman TA
├── sosialisasi.html                # Generated: slide sosialisasi
├── changelog.html                  # Generated: changelog
├── styles.css                      # Generated: shared styles
├── script.js                       # Generated: shared scripts
├── reveal-theme.css                # Generated: reveal.js theme
├── AGENTS.md                       # This file
├── README.md                       # User-facing docs
└── package.json                    # Node.js config
```

## Build Process

```bash
node build.js
```

Script ini:

1. Reads `src/templates/base.html` — HTML skeleton with `{{PLACEHOLDER}}` markers
2. Reads page templates from `src/templates/` (index, pedoman, changelog)
3. Reads `src/styles.css` → copies to `styles.css`
4. Reads `src/script.js` → copies to `script.js`
5. Reads `src/slides.html` → inserts into sosialisasi page
6. Reads `vendor/reveal.js/reveal.css` and `vendor/reveal.js/reveal.js` → copies to `vendor/reveal.js/`
7. Reads `src/reveal-theme.css` → copies to `reveal-theme.css`
8. Reads `content/Pedoman_TA_IF.md` → extracts TOC → generates `pedoman.html`
9. Reads `content/changelog.md` → generates `changelog.html` (max 8 entries)
10. Assembles all pages using base template → writes to root

**Tidak ada runtime dependencies** — marked.js di-load dari CDN di browser. Slide menggunakan reveal.js (vendored).

## Deployment

```bash
# Push ke branch gh-pages
git checkout gh-pages
git add -A
git commit -m "deploy: update site"
git push origin gh-pages
```

GitHub Pages serve dari branch `gh-pages` di repo `informatika-itera/panduan-ta`.

## Cara Edit Konten

### Edit Pedoman TA

1. Edit `content/Pedoman_TA_IF.md`
2. Jalankan `node build.js`
3. Test di browser, lalu commit

### Edit Slide Sosialisasi

1. Edit `src/slides.html` — tambah/modifikasi `<section>` di dalam `<div class="slides">`
2. Jalankan `node build.js`
3. Test di browser, lalu commit

### Edit CSS Styles

1. Edit `src/styles.css`
2. Jalankan `node build.js`

### Edit JavaScript

1. Edit `src/script.js`
2. Jalankan `node build.js`

### Tambah Changelog

1. Tambah entry di `content/changelog.md` (format: `## [versi] - tanggal`)
2. Jalankan `node build.js`
3. Commit

### Mengubah Template HTML

1. Edit file di `src/templates/` (base.html, index.html, pedoman.html, changelog.html)
2. Jalankan `node build.js`
3. Test di browser

## Changelog Policy

AI agent WAJIB mengupdate `content/changelog.md` **hanya untuk perubahan aturan/panduan pedoman TA** (konten substantif yang mempengaruhi prosedur, syarat, atau ketentuan tugas akhir).

### Yang WAJIB dicatat di changelog

- Perubahan syarat/ketentuan tugas akhir (babak, durasi, batas waktu, dll)
- Perubahan prosedur sempro, sidang, atau bimbingan
- Perubahan format/template laporan
- Penambahan/penghapusan aturan baru
- Perubahan standar penilaian

### Yang TIDAK perlu dicatat di changelog

- Perubahan tampilan UI (warna, font, layout, spacing)
- Perubahan teknis build script (refactor, optimasi)
- Perubahan slide sosialisasi (tanpa ubah konten pedoman)
- Fix formatting markdown
- Update dependencies atau konfigurasi teknis
- Perubahan deployment/CI

### Format penulisan changelog

```
## [versi] - YYYY-MM-DD

### Changed
- Deskripsi perubahan aturan/panduan yang terdampak
```

Gunakan semantic versioning:

- **Major (X.0.0)**: Perubahan besar pada aturan pedoman
- **Minor (0.X.0)**: Penambahan aturan baru
- **Patch (0.0.X)**: Klarifikasi/redaksi aturan yang sudah ada

---

## Design Decisions

- **Client-side markdown rendering**: Menghindari build step yang kompleks. marked.js cukup ringan dan reliable.
- **reveal.js for slides**: Slide sosialisasi menggunakan reveal.js (vendored) dengan mode embedded. Topbar tetap visible, slide counter, keyboard/touch navigation, dan progress bar dari reveal.js. Config: `center: true` (vertical centering via JS transforms), `embedded: true` (fills container, not viewport), `width/height: "100%"` (no scaling).
- **Hardcoded slide content**: Slide sosialisasi disimpan di `src/slides.html` sebagai HTML `<section>` elements. Lebih fleksibel daripada generate dari PDF.
- **CSS/JS as separate files**: CSS dan JS di-edit langsung di file terpisah (`src/styles.css`, `src/script.js`, `src/reveal-theme.css`) dengan syntax highlighting dan linting.
- **Template-based assembly**: Base template di `src/templates/base.html` dengan `{{PLACEHOLDER}}` markers. Build script mengganti placeholder dan menulis output.
- **CSS custom properties**: Memudahkan dark/light mode tanpa library CSS framework.
- **Source separation**: Source file di `src/` dan `content/` (gitignored). Downloadable forms di `formulir/` (tracked). Generated files di root untuk GitHub Pages.
- **Vendored reveal.js**: reveal.js di-vendor ke `vendor/reveal.js/` (bukan CDN) agar offline-capable dan tidak ada runtime dependencies. Vendor files (`vendor/reveal.js/reveal.css` dan `vendor/reveal.js/reveal.js`) jangan di-edit — hanya `src/reveal-theme.css` yang diubah untuk styling.
- **Vertical centering via JS, not CSS**: Reveal.js `center: true` menggunakan JS transforms (`translate3d`) untuk center slide di viewport. CSS flexbox centering pada section konflik dengan `position: absolute` reveal.js. Jangan gunakan `display: flex; align-items: center` pada `.reveal .slides > section`.

## Common Tasks

### Menambah slide sosialisasi

1. Buka `src/slides.html`
2. Tambah `<section>` baru di dalam `<div class="slides">`
3. Jalankan `node build.js`
4. Slide counter ("N / 20") di-update otomatis oleh reveal.js

### Menonaktifkan centering per-slide

Reveal.js `center: true` menerapkan vertical centering via JS transform ke semua slide. Jika slide tertentu perlu content di-top (misalnya slide dengan grid panjang), tambahkan `class="r-fit-text"` atau gunakan `style="justify-content: flex-start"` pada `<section>` tersebut.

**Penting**: Centering di reveal.js dilakukan via JavaScript (`center: true` config), BUKAN via CSS flexbox. Jangan gunakan `display: flex; align-items: center` pada `.reveal .slides > section` — ini akan konflik dengan layout reveal.js yang menggunakan `position: absolute` dan JS transforms.

### Mengubah warna theme

1. Edit CSS custom properties di `src/styles.css`
2. Jalankan `node build.js`

### Menambah halaman baru

1. Buat template body di `src/templates/nama-halaman.html`
2. Tambah `assemblePage()` call di `build.js`
3. Tambah `fs.writeFileSync()` di bagian write files
4. Tambah link di topbar di `src/templates/base.html`
5. Jalankan `node build.js`
