# Pintu Dua Coffeehouse

**Final UI/UX & System Architecture Specification**[cite: 5, 6]

## 1. Brand Identity & Visual Language

### Typography

- **Headings & Display:** 'Impact' or 'Arial Black'. Memberikan kesan bold ala poster event.[cite: 5, 6]
- **Body Text & UI Elements:** 'Inter' atau 'Helvetica Neue'. Bersih dan modern untuk keterbacaan tinggi di mobile.[cite: 5, 6]

### Color Palette

- **#FF6B00** - Primary[cite: 5, 6]
- **#121212** - Background (Bg)[cite: 5, 6]
- **#242424** - Surface[cite: 5, 6]
- **#E0E0E0** - Text[cite: 5, 6]

## 2. Technology Stack

**Frontend (SPA) & Backend Bridge**
Fokus pada performa interaktif tanpa reload halaman (React, Tailwind CSS) dan manajemen data via server handal tanpa arsitektur kompleks (Laravel, Inertia.js, MySQL).[cite: 5, 6]

- React[cite: 5, 6]
- Tailwind CSS[cite: 5, 6]
- Laravel[cite: 5, 6]
- Inertia.js[cite: 5, 6]
- MySQL[cite: 5, 6]

## 3. Mobile-First UI/UX

- **App-Like Navigation:** Menggunakan Bottom Navigation Bar atau Floating Action Button (FAB) agar ramah navigasi satu tangan (thumb-friendly).[cite: 5, 6]
- **Bottom Sheet Interaction:** Form reservasi muncul dari bawah layar, menjaga user tetap di halaman yang sama (native app feel).[cite: 5, 6]
- **Horizontal Swipe:** Galeri dan promo diletakkan bergeser ke samping untuk menghemat ruang vertikal.[cite: 5, 6]

## 4. Core System Features

### WhatsApp Integration Reservation

Bypass form reservasi dari frontend langsung ke WhatsApp admin via `wa.me`. Sistem tetap ringan tanpa perlu membebani database dengan data booking.[cite: 5, 6]

### Two-Tier Menu Display Strategy

- **Tier 1: Landing Page Highlights.** Menampilkan hanya kategori "Our Signature" dan "Main Course" andalan dalam bentuk card visual dengan foto beresolusi tinggi untuk menarik minat pelanggan.[cite: 5, 6]
- **Tier 2: Interactive Full Catalog.** Memuat seluruh menu menggunakan sistem Tabs (memisahkan Drink & Food) dan Accordion (buka-tutup) untuk sub-kategori. Desain teks-sentris mengadaptasi visual dari menu fisik/Instagram.[cite: 5, 6]

### Lightweight Admin Dashboard

Fokus operasi CRUD untuk katalog menu (gambar, harga, status) menggunakan struktur database berbasis `slug` dan `sku` tanpa auto-increment ID untuk URL yang bersih.[cite: 5, 6]
