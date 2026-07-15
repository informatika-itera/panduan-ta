# Revisi Pedoman TA + Slide Sosialisasi

Skill untuk melakukan revisi dokumen pedoman TA secara sistematis — dari identifikasi masalah, proposal rekomendasi, implementasi, hingga verifikasi konsistensi di seluruh artefak (pedoman, slide, lampiran, tabel).

## Artefak yang Terdampak

Setiap perubahan pedoman WAJIB diperiksa dampaknya ke seluruh artefak berikut:

| Artefak | File | Cara Cek |
|---|---|---|
| **Pedoman utama** | `content/Pedoman_TA_IF.md` | Grep keyword di seluruh file |
| **Slide sosialisasi** | `src/slides.html` | Grep keyword di `<section>` slides |
| **Tabel ringkasan** | Tabel 3.1, 3.2, 5.3, 5.4, 5.5, dll | Cek baris relevan di tabel |
| **Lampiran** | Lampiran 1–9 di pedoman | Cek field yang terdampak |
| **Bab 6 (Peran)** | 6.1–6.6 Mahasiswa/Pembimbing/Penguji/Kaprodi/Koordinator/Wali | Cek hak & kewajiban |

## Alur Kerja

### 1. Identifikasi Masalah

Baca dokumen pedoman secara sistematis. Klasifikasikan temuan:

| Kategori | Kode | Definisi |
|---|---|---|
| **Ambiguity** | A | Aturan multitafsir, tidak ada definisi jelas |
| **Loophole** | B | Celah yang bisa disalahgunakan tanpa melanggar aturan |
| **Overly Strict** | C | Aturan terlalu ketat — menghambat tanpa manfaat jelas |
| **Overly Lax** | D | Aturan terlalu longgar — berisiko turunkan kualitas |

### 2. Analisis & Rekomendasi

Untuk setiap temuan:
- Lokasi persis (bab, sub-bab, tabel, lampiran, slide)
- Severity: **Critical / High / Medium / Low**
- Rekomendasi spesifik dengan mekanisme implementasi
- Dampak ke artefak lain

### 3. Proposal ke User

Format proposal (tabel before/after):

```
**KODE — Judul Singkat**

| Lokasi | Sebelum | Sesudah |
|---|---|---|
| 3.5.2 | teks lama | teks baru |
| Slide | slide lama | slide baru |
```

Sertakan opsi bila ada alternatif, tandai rekomendasi.

### 4. Implementasi

Setelah user setuju:
1. Edit `content/Pedoman_TA_IF.md`
2. Edit `src/slides.html` (bila perlu)
3. Edit file lain yang terdampak

### 5. Build & Verifikasi

```bash
node build.js
```

Kemudian verifikasi setiap perubahan:

```bash
python3 -c "
import json, re
with open('pedoman.html') as f:
    text = f.read()
m = re.search(r'const rawMd = (.*?);\s*const mdEl', text, re.DOTALL)
raw = json.loads(m.group(1)) if m else ''
# verifikasi setiap klaim
for pat, label in checks:
    found = bool(re.search(pat, raw))
    print(f'  {\"✓\" if found else \"✗\"} {label}')
"
```

Cek juga `sosialisasi.html` untuk perubahan slide.

### 6. Konfirmasi

Laporkan ringkasan perubahan dalam tabel **Sebelum → Sesudah**.

## Aturan Penting

- **NEVER hanya ubah pedoman** — selalu cek slide, tabel ringkasan, lampiran, dan Bab 6.
- **Slide terlalu detail?** Skip. Slide hanya untuk poin kunci (highlight cards), bukan teks regulasi penuh.
- **Konsistensi nomor:** pastikan penomoran bab/sub-bab tidak rusak setelah insert section baru.
- **Tabel acuan:** perubahan di Bab 3 wajib sinkron dengan Tabel 3.1/3.2. Perubahan di Bab 5 wajib sinkron dengan Tabel 5.3–5.5.
- **Verifikasi selalu dengan grep keyword** — jangan mengandalkan ingatan posisi.

## Pola Perubahan Umum

### Tambah sub-bab baru
```
### X.Y.Z Judul Baru

Konten...
```
- Sesuaikan penomoran sub-bab setelahnya? Hanya jika bentrok. MD heading tidak perlu renumber.

### Ubah syarat di tabel
- Cek apakah syarat yang sama muncul di deskripsi bentuk (Bab 3), slide, dan lampiran.

### Ubah mekanisme/prosedur
- Cek apakah ada timeline/hak/kewajiban di Bab 6 yang terdampak.

### Tambah sanksi/konsekuensi
- Pastikan sanksi konsisten dengan sanksi lain yang sudah ada.
