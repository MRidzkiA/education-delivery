# Arsitektur & Daftar Fitur — Aplikasi/Website Education Delivery

**Disusun oleh:** Bima (Arsitek, Lantai 2 Mission Control)
**Tanggal:** 9 November 2026
**Status:** Dokumen arsitektur v1 — dasar pembangunan aplikasi baru (bukan revisi website informasional lama)

---

## 1. Gambaran Produk

Education Delivery adalah layanan les privat *home visit* untuk bayi dan anak di Setiabudi, Jakarta — guru datang ke rumah orang tua. Aplikasinya adalah website yang berfungsi sebagai katalog program + alat pendaftaran: orang tua membaca program (Baby Class, Toddler Class, Art Class), memahami cara daftar, lalu mengisi formulir booking. Berbeda dari website informasional lama (hanya menampilkan info), aplikasi baru **menyimpan data booking** dan **meneruskannya ke DM Instagram** pemilik, mengikuti alur yang sudah berjalan: DM IG → ceritakan kebutuhan anak → pilih program & jadwal → guru datang ke rumah.

---

## 2. Peran Pengguna

| Peran | Yang bisa dilakukan |
|---|---|
| **Orang tua (pengunjung)** | Melihat program & cara daftar, mengisi formulir booking, melihat riwayat booking-nya sendiri (tersimpan di perangkatnya), membuka DM Instagram untuk konfirmasi |
| **Admin / tutor (pemilik)** | Menerima booking lewat DM Instagram (di v1 belum ada panel admin — lihat Fase 2), menghubungi orang tua untuk konfirmasi jadwal |

> Catatan: v1 tidak punya sistem login. Admin bekerja lewat DM Instagram yang sudah jadi kanal resmi bisnis ini.

---

## 3. Daftar Fitur

### MVP — wajib di website pertama

| # | Fitur | Keterangan |
|---|---|---|
| 1 | Hero + tentang | Nama, motto "Nurturing Growth, Creativity, Joyful", tagline "Education Home Visit Specialist", tombol ke booking & Instagram |
| 2 | Program | Tiga kartu program: Baby Class (bayi), Toddler Class (balita), Art Class (anak kreatif); tiap kartu berisi layanan terkait: Sensory Play, Fun Activities, Movement Play |
| 3 | Formulir booking | Field: nama orang tua, nama anak, usia anak, program (pilih 1 dari 3), jadwal yang diinginkan (hari + jam), alamat lengkap, kontak (IG/HP orang tua). Validasi wajib isi semua field sebelum kirim |
| 4 | Penyimpanan booking | Data booking disimpan di `localStorage` (riwayat di perangkat orang tua) + tombol "Lanjutkan ke DM Instagram" yang membuka tautan resmi http://s.id/educationdelivery dengan pesan booking terisi otomatis |
| 5 | Cara daftar | 4 langkah bergambar: DM IG → ceritakan kebutuhan anak → pilih program & jadwal → guru datang ke rumah |
| 6 | FAQ | Pertanyaan umum seputar home visit, program, jadwal (jawaban hanya dari fakta terverifikasi; yang belum pasti ditandai "tanyakan via DM") |
| 7 | Kontak + link Instagram | Kartu kontak: DM @educationdelivery, tautan http://s.id/educationdelivery, alamat Jl. Karet Raya RT 06 RW 05, Kec. Setiabudi, Jakarta 15418 |
| 8 | Footer alamat | Alamat lengkap + link Instagram di setiap halaman |

### Fase 2 — nanti (setelah MVP jalan)

- Panel admin sederhana (login) untuk melihat daftar booking yang masuk
- Kalender ketersediaan tutor & jadwal yang sudah terisi
- Notifikasi otomatis ke admin saat ada booking baru (butuh backend)
- Galeri kegiatan & profil tutor
- Pembayaran / DP booking online
- Testimoni orang tua (hanya yang asli, dengan izin)

### Butuh info dari pemilik (jangan diisi sendiri)

- **Harga tiap program** — tidak ada harga terverifikasi; jangan tulis angka apa pun sampai pemilik memberi daftar harga resmi.
- **Testimoni** — tidak ada testimoni terverifikasi; jangan tulis testimoni palsu.
- **Nomor WhatsApp** — TIDAK ada nomor WA terverifikasi; kontak resmi hanya DM Instagram @educationdelivery. Jangan mengarang nomor.
- Detail jadwal operasional (hari/jam layanan) dan area jangkauan home visit di luar Setiabudi.

---

## 4. Halaman / Layar

**Keputusan: satu halaman panjang (single-page) dengan anchor.**

Alasan:
- Kontennya sedikit (8 bagian MVP) — satu halaman cukup dan tidak membuat pengunjung tersesat.
- Mayoritas pengunjung datang dari Instagram lewat HP; satu halaman yang di-scroll lebih cepat daripada pindah-pindah halaman.
- Formulir booking harus selalu mudah dijangkau — tombol "Booking" di header cukup meng-scroll ke bawah, tanpa memuat halaman baru.
- Lebih murah & sederhana di-hosting statis (tanpa routing server).

Struktur anchor: `#beranda` (hero) → `#tentang` → `#program` → `#cara-daftar` → `#booking` → `#faq` → `#kontak`. Header sticky dengan navigasi anchor + tombol "Booking Sekarang". Jika konten bertambah besar di Fase 2 (panel admin, galeri), baru dipecah jadi multi-halaman.

---

## 5. Teknologi yang Dipakai

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Markup & gaya | HTML + CSS statis (satu file `index.html` + `styles.css`) | Cepat, murah, tidak butuh server; sesuai skala bisnis kecil; website lama sudah membuktikan pendekatan ini bekerja |
| Interaksi | JavaScript vanilla (tanpa framework) | Formulir + localStorage + validasi tidak butuh React/Vue; tanpa build step, mudah dirawat siapa pun |
| Penyimpanan booking | `localStorage` di browser pengunjung | Tanpa backend dulu: tidak ada biaya server, tidak ada risiko kebocoran data di server, riwayat booking tetap terlihat saat orang tua kembali |
| Penerusan ke pemilik | Tautan ke DM Instagram via http://s.id/educationdelivery | Mengikuti alur bisnis yang sudah berjalan (DM IG adalah kanal resmi); tanpa backend, tidak ada cara lain yang andal untuk memberi tahu pemilik |
| Font & aset | Google Fonts (Baloo 2 + Plus Jakarta Sans, sama seperti website lama), aset gambar lokal di `assets/` | Konsisten dengan identitas visual website lama; aset lokal agar tidak bergantung pada hotlink |
| Hosting | Hosting statis apa pun (GitHub Pages / Netlify / hosting biasa) | Tanpa backend = bisa di-host gratis; keputusan hosting menunggu persetujuan Ridzki — **jangan publish tanpa izin** |

**Yang sengaja TIDAK dipakai di v1:** backend/server, database, sistem login, framework JS, payment gateway. Semuanya masuk Fase 2 bila volume booking sudah membenarkan biayanya. Prinsipnya: bangun yang paling sederhana yang menyelesaikan alur "orang tua → booking → DM pemilik" dengan benar.

---

## 6. Struktur File yang Diusulkan

```
~/workspace/education-delivery-app/
├── index.html                  # Satu halaman: hero, tentang, program, cara daftar,
│                               #   formulir booking, FAQ, kontak, footer
├── styles.css                  # Semua gaya (tema terang, warna logo: biru, toska,
│                               #   hijau, merah + pita emas; mobile-first)
├── app.js                      # Validasi formulir, simpan localStorage,
│                               #   susun pesan DM Instagram, tampilkan riwayat booking
├── assets/
│   ├── logo.svg                # Logo perisai 4 kuadran (tunas biru, buku toska,
│   │                           #   lampu hijau, otak merah + pita emas)
│   └── program/                # Gambar tiap program (baby, toddler, art)
│       ├── baby-class.jpg
│       ├── toddler-class.jpg
│       └── art-class.jpg
├── sections/
│   ├── arsitektur-bima.md      # Dokumen ini
│   └── fitur-dan-kebutuhan-sistem.md   # Dokumen Raka (koordinator) — bila ada
└── README.md                   # Cara menjalankan (buka index.html) + status info
                                #   yang masih ditunggu dari pemilik
```

**Aturan penamaan data booking (localStorage):** key `ed_booking_history`, isi array JSON objek `{ namaOrtu, namaAnak, usiaAnak, program, jadwal, alamat, kontak, dibuatPada }`. Tidak menyimpan data sensitif lain.
