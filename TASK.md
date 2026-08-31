# 📋 TASK — Backend Optimization Plan (Pintu Dua Coffeehouse)

> **Dibuat:** 31 Agustus 2026  
> **Status:** 🟢 Selesai (Backend Execution Complete)  
> **Estimasi Total:** ~2 Jam Kerja

---

## Ringkasan Keputusan

| # | Topik | Keputusan |
|---|-------|-----------|
| 1 | Admin System | Single admin — field `is_admin` + middleware |
| 2 | API Security | Rate limiting (5 req/menit per IP) |
| 3 | Pagination | Server-side pagination + search by name |
| 4 | Delete Reservasi | Soft delete (bisa di-recover) |
| 5 | Fitur Tambahan | Dashboard stats (total reservasi, menu aktif, pending) |
| 6 | Code Quality | Pisahkan validasi ke FormRequest classes |
| 7 | Reservation Logic | Validasi strict (tanggal harus today or future, pax 1-20) |
| 8 | Image Optimization | Auto-resize 1200px + compress quality 80% |
| 9 | Bahasa Error | Bahasa Indonesia |

---

## Phase 1: Admin Role & Middleware Protection

> Menambahkan field `is_admin` ke tabel `users` dan middleware `IsAdmin` agar hanya admin yang bisa akses panel `/admin/*`.

- [x] Buat migration `add_is_admin_to_users_table`
  - [x] Tambahkan kolom `is_admin` (boolean, default `false`) ke tabel `users`
- [x] Buat middleware `app/Http/Middleware/IsAdmin.php`
  - [x] Cek `auth()->user()->is_admin === true`
  - [x] Jika bukan admin → redirect ke home dengan flash message error
  - [x] Untuk request Inertia → return 403 error
- [x] Modifikasi `app/Models/User.php`
  - [x] Tambahkan `is_admin` ke `$fillable`
  - [x] Tambahkan `is_admin` ke `$casts` (boolean)
- [x] Modifikasi `routes/web.php`
  - [x] Ganti middleware group admin dari `['auth', 'verified']` → `['auth', 'verified', 'is_admin']`
- [x] Register middleware alias di `bootstrap/app.php`
  - [x] Alias `is_admin` → `IsAdmin::class`
- [x] Set user admin di database:
  ```sql
  UPDATE users SET is_admin = 1 WHERE email = 'your-email@example.com';
  ```
- [x] **Verifikasi:** Akses `/admin/menus` tanpa login → redirect ke login
- [x] **Verifikasi:** Akses `/admin/menus` dengan user non-admin → redirect ke home

---

## Phase 2: API Rate Limiting & Security

> Melindungi endpoint reservasi publik dari spam dan abuse.

- [x] Modifikasi `app/Providers/AppServiceProvider.php`
  - [x] Konfigurasi rate limiter `reservation` → max 5 requests per menit per IP
- [x] Modifikasi `routes/api.php`
  - [x] Terapkan throttle middleware `reservation` pada route `POST /api/reservations`
- [x] **Verifikasi:** Kirim 6 request berturut-turut → request ke-6 harus return 429 (Too Many Requests)

---

## Phase 3: FormRequest Validation Classes

> Memisahkan logika validasi dari controller ke class terpisah agar controller lebih bersih.

- [x] Buat `app/Http/Requests/StoreReservationRequest.php`
  - [x] `customer_name` → required|string|max:255
  - [x] `pax` → required|integer|min:1|max:20
  - [x] `reservation_date` → required|date|after_or_equal:today
  - [x] `reservation_time` → required
  - [x] `special_notes` → nullable|string
  - [x] Custom error messages dalam **Bahasa Indonesia**
- [x] Buat `app/Http/Requests/StoreMenuRequest.php`
  - [x] `sku` → unique:menus,sku
  - [x] `category_slug` → required|exists:categories,slug
  - [x] `name` → required|string|max:255
  - [x] `price` → required|numeric|min:0
  - [x] `image` → nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120
  - [x] Custom error messages dalam **Bahasa Indonesia**
- [x] Buat `app/Http/Requests/UpdateMenuRequest.php`
  - [x] Sama seperti Store tapi SKU tidak perlu unique check terhadap diri sendiri
- [x] Buat `app/Http/Requests/StoreHeroBannerRequest.php`
  - [x] `title` → required, `image` → required|file|image|max:5120
  - [x] Custom error messages dalam **Bahasa Indonesia**
- [x] Buat `app/Http/Requests/StoreGalleryRequest.php`
  - [x] `title` → required, `image` → required|file|image|max:5120, `category` → required
  - [x] Custom error messages dalam **Bahasa Indonesia**
- [x] Modifikasi `app/Http/Controllers/ReservationController.php`
  - [x] Ganti `$request->validate([...])` → type-hinted `StoreReservationRequest $request`
- [x] Modifikasi `app/Http/Controllers/Admin/AdminMenuController.php`
  - [x] Ganti inline validation → `StoreMenuRequest` & `UpdateMenuRequest`
- [x] Modifikasi `app/Http/Controllers/Admin/AdminHeroBannerController.php`
  - [x] Ganti inline validation → `StoreHeroBannerRequest`
- [x] Modifikasi `app/Http/Controllers/Admin/AdminGalleryController.php`
  - [x] Ganti inline validation → `StoreGalleryRequest`
- [x] **Verifikasi:** Submit form tanpa isi → pesan error muncul dalam Bahasa Indonesia

---

## Phase 4: Server-Side Pagination & Search

> Menambahkan pagination 15 items/page dan search by name di semua halaman admin.

- [x] Modifikasi `AdminReservationController@index`
  - [x] Terima query parameter `?search=`
  - [x] Filter by `customer_name` menggunakan `->when($search, fn...)`
  - [x] Gunakan `->paginate(15)`
- [x] Modifikasi `AdminMenuController@index`
  - [x] Search by `name`
  - [x] Gunakan `->paginate(15)`
- [x] Modifikasi `AdminHeroBannerController@index`
  - [x] Gunakan `->paginate(15)`
- [x] Modifikasi `AdminGalleryController@index`
  - [x] Search by `title`
  - [x] Gunakan `->paginate(15)`
- [x] **Verifikasi:** Cek pagination navigasi bekerja di semua halaman admin
- [x] **Verifikasi:** Cek search filter menampilkan hasil yang benar

---

## Phase 5: Soft Delete Reservasi

> Menambahkan fitur delete reservasi dengan soft delete agar data bisa di-recover.

- [x] Buat migration `add_soft_deletes_to_reservations_table`
  - [x] Tambahkan kolom `deleted_at` (softDeletes)
- [x] Modifikasi `app/Models/Reservation.php`
  - [x] Tambahkan `use SoftDeletes` trait
  - [x] Import `Illuminate\Database\Eloquent\SoftDeletes`
- [x] Modifikasi `AdminReservationController.php`
  - [x] Tambahkan method `destroy($bookingCode)`
  - [x] Panggil `->delete()` (soft delete)
- [x] Modifikasi `routes/web.php`
  - [x] Tambahkan route `DELETE /admin/reservations/{booking_code}`
- [x] **Verifikasi:** Delete reservasi → cek data masih ada di DB dengan `deleted_at` terisi
- [x] **Verifikasi:** Data yang di-soft-delete tidak muncul di list admin

---

## Phase 6: Dashboard Statistics

> Menambahkan halaman dashboard admin yang menampilkan statistik ringkas.

- [x] Buat `app/Http/Controllers/Admin/AdminDashboardController.php`
  - [x] Method `index()` mengambil:
    - [x] Total reservasi hari ini
    - [x] Jumlah reservasi berstatus `pending`
    - [x] Jumlah reservasi berstatus `confirmed`
    - [x] Total menu aktif
    - [x] Total menu non-aktif
    - [x] Total gallery items
    - [x] Reservasi terbaru (5 terakhir)
- [x] Modifikasi `routes/web.php`
  - [x] Ubah route `/dashboard` dari redirect → `AdminDashboardController@index`
  - [x] Render halaman Inertia `Admin/Dashboard`
- [x] **Verifikasi:** Cek dashboard stats menampilkan data yang akurat

---

## Phase 7: Image Optimization

> Menambahkan auto-resize dan compress pada semua upload gambar.

- [x] Install package Intervention Image:
  ```bash
  composer require intervention/image intervention/image-laravel
  ```
- [x] Pastikan PHP extension `gd` atau `imagick` terinstall
- [x] Buat `app/Services/ImageService.php`
  - [x] Method `optimize($uploadedFile, $directory)`:
    - [x] Resize gambar ke max width **1200px** (maintain aspect ratio)
    - [x] Compress quality ke **80%**
    - [x] Konversi ke format **WebP** untuk efisiensi
    - [x] Return path file yang sudah dioptimasi
- [x] Modifikasi `AdminMenuController.php`
  - [x] Gunakan `ImageService` di `store()` dan `update()`
- [x] Modifikasi `AdminHeroBannerController.php`
  - [x] Gunakan `ImageService` saat handle upload
- [x] Modifikasi `AdminGalleryController.php`
  - [x] Gunakan `ImageService` saat handle upload
- [x] **Verifikasi:** Upload gambar 5MB → cek file tersimpan < 500KB dan width max 1200px

---

## Phase 8: Localization — Bahasa Indonesia

> Menampilkan pesan error validasi dalam Bahasa Indonesia.

- [x] Modifikasi `config/app.php`
  - [x] Set `'locale' => 'id'`
  - [x] Set `'fallback_locale' => 'en'`
- [x] Buat `lang/id/validation.php`
  - [x] Terjemahan semua validation messages Laravel
  - [x] Mapping `attributes` (misal: `'customer_name' => 'nama pelanggan'`, `'pax' => 'jumlah tamu'`)
- [x] Buat `lang/id/pagination.php`
  - [x] Terjemahan label pagination (Sebelumnya / Berikutnya)
- [x] **Verifikasi:** Semua pesan error validasi tampil dalam Bahasa Indonesia

---

## Checklist Final Verification

- [x] Semua migration berhasil dijalankan (`php artisan migrate`)
- [x] User non-admin tidak bisa akses `/admin/*`
- [x] API reservasi terlindungi rate limiter
- [x] Semua form validation menggunakan FormRequest classes
- [x] Pagination bekerja di semua halaman admin
- [x] Soft delete reservasi berfungsi
- [x] Dashboard stats akurat
- [x] Gambar yang diupload otomatis di-optimize
- [x] Pesan error dalam Bahasa Indonesia
- [x] `npm run build` berhasil tanpa error
