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
│   ├── script.js                   # JS source (theme toggle, sidebar, slides)
│   ├── slides.html                 # Slide sosialisasi HTML sections
│   └── templates/
│       ├── base.html               # HTML skeleton (head, topbar, script tag)
│       ├── index.html              # Homepage body content
│       ├── pedoman.html            # Pedoman page body (with TOC + markdown)
│       └── changelog.html          # Changelog page body
├── content/                        # Source documents
│   ├── Pedoman_TA_IF.md            # Markdown source pedoman
│   ├── changelog.md                # Markdown source changelog
│   ├── draft-deklarasi-ai.*        # Draft documents
│   ├── raw/                        # Original documents (docx, pdf)
│   └── Berkas Administrasi TA/     # Administrative forms
├── build.js                        # Build script (~200 lines)
├── index.html                      # Generated: homepage
├── pedoman.html                    # Generated: pedoman TA
├── sosialisasi.html                # Generated: slide sosialisasi
├── changelog.html                  # Generated: changelog
├── styles.css                      # Generated: shared styles
├── script.js                       # Generated: shared scripts
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
6. Reads `content/Pedoman_TA_IF.md` → extracts TOC → generates `pedoman.html`
7. Reads `content/changelog.md` → generates `changelog.html` (max 8 entries)
8. Assembles all pages using base template → writes to root

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

1. Edit `content/Pedoman_TA_IF.md`
2. Jalankan `node build.js`
3. Test di browser, lalu commit

### Edit Slide Sosialisasi

1. Edit `src/slides.html` — tambah/modifikasi `<section class="slide">`
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
- **Hardcoded slide content**: Slide sosialisasi disimpan di `src/slides.html` sebagai HTML sections. Lebih fleksibel daripada generate dari PDF.
- **CSS/JS as separate files**: CSS dan JS di-edit langsung di file terpisah (`src/styles.css`, `src/script.js`) dengan syntax highlighting dan linting.
- **Template-based assembly**: Base template di `src/templates/base.html` dengan `{{PLACEHOLDER}}` markers. Build script mengganti placeholder dan menulis output.
- **CSS custom properties**: Memudahkan dark/light mode tanpa library CSS framework.
- **Source separation**: Semua source file di `src/` dan `content/`, generated files di root untuk GitHub Pages.

## Common Tasks

### Menambah slide sosialisasi

1. Buka `src/slides.html`
2. Tambah `<section class="slide">` baru
3. Update counter di `src/templates/sosialisasi.html` (jika ada) — atau biarkan JS update otomatis
4. Jalankan `node build.js`

### Mengubah warna theme

1. Edit CSS custom properties di `src/styles.css`
2. Jalankan `node build.js`

### Menambah halaman baru

1. Buat template body di `src/templates/nama-halaman.html`
2. Tambah `assemblePage()` call di `build.js`
3. Tambah `fs.writeFileSync()` di bagian write files
4. Tambah link di topbar di `src/templates/base.html`
5. Jalankan `node build.js`
