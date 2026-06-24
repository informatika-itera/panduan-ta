# Pedoman TA IF — Website

Website resmi Pedoman Tugas Akhir Program Studi Teknik Informatika, Institut Teknologi Sumatera.

**Live**: [informatika-itera.github.io/peduan-ta](https://informatika-itera.github.io/peduan-ta)

## Fitur

- **Pedoman TA Lengkap** — 8 Bab + 8 Lampiran, rendered dari markdown dengan sidebar navigasi
- **Sosialisasi** — Slide presentasi interaktif (20 slide, navigasi keyboard/touch)
- **Changelog** — Riwayat perubahan pedoman
- **Dark/Light Mode** — Toggle tema, tersimpan di localStorage
- **Responsive** — Mobile-friendly, sidebar collapse di layar kecil

## Struktur Halaman

| Halaman | Deskripsi |
|:---|:---|
| `index.html` | Homepage — akses ke Pedoman, Sosialisasi, dan Changelog |
| `pedoman.html` | Pedoman TA lengkap dengan sidebar ToC |
| `sosialisasi.html` | Slide presentasi interaktif |
| `changelog.html` | Riwayat perubahan (max 8 entry terakhir) |

## Pengembangan

### Prasyarat

- Node.js (untuk build script)

### Build

```bash
node build.js
```

### Edit Konten

| Konten | File | Setelah edit |
|:---|:---|:---|
| Pedoman TA | `Pedoman_TA_IF.md` | `node build.js` |
| Changelog | `changelog.md` | `node build.js` |
| Slide Sosialisasi | `build.js` (bagian `SOSIALISASI PAGE`) | `node build.js` |
| Styles | `build.js` (bagian `STYLES`) | `node build.js` |

### Deploy

```bash
git add -A
git commit -m "update: ..."
git push origin main

# Deploy ke GitHub Pages
git checkout gh-pages
git merge main
git push origin gh-pages
```

## Sumber

- **Source markdown**: `raw/Pedoman_TA_IF_Lengkap.docx.md`
- **PDF Sosialisasi**: `raw/Sosialisasi_Pedoman_TA_IF (1).pptx.pdf`

## Lisensi

Dikelola oleh Program Studi Teknik Informatika, Fakultas Teknologi Industri, Institut Teknologi Sumatera.
