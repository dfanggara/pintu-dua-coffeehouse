<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Gallery;
use App\Models\HeroBanner;
use App\Models\InstagramPost;
use App\Models\Menu;
use App\Models\Reservation;

$categories = Category::all()->makeHidden(['created_at', 'updated_at'])->toArray();
$menus = Menu::all()->makeHidden(['created_at', 'updated_at'])->toArray();
$banners = HeroBanner::all()->makeHidden(['created_at', 'updated_at'])->toArray();
$galleries = Gallery::all()->makeHidden(['created_at', 'updated_at'])->toArray();
$posts = InstagramPost::all()->makeHidden(['created_at', 'updated_at'])->toArray();
$reservations = Reservation::all()->makeHidden(['created_at', 'updated_at', 'deleted_at'])->toArray();

$seederContent = "<?php\n\nnamespace Database\Seeders;\n\nuse App\Models\Category;\nuse App\Models\Gallery;\nuse App\Models\HeroBanner;\nuse App\Models\InstagramPost;\nuse App\Models\Menu;\nuse App\Models\Reservation;\nuse App\Models\User;\nuse Illuminate\Database\Seeder;\nuse Illuminate\Support\Facades\Hash;\n\nclass DatabaseSeeder extends Seeder\n{\n    public function run(): void\n    {\n";

$seederContent .= "        // 1. Admin User\n";
$seederContent .= "        User::updateOrCreate(\n";
$seederContent .= "            ['email' => 'admin@pintudua.com'],\n";
$seederContent .= "            [\n";
$seederContent .= "                'name' => 'Admin Pintu Dua',\n";
$seederContent .= "                'password' => Hash::make('password123'),\n";
$seederContent .= "                'is_admin' => true,\n";
$seederContent .= "                'email_verified_at' => now(),\n";
$seederContent .= "            ]\n";
$seederContent .= "        );\n\n";

$seederContent .= "        // 2. Categories (" . count($categories) . " items)\n";
$seederContent .= "        \$categories = " . var_export($categories, true) . ";\n";
$seederContent .= "        foreach (\$categories as \$cat) {\n";
$seederContent .= "            Category::updateOrCreate(['slug' => \$cat['slug']], \$cat);\n";
$seederContent .= "        }\n\n";

$seederContent .= "        // 3. Menus (" . count($menus) . " items)\n";
$seederContent .= "        \$menus = " . var_export($menus, true) . ";\n";
$seederContent .= "        foreach (\$menus as \$m) {\n";
$seederContent .= "            Menu::updateOrCreate(['sku' => \$m['sku']], \$m);\n";
$seederContent .= "        }\n\n";

$seederContent .= "        // 4. Hero Banners (" . count($banners) . " items)\n";
$seederContent .= "        \$banners = " . var_export($banners, true) . ";\n";
$seederContent .= "        foreach (\$banners as \$b) {\n";
$seederContent .= "            HeroBanner::updateOrCreate(['code' => \$b['code']], \$b);\n";
$seederContent .= "        }\n\n";

$seederContent .= "        // 5. Galleries (" . count($galleries) . " items)\n";
$seederContent .= "        \$galleries = " . var_export($galleries, true) . ";\n";
$seederContent .= "        foreach (\$galleries as \$g) {\n";
$seederContent .= "            Gallery::updateOrCreate(['code' => \$g['code']], \$g);\n";
$seederContent .= "        }\n\n";

$seederContent .= "        // 6. Instagram Posts (" . count($posts) . " items)\n";
$seederContent .= "        \$posts = " . var_export($posts, true) . ";\n";
$seederContent .= "        foreach (\$posts as \$p) {\n";
$seederContent .= "            InstagramPost::updateOrCreate(['code' => \$p['code']], \$p);\n";
$seederContent .= "        }\n\n";

$seederContent .= "        // 7. Reservations (" . count($reservations) . " items)\n";
$seederContent .= "        \$reservations = " . var_export($reservations, true) . ";\n";
$seederContent .= "        foreach (\$reservations as \$r) {\n";
$seederContent .= "            Reservation::updateOrCreate(['booking_code' => \$r['booking_code']], \$r);\n";
$seederContent .= "        }\n";
$seederContent .= "    }\n}\n";

file_put_contents(__DIR__ . '/../database/seeders/DatabaseSeeder.php', $seederContent);
echo "DatabaseSeeder updated successfully!\n";
