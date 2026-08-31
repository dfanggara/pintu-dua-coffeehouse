<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstagramPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $code = $this->route('code');

        return [
            'code' => 'nullable|string|max:50|unique:instagram_posts,code,' . $code . ',code',
            'caption' => 'nullable|string|max:1000',
            'thumbnail' => $code ? 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120' : 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
            'post_url' => 'required|url|max:500',
            'post_type' => 'required|in:image,video,carousel',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ];
    }
}
