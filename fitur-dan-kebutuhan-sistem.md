# Fitur & Kebutuhan Sistem — Education Delivery (Aplikasi/Website Baru)

**Disusun oleh:** Fajar (Technical Lead, Lantai 2 Mission Control) — menggabungkan hasil tim
**Tanggal:** 9 November 2026
**Status:** Dokumen final v1 — dasar pembangunan (bukan revisi website informasional lama)
**Kontributor:** Raka (koordinator), Bima (arsitektur), Sinta (desain), Dimas (developer), Putri (data), Dewi (keamanan), Edo (deployment), Budi (QA)
**Catatan:** JANGAN publish/deploy/push ke mana pun tanpa persetujuan Ridzki/pemilik. Harga, testimoni, dan nomor WhatsApp TIDAK dicantumkan di dokumen ini karena tidak ada yang terverifikasi — lihat §9.

**Perubahan 10 Nov 2026 (permintaan owner, via Ridzki):** kelas kini hanya **Art Class** saja — Baby Class & Toddler Class dihapus dari website. Ditambah halaman galeri karya (`galeri.html`, 6 slot placeholder — foto karya asli menunggu kiriman owner). Alur bisnis berubah: DM IG → ceritakan kebutuhan anak → pilih jadwal → guru datang ke rumah. Dokumen `sections/` masih mendeskripsikan MVP 3-program versi 9 Nov 2026 dan belum diperbarui.

---

## 1. Gambaran Produk

**Education Delivery** adalah layanan les privat *home visit* untuk bayi dan anak — guru datang ke rumah orang tua. Lokasi: Jl. Karet Raya RT 06 RW 05, Kec. Setiabudi, Jakarta 15418. Kanal resmi: Instagram **@educationdelivery** (tautan: http://s.id/educationdelivery). Motto: *"Nurturing Growth, Creativity, Joyful"* — *Education Home Visit Specialist*.

Aplikasi ini adalah website katalog program + alat pendaftaran: orang tua membaca program, memahami cara daftar, lalu mengisi formulir booking. Bedanya dengan website informasional lama (hanya menampilkan info): aplikasi baru **menyimpan data booking di perangkat orang tua** dan **meneruskannya ke DM Instagram** pemilik.

**Alur bisnis yang sudah berjalan (diikuti apa adanya):** DM IG → ceritakan kebutuhan anak → pilih program & jadwal → guru datang ke rumah.

**Program:** Art Class saja (anak kreatif) — sejak 10 Nov 2026 atas permintaan owner; Baby Class & Toddler Class dihapus. Layanan di dalamnya: Sensory Play, Fun Activities, Movement Play.

**Desain:** simple soft, terang dan hangat (panduan Sinta, `desain.md`): latar krem `#FFF9F0`, kartu putih, font Baloo 2 (judul) + Plus Jakarta Sans (isi), aksen lembut per program (Baby = biru `#5B8DEF`, Toddler = toska `#2FB3A6`, Art = merah `#F0725C`, Movement = hijau `#58B947`, emas `#E9A800` hanya aksen kecil), tombol utama merah `#E8402F`, mobile-first (desain untuk 360px dulu, max-width 1120px, radius kartu 22–26px, bayangan lembut).

## 2. Peran Pengguna

| Peran | Yang bisa dilakukan |
|---|---|
| **Orang tua (pengunjung)** | Melihat program & cara daftar, mengisi formulir booking, melihat riwayat booking-nya sendiri di perangkatnya, membuka DM Instagram untuk konfirmasi |
| **Admin / tutor (pemilik)** | Menerima booking lewat DM Instagram, menghubungi orang tua untuk konfirmasi jadwal |

v1 **tidak punya sistem login dan tidak punya panel admin**. Admin bekerja lewat DM Instagram yang sudah jadi kanal resmi bisnis ini. Panel admin, login, dan kalender masuk Fase 2.

## 3. Daftar Fitur

### MVP — wajib di website pertama (prioritas berurutan)

| # | Fitur | Keterangan |
|---|---|---|
| 1 | Hero + tentang | Nama, motto, tagline, tombol ke booking & Instagram; chip layanan (Sensory Play, Fun Activities, Movement Play, Belajar di Rumah) |
| 2 | Program | 1 kartu program (Art Class) + halaman galeri karya (`galeri.html`) — foto, badge, 1 kalimat deskripsi, daftar layanan dengan centang warna aksen program |
| 3 | Cara daftar | 4 langkah: DM IG → ceritakan kebutuhan anak → pilih program & jadwal → guru datang ke rumah |
| 4 | Formulir booking | Field wajib (lihat §5): nama orang tua, nama anak, usia anak (bulan), program (pilih 1 dari 3), jadwal yang diinginkan (hari + jam), alamat lengkap, kontak (IG/HP orang tua). Validasi: semua wajib diisi sebelum kirim |
| 5 | Penyimpanan booking | Disimpan di `localStorage` key `ed_bookings` (lihat §5) + tombol "Lanjutkan ke DM Instagram" yang membuka http://s.id/educationdelivery dengan pesan booking terisi otomatis |
| 6 | FAQ | Pertanyaan umum seputar home visit, program, jadwal; jawaban hanya dari fakta terverifikasi, yang belum pasti ditandai "tanyakan via DM" |
| 7 | Kontak + footer | Kartu kontak: DM @educationdelivery, tautan http://s.id/educationdelivery, alamat lengkap; footer berisi alamat + link Instagram di setiap halaman |

### Fase 2 — nanti (setelah MVP jalan)

1. Panel admin sederhana (login) untuk melihat daftar booking yang masuk
2. Kalender ketersediaan tutor & jadwal yang sudah terisi (di sinilah entitas Kelas/Jadwal Putri dipakai penuh — lihat §5)
3. Notifikasi otomatis ke admin saat ada booking baru (butuh backend)
4. Galeri kegiatan & profil tutor
5. Pembayaran / DP booking online
6. Testimoni orang tua (hanya yang asli, dengan izin)

## 4. Halaman / Layar

**Keputusan: satu halaman panjang (single-page) dengan anchor.**

Alasan (Bima): konten sedikit, mayoritas pengunjung datang dari Instagram lewat HP, formulir booking harus selalu mudah dijangkau, dan lebih murah/sederhana di-hosting statis tanpa routing server. Jika konten membesar di Fase 2 (panel admin, galeri), baru dipecah jadi multi-halaman.

**Urutan section + anchor (final):** `#beranda` (hero) → `#tentang` → `#program` → `#cara-daftar` → `#booking` → `#faq` → `#kontak`. Header sticky dengan navigasi anchor + tombol "Booking Sekarang". (Bagian "Layanan" dari panduan Sinta bukan section tersendiri — layanannya tampil sebagai chip di hero dan poin di kartu program.)

## 5. Model Data

Ringkasan dari Putri (`sections/data-putri.md`). Entitas: **Program** (1:N) **Kelas/Jadwal** (1 tutor per kelas; 1 tutor mengajar banyak kelas), **Booking** (memilih 1 Program dan 1 Kelas/Jadwal), **Tutor**, **Orang Tua/Anak** (1 orang tua punya banyak anak & booking; di MVP profil ini opsional — cukup dari data booking).

**Status booking:** `baru` → `dikonfirmasi` → `selesai`; `baru`/`dikonfirmasi` → `dibatalkan`.

**Validasi penting:** semua field wajib diisi; usia anak angka bulat dalam bulan, 0–72 bulan (0–6 tahun); jadwal harus hari ini atau sesudahnya dan dalam jam layanan; kontak minimal satu dari DM Instagram (@username) atau nomor WhatsApp (diawali 08/+62, 10–14 digit); `program_id`/`kelas_id` harus ada di data master; kelas yang kuotanya penuh (`terisi >= kuota`) tidak bisa dipilih; satu anak + satu kelas yang sama tidak boleh terdaftar dua kali (cek `nama_anak + kelas_id`).

### Penyimpanan MVP — localStorage

- Key booking: **`ed_bookings`** (array JSON booking). Data master terpisah: `ed_programs`, `ed_kelas`, `ed_tutors`.
- **Contoh JSON 1 booking:**

```json
{
  "id": "BK-20261109-001",
  "nama_orang_tua": "Sari Wijaya",
  "nama_anak": "Nara",
  "usia_anak_bulan": 18,
  "program_id": "toddler-class",
  "kelas_id": "kelas-001",
  "jadwal_diminta": "2026-11-12",
  "alamat_rumah": "Jl. Karet Raya RT 06 RW 05, Setiabudi, Jakarta 15418",
  "kontak": "@sariwijaya (IG)",
  "catatan": "Anak alergi cat — pakai cat aman",
  "status": "baru",
  "dibuat_pada": "2026-11-09T13:58:00+07:00"
}
```

> Catatan: nama/alamat/kontak di contoh di atas adalah **data contoh dari dokumen Putri**, bukan data pelanggan asli. `kelas_id` boleh `null` di MVP (lihat Keputusan Teknis K4).

### Nanti — backend sungguhan (MySQL/Postgres)

Setiap entitas menjadi 1 tabel; `id` jadi PRIMARY KEY; `program_id`, `kelas_id`, `tutor_id` jadi FOREIGN KEY; `status` jadi ENUM (`baru`, `dikonfirmasi`, `selesai`, `dibatalkan`); `dibuat_pada` jadi TIMESTAMP DEFAULT NOW(); tambah tabel `users/admin` untuk login admin; tambah kolom `harga` di Program **hanya bila harga resmi sudah terverifikasi**. Migrasi: ekspor JSON localStorage → import ke tabel (satu baris per booking), lalu validasi ulang.

## 6. Teknologi yang Dipakai

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Markup & gaya | HTML + CSS statis (`index.html` + `styles.css`) | Cepat, murah, tanpa server; sesuai skala bisnis kecil |
| Interaksi | JavaScript vanilla (`app.js`, tanpa framework) | Formulir + localStorage + validasi tidak butuh React/Vue; tanpa build step |
| Penyimpanan booking | `localStorage` di browser pengunjung | Tanpa backend: tanpa biaya server, tanpa risiko kebocoran data di server |
| Penerusan ke pemilik | Tautan DM Instagram via http://s.id/educationdelivery | Mengikuti alur bisnis yang berjalan; DM IG adalah kanal resmi |
| Font & aset | Google Fonts (Baloo 2 + Plus Jakarta Sans), aset gambar lokal di `assets/` | Konsisten dengan identitas visual; aset lokal agar tidak bergantung hotlink |

**Struktur file:**

```
~/workspace/education-delivery-app/
├── index.html          # Satu halaman: hero, tentang, program, cara daftar,
│                       #   formulir booking, FAQ, kontak, footer
├── styles.css          # Semua gaya (token desain Sinta, mobile-first)
├── app.js              # Validasi formulir, simpan localStorage,
│                       #   susun pesan DM Instagram, tampilkan riwayat booking
├── assets/
│   ├── logo.svg        # Logo perisai 4 kuadran (tunas biru, buku toska,
│   │                   #   lampu hijau, otak merah + pita emas)
│   └── program/        # baby-class.jpg, toddler-class.jpg, art-class.jpg
├── sections/           # Dokumen kerja tim (arsitektur, data, keamanan, deployment)
├── fitur-dan-kebutuhan-sistem.md   # Dokumen ini
└── README.md           # Cara menjalankan (buka index.html) + status info
                        #   yang masih ditunggu dari pemilik
```

**Yang sengaja TIDAK dipakai di v1:** backend/server, database, sistem login, framework JS, payment gateway. Semua masuk Fase 2 bila volume booking sudah membenarkan biayanya.

## 7. Catatan Keamanan (ringkasan Dewi)

Data booking berisi **data anak** (nama, usia, program, jadwal) + **alamat rumah dan kontak orang tua** — perlakukan sebagai data sensitif (UU Perlindungan Data Pribadi).

1. **Jangan tampilkan data booking orang lain.** Tidak ada halaman "daftar pendaftar" untuk pengunjung; riwayat yang tampil hanya milik pengisi di perangkat itu sendiri.
2. **Jangan kirim data ke server pihak ketiga tanpa persetujuan.** Data hanya disimpan lokal dan diteruskan ke DM Instagram saat orang tua menekan tombol kirim. Tanpa pelacak, iklan, atau pengiriman otomatis.
3. **Validasi semua input.** Batasi panjang isian, tolak karakter HTML/JS (`<`, `>`, `script`), tampilkan isian kembali sebagai teks biasa — jangan pernah sebagai HTML.
4. **Jangan simpan data lebih lama dari perlu.** Data booking di localStorage **dihapus otomatis setelah terkirim** (atau maksimal 7 hari), tanpa salinan cadangan di browser.
5. **Tombol hapus data.** Di dekat formulir, tampilkan tombol "Hapus data saya di perangkat ini" yang menghapus seluruh data booking dari localStorage + konfirmasi terhapus.
6. **Jangan minta data yang tidak diperlukan.** Hanya yang dibutuhkan untuk booking; jangan minta foto anak, KTP, atau data lain.
7. **Teks persetujuan di bawah formulir (wajib tampil, sebelum tombol kirim):**

> Dengan mengirim formulir ini, saya setuju data yang saya isi (nama saya, nama dan usia anak saya, program, jadwal, alamat rumah, dan kontak) dipakai hanya untuk memproses booking les ini. Data disimpan sementara di perangkat saya sendiri dan diteruskan ke Education Delivery lewat DM Instagram saat saya menekan tombol kirim. Data tidak dibagikan ke pihak lain dan tidak dipakai untuk iklan. Saya bisa menghapus data dari perangkat saya kapan saja dengan tombol "Hapus data saya di perangkat ini".

**Sebelum ada backend sungguhan:** HTTPS wajib sebelum formulir aktif; halaman admin wajib login (kata sandi kuat + sebaiknya 2FA); enkripsi data di database (at rest + TLS); retensi (booking selesai dihapus maksimal 90 hari kemudian, otomatis); akses terbatas + audit log; simpan usia anak sebagai angka saja (bukan tanggal lahir); uji keamanan sebelum rilis backend (coba isi HTML/JS, coba buka data tanpa login, pastikan data lama benar-benar terhapus).

## 8. Catatan Deployment (ringkasan Edo — tanpa deploy/push)

Website statis (`index.html`, `styles.css`, `app.js`) — **belum ada yang di-deploy**. Opsi:

| Kriteria | GitHub Pages (rekomendasi) | Netlify Drop | Cloudflare Pages |
|---|---|---|---|
| Biaya | Gratis | Gratis | Gratis |
| Kemudahan | Sedang (perlu repo + push) | Sangat mudah (drag & drop) | Sangat mudah (drag & drop) |
| HTTPS | Otomatis | Otomatis | Otomatis |
| Update | Push ke repo | Upload ulang folder | Upload ulang folder |

- **GitHub Pages (rekomendasi Edo):** pemilik membuat repo sendiri di github.com (mis. `education-delivery`) — repo harus dibuat pemilik sendiri karena GitHub App yang terhubung tidak bisa membuat repo di akun personal (403); push file ke branch `main`; Settings → Pages → Source: Deploy from a branch → Branch: main → folder: / (root); tampil di `https://<username>.github.io/education-delivery/` setelah 1–2 menit.
- **Netlify Drop / Cloudflare Pages:** alternatif tercepat (drag & drop folder) kalau pemilik ingin langsung tayang tanpa urusan repo.
- Domain/URL final diputuskan pemilik. Jangan daftarkan domain atau buat akun hosting atas nama Education Delivery tanpa persetujuan mereka; semua akun (GitHub/Netlify/Cloudflare) dibuat dan dipegang pemilik sendiri. Jangan mempublikasikan apa pun sebelum pemilik menyetujui isi website dan memilih opsi deployment.

**Checklist sebelum deploy:** semua link (Instagram @educationdelivery, alamat) sudah diklik dan benar; form sudah diuji (tidak mengirim ke alamat/nomor yang salah); tampilan dicek di HP (Android & iPhone) dan desktop; data dummy/teks contoh sudah dihapus dan diganti data asli; nomor telepon, alamat, dan jam layanan sudah benar; `index.html` di root folder; nama file/gambar huruf kecil tanpa spasi.

## 9. Yang Butuh Masukan Pemilik (jangan diisi sendiri)

| # | Yang dibutuhkan | Status |
|---|---|---|
| 1 | **Harga asli Art Class** | Belum ada — jangan tulis angka apa pun sampai ada daftar harga resmi |
| 2 | **Testimoni asli** orang tua (dengan izin) | Belum ada — jangan tulis testimoni palsu; masuk Fase 2 |
| 3 | **Nomor WhatsApp resmi** (bila ada) | **Tidak ada nomor WA terverifikasi** — kontak resmi hanya DM Instagram @educationdelivery; jangan mengarang nomor. Formulir memakai kontak IG/HP orang tua, bukan nomor WA bisnis |
| 4 | **Foto asli** kegiatan/kelas dan logo (file logo perisai 4 kuadran) + **foto karya anak untuk galeri** (6 slot di `galeri.html`) | Belum ada file foto asli — jangan pakai foto stok anak tanpa izin pemilik |
| 5 | Detail jadwal operasional (hari/jam layanan) | Belum pasti — sampai ada, FAQ menjawab "tanyakan via DM" |
| 6 | Area jangkauan home visit di luar Setiabudi | Belum pasti |
| 7 | Persetujuan isi website + pilihan opsi deployment (§8) | Menunggu pemilik/Ridzki |

---

## Keputusan Teknis (Fajar — penyelesaian konflik antar dokumen)

| # | Konflik | Keputusan final |
|---|---|---|
| K1 | **Nama key localStorage:** Bima menulis `ed_booking_history`, Putri menulis `ed_bookings` | **Pakai `ed_bookings`** (Putri). Satu key untuk semua booking; nama lebih pendek dan konsisten dengan key master `ed_programs` / `ed_kelas` / `ed_tutors`. Bima dinyatakan kedaluwarsa untuk penamaan ini. |
| K2 | **Skema field booking:** Bima memakai camelCase tanpa id/status (`namaOrtu`, `namaAnak`, …), Putri memakai snake_case lengkap dengan `id`, `status`, `dibuat_pada`, `kelas_id`, `catatan` | **Pakai skema Putri** (§5) sebagai kanonik. Alasan: ada `id` + `status` yang dibutuhkan alur `baru → dikonfirmasi → selesai/dibatalkan`, dan konsisten dengan migrasi ke MySQL/Postgres nanti. |
| K3 | **Kontak via WhatsApp vs DM IG:** panduan desain Sinta menyebut field wajib "nomor WhatsApp" dan pesan sukses "Tim kami akan menghubungi via WhatsApp"; checklist Edo menyebut link WhatsApp | **Kontak resmi hanya DM Instagram** (@educationdelivery via http://s.id/educationdelivery). Tidak ada nomor WA bisnis yang terverifikasi. Formulir meminta kontak orang tua (IG dan/atau HP), dan pesan sukses berbunyi "Terima kasih! Silakan lanjutkan ke DM Instagram untuk konfirmasi." Sinta/Edo dikoreksi untuk poin ini. |
| K4 | **Kelas/Jadwal:** Putri memodelkan `kelas_id` + kuota, tapi formulir Bima hanya meminta jadwal yang diinginkan (hari + jam) tanpa pilihan kelas | **MVP: `jadwal_diminta` saja; `kelas_id` boleh `null`.** Belum ada data kelas/jadwal resmi dari pemilik, jadi tidak ada pilihan kelas di MVP. Validasi kuota dan pilihan kelas aktif di Fase 2 bersama kalender ketersediaan tutor. |
| K5 | **Alamat lengkap di formulir:** panduan Sinta melarang minta alamat lengkap sebelum booking dikonfirmasi ("form panjang: maks 5–6 field"), Bima + Putri mewajibkan alamat rumah | **Alamat lengkap tetap wajib di MVP.** Home visit tidak bisa dijadwalkan tanpa alamat; Bima + Putri (2 sumber, kebutuhan fungsional) mengalahkan aturan ringkas form Sinta. Kompensasi: total field tetap 7–8 dan form satu kolom sesuai panduan Sinta. |
| K6 | **Retensi riwayat booking:** Bima menulis riwayat "tetap terlihat saat orang tua kembali", Dewi menulis data dihapus otomatis setelah terkirim (maks. 7 hari) | **Ikuti Dewi (keamanan mengalahkan kenyamanan).** Riwayat hanya tampil sebelum terkirim; setelah tombol DM ditekan, data dihapus dari perangkat. Sisa data yang belum terkirim maksimal 7 hari, lalu dihapus otomatis. Tombol "Hapus data saya di perangkat ini" tetap wajib. |
| K7 | **Urutan section:** Sinta menulis Hero → Layanan → Program → Cara Daftar → FAQ → Kontak; Bima menulis anchor beranda → tentang → program → cara-daftar → booking → faq → kontak | **Pakai urutan Bima (§4),** dengan "Layanan" bukan section tersendiri melainkan chip di hero + poin di kartu program. Alasan: booking dan tentang harus punya anchor sendiri. |

*Sumber: `sections/arsitektur-bima.md`, `sections/data-putri.md`, `sections/keamanan-dewi.md`, `sections/deployment-edo.md`, `desain.md` (semua 9 Nov 2026).*
