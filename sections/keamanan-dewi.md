# Catatan Keamanan — Education Delivery

**Disusun oleh:** Dewi (Security, Lantai 2 — Mission Control)
**Tanggal:** 9 November 2026
**Lingkup:** Website statis HTML + CSS + JS (tanpa backend). Formulir booking (nama orang tua, nama anak, usia anak, program, jadwal, alamat rumah, kontak) disimpan di localStorage browser dan diteruskan ke DM Instagram via tautan s.id/educationdelivery.
**Catatan penting:** Tidak ada nomor WhatsApp, harga, atau testimoni terverifikasi — dokumen ini tidak mengarang ketiganya.

---

## 1. Risiko Utama

| # | Risiko | Dampak |
|---|--------|--------|
| 1 | **Data anak bocor** — nama anak, usia, program, dan jadwal adalah data anak (sensitif). Jika tampil atau terkirim ke pihak yang salah, anak bisa dikenali dan dilacak. | Privasi anak dilanggar; risiko penipuan/penculikan; kepercayaan orang tua hilang; kemungkinan masalah hukum (UU Perlindungan Data Pribadi). |
| 2 | **Alamat rumah + kontak orang tua bocor** — alamat rumah dan nomor kontak adalah data pribadi yang bisa dipakai untuk penipuan, spam, atau kunjungan tak diinginkan. | Orang tua dihubungi/didatangi pihak tak dikenal; risiko penipuan mengatasnamakan Education Delivery. |
| 3 | **Data booking orang lain terlihat di perangkat bersama** — localStorage tersimpan di browser; siapa pun yang memakai perangkat yang sama bisa membaca riwayat booking. | Data satu keluarga terlihat oleh keluarga lain / orang lain yang meminjam perangkat. |
| 4 | **Injeksi lewat formulir** — isian formulir (misalnya nama anak) yang ditampilkan kembali tanpa disaring bisa menyisipkan HTML/JS berbahaya. | Script jahat berjalan di browser pengunjung; data bisa dicuri atau halaman dirusak (XSS). |
| 5 | **Data diteruskan tanpa sadar** — tautan ke DM Instagram melewati s.id (pemendek tautan pihak ketiga) dan Instagram; data yang ikut di URL bisa tercatat di pihak ketiga. | Data pribadi tercatat di server pihak ketiga di luar kendali Education Delivery. |

---

## 2. Aturan Wajib di Website MVP

1. **Jangan tampilkan data booking orang lain.** Website tidak boleh menampilkan daftar booking, riwayat booking, atau data siapa pun selain yang sedang mengisi di perangkat itu sendiri. Tidak ada halaman "daftar pendaftar" yang bisa dibuka pengunjung.
2. **Jangan kirim data ke server pihak ketiga tanpa persetujuan.** Data formulir hanya disimpan lokal (localStorage) dan hanya diteruskan ke DM Instagram saat orang tua menekan tombol kirim. Jangan ada pelacak, iklan, atau pengiriman otomatis ke layanan lain.
3. **Validasi semua input formulir.** Batasi panjang isian, tolak karakter HTML/JS (`<`, `>`, `script`), dan tampilkan kembali isian apa pun sebagai teks biasa — jangan pernah sebagai HTML. Validasi di sisi browser saja tidak cukup; anggap semua isian tidak tepercaya.
4. **Jangan simpan data sensitif lebih lama dari perlu.** Data booking di localStorage harus dihapus otomatis setelah terkirim (atau maksimal 7 hari), dan tidak boleh ada salinan cadangan di browser.
5. **Sediakan tombol hapus data booking di perangkat sendiri.** Di dekat formulir, tampilkan tombol "Hapus data saya di perangkat ini" yang menghapus seluruh data booking dari localStorage dan memberi konfirmasi bahwa data sudah terhapus.
6. **Jangan minta data yang tidak diperlukan.** Formulir hanya meminta yang dibutuhkan untuk booking (nama orang tua, nama anak, usia, program, jadwal, alamat, kontak). Jangan minta foto anak, KTP, atau data lain.

---

## 3. Privasi — Teks Persetujuan di Bawah Formulir

Tampilkan teks berikut tepat di bawah formulir booking, sebelum tombol kirim:

> Dengan mengirim formulir ini, saya setuju data yang saya isi (nama saya, nama dan usia anak saya, program, jadwal, alamat rumah, dan kontak) dipakai hanya untuk memproses booking les ini. Data disimpan sementara di perangkat saya sendiri dan diteruskan ke Education Delivery lewat DM Instagram saat saya menekan tombol kirim. Data tidak dibagikan ke pihak lain dan tidak dipakai untuk iklan. Saya bisa menghapus data dari perangkat saya kapan saja dengan tombol "Hapus data saya di perangkat ini".

**Apa yang terjadi dengan data yang diisi:**
- Disimpan sementara di browser perangkat pengisi (localStorage) — bukan di server Education Delivery, karena belum ada backend.
- Saat tombol kirim ditekan, data diteruskan ke DM Instagram Education Delivery lewat tautan s.id/educationdelivery. Setelah terkirim, data di perangkat dihapus.
- Education Delivery hanya memakai data itu untuk menghubungi dan menjadwalkan les. Data tidak dijual, tidak dibagikan, dan tidak dipakai untuk iklan.

---

## 4. Yang Harus Dilakukan Sebelum Ada Backend Sungguhan

1. **HTTPS wajib.** Website harus diakses lewat HTTPS (bukan HTTP) sebelum formulir apa pun aktif, supaya data tidak bisa disadap di perjalanan.
2. **Autentikasi admin.** Jika ada halaman admin untuk melihat booking, wajib ada login (kata sandi kuat + sebaiknya autentikasi dua faktor). Tanpa login, tidak ada yang boleh melihat data booking.
3. **Enkripsi.** Data booking di database harus dienkripsi saat disimpan (encryption at rest) dan hanya bisa dibaca lewat koneksi terenkripsi (TLS).
4. **Hapus data berkala.** Tetapkan masa retensi (misalnya booking yang sudah selesai dihapus maksimal 90 hari kemudian) dan jalankan penghapusan otomatis secara berkala.
5. **Batasi akses.** Hanya staf yang benar-benar perlu (misalnya admin penjadwalan) yang boleh melihat data booking; catat siapa mengakses apa (audit log).
6. **Jangan simpan data anak lebih dari yang perlu.** Saat backend ada, simpan usia anak sebagai angka saja (bukan tanggal lahir lengkap) dan jangan simpan alamat rumah lebih lama dari masa les berjalan.
7. **Uji keamanan sebelum rilis backend.** Lakukan pengetesan dasar: coba isi formulir dengan kode HTML/JS, coba buka data booking tanpa login, dan pastikan data lama benar-benar terhapus.
