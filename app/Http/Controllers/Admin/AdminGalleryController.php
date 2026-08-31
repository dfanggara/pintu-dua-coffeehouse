<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryRequest;
use App\Models\Gallery;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminGalleryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $galleries = Gallery::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => $galleries,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function store(StoreGalleryRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['code'])) {
            $validated['code'] = 'GAL-' . strtoupper(Str::random(6));
        }

        if ($request->hasFile('image')) {
            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'galleries');
        }

        unset($validated['image']);

        Gallery::create($validated);

        return redirect()->back()->with('success', 'Foto galeri baru berhasil ditambahkan!');
    }

    public function update(StoreGalleryRequest $request, $code)
    {
        $gallery = Gallery::findOrFail($code);
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($gallery->image_url && str_contains($gallery->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $gallery->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $validated['image_url'] = ImageService::compressAndStore($request->file('image'), 'galleries');
        }

        unset($validated['image']);

        $gallery->update($validated);

        return redirect()->back()->with('success', 'Foto galeri berhasil diperbarui!');
    }

    public function destroy($code)
    {
        $gallery = Gallery::findOrFail($code);

        if ($gallery->image_url && str_contains($gallery->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $gallery->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Foto galeri berhasil dihapus!');
    }
}
