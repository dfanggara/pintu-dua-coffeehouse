<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInstagramPostRequest;
use App\Models\InstagramPost;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Illuminate\Support\Str;

class AdminInstagramPostController extends Controller
{
    public function index()
    {
        $posts = InstagramPost::query()
            ->orderBy('sort_order', 'asc')
            ->latest()
            ->paginate(9);

        return Inertia::render('Admin/InstagramPosts/Index', [
            'posts' => $posts,
        ]);
    }

    private function extractCodeFromUrl(string $url, ?string $inputCode = null): string
    {
        if (!empty($inputCode)) {
            return $inputCode;
        }

        if (preg_match('/(?:p|reel|tv|reels)\/([A-Za-z0-9_-]+)/i', $url, $matches)) {
            return $matches[1];
        }

        return 'IGP-' . strtoupper(Str::random(8));
    }

    public function store(StoreInstagramPostRequest $request)
    {
        $validated = $request->validated();

        $validated['code'] = $this->extractCodeFromUrl(
            $validated['post_url'],
            $validated['code'] ?? null
        );

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail_url'] = ImageService::compressAndStore(
                $request->file('thumbnail'),
                'instagram'
            );
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        InstagramPost::create($validated);

        return redirect()->back()->with('success', 'Postingan Instagram berhasil ditambahkan!');
    }

    public function update(StoreInstagramPostRequest $request, string $code)
    {
        $post = InstagramPost::findOrFail($code);
        $validated = $request->validated();

        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail_url && !filter_var($post->thumbnail_url, FILTER_VALIDATE_URL)) {
                $oldPath = str_replace('/storage/', '', $post->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['thumbnail_url'] = ImageService::compressAndStore(
                $request->file('thumbnail'),
                'instagram'
            );
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        $post->update($validated);

        return redirect()->back()->with('success', 'Postingan Instagram berhasil diperbarui!');
    }

    public function destroy(string $code)
    {
        $post = InstagramPost::findOrFail($code);

        if ($post->thumbnail_url && !filter_var($post->thumbnail_url, FILTER_VALIDATE_URL)) {
            $oldPath = str_replace('/storage/', '', $post->thumbnail_url);
            Storage::disk('public')->delete($oldPath);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Postingan Instagram berhasil dihapus!');
    }
}
