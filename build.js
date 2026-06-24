const fs = require("fs");
const path = require("path");

const md = fs.readFileSync(path.join(__dirname, "Pedoman_TA_IF.md"), "utf8");
const changelogMd = fs.readFileSync(
	path.join(__dirname, "changelog.md"),
	"utf8",
);

// --- Extract TOC from markdown ---
function extractToc(md) {
	const lines = md.split("\n");
	const toc = [];
	for (const line of lines) {
		const m = line.match(/^(#{1,4})\s+(.+)/);
		if (m) {
			const level = m[1].length;
			const text = m[2].trim();
			const id = text
				.toLowerCase()
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, "-");
			toc.push({ level, text, id });
		}
	}
	return toc;
}

const toc = extractToc(md);
const tocHtml = toc
	.map((item) => {
		return `<li class="toc-level-${item.level}"><a href="#${item.id}" data-level="${item.level}">${item.text}</a></li>`;
	})
	.join("\n");

// --- HTML template ---
function template(title, bodyContent, extraHead = "") {
	return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Pedoman TA IF ITERA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  ${extraHead}
</head>
<body>
  <nav class="topbar">
    <a href="index.html" class="topbar-brand">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      <span>Pedoman TA IF</span>
    </a>
    <div class="topbar-actions">
      <a href="index.html" class="topbar-link ${title === "Beranda" ? "active" : ""}">Beranda</a>
      <a href="pedoman.html" class="topbar-link ${title === "Pedoman" ? "active" : ""}">Pedoman</a>
      <a href="sosialisasi.html" class="topbar-link ${title === "Sosialisasi" ? "active" : ""}">Sosialisasi</a>
      <a href="changelog.html" class="topbar-link ${title === "Changelog" ? "active" : ""}">Changelog</a>
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </nav>
  ${bodyContent}
  <script src="script.js"></script>
</body>
</html>`;
}

// === INDEX PAGE ===
const indexHtml = template(
	"Beranda",
	`
<main class="home">
  <div class="hero">
    <div class="hero-badge">Program Studi Teknik Informatika · FTI · ITERA</div>
    <h1>Pedoman Tugas Akhir<br><span class="gradient-text">Tahun Akademik 2025/2026</span></h1>
    <p class="hero-sub">Panduan lengkap penyelenggaraan Tugas Akhir — enam bentuk, satu standar mutu.</p>
  </div>
  <div class="draft-banner">
    <div class="draft-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
    </div>
    <div class="draft-text">
      <strong>Status: Masih Drafting</strong>
      <span>Pedoman ini masih dalam tahap penyusunan. Berikan masukan dan saran perbaikan kepada Tim TA melalui formulir berikut.</span>
    </div>
    <a href="https://tally.so/r/b5g176" target="_blank" rel="noopener" class="draft-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Kirim Masukan
    </a>
  </div>
  <div class="cards">
    <a href="pedoman.html" class="card card-pedoman">
      <div class="card-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>
      <h2>Pedoman TA Lengkap</h2>
      <p>8 Bab · 8 Lampiran — Persyaratan, alur, bentuk TA, penilaian, format penulisan, dan semua ketentuan resmi.</p>
      <span class="card-cta">Buka Pedoman →</span>
    </a>
    <a href="sosialisasi.html" class="card card-sosialisasi">
      <div class="card-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </div>
      <h2>Sosialisasi Pedoman</h2>
      <p>Slide presentasi interaktif — ringkasan visual setiap bab, contoh skripsi, dan jadwal pelaksanaan.</p>
      <span class="card-cta">Lihat Slide →</span>
    </a>
    <a href="changelog.html" class="card card-changelog">
      <div class="card-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <h2>Changelog</h2>
      <p>Riwayat perubahan pedoman — setiap pembaruan tercatat dengan versi dan tanggal.</p>
      <span class="card-cta">Lihat Changelog →</span>
    </a>
  </div>
  <div class="home-footer">
    <p>Institut Teknologi Sumatera · Fakultas Teknologi Industri · Program Studi Teknik Informatika</p>
  </div>
</main>
`,
);

// === PEDOMAN PAGE ===
const pedomanHtml = template(
	"Pedoman",
	`
<div class="layout-pedoman">
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h3>Daftar Isi</h3>
      <button class="sidebar-close" id="sidebar-close" aria-label="Tutup sidebar">✕</button>
    </div>
    <ul class="toc" id="toc">
      ${tocHtml}
    </ul>
  </aside>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>
  <main class="content-pedoman" id="content">
    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Buka navigasi">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      <span>Daftar Isi</span>
    </button>
    <div id="md-content"></div>
  </main>
</div>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
  const rawMd = ${JSON.stringify(md)};
  const mdEl = document.getElementById('md-content');
  // Configure marked
  marked.setOptions({ breaks: true, gfm: true });
  // Render
  mdEl.innerHTML = marked.parse(rawMd);
  // Add IDs to headings for ToC links
  mdEl.querySelectorAll('h1, h2, h3, h4').forEach(h => {
    const id = h.textContent.toLowerCase().replace(/[^\\w\\s-]/g, '').replace(/\\s+/g, '-');
    h.id = id;
  });
</script>
`,
);

// === SOSIALISASI PAGE ===
const sosialisasiHtml = template(
	"Sosialisasi",
	`
<div class="slides-container" id="slides-container">
  <nav class="slides-nav" id="slides-nav">
    <button class="slide-nav-btn" id="slide-prev" aria-label="Sebelumnya">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <span class="slide-counter" id="slide-counter">1 / 14</span>
    <button class="slide-nav-btn" id="slide-next" aria-label="Selanjutnya">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <div class="slide-dots" id="slide-dots"></div>
  </nav>

  <div class="slides-wrapper" id="slides-wrapper">

    <!-- SLIDE 1: Cover -->
    <section class="slide slide-cover" data-slide="1">
      <div class="slide-content cover-content">
        <div class="cover-badge">Fakultas Teknologi Industri · Institut Teknologi Sumatera</div>
        <h1>Pedoman<br>Tugas Akhir</h1>
        <p class="cover-sub">Program Studi Teknik Informatika</p>
        <p class="cover-year">Tahun Akademik 2025/2026</p>
      </div>
    </section>

    <!-- SLIDE 2: Agenda -->
    <section class="slide" data-slide="2">
      <div class="slide-content">
        <h2>Agenda Sosialisasi</h2>
        <div class="agenda-grid">
          <div class="agenda-item"><span class="agenda-num">01</span>Pendahuluan & CPL 10</div>
          <div class="agenda-item"><span class="agenda-num">02</span>Enam Bentuk Tugas Akhir</div>
          <div class="agenda-item"><span class="agenda-num">03</span>Alur & Timeline per Bentuk</div>
          <div class="agenda-item"><span class="agenda-num">04</span>Persyaratan & Kelengkapan</div>
          <div class="agenda-item"><span class="agenda-num">05</span>Penilaian & Rubrik</div>
          <div class="agenda-item"><span class="agenda-num">06</span>Kebijakan Penggunaan AI</div>
          <div class="agenda-item"><span class="agenda-num">07</span>Integritas Akademik & Sanksi</div>
          <div class="agenda-item"><span class="agenda-num">08</span>Batas Waktu & Penanganan</div>
          <div class="agenda-item"><span class="agenda-num">09</span>Peran & Tanggung Jawab</div>
        </div>
      </div>
    </section>

    <!-- SLIDE 3: CPL 10 -->
    <section class="slide" data-slide="3">
      <div class="slide-content">
        <h2>CPL 10 & Taksonomi Bloom</h2>
        <div class="highlight-box">
          <p>"Mampu menerapkan sikap ilmiah dalam merancang, melaksanakan, dan menganalisis solusi TI serta mendokumentasikannya dalam bentuk laporan yang sistematis."</p>
        </div>
        <div class="bloom-levels">
          <div class="bloom-item">
            <span class="bloom-tag bloom-c3">C3</span>
            <span class="bloom-label">Apply</span>
            <p>Menerapkan · Melaksanakan</p>
          </div>
          <div class="bloom-item">
            <span class="bloom-tag bloom-c4">C4</span>
            <span class="bloom-label">Analyze</span>
            <p>Menganalisis</p>
          </div>
          <div class="bloom-item">
            <span class="bloom-tag bloom-c6">C6</span>
            <span class="bloom-label">Create</span>
            <p>Merancang · Mendokumentasikan</p>
          </div>
        </div>
        <p class="slide-note">TA menuntut capaian dari level penerapan (C3) hingga level mencipta (C6)</p>
      </div>
    </section>

    <!-- SLIDE 4: Enam Bentuk -->
    <section class="slide" data-slide="4">
      <div class="slide-content">
        <h2>Enam Bentuk Tugas Akhir</h2>
        <div class="forms-grid">
          <div class="form-card">
            <div class="form-num">1</div>
            <h3>Laporan TA</h3>
            <p>Penelitian konvensional · Individu</p>
          </div>
          <div class="form-card">
            <div class="form-num">2</div>
            <h3>Capstone Design</h3>
            <p>Proyek kelompok + mitra · Tim 3</p>
          </div>
          <div class="form-card">
            <div class="form-num">3</div>
            <h3>Artikel Ilmiah</h3>
            <p>Publikasi jurnal/konferensi · Individu</p>
          </div>
          <div class="form-card">
            <div class="form-num">4</div>
            <h3>HKI / Paten</h3>
            <p>Purwarupa + DJKI · 2–3 orang</p>
          </div>
          <div class="form-card">
            <div class="form-num">5</div>
            <h3>Teknologi Tepat Guna</h3>
            <p>Produk tepat guna · Tim 2–3</p>
          </div>
          <div class="form-card">
            <div class="form-num">6</div>
            <h3>Buku ber-ISBN</h3>
            <p>Buku referensi · Maks. 2</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 5: Alur Bentuk 1 -->
    <section class="slide" data-slide="5">
      <div class="slide-content">
        <h2>Alur Bentuk 1 — Laporan TA</h2>
        <div class="flow-steps">
          <div class="flow-step"><span class="step-num">1</span><span class="step-label">Pendaftaran TA 1</span><span class="step-detail">≥100 SKS, IPK ≥2,00</span></div>
          <div class="flow-step"><span class="step-num">2</span><span class="step-label">Penyusunan Proposal</span><span class="step-detail">Min. 4x bimbingan</span></div>
          <div class="flow-step"><span class="step-num">3</span><span class="step-label">Seminar Proposal</span><span class="step-detail">Terbuka, 10 menit</span></div>
          <div class="flow-step"><span class="step-num">4</span><span class="step-label">Pendaftaran TA 2</span><span class="step-detail">≥140 SKS, Dosen Wali</span></div>
          <div class="flow-step"><span class="step-num">5</span><span class="step-label">Pelaksanaan</span><span class="step-detail">Bab I–V, similarity ≤25%</span></div>
          <div class="flow-step"><span class="step-num">6</span><span class="step-label">Sidang Akhir</span><span class="step-detail">Tertutup, Grade B</span></div>
          <div class="flow-step"><span class="step-num">7</span><span class="step-label">Pasca Sidang</span><span class="step-detail">Revisi 14 hari kerja</span></div>
        </div>
        <div class="timeline-bar">
          <div class="timeline-sem">Semester 7 · TA 1</div>
          <div class="timeline-sem">Semester 8 · TA 2</div>
        </div>
        <div class="example-box">
          <strong>Contoh:</strong> Ahmad memilih Bentuk 1 dengan topik "Klasifikasi Penyakit Tanaman Kopi menggunakan CNN". Smt 7: proposal + sempro. Smt 8: eksperimen + Bab IV-V + sidang.
        </div>
      </div>
    </section>

    <!-- SLIDE 6: Bentuk 2 Capstone -->
    <section class="slide" data-slide="6">
      <div class="slide-content">
        <h2>Bentuk 2 — Capstone Design</h2>
        <div class="two-col">
          <div class="col">
            <h3>Syarat & Ketentuan</h3>
            <ul class="slide-list">
              <li>Kelompok = <strong>3 orang</strong></li>
              <li>Mitra berlegalitas formal</li>
              <li>Batas waktu: maks. <strong>3 semester</strong></li>
              <li>Tidak selesai → topik baru</li>
            </ul>
          </div>
          <div class="col">
            <h3>Penilaian Individu</h3>
            <ul class="slide-list">
              <li>Kualitas produk: <strong>50%</strong></li>
              <li>Kontribusi individu: <strong>30%</strong></li>
              <li>Presentasi individu: <strong>20%</strong></li>
            </ul>
          </div>
        </div>
        <div class="warning-box">
          <strong>Anggota Tim Bermasalah:</strong> Dapat dikeluarkan dari tim → konversi ke Bentuk 1 dengan topik baru, atau bergabung tim lain. Tim tersisa lanjut jika masih ≥3 orang.
        </div>
      </div>
    </section>

    <!-- SLIDE 7: Bentuk 3 Artikel -->
    <section class="slide" data-slide="7">
      <div class="slide-content">
        <h2>Bentuk 3 — Jalur Publikasi Ilmiah</h2>
        <div class="flow-steps compact">
          <div class="flow-step"><span class="step-num">1</span><span class="step-label">Pengajuan Naskah</span><span class="step-detail">Proposal 1-2 hal</span></div>
          <div class="flow-step"><span class="step-num">2</span><span class="step-label">Penyusunan</span><span class="step-detail">Draf artikel</span></div>
          <div class="flow-step"><span class="step-num">3</span><span class="step-label">Sempro</span><span class="step-detail">Sebelum submit</span></div>
          <div class="flow-step"><span class="step-num">4</span><span class="step-label">Submisi & Revisi</span><span class="step-detail">Peer review → LoA</span></div>
          <div class="flow-step"><span class="step-num">5</span><span class="step-label">Sidang Akhir</span><span class="step-detail">Setelah LoA</span></div>
        </div>
        <div class="two-col">
          <div class="col">
            <h3>Standar Publikasi</h3>
            <p><strong>SINTA 1–4</strong> · Scopus / WoS · IEEE Xplore</p>
          </div>
          <div class="col">
            <h3>Ketentuan Kepenulisan</h3>
            <p>Mahasiswa: first author. Pembimbing: co-author. Wajib CRediT + dokumen kesepakatan kontribusi.</p>
          </div>
        </div>
        <div class="warning-box">
          <strong>Off-Ramp:</strong> Jika dalam 3 semester belum mendapat LoA → topik baru (ajukan kembali dari awal).
        </div>
      </div>
    </section>

    <!-- SLIDE 8: Bentuk 4 HKI -->
    <section class="slide" data-slide="8">
      <div class="slide-content">
        <h2>Bentuk 4 — Prototipe / HKI / Paten</h2>
        <table class="slide-table">
          <thead>
            <tr><th>Jenis Output</th><th>Maks.</th><th>Contoh untuk IF</th></tr>
          </thead>
          <tbody>
            <tr><td>Hak Cipta Software</td><td>1–2</td><td>Aplikasi, library, framework orisinal</td></tr>
            <tr><td>Paten Sederhana</td><td>2–3</td><td>Algoritma baru, metode komputasi</td></tr>
            <tr><td>Paten</td><td>2–3</td><td>Sistem terintegrasi, inovasi signifikan</td></tr>
          </tbody>
        </table>
        <div class="two-col" style="margin-top:1.5rem;">
          <div class="col">
            <h3>Seminar Proposal</h3>
            <p>Draft pengajuan HKI/Paten disiapkan. TKT minimum: <strong>Level 3</strong>.</p>
          </div>
          <div class="col">
            <h3>Sidang Akhir</h3>
            <p>Bukti nomor permohonan DJKI (sertifikat tidak harus terbit). <strong>Wajib demo produk.</strong></p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 9: Bentuk 5 TTG -->
    <section class="slide" data-slide="9">
      <div class="slide-content">
        <h2>Bentuk 5 — Teknologi Tepat Guna (TTG)</h2>
        <div class="two-col">
          <div class="col">
            <h3>Format & Ketentuan</h3>
            <ul class="slide-list">
              <li>Tim: min. 2, maks. 3 mahasiswa</li>
              <li>TKT minimum: <strong>Level 6</strong></li>
              <li>Batas waktu: maks. <strong>3 semester</strong></li>
              <li>Mitra harus berlegalitas formal</li>
            </ul>
          </div>
          <div class="col">
            <h3>Substansi & Output</h3>
            <ul class="slide-list">
              <li>Produk diterapkan di mitra</li>
              <li>Prototipe + dokumentasi</li>
              <li>Laporan evaluasi penggunaan</li>
              <li>Surat verifikasi mitra + logbook</li>
            </ul>
          </div>
        </div>
        <div class="warning-box">
          <strong>Mitra mundur:</strong> Ganti mitra (dalam 3 semester) atau topik baru.
        </div>
      </div>
    </section>

    <!-- SLIDE 10: Bentuk 6 Buku -->
    <section class="slide" data-slide="10">
      <div class="slide-content">
        <h2>Bentuk 6 — Buku ber-ISBN</h2>
        <div class="two-col">
          <div class="col">
            <h3>Format & Ketentuan</h3>
            <ul class="slide-list">
              <li>Maksimal 2 mahasiswa per buku</li>
              <li>Minimal isi buku 50 halaman</li>
              <li>ISBN diperoleh sebelum sidang</li>
              <li>Self-publishing diperbolehkan</li>
              <li>Pembimbing boleh co-author</li>
            </ul>
          </div>
          <div class="col">
            <h3>Substansi & Konten</h3>
            <ul class="slide-list">
              <li>Berdasarkan kajian ilmiah berbasis <strong>PRISMA</strong></li>
              <li>Protokol PRISMA harus diseminarkan</li>
              <li>Topik sesuai bidang Prodi IF</li>
              <li>Dilampirkan narasi ilmiah singkat</li>
            </ul>
          </div>
        </div>
        <p class="slide-note">Jenis: referensi, monograf, buku ajar, teknis, populer ilmiah. ISBN gagal 3 smt → topik baru dari awal.</p>
      </div>
    </section>

    <!-- SLIDE 11: Persyaratan -->
    <section class="slide" data-slide="11">
      <div class="slide-content">
        <h2>Persyaratan Akademik</h2>
        <div class="two-col">
          <div class="col">
            <h3>TA 1 — Proposal (Smt 7)</h3>
            <ul class="slide-list">
              <li>Minimal 100 SKS</li>
              <li>Lulus semua MK prasyarat TA</li>
              <li>IPK minimal 2,00</li>
              <li>Tidak memiliki nilai E</li>
              <li>Nilai D ≤ 10% total SKS</li>
              <li>Tidak dalam status skorsing</li>
              <li>Terdaftar dalam KRS aktif</li>
            </ul>
          </div>
          <div class="col">
            <h3>TA 2 — Sidang Akhir (Smt 8)</h3>
            <ul class="slide-list">
              <li>Lulus TA 1</li>
              <li>Lulus seluruh MK lain (≥140 SKS)</li>
              <li>Persetujuan & validasi Dosen Wali</li>
              <li>Terdaftar dalam KRS aktif</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 12: Penilaian -->
    <section class="slide" data-slide="12">
      <div class="slide-content">
        <h2>Penilaian</h2>
        <div class="two-col">
          <div class="col">
            <h3>TA 1 — Proposal</h3>
            <div class="grading-bars">
              <div class="grade-bar"><span>Kualitas proposal</span><span class="grade-pct">40%</span></div>
              <div class="grade-bar"><span>Presentasi & jawaban</span><span class="grade-pct">30%</span></div>
              <div class="grade-bar"><span>Proses bimbingan</span><span class="grade-pct">30%</span></div>
            </div>
          </div>
          <div class="col">
            <h3>TA 2 — Sidang Akhir</h3>
            <div class="grading-bars">
              <div class="grade-bar"><span>Kualitas laporan/output</span><span class="grade-pct">35%</span></div>
              <div class="grade-bar"><span>Presentasi & pertahanan</span><span class="grade-pct">25%</span></div>
              <div class="grade-bar"><span>Proses bimbingan</span><span class="grade-pct">20%</span></div>
              <div class="grade-bar"><span>Orisinalitas & kontribusi</span><span class="grade-pct">20%</span></div>
            </div>
          </div>
        </div>
        <div class="grade-table">
          <div class="grade-cell grade-a">A<br>75–100</div>
          <div class="grade-cell grade-ab">AB<br>70–74</div>
          <div class="grade-cell grade-b">B<br>65–69</div>
          <div class="grade-cell grade-bc">BC<br>60–64</div>
          <div class="grade-cell grade-tl">TL<br>&lt;60</div>
        </div>
        <p class="slide-note">Nilai minimum kelulusan: <strong>Grade B (65)</strong></p>
      </div>
    </section>

    <!-- SLIDE 13: AI Policy -->
    <section class="slide" data-slide="13">
      <div class="slide-content">
        <h2>Kebijakan Penggunaan AI</h2>
        <div class="two-col">
          <div class="col">
            <div class="allowed-box">
              <h3>✓ Diizinkan</h3>
              <ul class="slide-list">
                <li>Perbaikan bahasa & penerjemahan</li>
                <li>Brainstorming & kerangka tulisan</li>
                <li>Debugging, refactoring, boilerplate</li>
                <li>Pencarian referensi (verifikasi)</li>
                <li>Eksplorasi data awal & visualisasi</li>
              </ul>
            </div>
          </div>
          <div class="col">
            <div class="forbidden-box">
              <h3>✗ Dilarang</h3>
              <ul class="slide-list">
                <li>Generate sebagian besar isi TA</li>
                <li>Fabrikasi data atau referensi fiktif</li>
                <li>Generate kode utuh tanpa paham</li>
                <li>Upload naskah TA ke platform AI</li>
                <li>AI sebagai penulis/kontributor</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="highlight-box" style="margin-top:1.5rem;">
          <p><strong>WAJIB:</strong> Setiap TA memuat Halaman Pernyataan Penggunaan AI.</p>
        </div>
      </div>
    </section>

    <!-- SLIDE 14: Integritas & Sanksi -->
    <section class="slide" data-slide="14">
      <div class="slide-content">
        <h2>Integritas Akademik & Sanksi</h2>
        <table class="slide-table">
          <thead>
            <tr><th>Tingkat</th><th>Pelanggaran</th><th>Sanksi</th></tr>
          </thead>
          <tbody>
            <tr><td><span class="severity sev-ringan">Ringan</span></td><td>Kutipan tanpa atribusi, tidak isi Pernyataan AI</td><td>Teguran lisan/tertulis, revisi wajib</td></tr>
            <tr><td><span class="severity sev-sedang">Sedang</span></td><td>Pelanggaran berulang, free-rider, AI berlebihan</td><td>Penundaan sidang 1 smt, pembatalan nilai MK TA</td></tr>
            <tr><td><span class="severity sev-berat">Berat</span></td><td>Plagiarisme penuh, fabrikasi data, jasa TA</td><td>Skorsing min. 3 smt, pemberhentian mahasiswa</td></tr>
          </tbody>
        </table>
        <p class="slide-note">Hak Pembelaan: Mahasiswa berhak membela diri di hadapan Komisi Etik (Pasal 24).</p>
      </div>
    </section>

    <!-- SLIDE 15: Batas Waktu -->
    <section class="slide" data-slide="15">
      <div class="slide-content">
        <h2>Batas Waktu & Penanganan</h2>
        <div class="highlight-box big">
          <p>Masa berlaku topik TA: <strong>3 semester</strong></p>
          <p>Berlaku untuk SEMUA bentuk TA (1, 2, 3, 4, 5, 6)</p>
          <p>TA 1 + TA 2 harus diselesaikan dalam 3 semester aktif</p>
        </div>
        <table class="slide-table" style="margin-top:1.5rem;">
          <thead>
            <tr><th>Bentuk</th><th>Skenario</th><th>Penanganan</th></tr>
          </thead>
          <tbody>
            <tr><td>Artikel Ilmiah</td><td>Ditolak sebelum sempro</td><td>Ganti jurnal target</td></tr>
            <tr><td>Artikel Ilmiah</td><td>Ditolak setelah sempro</td><td>Submit ulang (dalam 2 bln)</td></tr>
            <tr><td>Artikel Ilmiah</td><td>Belum LoA hingga 3 smt</td><td>Konversi atau topik baru</td></tr>
            <tr><td>HKI / Paten</td><td>Proses DJKI lama</td><td>Cukup no. permohonan</td></tr>
            <tr><td>TTG</td><td>Mitra mundur</td><td>Ganti mitra atau topik baru</td></tr>
            <tr><td>Buku ISBN</td><td>ISBN tidak terbit 3 smt</td><td>Topik baru atau konversi</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SLIDE 16: Peran & Tanggung Jawab -->
    <section class="slide" data-slide="16">
      <div class="slide-content">
        <h2>Peran & Tanggung Jawab</h2>
        <div class="roles-grid">
          <div class="role-card">
            <h4>Kaprodi</h4>
            <p>Mengesahkan pedoman, menyetujui perpanjangan, menunjuk dosen independen</p>
          </div>
          <div class="role-card">
            <h4>Tim Koordinasi TA</h4>
            <p>Menyelenggarakan TA, jadwal, administrasi, menugaskan penguji, mediasi</p>
          </div>
          <div class="role-card">
            <h4>GKMF</h4>
            <p>Mengawasi penerapan pedoman, laporan berkala, rekomendasi</p>
          </div>
          <div class="role-card">
            <h4>Mahasiswa</h4>
            <p>Syarat akademik, bimbingan 4x/smt, integritas, code walkthrough</p>
          </div>
          <div class="role-card">
            <h4>Pembimbing</h4>
            <p>Topik BoK, 4x bimbingan, respons 7 hari, verifikasi plagiarisme</p>
          </div>
          <div class="role-card">
            <h4>Penguji</h4>
            <p>2 per sidang, penilaian rubrik, hak demo/walkthrough</p>
          </div>
          <div class="role-card">
            <h4>Dosen Wali</h4>
            <p>Validasi SKS TA 2, Form Pernyataan, arahan akademik</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 17: Hal Penting -->
    <section class="slide" data-slide="17">
      <div class="slide-content">
        <h2>Hal Penting untuk Diingat</h2>
        <div class="important-grid">
          <div class="important-item"><strong>H-3</strong> Informasikan jadwal sempro/sidang ke pembimbing & penguji</div>
          <div class="important-item"><strong>14 hari</strong> Batas revisi pasca-sidang (perpanjangan maks. +7 hari)</div>
          <div class="important-item"><strong>Dosen Wali</strong> Wajib ditemui sebelum mendaftar sidang akhir</div>
          <div class="important-item"><strong>Bimbingan</strong> Min. 4x/semester, catat di Form Kendali Bimbingan</div>
          <div class="important-item"><strong>Similarity</strong> ≤25% wajib dilampirkan saat mendaftar sidang</div>
          <div class="important-item"><strong>Pernyataan AI</strong> Wajib diisi — baik menggunakan maupun tidak</div>
          <div class="important-item"><strong>Code Walkthrough</strong> Harus mampu jelaskan seluruh isi TA secara lisan</div>
          <div class="important-item"><strong>Nota Kesepahaman</strong> Direkomendasikan di awal bimbingan</div>
        </div>
      </div>
    </section>

    <!-- SLIDE 18: Contoh Skenario -->
    <section class="slide" data-slide="18">
      <div class="slide-content">
        <h2>Contoh Skenario Mahasiswa</h2>
        <div class="scenarios-grid">
          <div class="scenario-card">
            <div class="scenario-header">
              <h4>Ahmad</h4>
              <span class="scenario-form">Bentuk 1</span>
            </div>
            <p>Topik: Klasifikasi penyakit tanaman kopi dengan CNN. Smt 7: proposal + sempro. Smt 8: eksperimen, Bab IV-V, sidang.</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-header">
              <h4>Budi & Tim</h4>
              <span class="scenario-form">Bentuk 2</span>
            </div>
            <p>3 orang, mitra Dinas Pertanian. Membangun sistem monitoring IoT. Sidang: demo + jawab individu.</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-header">
              <h4>Citra</h4>
              <span class="scenario-form">Bentuk 3</span>
            </div>
            <p>Submit paper ke jurnal SINTA 3. Sempro smt 7, LoA smt 8, sidang. Belum LoA 3 smt → topik baru.</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-header">
              <h4>Dian & Eka</h4>
              <span class="scenario-form">Bentuk 5</span>
            </div>
            <p>Platform e-learning sekolah terpencil. Mitra: Dinas Pendidikan Lampung. Sidang: demo + surat verifikasi.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 19: Jadwal -->
    <section class="slide" data-slide="19">
      <div class="slide-content">
        <h2>Pelaksanaan Tugas Akhir — Ganjil 2026/2027</h2>
        <div class="schedule-timeline">
          <div class="schedule-item">
            <div class="schedule-date">1 – 8 Juli 2026</div>
            <div class="schedule-desc">Periode dosen mengisi tawaran topik</div>
          </div>
          <div class="schedule-item">
            <div class="schedule-date">9 – 23 Juli 2026</div>
            <div class="schedule-desc">Periode mahasiswa submit pengajuan topik</div>
          </div>
          <div class="schedule-item">
            <div class="schedule-date">24 – 27 Juli 2026</div>
            <div class="schedule-desc">Periode validasi topik mahasiswa oleh dosen</div>
          </div>
          <div class="schedule-item">
            <div class="schedule-date">28 Juli 2026</div>
            <div class="schedule-desc">Pengumuman penerimaan topik mahasiswa</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SLIDE 20: Penutup -->
    <section class="slide slide-cover" data-slide="20">
      <div class="slide-content cover-content">
        <h1>Selamat Mengerjakan<br>Tugas Akhir!</h1>
        <p class="cover-quote">"Tugas Akhir bukan hanya syarat kelulusan —<br>ia adalah bukti bahwa Anda mampu berkarya."</p>
        <div class="cover-badge" style="margin-top:2rem;">Program Studi Teknik Informatika · FTI · Institut Teknologi Sumatera</div>
      </div>
    </section>

  </div>
</div>
`,
);

// === CHANGELOG PAGE ===
const changelogHtml = template(
	"Changelog",
	`
<main class="home">
  <div class="hero" style="padding-bottom:20px;">
    <div class="hero-badge">Version History</div>
    <h1 style="font-size:36px;">Changelog</h1>
    <p class="hero-sub">Riwayat perubahan penting pada Pedoman TA IF ITERA.</p>
  </div>
  <div class="changelog-container" id="changelog-content"></div>
  <div class="home-footer">
    <p>Institut Teknologi Sumatera · Fakultas Teknologi Industri · Program Studi Teknik Informatika</p>
  </div>
</main>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
  const rawChangelog = ${JSON.stringify(changelogMd)};
  const clEl = document.getElementById('changelog-content');
  marked.setOptions({ breaks: true, gfm: true });
  // Parse markdown and split by h2 (each version)
  const tmpDiv = document.createElement('div');
  tmpDiv.innerHTML = marked.parse(rawChangelog);
  const allH2 = tmpDiv.querySelectorAll('h2');
  const maxEntries = 8;
  let count = 0;
  allH2.forEach(h2 => {
    if (count >= maxEntries) {
      // Hide remaining entries
      let node = h2;
      while (node) {
        const next = node.nextElementSibling;
        node.remove();
        node = next;
        if (!node || node.tagName === 'H2') break;
      }
      h2.remove();
    } else {
      count++;
    }
  });
  clEl.innerHTML = tmpDiv.innerHTML;
  // Style the changelog
  clEl.querySelectorAll('h2').forEach(h => {
    h.style.cssText = 'font-size:22px;font-weight:700;margin:32px 0 12px;padding:12px 20px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-sm);border-left:4px solid var(--accent);';
  });
  clEl.querySelectorAll('h3').forEach(h => {
    h.style.cssText = 'font-size:16px;font-weight:600;margin:20px 0 8px;color:var(--accent);';
  });
  clEl.querySelectorAll('ul').forEach(ul => {
    ul.style.cssText = 'padding-left:20px;margin:8px 0 16px;';
  });
  clEl.querySelectorAll('li').forEach(li => {
    li.style.cssText = 'font-size:14px;line-height:1.7;margin:4px 0;color:var(--text-2);';
  });
  clEl.querySelectorAll('strong').forEach(s => {
    s.style.color = 'var(--text)';
  });
</script>
`,
);

// === STYLES ===
const styles = `/* ===== RESET & VARIABLES ===== */
:root {
  --bg: #ffffff;
  --bg-2: #f8f9fb;
  --bg-3: #f0f2f5;
  --text: #1a1d23;
  --text-2: #4a5068;
  --text-3: #8891a5;
  --border: #e2e5eb;
  --border-2: #d0d4dc;
  --accent: #2563eb;
  --accent-light: #dbeafe;
  --accent-dark: #1d4ed8;
  --green: #16a34a;
  --green-bg: #dcfce7;
  --red: #dc2626;
  --red-bg: #fee2e2;
  --yellow: #ca8a04;
  --yellow-bg: #fef9c3;
  --purple: #7c3aed;
  --purple-bg: #ede9fe;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.03);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.08);
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', 'Fira Code', monospace;
}

[data-theme="dark"] {
  --bg: #0f1117;
  --bg-2: #161920;
  --bg-3: #1e2128;
  --text: #e8eaef;
  --text-2: #a0a6b8;
  --text-3: #6b7394;
  --border: #2a2e38;
  --border-2: #363b47;
  --accent: #3b82f6;
  --accent-light: #1e3a5f;
  --accent-dark: #60a5fa;
  --green: #22c55e;
  --green-bg: #14532d;
  --red: #ef4444;
  --red-bg: #7f1d1d;
  --yellow: #eab308;
  --yellow-bg: #713f12;
  --purple: #a78bfa;
  --purple-bg: #3b1f7e;
  --shadow: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.4);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ===== TOPBAR ===== */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--bg) 85%, transparent);
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  font-weight: 700;
  font-size: 15px;
}

.topbar-brand svg { color: var(--accent); }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.topbar-link:hover { color: var(--text); background: var(--bg-3); }
.topbar-link.active { color: var(--accent); background: var(--accent-light); }

.theme-toggle {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-2);
  transition: all 0.2s;
}
.theme-toggle:hover { border-color: var(--accent); color: var(--accent); }

[data-theme="light"] .icon-moon { display: none; }
[data-theme="dark"] .icon-sun { display: none; }

/* ===== HOME ===== */
.home {
  padding: 56px 24px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  text-align: center;
  padding: 80px 20px 40px;
  max-width: 700px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 17px;
  color: var(--text-2);
  max-width: 500px;
  margin: 0 auto;
}

/* Draft Banner */
.draft-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 720px;
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--yellow-bg), color-mix(in srgb, var(--yellow-bg) 60%, var(--bg)));
  border: 1px solid color-mix(in srgb, var(--yellow) 40%, transparent);
  border-radius: var(--radius);
  margin: 0 20px 24px;
}

.draft-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--yellow-bg);
  border-radius: 10px;
  color: var(--yellow);
}

.draft-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.draft-text strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--yellow);
}

.draft-text span {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
}

.draft-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--yellow);
  color: #fff;
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.draft-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .draft-banner {
    flex-direction: column;
    text-align: center;
    margin: 0 16px 20px;
    padding: 16px;
  }
  .draft-btn { width: 100%; justify-content: center; }
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 720px;
  width: 100%;
  padding: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 36px 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--text);
  background: var(--bg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card-pedoman .card-icon { background: var(--accent-light); color: var(--accent); }
.card-sosialisasi .card-icon { background: var(--purple-bg); color: var(--purple); }

.card h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card p {
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.card-cta {
  display: inline-block;
  margin-top: 20px;
  color: var(--accent);
  font-weight: 600;
  font-size: 14px;
}

.home-footer {
  margin-top: auto;
  padding: 40px 20px;
  text-align: center;
  color: var(--text-3);
  font-size: 13px;
}

/* ===== PEDOMAN LAYOUT ===== */
.layout-pedoman {
  display: flex;
  padding-top: 56px;
  min-height: 100vh;
}

.sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  padding: 20px 0;
  z-index: 100;
  scrollbar-width: thin;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}

.sidebar-header h3 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-3);
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: var(--text-3);
  cursor: pointer;
  font-size: 18px;
}

.toc {
  list-style: none;
}

.toc a {
  display: block;
  padding: 5px 20px;
  text-decoration: none;
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.5;
  transition: all 0.15s;
  border-left: 2px solid transparent;
}
.toc a:hover {
  color: var(--text);
  background: var(--bg-3);
}
.toc a.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--accent-light);
  font-weight: 500;
}

.toc-level-1 a { font-weight: 600; color: var(--text); padding-left: 20px; }
.toc-level-2 a { padding-left: 32px; }
.toc-level-3 a { padding-left: 44px; font-size: 12px; }
.toc-level-4 a { padding-left: 56px; font-size: 12px; color: var(--text-3); }

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 90;
  padding: 10px 18px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  gap: 8px;
  align-items: center;
}

.content-pedoman {
  margin-left: 280px;
  flex: 1;
  padding: 40px 48px 80px;
  max-width: 900px;
  min-width: 0;
}

/* ===== MARKDOWN CONTENT ===== */
#md-content h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 48px 0 24px;
  letter-spacing: -0.02em;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border);
}
#md-content h1:first-child { margin-top: 0; }

#md-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 40px 0 16px;
  color: var(--accent);
}

#md-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 28px 0 12px;
}

#md-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 20px 0 8px;
}

#md-content p {
  margin: 0 0 16px;
  color: var(--text);
  line-height: 1.7;
}

#md-content ul, #md-content ol {
  margin: 0 0 16px;
  padding-left: 24px;
}

#md-content li {
  margin: 4px 0;
  line-height: 1.6;
}

#md-content strong { font-weight: 600; }

#md-content em { font-style: italic; color: var(--text-2); }

#md-content a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-light);
}
#md-content a:hover { border-bottom-color: var(--accent); }

#md-content blockquote {
  border-left: 3px solid var(--accent);
  padding: 12px 20px;
  margin: 16px 0;
  background: var(--accent-light);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-2);
}

#md-content code {
  font-family: var(--mono);
  font-size: 0.9em;
  padding: 2px 6px;
  background: var(--bg-3);
  border-radius: 4px;
  color: var(--accent-dark);
}

#md-content pre {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  overflow-x: auto;
  margin: 16px 0;
}
#md-content pre code {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.6;
}

#md-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 24px;
  font-size: 14px;
}

#md-content th {
  background: var(--bg-3);
  font-weight: 600;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

#md-content td {
  padding: 10px 14px;
  border: 1px solid var(--border);
  vertical-align: top;
}

#md-content tr:hover td { background: var(--bg-2); }

#md-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 40px 0;
}

#md-content img {
  max-width: 100%;
  border-radius: var(--radius-sm);
}

/* ===== SLIDES ===== */
.slides-container {
  padding-top: 56px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.slides-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 999;
  padding: 0 24px;
  pointer-events: auto;
  isolation: isolate;
}

.slides-nav .slide-nav-btn,
.slides-nav .slide-dot,
.slides-nav .slide-counter {
  position: relative;
  z-index: 1000;
  pointer-events: auto;
}

.slide-nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-2);
  transition: all 0.2s;
}
.slide-nav-btn:hover { border-color: var(--accent); color: var(--accent); }
.slide-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.slide-counter {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-3);
  min-width: 60px;
  text-align: center;
}

.slide-dots {
  display: flex;
  gap: 6px;
}
.slide-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--border-2);
  cursor: pointer;
  transition: all 0.2s;
  pointer-events: auto;
}
.slide-dot.active {
  background: var(--accent);
  width: 28px;
  border-radius: 6px;
}

.slides-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 60px 100px;
  opacity: 0;
  transform: translateX(40px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.slide.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  z-index: 1;
}
.slide.prev {
  opacity: 0;
  transform: translateX(-40px);
  z-index: 0;
}

.slide-content {
  max-width: 960px;
  width: 100%;
}

.slide-content h2 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

/* Cover slide */
.slide-cover { background: linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%); }
.cover-content { text-align: center; }
.cover-badge {
  display: inline-block;
  padding: 6px 16px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 32px;
}
.cover-content h1 {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}
.cover-sub {
  font-size: 20px;
  color: var(--text-2);
  margin-bottom: 8px;
}
.cover-year {
  font-size: 15px;
  color: var(--text-3);
}
.cover-quote {
  font-size: 18px;
  color: var(--text-2);
  font-style: italic;
  max-width: 500px;
  margin: 0 auto;
}

/* Agenda grid */
.agenda-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.agenda-item {
  padding: 16px 20px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}
.agenda-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  min-width: 32px;
}

/* Bloom levels */
.bloom-levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0;
}
.bloom-item {
  text-align: center;
  padding: 24px 16px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.bloom-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}
.bloom-c3 { background: var(--green-bg); color: var(--green); }
.bloom-c4 { background: var(--yellow-bg); color: var(--yellow); }
.bloom-c6 { background: var(--purple-bg); color: var(--purple); }
.bloom-label { display: block; font-weight: 700; font-size: 16px; margin: 4px 0; }
.bloom-item p { color: var(--text-2); font-size: 13px; margin: 0; }

/* Highlight box */
.highlight-box {
  padding: 20px 24px;
  background: var(--accent-light);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: var(--radius);
  margin-bottom: 20px;
}
.highlight-box.big { text-align: center; }
.highlight-box p { margin: 0; line-height: 1.7; }

/* Forms grid */
.forms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.form-card {
  padding: 24px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-align: center;
  transition: all 0.2s;
}
.form-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.form-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
}
.form-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.form-card p { font-size: 13px; color: var(--text-2); margin: 0; }

/* Flow steps */
.flow-steps {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.flow-steps.compact .flow-step { flex: 1; min-width: 120px; }
.flow-step {
  flex: 1;
  min-width: 100px;
  padding: 14px 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-align: center;
  position: relative;
}
.flow-step::after {
  content: '→';
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  font-size: 14px;
}
.flow-step:last-child::after { display: none; }
.step-num {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 4px;
}
.step-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}
.step-detail {
  display: block;
  font-size: 11px;
  color: var(--text-3);
}

/* Timeline bar */
.timeline-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}
.timeline-sem {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-sm);
}
.timeline-sem:first-child { background: var(--accent-light); color: var(--accent); }
.timeline-sem:last-child { background: var(--green-bg); color: var(--green); }

/* Two column */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.col h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--accent);
}
.col p { font-size: 14px; line-height: 1.6; }

.slide-list {
  list-style: none;
  padding: 0;
}
.slide-list li {
  padding: 6px 0;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.slide-list li::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* Warning box */
.warning-box {
  padding: 16px 20px;
  background: var(--yellow-bg);
  border: 1px solid color-mix(in srgb, var(--yellow) 30%, transparent);
  border-radius: var(--radius-sm);
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.6;
}

/* Example box */
.example-box {
  padding: 16px 20px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-2);
  margin-top: 16px;
}

/* Slide table */
.slide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.slide-table th {
  background: var(--bg-3);
  padding: 10px 16px;
  text-align: left;
  font-weight: 600;
  border: 1px solid var(--border);
  font-size: 13px;
}
.slide-table td {
  padding: 10px 16px;
  border: 1px solid var(--border);
}
.slide-table tr:hover td { background: var(--bg-2); }

/* Grading */
.grading-bars { display: flex; flex-direction: column; gap: 8px; }
.grade-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
}
.grade-pct {
  font-weight: 700;
  color: var(--accent);
  font-size: 16px;
}

.grade-table {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.grade-cell {
  flex: 1;
  text-align: center;
  padding: 16px 8px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
}
.grade-a { background: var(--green-bg); color: var(--green); }
.grade-ab { background: #d1fae5; color: #059669; }
.grade-b { background: var(--accent-light); color: var(--accent); }
.grade-bc { background: var(--yellow-bg); color: var(--yellow); }
.grade-tl { background: var(--red-bg); color: var(--red); }

[data-theme="dark"] .grade-ab { background: #064e3b; }

/* Allowed / Forbidden boxes */
.allowed-box, .forbidden-box {
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid;
}
.allowed-box { background: var(--green-bg); border-color: color-mix(in srgb, var(--green) 30%, transparent); }
.allowed-box h3 { color: var(--green); margin-bottom: 12px; }
.forbidden-box { background: var(--red-bg); border-color: color-mix(in srgb, var(--red) 30%, transparent); }
.forbidden-box h3 { color: var(--red); margin-bottom: 12px; }

/* Severity */
.severity {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}
.sev-ringan { background: var(--green-bg); color: var(--green); }
.sev-sedang { background: var(--yellow-bg); color: var(--yellow); }
.sev-berat { background: var(--red-bg); color: var(--red); }

/* Roles grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}
.role-card {
  padding: 20px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.role-card h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--accent);
}
.role-card p { font-size: 13px; color: var(--text-2); margin: 0; line-height: 1.5; }

/* Important grid */
.important-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.important-item {
  padding: 16px 20px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1.5;
}
.important-item strong { color: var(--accent); }

/* Scenarios */
.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.scenario-card {
  padding: 24px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.scenario-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.scenario-header h4 { font-size: 16px; font-weight: 700; margin: 0; }
.scenario-form {
  padding: 2px 10px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}
.scenario-card p { font-size: 13px; color: var(--text-2); margin: 0; line-height: 1.6; }

/* Schedule */
.schedule-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 32px;
}
.schedule-timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--border);
}
.schedule-item {
  position: relative;
  padding: 16px 0 16px 24px;
}
.schedule-item::before {
  content: '';
  position: absolute;
  left: -25px;
  top: 22px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg);
}
.schedule-date {
  font-weight: 700;
  font-size: 15px;
  color: var(--accent);
  margin-bottom: 4px;
}
.slide-note {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-3);
  font-style: italic;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar.open ~ .sidebar-overlay { display: block; }
  .sidebar-close { display: block; }
  .sidebar-toggle { display: flex; }

  .content-pedoman {
    margin-left: 0;
    padding: 24px 20px 100px;
  }

  .slide { padding: 24px 20px 100px; }
  .agenda-grid { grid-template-columns: 1fr; }
  .bloom-levels { grid-template-columns: 1fr; }
  .forms-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .flow-steps { flex-direction: column; }
  .flow-step::after { display: none; }
  .grade-table { flex-wrap: wrap; }
  .grade-cell { min-width: calc(50% - 4px); }
  .important-grid { grid-template-columns: 1fr; }
  .scenarios-grid { grid-template-columns: 1fr; }
  .roles-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .forms-grid { grid-template-columns: 1fr; }
  .hero h1 { font-size: 28px; }
  .cards { grid-template-columns: 1fr; }
  .topbar-link { display: none; }
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-3); }
`;

// === SCRIPT ===
const script = `// Theme
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// Sidebar toggle (pedoman page)
(function() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const close = document.getElementById('sidebar-close');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggle) {
    toggle.addEventListener('click', () => sidebar.classList.add('open'));
  }
  if (close) {
    close.addEventListener('click', () => sidebar.classList.remove('open'));
  }
  if (overlay) {
    overlay.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  // Active ToC tracking
  const tocLinks = document.querySelectorAll('.toc a');
  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) headings.push({ el, link });
  });

  if (headings.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const match = headings.find(h => h.el === entry.target);
          if (match) match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    headings.forEach(h => observer.observe(h.el));
  }

  // Close sidebar on link click (mobile)
  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) sidebar.classList.remove('open');
    });
  });
})();

// Slides navigation
(function() {
  const wrapper = document.getElementById('slides-wrapper');
  if (!wrapper) return;

  const slides = wrapper.querySelectorAll('.slide');
  const counter = document.getElementById('slide-counter');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const dotsContainer = document.getElementById('slide-dots');
  let current = 0;
  const total = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    slides[current].classList.remove('active');
    slides[current].classList.add(idx > current ? 'prev' : '');
    current = idx;
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === current) s.classList.add('active');
      else if (i < current) s.classList.add('prev');
    });
    counter.textContent = (current + 1) + ' / ' + total;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
    dotsContainer.querySelectorAll('.slide-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
  });

  // Touch swipe
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  wrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  goTo(0);
})();
`;

// Write files
fs.writeFileSync(path.join(__dirname, "index.html"), indexHtml);
fs.writeFileSync(path.join(__dirname, "pedoman.html"), pedomanHtml);
fs.writeFileSync(path.join(__dirname, "sosialisasi.html"), sosialisasiHtml);
fs.writeFileSync(path.join(__dirname, "changelog.html"), changelogHtml);
fs.writeFileSync(path.join(__dirname, "styles.css"), styles);
fs.writeFileSync(path.join(__dirname, "script.js"), script);

console.log("Build complete! Files generated:");
console.log("  - index.html");
console.log("  - pedoman.html");
console.log("  - sosialisasi.html");
console.log("  - changelog.html");
console.log("  - styles.css");
console.log("  - script.js");
