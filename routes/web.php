<?php

use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminGalleryController;
use App\Http\Controllers\Admin\AdminHeroBannerController;
use App\Http\Controllers\Admin\AdminInstagramPostController;
use App\Http\Controllers\Admin\AdminMenuController;
use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\ProfileController;
use App\Models\Category;
use App\Models\Gallery;
use App\Models\HeroBanner;
use App\Models\InstagramPost;
use App\Models\Menu;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Multi-Page Inertia SPA Routes

// 1. Home Page / Landing Overview
Route::get('/', function () {
    $highlights = Menu::where('is_active', true)
        ->where('is_highlight', true)
        ->with('category')
        ->get();

    $heroBanners = HeroBanner::where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->latest()
        ->get();

    $galleries = Gallery::where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->latest()
        ->take(6)
        ->get();

    $instagramPosts = InstagramPost::where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->latest()
        ->take(9)
        ->get();

    return Inertia::render('Home', [
        'highlights' => $highlights,
        'heroBanners' => $heroBanners,
        'galleries' => $galleries,
        'instagramPosts' => $instagramPosts,
    ]);
})->name('home');

// 2. Dedicated Menu Catalog Page
Route::get('/menu', function () {
    $categories = Category::with(['menus' => function ($query) {
        $query->where('is_active', true);
    }])->get();

    return Inertia::render('Menu', [
        'categories' => $categories,
    ]);
})->name('menu');

// 3. Dedicated Community Gallery Page
Route::get('/gallery', function () {
    $galleries = Gallery::where('is_active', true)
        ->orderBy('sort_order', 'asc')
        ->latest()
        ->get();

    return Inertia::render('Gallery', [
        'galleries' => $galleries,
    ]);
})->name('gallery');

// 4. Dedicated Location & Hours Page
Route::get('/location', function () {
    return Inertia::render('Location');
})->name('location');

// Dashboard & Admin Management Routes
Route::get('/dashboard', [AdminDashboardController::class, 'index'])->middleware(['auth', 'verified', 'is_admin'])->name('dashboard');

Route::middleware(['auth', 'verified', 'is_admin'])->group(function () {
    // Admin Reservations Management
    Route::get('/admin/reservations', [AdminReservationController::class, 'index'])->name('admin.reservations.index');
    Route::patch('/admin/reservations/{booking_code}/status', [AdminReservationController::class, 'updateStatus'])->name('admin.reservations.update-status');
    Route::delete('/admin/reservations/{booking_code}', [AdminReservationController::class, 'destroy'])->name('admin.reservations.destroy');

    // Admin Catalog Menu Management
    Route::get('/admin/menus', [AdminMenuController::class, 'index'])->name('admin.menus.index');
    Route::post('/admin/menus', [AdminMenuController::class, 'store'])->name('admin.menus.store');
    Route::put('/admin/menus/{sku}', [AdminMenuController::class, 'update'])->name('admin.menus.update');
    Route::match(['post', 'put'], '/admin/menus/{sku}/update', [AdminMenuController::class, 'update'])->name('admin.menus.post-update');
    Route::delete('/admin/menus/{sku}', [AdminMenuController::class, 'destroy'])->name('admin.menus.destroy');

    // Admin Category Management
    Route::post('/admin/categories', [AdminCategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/admin/categories/{slug}', [AdminCategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{slug}', [AdminCategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Admin Hero Banners Management
    Route::get('/admin/hero-banners', [AdminHeroBannerController::class, 'index'])->name('admin.hero-banners.index');
    Route::post('/admin/hero-banners', [AdminHeroBannerController::class, 'store'])->name('admin.hero-banners.store');
    Route::put('/admin/hero-banners/{code}', [AdminHeroBannerController::class, 'update'])->name('admin.hero-banners.update');
    Route::match(['post', 'put'], '/admin/hero-banners/{code}/update', [AdminHeroBannerController::class, 'update'])->name('admin.hero-banners.post-update');
    Route::delete('/admin/hero-banners/{code}', [AdminHeroBannerController::class, 'destroy'])->name('admin.hero-banners.destroy');

    // Admin Gallery Management
    Route::get('/admin/galleries', [AdminGalleryController::class, 'index'])->name('admin.galleries.index');
    Route::post('/admin/galleries', [AdminGalleryController::class, 'store'])->name('admin.galleries.store');
    Route::put('/admin/galleries/{code}', [AdminGalleryController::class, 'update'])->name('admin.galleries.update');
    Route::match(['post', 'put'], '/admin/galleries/{code}/update', [AdminGalleryController::class, 'update'])->name('admin.galleries.post-update');
    Route::delete('/admin/galleries/{code}', [AdminGalleryController::class, 'destroy'])->name('admin.galleries.destroy');

    // Admin Instagram Posts Management
    Route::get('/admin/instagram-posts', [AdminInstagramPostController::class, 'index'])->name('admin.instagram-posts.index');
    Route::post('/admin/instagram-posts', [AdminInstagramPostController::class, 'store'])->name('admin.instagram-posts.store');
    Route::put('/admin/instagram-posts/{code}', [AdminInstagramPostController::class, 'update'])->name('admin.instagram-posts.update');
    Route::match(['post', 'put'], '/admin/instagram-posts/{code}/update', [AdminInstagramPostController::class, 'update'])->name('admin.instagram-posts.post-update');
    Route::delete('/admin/instagram-posts/{code}', [AdminInstagramPostController::class, 'destroy'])->name('admin.instagram-posts.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
