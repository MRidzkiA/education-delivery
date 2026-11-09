/* Education Delivery — app.js
   Vanilla JS. Validasi formulir booking, simpan ke localStorage (key: ed_bookings,
   skema snake_case Fajar), FAQ accordion, riwayat booking perangkat ini.
   Semua isian pengguna ditampilkan sebagai teks biasa (textContent) — tidak pernah
   sebagai HTML, untuk mencegah injeksi. */

(function () {
  'use strict';

  var STORAGE_KEY = 'ed_bookings';
  var MAX_AGE_DAYS = 7;
  var PROGRAM_NAMES = {
    'baby-class': 'Baby Class',
    'toddler-class': 'Toddler Class',
    'art-class': 'Art Class'
  };

  /* ---------- util ---------- */
  function $(id) { return document.getElementById(id); }

  function loadBookings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveBookings(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) { /* penyimpanan penuh/diblokir — abaikan */ }
  }

  function isExpired(booking) {
    if (!booking.dibuat_pada) return true;
    var created = new Date(booking.dibuat_pada).getTime();
    if (isNaN(created)) return true;
    return (Date.now() - created) > MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  }

  function pruneExpired() {
    var fresh = loadBookings().filter(function (b) { return !isExpired(b); });
    saveBookings(fresh);
    return fresh;
  }

  function todayLocal() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function nextId() {
    var d = new Date();
    var stamp = String(d.getFullYear()) +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    var count = loadBookings().filter(function (b) {
      return b.id && b.id.indexOf('BK-' + stamp) === 0;
    }).length;
    return 'BK-' + stamp + '-' + String(count + 1).padStart(3, '0');
  }

  function isoWithWib() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '+07:00';
  }

  /* ---------- tahun footer ---------- */
  var yearEl = $('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- FAQ accordion (satu terbuka) ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- pilih program dari kartu ---------- */
  document.querySelectorAll('.program-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var val = link.getAttribute('data-program');
      var radio = document.querySelector('input[name="program_id"][value="' + val + '"]');
      if (radio) radio.checked = true;
      clearError('program_id');
    });
  });

  /* ---------- validasi ---------- */
  function setError(fieldId, message) {
    var err = $('err-' + fieldId);
    var input = $(fieldId);
    if (err) { err.textContent = message; err.hidden = false; }
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearError(fieldId) {
    var err = $('err-' + fieldId);
    var input = $(fieldId);
    if (err) { err.textContent = ''; err.hidden = true; }
    if (input) input.removeAttribute('aria-invalid');
  }

  function kontakValid(value) {
    var compact = value.replace(/[\s\-()]/g, '');
    var hasIg = /@[\w.]{2,}/.test(value);
    var hasPhone = /^(\+?62|0)8\d{8,12}$/.test(compact) && compact.replace(/\D/g, '').length >= 10 && compact.replace(/\D/g, '').length <= 14;
    return hasIg || hasPhone;
  }

  function containsForbidden(value) {
    return /[<>]/.test(value) || /script/i.test(value);
  }

  function validate(data) {
    var ok = true;
    ['nama_orang_tua', 'nama_anak', 'usia_anak_bulan', 'program_id', 'jadwal_diminta', 'jam_diminta', 'alamat_rumah', 'kontak', 'catatan'].forEach(clearError);

    var forbidden = [
      ['nama_orang_tua', data.nama_orang_tua],
      ['nama_anak', data.nama_anak],
      ['alamat_rumah', data.alamat_rumah],
      ['kontak', data.kontak],
      ['catatan', data.catatan]
    ];
    var forbiddenHit = false;
    forbidden.forEach(function (pair) {
      if (pair[1] && containsForbidden(pair[1])) {
        setError(pair[0], 'Isian tidak boleh mengandung karakter < atau > atau kata "script".');
        forbiddenHit = true;
      }
    });
    if (forbiddenHit) { ok = false; return ok; }

    if (!data.nama_orang_tua) { setError('nama_orang_tua', 'Nama orang tua wajib diisi.'); ok = false; }
    if (!data.nama_anak) { setError('nama_anak', 'Nama anak wajib diisi.'); ok = false; }

    if (data.usia_anak_bulan === '' || data.usia_anak_bulan === null) {
      setError('usia_anak_bulan', 'Usia anak wajib diisi.'); ok = false;
    } else if (!Number.isInteger(data.usia_anak_bulan) || data.usia_anak_bulan < 0 || data.usia_anak_bulan > 72) {
      setError('usia_anak_bulan', 'Usia anak harus angka bulat 0–72 bulan.'); ok = false;
    }

    if (!data.program_id) { setError('program_id', 'Pilih salah satu program.'); ok = false; }

    if (!data.jadwal_diminta) {
      setError('jadwal_diminta', 'Tanggal yang diinginkan wajib diisi.'); ok = false;
    } else if (data.jadwal_diminta < todayLocal()) {
      setError('jadwal_diminta', 'Tanggal tidak boleh di masa lalu.'); ok = false;
    }

    if (!data.jam_diminta) { setError('jam_diminta', 'Jam yang diinginkan wajib diisi.'); ok = false; }

    if (!data.alamat_rumah) { setError('alamat_rumah', 'Alamat rumah wajib diisi.'); ok = false; }

    if (!data.kontak) {
      setError('kontak', 'Kontak wajib diisi.'); ok = false;
    } else if (!kontakValid(data.kontak)) {
      setError('kontak', 'Isi username Instagram (contoh: @nama) atau nomor HP (08… / +62…, 10–14 digit).'); ok = false;
    }

    return ok;
  }

  /* ---------- pesan DM ---------- */
  function buildDmMessage(b) {
    return 'Halo Education Delivery! Saya mau booking les home visit.\n' +
      'ID Booking: ' + b.id + '\n' +
      'Nama orang tua: ' + b.nama_orang_tua + '\n' +
      'Nama anak: ' + b.nama_anak + '\n' +
      'Usia anak: ' + b.usia_anak_bulan + ' bulan\n' +
      'Program: ' + (PROGRAM_NAMES[b.program_id] || b.program_id) + '\n' +
      'Jadwal yang diinginkan: ' + b.jadwal_diminta + ' pukul ' + b.jam_diminta + '\n' +
      'Alamat rumah: ' + b.alamat_rumah + '\n' +
      'Kontak: ' + b.kontak +
      (b.catatan ? '\nCatatan: ' + b.catatan : '');
  }

  /* ---------- riwayat booking (perangkat ini saja) ---------- */
  function renderHistory() {
    var bookings = pruneExpired();
    var wrap = $('booking-history');
    var list = $('booking-list');
    if (!wrap || !list) return;
    list.textContent = '';
    if (bookings.length === 0) { wrap.hidden = true; return; }
    wrap.hidden = false;
    bookings.forEach(function (b) {
      var li = document.createElement('li');
      var line1 = document.createElement('div');
      var idSpan = document.createElement('span');
      idSpan.className = 'booking-id';
      idSpan.textContent = b.id;
      var status = document.createElement('span');
      status.className = 'booking-status';
      status.textContent = b.status === 'baru' ? 'Baru — belum dikonfirmasi' : b.status;
      line1.appendChild(idSpan);
      line1.appendChild(status);
      var line2 = document.createElement('div');
      line2.textContent = (PROGRAM_NAMES[b.program_id] || b.program_id) +
        ' • ' + b.nama_anak + ' (' + b.usia_anak_bulan + ' bln) • ' +
        b.jadwal_diminta + ' pukul ' + b.jam_diminta;
      li.appendChild(line1);
      li.appendChild(line2);
      list.appendChild(li);
    });
  }

  /* ---------- submit formulir ---------- */
  var form = $('booking-form');
  var successCard = $('success-card');
  var lastBooking = null;

  if (form) {
    var dateInput = $('jadwal_diminta');
    if (dateInput) dateInput.min = todayLocal();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var programRadio = document.querySelector('input[name="program_id"]:checked');
      var usiaRaw = $('usia_anak_bulan').value.trim();
      var data = {
        nama_orang_tua: $('nama_orang_tua').value.trim(),
        nama_anak: $('nama_anak').value.trim(),
        usia_anak_bulan: usiaRaw === '' ? '' : Number(usiaRaw),
        program_id: programRadio ? programRadio.value : '',
        jadwal_diminta: $('jadwal_diminta').value,
        jam_diminta: $('jam_diminta').value,
        alamat_rumah: $('alamat_rumah').value.trim(),
        kontak: $('kontak').value.trim(),
        catatan: $('catatan').value.trim()
      };

      if (!validate(data)) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var booking = {
        id: nextId(),
        nama_orang_tua: data.nama_orang_tua,
        nama_anak: data.nama_anak,
        usia_anak_bulan: data.usia_anak_bulan,
        program_id: data.program_id,
        kelas_id: null,
        jadwal_diminta: data.jadwal_diminta,
        jam_diminta: data.jam_diminta,
        alamat_rumah: data.alamat_rumah,
        kontak: data.kontak,
        catatan: data.catatan,
        status: 'baru',
        dibuat_pada: isoWithWib()
      };

      var bookings = pruneExpired();
      bookings.push(booking);
      saveBookings(bookings);
      lastBooking = booking;

      form.reset();
      if (successCard) {
        successCard.hidden = false;
        var idEl = $('success-id');
        if (idEl) idEl.textContent = 'ID Booking: ' + booking.id;
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      renderHistory();
    });
  }

  /* ---------- tombol DM: salin pesan, lalu hapus data (K6 Dewi) ---------- */
  var dmButton = $('dm-button');
  if (dmButton) {
    dmButton.addEventListener('click', function () {
      if (lastBooking) {
        var msg = buildDmMessage(lastBooking);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(msg).catch(function () { /* clipboard ditolak — pengguna tetap bisa mengetik manual */ });
        }
        // Data dianggap terkirim begitu orang tua menuju DM: hapus dari perangkat.
        saveBookings([]);
        lastBooking = null;
        renderHistory();
      }
    });
  }

  /* ---------- tombol hapus data ---------- */
  var clearBtn = $('clear-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      saveBookings([]);
      lastBooking = null;
      if (successCard) successCard.hidden = true;
      renderHistory();
      var note = $('delete-note');
      if (note) {
        note.textContent = '✅ Data booking di perangkat ini sudah dihapus.';
        note.hidden = false;
      }
    });
  }

  /* ---------- init ---------- */
  pruneExpired();
  renderHistory();
})();
