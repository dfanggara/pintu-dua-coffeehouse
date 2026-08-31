<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin User
        User::updateOrCreate(
            ['email' => 'admin@pintudua.com'],
            [
                'name' => 'Admin Pintu Dua',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Sample Categories (Primary Key: slug, with type drink/food)
        $categories = [
            ['slug' => 'espresso-based', 'name' => 'Espresso Based', 'type' => 'drink', 'description' => 'Classic & Signature espresso coffees'],
            ['slug' => 'tea-series', 'name' => 'Tea Series', 'type' => 'drink', 'description' => 'Artisanal & fruity teas'],
            ['slug' => 'non-coffee', 'name' => 'Non-Coffee & Mocktails', 'type' => 'drink', 'description' => 'Refreshers & cocoa drinks'],
            ['slug' => 'main-course', 'name' => 'Main Course', 'type' => 'food', 'description' => 'Heavy bites & burgers'],
            ['slug' => 'bites-snacks', 'name' => 'Bites & Snacks', 'type' => 'food', 'description' => 'Sides & desserts'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
