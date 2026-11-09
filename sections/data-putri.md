# Model Data — Education Delivery
*Disusun oleh Putri (Database, Lantai 2 Mission Control) — 9 Nov 2026*
*Sumber: info Instagram @educationdelivery. Tidak ada harga/testimoni terverifikasi — tidak dicantumkan.*

## 1. Entitas + Field

### Program
Program kelas yang ditawarkan (Baby Class, Toddler Class, Art Class).

| Field | Tipe | Contoh |
|---|---|---|
| id | string | `baby-class` |
| nama | string | Baby Class |
| deskripsi | string | Kelas stimulasi untuk bayi |
| kategori_usia | string | 0–12 bulan |
| layanan | string[] | Sensory Play, Movement Play |

### Kelas / Jadwal
Sesi kelas yang bisa dipilih orang tua.

| Field | Tipe | Contoh |
|---|---|---|
| id | string | `kelas-001` |
| program_id | string | `toddler-class` |
| tanggal | date | 2026-11-12 |
| jam_mulai | time | 09:00 |
| jam_selesai | time | 10:00 |
| kuota | number | 6 |
| terisi | number | 3 |
| tutor_id | string | `tutor-01` |

### Booking / Pendaftaran
Pendaftaran home visit oleh orang tua.

| Field | Tipe | Contoh |
|---|---|---|
| id | string | `BK-20261109-001` |
| nama_orang_tua | string | Sari Wijaya |
| nama_anak | string | Nara |
| usia_anak_bulan | number | 18 |
| program_id | string | `toddler-class` |
| kelas_id | string | `kelas-001` |
| jadwal_diminta | date | 2026-11-12 |
| alamat_rumah | string | Jl. Karet Raya RT 06 RW 05, Setiabudi, Jakarta 15418 |
| kontak | string | @sariwijaya (IG) / 0812-xxxx-xxxx (WA) |
| catatan | string | Anak alergi cat — pakai cat aman |
| status | string | baru |
| dibuat_pada | datetime | 2026-11-09T13:58:00+07:00 |

### Tutor
Pengajar home visit.

| Field | Tipe | Contoh |
|---|---|---|
| id | string | `tutor-01` |
| nama | string | Kak Rani |
| spesialisasi | string[] | Sensory Play, Toddler Class |
| kontak | string | @rani.tutor (IG) |

### Orang Tua / Anak
Profil keluarga (opsional di MVP; cukup dari data booking).

| Field | Tipe | Contoh |
|---|---|---|
| id | string | `ortu-001` |
| nama_orang_tua | string | Sari Wijaya |
| kontak | string | @sariwijaya (IG) |
| anak | object[] | [{ nama: "Nara", usia_bulan: 18 }] |

## 2. Relasi Antar Entitas
- Satu **Program** punya banyak **Kelas/Jadwal** (1:N).
- Satu **Kelas/Jadwal** diisi satu **Tutor**; satu Tutor mengajar banyak Kelas (1:N).
- Satu **Booking** memilih satu **Program** dan satu **Kelas/Jadwal** (N:1).
- Satu **Orang Tua** bisa punya banyak **Anak** dan banyak **Booking** (1:N).

## 3. Status Booking
`baru` → `dikonfirmasi` → `selesai`
`baru` → `dibatalkan` (oleh orang tua/admin, kapan saja sebelum selesai)
`dikonfirmasi` → `dibatalkan` (bila jadwal batal)

## 4. Penyimpanan

### MVP: localStorage browser
Satu key `ed_bookings` berisi array JSON booking. Contoh 1 booking:

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

Program, kelas, dan tutor disimpan sebagai key terpisah (`ed_programs`, `ed_kelas`, `ed_tutors`) dengan struktur yang sama seperti tabel di atas.

### Nanti: backend sungguhan (MySQL / Postgres)
- Setiap entitas menjadi 1 tabel; `id` jadi PRIMARY KEY (string/UUID atau auto-increment).
- `program_id`, `kelas_id`, `tutor_id` menjadi FOREIGN KEY dengan relasi sesuai bagian 2.
- `status` jadi ENUM (`baru`, `dikonfirmasi`, `selesai`, `dibatalkan`).
- `dibuat_pada` jadi TIMESTAMP DEFAULT NOW().
- Tambah tabel `users/admin` untuk login admin; tambah kolom `harga` di Program hanya bila harga resmi sudah terverifikasi.
- Migrasi: ekspor JSON localStorage → import ke tabel (satu baris per booking), lalu validasi ulang.

## 5. Validasi Data Penting
- **Wajib diisi:** nama orang tua, nama anak, usia anak, program, jadwal yang diinginkan, alamat rumah, kontak.
- **Usia anak:** angka bulat dalam bulan, 0–72 bulan (0–6 tahun); tolak teks atau angka negatif.
- **Jadwal:** tanggal harus hari ini atau sesudahnya — tidak boleh di masa lalu; jam harus dalam jam layanan.
- **Kontak:** minimal satu dari DM Instagram (@username) atau nomor WhatsApp (diawali 08 / +62, 10–14 digit).
- **Program & kelas:** `program_id` dan `kelas_id` harus ada di data master; kelas yang kuotanya penuh (`terisi >= kuota`) tidak bisa dipilih.
- **Duplikasi:** satu anak + satu kelas yang sama tidak boleh terdaftar dua kali (cek `nama_anak + kelas_id`).
