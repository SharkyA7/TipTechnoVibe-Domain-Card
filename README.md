# TipTechnoVibe – Coming Soon Page

> Tips Teknologi dengan Vibe Asik

Landing page "coming soon" untuk brand **TipTechnoVibe** – situs tips teknologi praktis dari Jember, Jawa Timur.

---

## Struktur File

```
tiptechnovibe/
├── index.html    → Struktur HTML + semantic markup + aksesibilitas dasar
├── styles.css    → Semua styling: glassmorphism, animasi, responsive
├── script.js     → Particle background canvas + hover effects (vanilla JS)
└── README.md     → Dokumentasi ini
```

---

## Fitur

- **Dark Neon Cyber-Chill** – Gradien biru tua ke ungu midnight, aksen cyan & magenta neon
- **Particle Background** – ~80 titik bergerak pelan dengan koneksi garis, responsif terhadap mouse
- **Glassmorphism Card** – `backdrop-filter: blur(12px)`, border cyan semi-transparan, spotlight efek saat hover
- **Glow Text Animation** – Brand name pulse animasi dengan CSS `text-shadow` keyframes
- **3 Tombol CTA** – Gradient, hover glow + scale, shine sweep effect
- **Mobile-First Responsive** – Stack vertikal di HP, horizontal di tablet ke atas
- **Aksesibilitas** – Semantic HTML, `aria-label`, `focus-visible` outline, `prefers-reduced-motion`

---

## Cara Pakai

1. **Download / clone** semua 4 file ke satu folder yang sama
2. Buka `index.html` di browser (klik dua kali, atau pakai live server)
3. Selesai! Tidak perlu build process, tidak ada dependency eksternal

### Deploy ke Hosting

Upload semua file ke folder root hosting (cPanel, Netlify, Vercel, dll):

```
public_html/
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## Kustomisasi

### Ganti Nama Domain / Link

Di `index.html`, cari dan ubah:

```html
<!-- Link Instagram -->
href="https://instagram.com/tiptechnovibe"

<!-- Link email -->
href="mailto:tiptechnovibe@gmail.com?subject=Ide%20Tips%20Tekno"

<!-- Link newsletter (ganti # dengan URL Google Form, dll) -->
href="#"
```

### Ubah Warna Utama

Di `styles.css`, edit bagian `:root`:

```css
:root {
  --cyan:  #00ffff;   /* warna aksen utama */
  --pink:  #ff00aa;   /* warna aksen sekunder */
  --bg-deep:   #0a001f; /* background paling gelap */
  --bg-purple: #2a004a; /* background paling terang */
}
```

### Jumlah Partikel

Di `script.js`, ubah:

```js
const CONFIG = {
  count: 80,   /* naikan/turunkan jumlah partikel */
  speedMax: 0.28, /* kecepatan partikel */
};
```

---

## Teknologi

| Komponen | Detail |
|---|---|
| HTML | Semantic HTML5, aksesibilitas dasar (ARIA) |
| CSS | Custom Properties, Flexbox, `backdrop-filter`, CSS Animations |
| JavaScript | Vanilla ES6+, Canvas 2D API, `requestAnimationFrame` |
| Font | [Orbitron](https://fonts.google.com/specimen/Orbitron) + [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts |
| Framework | Tidak ada – pure HTML/CSS/JS |

---

## Breakpoint Responsive

| Ukuran | Perilaku |
|---|---|
| < 600px (HP) | Tombol stack vertikal, font mengecil, padding dikurangi |
| ≥ 600px (Tablet) | Tombol berdampingan horizontal |
| ≥ 900px (Desktop) | Card padding lebih lega, font optimal |

---

## Lisensi

Bebas digunakan untuk keperluan pribadi dan komersial.  
Dibuat dengan ❤️ dari Jember, Jawa Timur, Indonesia.

---

*© 2026 TipTechnoVibe*
