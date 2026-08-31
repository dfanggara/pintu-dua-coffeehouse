<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHeroBannerRequest;
use App\Models\HeroBanner;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminHeroBannerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $heroBanners = HeroBanner::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%");
            })
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/HeroBanners/Index', [
            'heroBanners' => $heroBanners,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function store(StoreHeroBannerRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['code'])) {
            $validated['code'] = 'BANNER-' . strtoupper(Str::random(6));
        }

        if ($request->hasFile('image')) {
            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'banners');
        }

        unset($validated['image']);

        HeroBanner::create($validated);

        return redirect()->back()->with('success', 'Hero banner baru berhasil ditambahkan!');
    }

    public function update(StoreHeroBannerRequest $request, $code)
    {
        $heroBanner = HeroBanner::findOrFail($code);
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($heroBanner->image_url && str_contains($heroBanner->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $heroBanner->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'banners');
        }

        unset($validated['image']);

        $heroBanner->update($validated);

        return redirect()->back()->with('success', 'Hero banner berhasil diperbarui!');
    }

    public function destroy($code)
    {
        $heroBanner = HeroBanner::findOrFail($code);

        if ($heroBanner->image_url && str_contains($heroBanner->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $heroBanner->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $heroBanner->delete();

        return redirect()->back()->with('success', 'Hero banner berhasil dihapus!');
    }
}
