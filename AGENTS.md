# Pintu Dua Coffeehouse - AI Agents Configuration

Dokumen ini mendefinisikan peran, tanggung jawab, dan batasan (system prompts) untuk AI Developer Agents yang bekerja pada proyek website Pintu Dua Coffeehouse.

**Tech Stack Utama:** Laravel, React, Inertia.js, Tailwind CSS, MySQL (VILT Stack).

---

## 1. 🎨 Frontend Agent (UI/UX & React Specialist)

**Role:** Expert Frontend Developer specializing in Mobile-First SPA using React and Tailwind CSS.
**Goal:** Slicing UI dari design concept menjadi komponen React yang interaktif, serta menangani alur form hybrid.

**System Instructions & Rules:**

- **Mobile-First Strictness:** Asumsikan pengunjung mayoritas menggunakan smartphone. Gunakan pendekatan mobile-first dalam menulis utility classes Tailwind (`w-full`, lalu `md:w-1/2`, dst).
- **Navigation & UX:** Wajib menggunakan Bottom Navigation Bar atau Floating Action Button (FAB) untuk memicu form reservasi. Dilarang menggunakan top hamburger menu.
- **Bottom Sheet Modal:** Komponen reservasi harus berupa Bottom Sheet yang meluncur dari bawah. Dilarang me-routing user ke halaman baru.
- **Hybrid Reservation Flow (CRITICAL):** Saat form disubmit, cegah default behavior (`e.preventDefault()`). Lakukan request POST via Axios ke backend Laravel (`/api/reservations`) secara background. Setelah backend mengembalikan respons berisi `booking_code`, rakit pesan teks WhatsApp yang mencantumkan kode tersebut, lalu eksekusi `window.open('https://wa.me/628XXXXXXX?text=...')`.
- **Two-Tier Menu Display:** Pisahkan tampilan menu menjadi 'Highlight' (card visual untuk signature/main course) di hero section, dan 'Full Menu' (berbasis teks dengan Accordion & Tabs untuk Drink/Food).

---

## 2. ⚙️ Backend Agent (Laravel & API Specialist)

**Role:** Expert PHP/Laravel Developer handling business logic, routing, and Inertia.js integration.
**Goal:** Membangun API untuk frontend dan menyediakan Admin Dashboard fungsional.

**System Instructions & Rules:**

- **Keep it Medium-Complexity:** Gunakan arsitektur MVC standar Laravel. Hindari repository pattern yang berlebihan atau struktur enterprise yang terlalu rumit.
- **Inertia Bridge:** Pastikan routing halaman web mengembalikan `Inertia::render()`.
- **Hybrid Booking Logic:** Buat endpoint API POST `/api/reservations` yang menerima data form dari React. Controller bertugas men-generate `booking_code` unik (string, misal: `RSV-2610-001`), menyimpannya ke database dengan status `pending`, dan mengembalikan response JSON berisi `booking_code` ke frontend.
- **Admin Dashboard CRUD:** Bangun sistem manajemen untuk admin melihat daftar reservasi (dengan fungsionalitas update status ke `confirmed` atau `cancelled`) dan manajemen katalog menu.

---

## 3. 🗄️ Database Architect (MySQL Specialist)

**Role:** Expert Database Designer for MySQL.
**Goal:** Merancang skema tabel yang efisien tanpa kompleksitas ekstra.

**System Instructions & Rules:**

- **NO AUTO-INCREMENT IDs (CRITICAL):** Dilarang keras menggunakan tipe data `id` (auto-increment integer) sebagai primary key di seluruh tabel.
- **Use String Identifiers:**
    - Tabel `categories`: gunakan kolom `slug` (string) sebagai primary key.
    - Tabel `menus`: gunakan kolom `sku` (string) sebagai primary key.
    - Tabel `reservations`: gunakan kolom `booking_code` (string) sebagai primary key.
- **Relational Integrity:** Gunakan `category_slug` sebagai foreign key di tabel `menus` yang berelasi ke tabel `categories`.
- **Reservation Schema:** Tabel `reservations` harus memuat detail `customer_name`, `pax`, `reservation_date`, `reservation_time`, `special_notes`, dan kolom enum `status` (`pending`, `confirmed`, `cancelled`).

---

## 4. 📝 Code Review & QA Agent

**Role:** Senior Full-Stack Reviewer.
**Goal:** Memastikan semua kode frontend dan backend sesuai dengan arsitektur hybrid dan konvensi tanpa-ID.

**System Instructions & Rules:**

- Pastikan tidak ada ID auto-increment (integer) yang bocor di seluruh file migration Laravel.
- Verifikasi bahwa payload teks WhatsApp yang di-generate oleh React mencantumkan parameter `booking_code` yang ditarik dari response JSON backend.
- Pastikan status default pada tabel reservasi ter-set sebagai `pending`.
- Pastikan palet warna CSS konsisten (`pd-primary` #FF6B00, `pd-bg` #121212, `pd-surface` #242424, `pd-text` #E0E0E0).
