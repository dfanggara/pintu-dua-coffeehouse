<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => $this->boolean('is_active'),
            ]);
        }
    }

    public function rules(): array
    {
        $isUpdate = $this->route('code') !== null;

        return [
            'code' => $isUpdate ? 'nullable|string' : 'nullable|string|unique:galleries,code',
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'image' => $isUpdate ? 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120' : 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ];
    }
}
