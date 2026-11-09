# Opsi Deployment — Website Education Delivery

**Disusun oleh:** Edo (DevOps, Lantai 2)
**Tanggal:** 9 November 2026
**Status:** Dokumen opsi saja — belum ada yang di-deploy atau dipublikasikan.

Website ini statis (HTML + CSS + JS, tanpa backend). File: `index.html`, `styles.css`, `app.js` di `~/workspace/education-delivery-app/`.

---

## Opsi 1: GitHub Pages

Gratis, cocok karena file sudah dikelola di GitHub.

1. Pemilik membuat repository baru sendiri di github.com (misalnya `education-delivery`) — **repo harus dibuat pemilik sendiri**, karena GitHub App yang terhubung tidak bisa membuat repository di akun personal (ditolak GitHub, error 403).
2. Push file `index.html`, `styles.css`, `app.js` ke branch `main` repository tersebut.
3. Di repository: **Settings → Pages → Source: Deploy from a branch → Branch: main → folder: / (root)** → Save.
4. Tunggu 1–2 menit. Website tampil di `https://<username>.github.io/education-delivery/`.

**Kelebihan:** gratis, HTTPS otomatis, update cukup push ulang, terintegrasi dengan repo yang sudah ada.
**Kekurangan:** URL bawaan panjang (bisa diganti domain sendiri, lihat perbandingan); perlu repo GitHub.

---

## Opsi 2: Static Hosting Lain (tanpa repo)

### Netlify Drop
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag & drop folder berisi `index.html`, `styles.css`, `app.js`.
3. Website langsung live di URL acak `https://<nama-acak>.netlify.app` (bisa diganti namanya).

### Cloudflare Pages
1. Buka dashboard Cloudflare → Pages → **Create → Upload assets** (direct upload).
2. Upload folder yang sama, beri nama proyek.
3. Website live di `https://<nama-proyek>.pages.dev`.

**Kelebihan:** tidak perlu repo GitHub, paling cepat (drag & drop, selesai dalam hitungan menit), gratis.
**Kekurangan:** update harus upload ulang folder (tidak otomatis seperti push GitHub); akun Netlify/Cloudflare tetap perlu dibuat pemilik.

---

## Perbandingan Singkat

| Kriteria | GitHub Pages | Netlify Drop | Cloudflare Pages |
|---|---|---|---|
| Biaya | Gratis | Gratis | Gratis |
| Kemudahan | Sedang (perlu repo + push) | Sangat mudah (drag & drop) | Sangat mudah (drag & drop) |
| Domain sendiri | Bisa (CNAME, gratis) | Bisa (gratis) | Bisa (gratis) |
| HTTPS | Otomatis | Otomatis | Otomatis |
| Update konten | Push ke repo | Upload ulang folder | Upload ulang folder |
| Cocok untuk | Pemilik yang sudah pakai GitHub | Publish sekali, cepat | Publish sekali, cepat |

**Rekomendasi: GitHub Pages.** Alasannya: file website sudah dikelola lewat GitHub, update ke depan tinggal push ulang tanpa upload manual, gratis dengan HTTPS otomatis, dan domain sendiri bisa dipasang kapan saja. Netlify Drop jadi alternatif tercepat kalau pemilik ingin website langsung tayang tanpa urusan repo.

---

## Checklist Sebelum Deploy

- [ ] Semua link internal & eksternal (WhatsApp, Instagram @educationdelivery, alamat) sudah diklik dan benar.
- [ ] Form (kalau ada) sudah diuji — pastikan tidak mengirim ke alamat/nomor yang salah.
- [ ] Tampilan dicek di HP (Android & iPhone) dan desktop — teks tidak terpotong, gambar tidak pecah.
- [ ] Data dummy / teks contoh sudah dihapus, diganti data asli Education Delivery.
- [ ] Nomor telepon, alamat (Jl. Karet Raya, Setiabudi, Jakarta), dan jam layanan sudah benar.
- [ ] File `index.html` berada di root folder (bukan di subfolder) supaya hosting menemukannya.
- [ ] Nama file dan gambar memakai huruf kecil tanpa spasi (menghindari link rusak).

---

## Catatan Penting

- **Domain / URL final diputuskan pemilik.** Jangan daftarkan domain atau membuat akun hosting atas nama Education Delivery tanpa persetujuan mereka.
- Jangan mempublikasikan apa pun sebelum pemilik menyetujui isi website dan memilih opsi deployment.
- Semua akun (GitHub, Netlify, atau Cloudflare) dibuat dan dipegang oleh pemilik sendiri.
