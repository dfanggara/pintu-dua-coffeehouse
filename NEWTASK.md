# 📸 NEWTASK: Instagram Feed Section pada Halaman Home

## Deskripsi

Menambahkan section baru di halaman **Home** yang menampilkan grid postingan Instagram Pintu Dua Coffeehouse. Setiap item berupa thumbnail foto/video cover yang jika di-klik akan membuka postingan Instagram asli di tab baru. Section ini ditempatkan **di bawah Signature Highlights** dan **di atas Footer**.

Referensi visual: grid 3×3 seperti website Kopi Kenangan yang menampilkan embed-style Instagram posts.

---

## Arsitektur & Pendekatan

### Opsi A: Database-Driven (Direkomendasikan ✅)
Data postingan Instagram disimpan di database agar admin bisa menambah/mengubah/menghapus konten Instagram tanpa perlu coding ulang.

### Mengapa bukan Instagram API?
- Instagram Basic Display API sudah **deprecated** sejak Desember 2024.
- Instagram Graph API butuh Business Account + Facebook App approval yang ribet.
- Pendekatan manual via database lebih simpel, stabil, dan sesuai dengan arsitektur VILT stack kita.

---

## Implementation Plan

### Phase 1: Database & Backend

#### 1.1 Migration — Tabel `instagram_posts`
- `[ ]` Buat migration baru: `create_instagram_posts_table`
- Primary key: `code` (string) — diambil dari shortcode Instagram post (contoh: `CxYz123AbCd`)
- Kolom:
  - `code` (string, PK) — shortcode unik Instagram
  - `caption` (text, nullable) — caption pendek untuk alt text / tooltip
  - `thumbnail_url` (string) — path gambar thumbnail yang di-upload admin
  - `post_url` (string) — URL lengkap postingan Instagram (`https://www.instagram.com/p/CxYz123AbCd/`)
  - `post_type` (enum: `image`, `video`, `carousel`) — tipe postingan
  - `is_active` (boolean, default: true)
  - `sort_order` (integer, default: 0)
  - `timestamps`
- **PENTING**: Tidak menggunakan auto-increment integer ID (sesuai AGENTS.md rules)

#### 1.2 Model — `InstagramPost`
- `[ ]` Buat model `InstagramPost.php`
- Primary key: `code`
- `$incrementing = false`, `$keyType = 'string'`
- Fillable: semua kolom di atas
- Cast: `is_active` → boolean

#### 1.3 Controller — `AdminInstagramPostController`
- `[ ]` Buat controller CRUD lengkap di namespace `App\Http\Controllers\Admin`
- Method: `index`, `store`, `update`, `destroy`
- Index: pagination 15, search by caption/code, Inertia render
- Store/Update: gunakan `ImageService` untuk kompresi thumbnail WebP
- FormRequest: `StoreInstagramPostRequest` untuk validasi

#### 1.4 Routes
- `[ ]` Tambahkan routes di `routes/web.php` dalam group admin middleware:
  - `GET /admin/instagram-posts` → `admin.instagram-posts.index`
  - `POST /admin/instagram-posts` → `admin.instagram-posts.store`
  - `PUT /admin/instagram-posts/{code}` → `admin.instagram-posts.update`
  - `POST /admin/instagram-posts/{code}/update` → `admin.instagram-posts.post-update`
  - `DELETE /admin/instagram-posts/{code}` → `admin.instagram-posts.destroy`

#### 1.5 Home Controller Update
- `[ ]` Update route `/` di `routes/web.php` untuk query `InstagramPost::where('is_active', true)->orderBy('sort_order')->latest()->take(9)->get()` dan pass sebagai prop `instagramPosts` ke halaman Home

---

### Phase 2: Frontend — Komponen React

#### 2.1 Komponen `InstagramFeedSection.jsx`
- `[ ]` Buat file `resources/js/Components/InstagramFeedSection.jsx`
- Layout:
  - Section header dengan accent bar + judul "Follow Us On Instagram"
  - Background watermark teks besar "INSTAGRAM" (opacity rendah, konsisten dengan StorySection)
  - Grid responsif: `grid-cols-2 sm:grid-cols-3` (6-9 item)
  - Setiap item adalah `<a href={post_url} target="_blank">` berisi:
    - Thumbnail foto dengan aspect ratio 1:1 (square crop via `object-cover`)
    - Overlay gradient gelap on hover
    - Icon Instagram / icon play (untuk video) muncul saat hover
    - Badge kecil `post_type` di pojok (jika video/carousel)
  - Footer text: "Follow Us On Instagram @PintuDuaCoffeehouse" yang juga clickable ke profil IG
- Styling: konsisten dengan design system Pintu Dua (dark theme, border-white/10, hover glow #FF6B00)

#### 2.2 Update `Home.jsx`
- `[ ]` Import dan render `<InstagramFeedSection />` di bawah `<SignatureBites />`
- Terima prop `instagramPosts` dari backend

---

### Phase 3: Admin Panel — Halaman Manajemen

#### 3.1 Halaman `Admin/InstagramPosts/Index.jsx`
- `[ ]` Buat file `resources/js/Pages/Admin/InstagramPosts/Index.jsx`
- Fungsionalitas:
  - Form tambah/edit post: input code, upload thumbnail, input post URL, select post type, toggle aktif
  - Tabel daftar post dengan thumbnail preview, caption, link, status
  - Tombol edit & hapus
  - Search bar & pagination links
- Styling: konsisten dengan halaman admin lain (dark mode, rounded-xl cards)

#### 3.2 Update Navigasi Admin
- `[ ]` Tambahkan link "Instagram Posts" di `AuthenticatedLayout.jsx` (desktop & mobile nav)

---

### Phase 4: Build & Verifikasi

- `[ ]` Run `php artisan migrate` untuk membuat tabel baru
- `[ ]` Run `npm run build` untuk kompilasi frontend
- `[ ]` Verifikasi:
  - Halaman Home menampilkan grid Instagram yang clickable
  - Admin panel bisa CRUD Instagram posts
  - Thumbnail ter-optimasi via ImageService (WebP)
  - Navigasi admin menampilkan link baru "Instagram Posts"

---

## Estimasi File yang Akan Dibuat / Dimodifikasi

### File Baru
| File | Deskripsi |
|------|-----------|
| `database/migrations/xxxx_create_instagram_posts_table.php` | Migration tabel |
| `app/Models/InstagramPost.php` | Eloquent Model |
| `app/Http/Controllers/Admin/AdminInstagramPostController.php` | Admin CRUD Controller |
| `app/Http/Requests/StoreInstagramPostRequest.php` | Form validation |
| `resources/js/Components/InstagramFeedSection.jsx` | Komponen frontend grid IG |
| `resources/js/Pages/Admin/InstagramPosts/Index.jsx` | Admin management page |

### File Dimodifikasi
| File | Perubahan |
|------|-----------|
| `routes/web.php` | Tambah routes admin IG + update home query |
| `resources/js/Pages/Home.jsx` | Import & render InstagramFeedSection |
| `resources/js/Layouts/AuthenticatedLayout.jsx` | Tambah nav link "Instagram Posts" |

---

## Status: ✅ Selesai (100% Completed)
