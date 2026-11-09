# Panduan Desain — Education Delivery (Simple Soft)

> **Untuk:** Dimas (Mobile Developer) — pakai token di bawah ini langsung di kode.
> **Suasana:** terang, hangat, lembut, ramah anak & orang tua. "Simple soft": sedikit warna, banyak ruang kosong, semua terasa ringan.
> **Motto:** "Nurturing Growth, Creativity, Joyful" — Education Home Visit Specialist.
> **Referensi gaya:** website informasional lama `~/workspace/your_files/education-delivery/education-delivery.html` (palet krem hangatnya dipakai, tapi JANGAN ditiru persis — versi baru lebih simpel & lebih lembut).

---

## 1. Palet Warna (HEX)

Selalu pakai token ini — jangan hardcode warna lain.

### Latar & permukaan

| Token | HEX | Pakai untuk |
|---|---|---|
| `--bg` | `#FFF9F0` | Latar utama halaman (krem hangat) |
| `--bg-soft` | `#FFF3DF` | Latar section selang-seling / area lembut |
| `--surface` | `#FFFFFF` | Kartu, panel, form |
| `--surface-2` | `#FEF6E9` | Chip, badge, area dalam kartu |
| `--line` | `#F0DFC2` | Border tipis kartu & pemisah |

### Teks

| Token | HEX | Pakai untuk |
|---|---|---|
| `--ink` | `#1C2B4A` | Judul & teks utama (navy gelap, bukan hitam pekat) |
| `--ink-2` | `#4A5878` | Paragraf / deskripsi |
| `--muted` | `#6B7794` | Teks kecil, caption, footer |

### Aksen program (versi LEMBUT dari 4 kuadran logo)

Logo memakai biru–toska–hijau–merah yang pekat; di UI pakai versi lembutnya sebagai warna utama, dan versi pekatnya hanya untuk teks kecil / ikon di atas latar lembut.

| Program / layanan | Warna utama (lembut) | Latar lembut | Teks/ikon di atasnya |
|---|---|---|---|
| Baby Class — biru (tunas) | `#5B8DEF` | `#E1EDFC` | `#0063C6` |
| Toddler Class — toska (buku) | `#2FB3A6` | `#DDF3F0` | `#1B968A` |
| Art Class — merah (otak) | `#F0725C` | `#FFE8E3` | `#D63A28` |
| Movement Play — hijau (lampu) | `#58B947` | `#E2F4DC` | `#3F9C35` |
| Emas (pita logo, aksen kecil saja) | `#E9A800` | `#FFF0C2` | `#8A6400` |

**Aturan:** satu kartu = satu warna aksen saja. Jangan campur 4 warna dalam satu komponen.

### Tombol

| Token | HEX | Pakai untuk |
|---|---|---|
| `--btn-primary-bg` | `#E8402F` | Tombol utama (CTA: "Daftar Sekarang", "Booking") — merah lembut, teks putih `#FFFFFF` |
| `--btn-primary-hover` | `#D63A28` | Hover / tekan |
| `--btn-secondary-bg` | `#FFFFFF` | Tombol sekunder — teks `#1C2B4A`, border 1.5px `#F0DFC2` |
| `--btn-dark-bg` | `#16264A` | Tombol di header / footer (navy) — teks putih |
| `--success` | `#3F9C35` | Status berhasil / centang |
| `--error` | `#D63A28` | Validasi form gagal (teks merah + border merah) |

**Kontras:** teks putih di atas `#E8402F` dan `#16264A` lolos kontras. Jangan pakai teks kuning di atas putih, atau teks putih di atas latar lembut.

---

## 2. Tipografi (Google Fonts)

### Font pilihan

- **Judul:** **Baloo 2** (600–800) — bulat, ramah, berkesan anak-anak tapi tetap rapi.
- **Isi/UI:** **Plus Jakarta Sans** (400–700) — bersih, sangat mudah dibaca di HP.

```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.

### Ukuran

| Elemen | Mobile (≤ 560px) | Desktop (≥ 1024px) |
|---|---|---|
| H1 hero | 32px / 2rem | 56–62px |
| H2 section | 28px | 36–40px |
| H3 kartu | 20–21px | 22–23px |
| Isi/paragraf | 15–16px | 16–17px |
| Teks kecil/caption | 13–14px | 13–14px |
| Tombol | 16px, weight 700–800 | 16px |

- **Line-height:** judul 1.15, isi 1.65. Jangan pernah di bawah 1.5 untuk paragraf.
- **Teks isi minimal 15px di mobile** — tidak ada teks 12px untuk isi penting (hanya label kecil/kaki halaman boleh 12–13px).
- Judul pakai Baloo 2, **maksimal 2 baris** di mobile; kalau lebih, pendekkan kalimatnya, bukan kecilkan fontnya.

---

## 3. Prinsip Layout

### Mobile-first (pengguna utama: orang tua, buka dari HP)

1. **Desain untuk lebar 360px dulu**, baru lebarkan ke desktop. Semua layout 1 kolom di mobile; grid 2–3 kolom hanya di ≥ 768px.
2. **Konten max-width 1120px**, padding samping 16px (mobile) / 20px (desktop). Jangan tempel ke tepi layar.
3. **Satu ide per layar:** satu section = satu pesan. Urutan: Hero → Layanan → Program → Cara Daftar → FAQ → Kontak/Footer.

### Spasi & ritme

- Jarak antar section: **64px** (mobile 48px).
- Jarak antar kartu dalam grid: **16–18px**.
- Padding dalam kartu: **20–22px**.
- Jarak judul ke paragraf di bawahnya: **10–12px**.
- **Satu aksi utama per section** — jangan taruh 3 tombol berdampingan di mobile.

### Radius sudut & bayangan (ciri khas "soft")

- Kartu besar: **radius 22–26px**; kartu kecil/chip: **radius 16px**; tombol & badge: **pill (999px)**.
- Bayangan lembut, satu saja: `box-shadow: 0 10px 30px rgba(28, 43, 74, 0.08)`.
- Bayangan besar (hero/CTA): `0 20px 50px rgba(28, 43, 74, 0.13)`.
- Border kartu: **1px solid `#F0DFC2`** — jangan pakai border tebal atau garis hitam.

### Kartu program

- Foto di atas (tinggi ±215px, `object-fit: cover`, sudut atas membulat mengikuti kartu), isi di bawah: badge usia (pill putih di atas foto, pojok kiri bawah), judul, 1 kalimat deskripsi, daftar 3–4 poin dengan centang ✓ warna aksen program, link "Lihat detail →" warna aksen.
- Kartu sama tinggi dalam satu baris (flex column, tombol/link menempel ke bawah kartu).

### Tombol ramah jempol

- Tinggi minimal **48px** (padding 14px vertikal, 22px horizontal), radius pill.
- Jarak antar tombol minimal **12px**; di mobile tombol utama selebar layar (full-width) di hero & form.
- Area ketuk elemen interaktif (link, ikon, accordion) minimal **44×44px**.

---

## 4. Komponen Kunci

### Header
- Sticky di atas, latar krem `#FFF9F0` transparan 88% + blur 12px, border bawah 1px `#F0DFC2`. Logo perisai 4 kuadran di kiri + nama "Education Delivery" (Baloo 2, 800) + sub-label "HOME VISIT SPECIALIST" kecil. Di mobile: sembunyikan semua link nav kecuali tombol CTA "Hubungi Kami" (navy).

### Hero
- Latar krem `#FFF9F0`, judul besar Baloo 2 dengan 1–2 kata diberi warna aksen (maksimal 3 warna dalam satu judul). Di bawahnya: 1 paragraf pendek (maks. 2 baris di desktop), 2 tombol (primer merah + sekunder putih), lalu 3–4 chip layanan (Sensory Play, Fun Activities, Movement Play, Belajar di Rumah). Foto anak/guru di kanan (desktop) atau di bawah teks (mobile), sudut 28px + border putih 6px.

### Kartu program
- Ikuti pola di §3 (foto + badge usia + deskripsi + centang + link). Baby Class = biru, Toddler Class = toska, Art Class = merah. Satu kartu satu warna aksen, latar kartu putih, bayangan lembut.

### Formulir booking
- Satu kolom, label di atas input (bukan placeholder sebagai pengganti label). Input: tinggi 52px, radius 16px, border 1.5px `#F0DFC2`, latar putih, fokus = border warna aksen program + bayangan lembut. Field wajib: nama orang tua, nomor WhatsApp, usia anak, program (pilih 1 dari 3 kartu radio), area/jadwal. Tombol kirim full-width merah. Pesan error merah `#D63A28` di bawah field, jangan hanya warna — sertakan teks. Setelah kirim: kartu sukses hijau lembut `#E2F4DC` + teks "Terima kasih! Tim kami akan menghubungi via WhatsApp."

### FAQ (accordion)
- Daftar pertanyaan, tiap item kartu putih radius 16px, border `#F0DFC2`, jarak antar item 12px. Pertanyaan Baloo 2 600, ikon +/− atau chevron warna aksen di kanan. Jawaban muncul di bawah dengan animasi halus (±200ms), teks `#4A5878`. Hanya satu item terbuka dalam satu waktu. Maksimal 6–8 pertanyaan.

### Footer
- Latar `#FEF6E9`, border atas 1px `#F0DFC2`. Logo + motto "Nurturing Growth, Creativity, Joyful" + alamat (Jl. Karet Raya RT 06 RW 05, Kec. Setiabudi, Jakarta) + Instagram @educationdelivery + link navigasi. Baris bawah: © tahun + "Education Delivery" dengan teks `#6B7794` 13px. Di mobile semua menumpuk vertikal, rata kiri.

---

## 5. Hal yang DIHINDARI

- ❌ **Terlalu ramai:** maksimal 3 warna aksen per layar; jangan tampilkan 4 kuadran logo sekaligus di satu komponen (logo saja yang boleh).
- ❌ **Warna mencolok:** jangan pakai warna logo versi pekat (`#0063C6`, `#EE4036`) sebagai latar blok besar — pakai versi lembutnya. Jangan pakai gradien pelangi atau latar merah/biru penuh.
- ❌ **Teks kecil:** tidak ada isi penting di bawah 15px di mobile; jangan pakai teks abu-abu muda di atas krem.
- ❌ **Terlalu banyak font:** hanya Baloo 2 + Plus Jakarta Sans. Jangan tambah font dekoratif lain.
- ❌ **Bayangan keras / border hitam:** bayangan hanya lembut (opacity ≤ 0.13), border hanya krem `#F0DFC2`.
- ❌ **Animasi berlebihan:** transisi maksimal 300ms, hanya untuk hover/accordion; tidak ada elemen bergerak terus-menerus atau marquee berjalan (kecuali strip info statis).
- ❌ **Form panjang:** maksimal 5–6 field; jangan minta data yang tidak perlu (mis. alamat lengkap sebelum booking dikonfirmasi).

---

## Token Ringkas (copy-paste untuk Dimas)

```css
:root {
  --bg: #FFF9F0; --bg-soft: #FFF3DF; --surface: #FFFFFF; --surface-2: #FEF6E9;
  --line: #F0DFC2; --ink: #1C2B4A; --ink-2: #4A5878; --muted: #6B7794;
  --blue: #5B8DEF; --blue-soft: #E1EDFC; --blue-deep: #0063C6;
  --teal: #2FB3A6; --teal-soft: #DDF3F0; --teal-deep: #1B968A;
  --green: #58B947; --green-soft: #E2F4DC; --green-deep: #3F9C35;
  --red: #F0725C; --red-soft: #FFE8E3; --red-deep: #D63A28;
  --gold: #E9A800; --gold-soft: #FFF0C2;
  --btn-primary: #E8402F; --btn-primary-hover: #D63A28; --btn-dark: #16264A;
  --radius: 22px; --radius-sm: 16px; --radius-pill: 999px;
  --shadow: 0 10px 30px rgba(28,43,74,.08);
  --shadow-lg: 0 20px 50px rgba(28,43,74,.13);
}
```

*Disusun oleh Sinta (UI/UX Designer, Lantai 2) — 9 Nov 2026.*
