<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Models\Category;
use App\Models\Menu;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminMenuController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $menus = Menu::with('category')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = Category::withCount('menus')->get();

        return Inertia::render('Admin/Menus/Index', [
            'menus' => $menus,
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    private function generateAutoSku(string $categorySlug): string
    {
        $cleanSlug = str_replace(['-', '_'], '', $categorySlug);
        $prefix = strtoupper(substr($cleanSlug, 0, 3));
        if (strlen($prefix) < 3) {
            $prefix = str_pad($prefix, 3, 'X', STR_PAD_RIGHT);
        }

        $baseSku = 'MNU-' . $prefix . '-';
        $count = Menu::where('category_slug', $categorySlug)->count() + 1;
        $sku = $baseSku . str_pad($count, 3, '0', STR_PAD_LEFT);

        while (Menu::where('sku', $sku)->exists()) {
            $count++;
            $sku = $baseSku . str_pad($count, 3, '0', STR_PAD_LEFT);
        }

        return $sku;
    }

    public function store(StoreMenuRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['sku']) && !empty($validated['category_slug'])) {
            $validated['sku'] = $this->generateAutoSku($validated['category_slug']);
        }

        if ($request->hasFile('image')) {
            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'menus');
        }

        unset($validated['image']);

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu baru berhasil ditambahkan!');
    }

    public function update(UpdateMenuRequest $request, $sku)
    {
        $menu = Menu::findOrFail($sku);
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image if stored locally
            if ($menu->image_url && str_contains($menu->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $menu->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'menus');
        }

        unset($validated['image']);

        $menu->update($validated);

        return redirect()->back()->with('success', 'Data menu berhasil diperbarui!');
    }

    public function destroy($sku)
    {
        $menu = Menu::findOrFail($sku);

        if ($menu->image_url && str_contains($menu->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $menu->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $menu->delete();

        return redirect()->back()->with('success', 'Menu berhasil dihapus!');
    }
}
