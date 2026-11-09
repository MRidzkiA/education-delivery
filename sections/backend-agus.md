# Spesifikasi Backend — Education Delivery (Rencana Fase Berikutnya)

**Disusun oleh:** Agus (Backend Developer, Lantai 2 Mission Control)
**Tanggal:** 9 November 2026
**Status:** Dokumen spesifikasi saja — TIDAK ada backend yang dibangun sekarang, TIDAK ada kode, TIDAK ada deploy/push
**Dasar:** `fitur-dan-kebutuhan-sistem.md` (Fajar) dan `sections/data-putri.md` (Putri)
**Kontak resmi:** DM Instagram @educationdelivery via http://s.id/educationdelivery (tidak ada nomor WA bisnis terverifikasi)

---

## 1. Gambaran

**MVP saat ini tanpa backend.** Website adalah halaman statis (HTML + CSS + JS vanilla). Booking disimpan di browser orang tua di `localStorage` key `ed_bookings` (array JSON, skema snake_case Putri), lalu orang tua meneruskannya sendiri lewat tombol "Lanjutkan ke DM Instagram". Tidak ada server, tidak ada database, tidak ada login, tidak ada panel admin.

**Backend dibutuhkan saat:** admin/pemilik perlu melihat semua booking yang masuk dari mana saja (bukan hanya dari perangkat orang tua), mengubah status booking, dan menerima notifikasi tanpa harus menunggu DM IG dibuka satu per satu. Pemicunya: volume booking naik sehingga DM IG saja tidak lagi cukup untuk melacak siapa sudah dikonfirmasi, siapa sudah selesai, dan siapa batal.

**Prinsip:** backend hanya menggantikan penyimpanan + alur status. Kontak dengan orang tua tetap lewat DM IG (kanal resmi). Backend tidak menambah data yang diminta dari orang tua (tetap 7–8 field yang sama), tidak menyimpan foto anak/KTP, dan tidak menampilkan data booking ke pengunjung lain.

**Teknologi yang diusulkan (Fase 2, bila disetujui):** REST API JSON + MySQL/Postgres (sesuai rencana Putri), di-host di layanan gratis yang sama dengan website statis bila memungkinkan. Keputusan teknologi final menunggu persetujuan pemilik/Ridzki.

---

## 2. Endpoint API yang Diusulkan (REST, JSON)

Base URL contoh: `https://api.educationdelivery.example/v1` (URL final diputuskan saat backend benar-benar dibangun). Semua response JSON dengan bentuk umum:

```json
{ "ok": true, "data": { ... }, "error": null }
```

Error: `{ "ok": false, "data": null, "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": { "usia_anak_bulan": "Usia harus 0–72 bulan" } } }`

### 2.1 Buat booking — `POST /bookings` (publik, tanpa login)

Request:

```json
{
  "nama_orang_tua": "Sari Wijaya",
  "nama_anak": "Nara",
  "usia_anak_bulan": 18,
  "program_id": "toddler-class",
  "kelas_id": null,
  "jadwal_diminta": "2026-11-12",
  "alamat_rumah": "Jl. Karet Raya RT 06 RW 05, Setiabudi, Jakarta 15418",
  "kontak": "@sariwijaya (IG)",
  "catatan": "Anak alergi cat — pakai cat aman"
}
```

Response `201 Created` — server mengisi `id` (`BK-YYYYMMDD-NNN`), `status: "baru"`, `dibuat_pada` (timestamp server, zona Asia/Jakarta):

```json
{
  "ok": true,
  "data": {
    "id": "BK-20261109-001",
    "nama_orang_tua": "Sari Wijaya",
    "nama_anak": "Nara",
    "usia_anak_bulan": 18,
    "program_id": "toddler-class",
    "kelas_id": null,
    "jadwal_diminta": "2026-11-12",
    "alamat_rumah": "Jl. Karet Raya RT 06 RW 05, Setiabudi, Jakarta 15418",
    "kontak": "@sariwijaya (IG)",
    "catatan": "Anak alergi cat — pakai cat aman",
    "status": "baru",
    "dibuat_pada": "2026-11-09T13:58:00+07:00"
  },
  "error": null
}
```

Catatan: `kelas_id` boleh `null` di MVP (keputusan K4 Fajar — belum ada data kelas resmi). Setelah Fase 2 (kalender tutor), `kelas_id` wajib bila program dipilih lewat kelas.

### 2.2 Lihat daftar booking (admin) — `GET /admin/bookings` (login admin wajib)

Query params: `?status=baru&page=1&limit=20&sort=dibuat_pada&order=desc` (filter `status` opsional: `baru`, `dikonfirmasi`, `selesai`, `dibatalkan`).

Response `200 OK`:

```json
{
  "ok": true,
  "data": {
    "items": [ { "id": "BK-20261109-001", "nama_orang_tua": "Sari Wijaya", "nama_anak": "Nara", "usia_anak_bulan": 18, "program_id": "toddler-class", "jadwal_diminta": "2026-11-12", "status": "baru", "dibuat_pada": "2026-11-09T13:58:00+07:00" } ],
    "total": 1,
    "page": 1,
    "limit": 20
  },
  "error": null
}
```

Detail satu booking: `GET /admin/bookings/{id}` → `200 OK` dengan objek booking lengkap (termasuk `alamat_rumah`, `kontak`, `catatan`). Tanpa login → `401 Unauthorized`. Bukan admin → `403 Forbidden`.

### 2.3 Ubah status booking — `PATCH /admin/bookings/{id}` (login admin wajib)

Hanya `status` yang boleh diubah lewat endpoint ini. Transisi yang sah (Putri §3):

- `baru` → `dikonfirmasi` | `dibatalkan`
- `dikonfirmasi` → `selesai` | `dibatalkan`
- `selesai` / `dibatalkan` → tidak bisa diubah lagi (terminal)

Request:

```json
{ "status": "dikonfirmasi" }
```

Response `200 OK` — objek booking lengkap dengan status baru. Transisi tidak sah → `422 Unprocessable Entity` (`{ "code": "INVALID_STATUS_TRANSITION" }`). ID tidak ada → `404 Not Found`.

### 2.4 Daftar program/kelas — `GET /programs` dan `GET /kelas` (publik, read-only)

`GET /programs` → daftar program aktif (Baby, Toddler, Art Class) — `id`, `nama`, `deskripsi`, `kategori_usia`, `layanan`. Tanpa harga sampai harga resmi terverifikasi (Fajar §9).

`GET /kelas?program_id=toddler-class` → daftar kelas/jadwal beserta `kuota` dan `terisi` (Fase 2; di MVP endpoint ini mengembalikan daftar kosong karena belum ada data kelas resmi). Kelas penuh (`terisi >= kuota`) tetap tampil dengan penanda penuh dan tidak bisa dipilih.

### 2.5 Hapus booking — `DELETE /admin/bookings/{id}` (login admin wajib)

Menghapus satu booking (dipakai untuk data salah/duplikat atau atas permintaan orang tua). Response `200 OK`: `{ "ok": true, "data": { "id": "BK-20261109-001", "deleted": true }, "error": null }`. ID tidak ada → `404`. Penghapusan dicatat di audit log (siapa, kapan, id apa) — lihat §6.

**Bukan endpoint publik:** orang tua tidak menghapus booking lewat API; mereka menghapus data di perangkatnya sendiri dengan tombol "Hapus data saya di perangkat ini" (localStorage, sesuai catatan Dewi).

---

## 3. Alur Data

```
Formulir (browser)
  → validasi klien (JS, sama seperti MVP sekarang)
  → POST /bookings
  → validasi server (§4 — jangan percaya validasi klien saja)
  → simpan ke tabel bookings (status awal "baru")
  → response 201 + id booking ke orang tua
  → notifikasi admin (lihat di bawah)
  → admin buka panel → GET /admin/bookings?status=baru
  → admin konfirmasi via DM IG ke orang tua
  → PATCH /admin/bookings/{id} { "status": "dikonfirmasi" }
  → setelah les selesai → PATCH ... { "status": "selesai" }
  → retensi: booking selesai dihapus maks. 90 hari kemudian (otomatis, Dewi)
```

**Notifikasi admin:**

- **v1 (saat backend pertama jalan): manual lewat DM IG.** Alur lama tetap jalan: orang tua tetap menekan tombol "Lanjutkan ke DM Instagram" setelah formulir terkirim, sehingga admin tetap menerima booking lewat DM seperti sekarang. Backend di v1 berfungsi sebagai pencatat & pelacak status, bukan sebagai pengganti DM.
- **v2 (setelah v1 stabil): otomatis.** Server mengirim notifikasi ke admin saat `POST /bookings` berhasil (mis. email admin atau pesan ke kanal yang disepakati pemilik). Mekanisme persisnya diputuskan di Fase 2 — tidak ada integrasi notifikasi yang dibangun atau dijanjikan di dokumen ini.

---

## 4. Aturan Validasi Server

Server mengulangi **semua** validasi klien (Putri §5 + Fajar §5). Validasi klien hanya untuk kenyamanan; server adalah garis pertahanan terakhir.

| Field | Aturan |
|---|---|
| `nama_orang_tua`, `nama_anak` | Wajib, string, maks. 100 karakter; tolak kosong/whitespace saja |
| `usia_anak_bulan` | Wajib, integer (angka bulat), 0–72 bulan; tolak teks, desimal, negatif, > 72 |
| `program_id` | Wajib, harus ada di tabel `programs` |
| `kelas_id` | Boleh `null` di MVP; bila diisi harus ada di tabel `kelas` dan `program_id`-nya cocok; kelas penuh (`terisi >= kuota`) tidak bisa dipilih (Fase 2) |
| `jadwal_diminta` | Wajib, format tanggal `YYYY-MM-DD`; harus hari ini atau sesudahnya — tidak boleh di masa lalu; jam (bila ada) dalam jam layanan |
| `alamat_rumah` | Wajib, string, maks. 500 karakter |
| `kontak` | Wajib, minimal satu dari: username IG (`@username`) atau nomor HP (`08…` / `+62…`, 10–14 digit) |
| `catatan` | Opsional, maks. 500 karakter |
| Semua field teks | Tolak/sanitasi karakter HTML/JS (`<`, `>`, `script`); simpan & tampilkan sebagai teks biasa, jangan pernah sebagai HTML (catatan Dewi) |
| Duplikasi | Satu anak + satu kelas yang sama tidak boleh terdaftar dua kali (cek `nama_anak + kelas_id`); bila `kelas_id` null, cek `nama_anak + jadwal_diminta` sebagai pengganti sementara |

Gagal validasi → `400 Bad Request` dengan `error.fields` per field (lihat bentuk error di §2). `id`, `status`, dan `dibuat_pada` **tidak boleh** dikirim klien — selalu dibuat server. Field yang tidak dikenal diabaikan.

---

## 5. Migrasi dari localStorage

Keputusan Fajar (K6): data booking di localStorage **dihapus otomatis setelah terkirim** (atau maksimal 7 hari). Jadi migrasi hanya memindahkan **sisa data yang belum terkirim** — bukan arsip panjang.

**Langkah migrasi (sekali, saat backend pertama aktif):**

1. **Ekspor:** di browser, baca `localStorage.getItem("ed_bookings")` → array JSON booking (skema Putri: snake_case, `id`, `status`, `dibuat_pada`, `kelas_id` boleh `null`). Ekspor juga `ed_programs`, `ed_kelas`, `ed_tutors` bila sudah terisi (data master).
2. **Validasi ulang:** setiap booking diekspor ulang lewat aturan §4 (field wajib lengkap, usia 0–72, tanggal tidak di masa lalu). Baris yang gagal validasi dicatat ke daftar "gagal migrasi" untuk ditinjau manual, **tidak** dimasukkan diam-diam dengan data diubah.
3. **Import:** satu baris per booking ke tabel `bookings` (lihat skema di bawah). `id` lama (`BK-YYYYMMDD-NNN`) dipertahankan sebagai PRIMARY KEY bila belum ada di tabel; bila bentrok, buat id baru dan catat pemetaan lama → baru. `status` dipetakan ke ENUM (`baru`, `dikonfirmasi`, `selesai`, `dibatalkan`); nilai di luar itu ditolak di langkah 2.
4. **Verifikasi:** hitung jumlah baris di tabel vs jumlah item JSON; bandingkan contoh acak 5–10 booking field demi field. Bila cocok, migrasi dinyatakan selesai.
5. **Bersihkan perangkat:** setelah import terverifikasi, hapus `ed_bookings` dari localStorage perangkat itu (data kini tinggal di server). Mulai saat itu formulir menulis langsung ke `POST /bookings`, bukan ke localStorage.

**Skema tabel (MySQL/Postgres, ringkas — dari Putri §4):**

| Tabel | Kolom kunci |
|---|---|
| `programs` | `id` PK, `nama`, `deskripsi`, `kategori_usia`, `layanan` (JSON/array); `harga` ditambah **hanya** bila harga resmi terverifikasi |
| `kelas` | `id` PK, `program_id` FK → programs, `tanggal`, `jam_mulai`, `jam_selesai`, `kuota`, `terisi`, `tutor_id` FK → tutors |
| `bookings` | `id` PK (`BK-…`), `nama_orang_tua`, `nama_anak`, `usia_anak_bulan` INT, `program_id` FK, `kelas_id` FK NULL, `jadwal_diminta` DATE, `alamat_rumah`, `kontak`, `catatan` NULL, `status` ENUM, `dibuat_pada` TIMESTAMP DEFAULT NOW() |
| `tutors` | `id` PK, `nama`, `spesialisasi`, `kontak` |
| `admin_users` | `id` PK, `username` unik, `password_hash`, `dibuat_pada` (lihat §6) |

**Retensi (keputusan Fajar K6 + Dewi):** data yang belum terkirim di localStorage maks. 7 hari lalu dihapus otomatis; setelah pindah ke server, booking berstatus `selesai` dihapus otomatis maks. 90 hari kemudian; booking `dibatalkan` dihapus maks. 30 hari kemudian (disarankan — diputuskan final bersama pemilik). Tidak ada cadangan (backup) data booking di browser.

---

## 6. Kebutuhan Auth Admin + HTTPS

**Login admin (sederhana, Fase 2):**

- Satu akun admin dulu (pemilik); tambah akun bila perlu. Tabel `admin_users`: `username` + `password_hash` (bcrypt/argon2 — **jangan** simpan password teks biasa).
- Login: `POST /admin/login` dengan `{ "username", "password" }` → session/token (httpOnly cookie atau token Bearer berumur pendek, mis. 8 jam). Logout: `POST /admin/logout`.
- Kata sandi kuat (min. 12 karakter, campuran huruf/angka/simbol) dan sebaiknya 2FA bila layanan hosting mendukungnya (Dewi).
- Semua endpoint `/admin/*` menolak tanpa login (`401`) dan tanpa peran admin (`403`). Endpoint publik hanya `POST /bookings`, `GET /programs`, `GET /kelas`.
- **Audit log:** setiap aksi admin (login, ubah status, hapus booking) dicatat: siapa, kapan, aksi apa, id booking apa. Log disimpan min. 90 hari.
- **Rate limiting:** `POST /bookings` dibatasi (mis. maks. 10 kiriman per IP per jam) untuk mencegah spam/banjir booking palsu; login dibatasi (mis. 5 percobaan gagal → kunci 15 menit).

**HTTPS wajib:**

- HTTPS aktif **sebelum** formulir booking aktif di backend (Dewi) — tanpa pengecualian. Semua API hanya lewat HTTPS; HTTP dialihkan ke HTTPS.
- Data di database dienkripsi saat disimpan (at rest, bila hosting mendukung) dan selalu lewat TLS saat transit.
- Header keamanan dasar diaktifkan (mis. `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`).
- Uji keamanan sebelum rilis backend: coba isi HTML/JS di formulir, coba buka `/admin/bookings` tanpa login, pastikan data lama benar-benar terhapus setelah retensi habis.

**Yang dokumen ini TIDAK putuskan (menunggu pemilik/Ridzki):** pilihan hosting backend, URL API final, jumlah akun admin, mekanisme notifikasi otomatis v2, dan harga program.
