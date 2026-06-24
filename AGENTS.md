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
├── build.js                    # Build script — generate semua HTML
├── Pedoman_TA_IF.md            # Source: pedoman TA (markdown)
├── changelog.md                # Source: changelog (markdown)
├── raw/                        # Source documents
│   ├── Pedoman_TA_IF_Lengkap.docx.md
│   └── Sosialisasi_Pedoman_TA_IF (1).pptx.pdf
├── index.html                  # Generated: homepage
├── pedoman.html                # Generated: pedoman TA
├── sosialisasi.html            # Generated: slide sosialisasi
├── changelog.html              # Generated: changelog
├── styles.css                  # Generated: shared styles
├── script.js                   # Generated: shared scripts
├── AGENTS.md                   # This file
├── README.md                   # User-facing docs
└── package.json                # Node.js config
```

## Build Process

```bash
node build.js
```

Script ini:

1. Membaca `Pedoman_TA_IF.md` → extract TOC → generate `pedoman.html`
2. Membaca `changelog.md` → generate `changelog.html` (max 8 entries)
3. Generate `sosialisasi.html` (konten slide hardcoded dalam JS)
4. Generate `styles.css` dan `script.js`
5. Generate `index.html` (homepage)

**Tidak ada runtime dependencies** — marked.js di-load dari CDN di browser.

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

1. Edit `Pedoman_TA_IF.md`
2. Jalankan `node build.js`
3. Test di browser, lalu commit

### Edit Slide Sosialisasi

1. Edit bagian `sosialisasi.html` di dalam `build.js` (section `// === SOSIALISASI PAGE ===`)
2. Jalankan `node build.js`
3. Test di browser, lalu commit

### Tambah Changelog

1. Tambah entry di `changelog.md` (format: `## [versi] - tanggal`)
2. Jalankan `node build.js`
3. Commit

## Design Decisions

- **Client-side markdown rendering**: Menghindari build step yang kompleks. marked.js cukup ringan dan reliable.
- **Hardcoded slide content**: Slide sosialisasi ditulis langsung sebagai HTML section di build.js. Lebih fleksibel daripada generate dari PDF.
- **CSS custom properties**: Memudahkan dark/light mode tanpa library CSS framework.
- **Single build.js**: Semua kode generate dalam satu file. Mudah dipahami dan di-maintain.

## Common Tasks

### Menambah slide sosialisasi

1. Buka `build.js`, cari `// === SOSIALISASI PAGE ===`
2. Tambah `<section class="slide">` baru
3. Update counter di `<span class="slide-counter">`
4. Jalankan `node build.js`

### Mengubah warna theme

1. Edit CSS custom properties di `styles.css` (atau di `build.js` bagian `// === STYLES ===`)
2. Jalankan `node build.js`

### Menambah halaman baru

1. Buat template HTML di `build.js` menggunakan fungsi `template()`
2. Tambah `fs.writeFileSync()` di bagian write files
3. Tambah link di topbar (fungsi `template()`)
