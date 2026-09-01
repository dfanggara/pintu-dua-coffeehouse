<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Gallery;
use App\Models\HeroBanner;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PintuDuaSystemTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test public pages accessibility.
     */
    public function test_public_pages_load_successfully(): void
    {
        $this->get('/')->assertStatus(200);
        $this->get('/menu')->assertStatus(200);
        $this->get('/gallery')->assertStatus(200);
        $this->get('/location')->assertStatus(200);
    }

    /**
     * Test reservation API validation & store logic.
     */
    public function test_reservation_api_creates_pending_booking_with_string_code(): void
    {
        $payload = [
            'customer_name' => 'John Doe',
            'pax' => 4,
            'reservation_date' => now()->addDays(2)->format('Y-m-d'),
            'reservation_time' => '19:00',
            'special_notes' => 'Near window please',
        ];

        $response = $this->postJson('/api/reservations', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'booking_code',
                'data' => ['booking_code', 'customer_name', 'pax', 'status'],
            ]);

        $this->assertDatabaseHas('reservations', [
            'customer_name' => 'John Doe',
            'pax' => 4,
            'status' => 'pending',
        ]);
    }

    /**
     * Test admin routes authorization protection.
     */
    public function test_admin_dashboard_requires_admin_user(): void
    {
        // Guest redirected to login
        $this->get('/dashboard')->assertRedirect('/login');

        // Non-admin user redirected to home page
        $regularUser = User::factory()->create(['is_admin' => false]);
        $this->actingAs($regularUser)->get('/dashboard')->assertRedirect('/');

        // Non-admin JSON request returns 403 Forbidden
        $this->actingAs($regularUser)->getJson('/dashboard')->assertStatus(403);

        // Admin user granted access
        $adminUser = User::factory()->create(['is_admin' => true]);
        $this->actingAs($adminUser)->get('/dashboard')->assertStatus(200);
    }

    /**
     * Test admin CRUD functionality for Categories and Menus.
     */
    public function test_admin_can_manage_categories_and_menus(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);

        // 1. Create Category
        $catResponse = $this->actingAs($adminUser)->post('/admin/categories', [
            'slug' => 'test-category',
            'name' => 'Test Category',
            'type' => 'drink',
        ]);
        $catResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', ['slug' => 'test-category']);

        // 2. Create Menu
        $menuResponse = $this->actingAs($adminUser)->post('/admin/menus', [
            'category_slug' => 'test-category',
            'name' => 'Test Coffee',
            'price' => 25000,
            'description' => 'Test Coffee Description',
            'is_highlight' => true,
            'is_active' => true,
        ]);
        $menuResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('menus', ['name' => 'Test Coffee', 'category_slug' => 'test-category']);

        $menu = Menu::where('name', 'Test Coffee')->first();
        $this->assertNotNull($menu);

        // 3. Delete Menu
        $deleteResponse = $this->actingAs($adminUser)->delete("/admin/menus/{$menu->sku}");
        $deleteResponse->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('menus', ['sku' => $menu->sku]);
    }

    /**
     * Test admin status updates and soft deletes on Reservations.
     */
    public function test_admin_can_update_status_and_soft_delete_reservation(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);

        $reservation = Reservation::create([
            'booking_code' => 'RSV-TEST-001',
            'customer_name' => 'Jane Smith',
            'pax' => 2,
            'reservation_date' => now()->addDay()->format('Y-m-d'),
            'reservation_time' => '18:00',
            'status' => 'pending',
        ]);

        // 1. Update status to confirmed
        $updateResponse = $this->actingAs($adminUser)->patch("/admin/reservations/{$reservation->booking_code}/status", [
            'status' => 'confirmed',
        ]);
        $updateResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('reservations', ['booking_code' => 'RSV-TEST-001', 'status' => 'confirmed']);

        // 2. Soft delete reservation
        $deleteResponse = $this->actingAs($adminUser)->delete("/admin/reservations/{$reservation->booking_code}");
        $deleteResponse->assertSessionHasNoErrors();
        $this->assertSoftDeleted('reservations', ['booking_code' => 'RSV-TEST-001']);
    }

    /**
     * Test admin CRUD operations for Hero Banners and Galleries.
     */
    public function test_admin_can_manage_hero_banners_and_galleries(): void
    {
        $adminUser = User::factory()->create(['is_admin' => true]);

        // 1. Create Gallery Photo
        $gallery = Gallery::create([
            'code' => 'GAL-TEST-001',
            'title' => 'Vibe Interior Test',
            'category' => 'vibe',
            'image_url' => '/images/ourstory.png',
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('galleries', ['code' => 'GAL-TEST-001']);

        // Delete Gallery
        $this->actingAs($adminUser)->delete("/admin/galleries/{$gallery->code}");
        $this->assertDatabaseMissing('galleries', ['code' => 'GAL-TEST-001']);

        // 2. Create Hero Banner
        $banner = HeroBanner::create([
            'code' => 'BNR-TEST-001',
            'title' => 'Promo Weekend Test',
            'image_url' => '/images/ourstory.png',
            'is_active' => true,
        ]);
        $this->assertDatabaseHas('hero_banners', ['code' => 'BNR-TEST-001']);

        // Delete Hero Banner
        $this->actingAs($adminUser)->delete("/admin/hero-banners/{$banner->code}");
        $this->assertDatabaseMissing('hero_banners', ['code' => 'BNR-TEST-001']);
    }
}
