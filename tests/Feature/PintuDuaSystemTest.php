<?php

namespace Tests\Feature;

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
}
